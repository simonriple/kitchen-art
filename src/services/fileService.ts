import Art, { IArt } from '../model/Art'
import { getAverageColor } from 'fast-average-color-node'
import { sendSlackMessage } from '../components/slackBot'
import { uploadToAWS } from './fileStorageProviders/aws'

export type UploadFileResult = Pick<
  IArt,
  'generating' | 'artUrl' | 'averageColor'
>

export const uploadBufferToFileStorage = async (image: Buffer, art: IArt) => {
  if (art.externalArtId && image) {
    const { hex: averageColor } = await getAverageColor(image)
    //await uploadToAzure(art.externalArtId, image)
    await uploadToAWS(art.externalArtId, image)
    const artUpdate: Partial<IArt> = {
      generating: false,
      //   artUrl: `${process.env.AZURE_STORAGE_URL}/${process.env.AZURE_STORAGE_CONTAINER}/${art.externalArtId}.jpg`,
      artUrl: `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${art.externalArtId}`,
      averageColor: averageColor,
    }
    console.log('updating Art', artUpdate)
    const updatedArt = await Art.updateOne({ _id: art._id }, artUpdate)
    console.log('updated', updatedArt.acknowledged)
    sendSlackMessage(`New image generated`)
    return updatedArt.acknowledged
    return true
  }
}
