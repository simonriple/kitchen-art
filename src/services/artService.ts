import { BlobServiceClient } from '@azure/storage-blob'
import { getAverageColor } from 'fast-average-color-node'
import { retryFetch } from '../components/fetcher'
import Art, { IArt } from '../model/Art'
import Option, { IOption } from '../model/Option'
const { v1: uuidv1 } = require('uuid')
interface ArtGeneratorResponse {
  image_id: string
  promt: string
}

const uploadToAzure = async (imageId: string, data: Buffer) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    `${process.env.AZURE_STORAGE}`
  )

  console.log('connecting to container:', process.env.AZURE_STORAGE_CONTAINER)
  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.AZURE_STORAGE_CONTAINER}`
  )
  // const createContainerResponse = await containerClient.create()
  console.log('Container was connected successfully')

  //Upload
  const blockBlobClient = containerClient.getBlockBlobClient(`${imageId}.jpg`)
  console.log('getBlockBlobClient ok')
  const uploadBlobResponse = blockBlobClient.upload(data, data.length, {
    blobHTTPHeaders: {
      blobContentType: 'image/jpeg',
    },
  })
  console.log('upload ok', uploadBlobResponse)
}

const generateArtRequest = async (optionText: string) =>
  await retryFetch(`${process.env.ART_GENERATOR}`, undefined, undefined, {
    method: 'post',
    body: JSON.stringify({
      prompt: optionText,
      high_resolution: false,
      algo_version: 1,
    }),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json())

const getArtImage = async (imageId: string) =>
  await retryFetch(`${process.env.ART_STORAGE}/${imageId}.jpg`)
    .then((res) => res.arrayBuffer())
    .then((ab) => Buffer.from(ab))

export const startArtGeneration = async () => {
  const option = await Option.findOne<IOption>({ generated: false }).sort({
    votes: -1,
  })
  if (option) {
    const artUrlResponse: ArtGeneratorResponse = await generateArtRequest(
      option.optionText
    )
    const createdArt = await Art.create<Partial<IArt>>({
      externalArtId: artUrlResponse.image_id,
      optionId: option._id,
      artDescription: option.optionText,
      generating: true,
    })

    await Option.updateOne({ _id: option._id }, { generated: true })

    return createdArt
  }
  return null
}

export const getGenratedArt = async () => {
  const art = await Art.findOne<IArt>({ generating: true })
  if (art && art.externalArtId) {
    const imageBuffer = await getArtImage(art.externalArtId)
    if (imageBuffer) {
      console.log('got image')
      const { hex: averageColor } = await getAverageColor(imageBuffer)
      await uploadToAzure(art.externalArtId, imageBuffer)
      const artUpdate: Partial<IArt> = {
        generating: false,
        artUrl: `${process.env.AZURE_STORAGE_URL}/${process.env.AZURE_STORAGE_CONTAINER}/${art.externalArtId}.jpg`,
        averageColor: averageColor,
      }
      const updatedArt = await Art.updateOne({ _id: art._id }, artUpdate)
      return updatedArt.acknowledged
    } else {
      console.log('no image')
    }
  }

  return false
}
