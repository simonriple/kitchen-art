import { BlobServiceClient } from '@azure/storage-blob'
import { getAverageColor } from 'fast-average-color-node'
import { sendSlackMessage } from '../components/slackBot'
import Art, { IArt } from '../model/Art'
import Option, { IOption } from '../model/Option'
import {
  generateArtRequestDalle2,
  getGeneratedArtDalle2,
} from './artProviders/dalle2Service'
// import {
//   generateArtRequestHypnogram,
//   getGeneratedArtHypnogram,
// } from './artProviders/hypnogramService'

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
  const uploadBlobResponse = await blockBlobClient.upload(data, data.length, {
    blobHTTPHeaders: {
      blobContentType: 'image/jpeg',
    },
  })
  console.log('upload ok', uploadBlobResponse)
}

export const startArtGeneration = async () => {
  const option = await Option.findOne<IOption>({ generated: false }).sort({
    votes: -1,
  })
  if (option) {
    // const generateArtResponse = await generateArtRequestHypnogram(
    //   option.optionText
    // )
    const generateArtResponse = await generateArtRequestDalle2(
      option.optionText
    )
    const createdArt = await Art.create<Partial<IArt>>({
      externalArtId: generateArtResponse.externalArtId,
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
    // const imageBuffer = await getGeneratedArtHypnogram(art.externalArtId)
    const imageBuffer = await getGeneratedArtDalle2(art.externalArtId)
    if (imageBuffer) {
      console.log('got image')
      const { hex: averageColor } = await getAverageColor(imageBuffer)
      await uploadToAzure(art.externalArtId, imageBuffer)
      const artUpdate: Partial<IArt> = {
        generating: false,
        artUrl: `${process.env.AZURE_STORAGE_URL}/${process.env.AZURE_STORAGE_CONTAINER}/${art.externalArtId}.jpg`,
        averageColor: averageColor,
      }
      console.log('updating Art', artUpdate)
      const updatedArt = await Art.updateOne({ _id: art._id }, artUpdate)
      console.log('updated', updatedArt.acknowledged)
      sendSlackMessage(`New image generated`)
      return updatedArt.acknowledged
    } else {
      console.log('no image')
    }
  }

  return false
}
