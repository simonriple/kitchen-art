import { BlobServiceClient } from '@azure/storage-blob'
import { retryFetch } from '../components/fetcher'
import { IArt } from '../model/Art'
import { IOption } from '../model/Option'
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

export const generateArt = async (option: IOption) => {
  const artUrlResponse: ArtGeneratorResponse = await generateArtRequest(
    option.optionText
  )
  console.log(artUrlResponse)
  const imageBuffer = await getArtImage(artUrlResponse.image_id)

  if (imageBuffer) {
    console.log('got image')
    await uploadToAzure(artUrlResponse.image_id, imageBuffer)
  } else {
    console.log('no image')
  }

  const art: Partial<IArt> = {
    optionId: option._id,
    artUrl: `${process.env.AZURE_STORAGE_URL}/${process.env.AZURE_STORAGE_CONTAINER}/${artUrlResponse.image_id}.jpg`,
    artDescription: option.optionText,
  }
  return art
}
