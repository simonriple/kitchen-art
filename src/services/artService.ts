import { BlobServiceClient } from '@azure/storage-blob'
import { getAverageColor } from 'fast-average-color-node'
import { sendSlackMessage } from '../components/slackBot'
import Art, { IArt } from '../model/Art'
import { ArtProviderEnum } from '../model/ArtProvider'
import Option, { IOption } from '../model/Option'
import {
  generateArtRequestDalle2,
  getGeneratedArtDalle2,
} from './artProviders/dalle2Service'
import {
  generateArtRequestHypnogram,
  getGeneratedArtHypnogram,
} from './artProviders/hypnogramService'
import { uploadBufferToFileStorage } from './fileService'

export const startArtGeneration = async () => {
  const option = await Option.findOne<IOption>({ generated: false }).sort({
    votes: -1,
  })
  if (option) {
    const generateHypnogramArtResponse = await generateArtRequestHypnogram(
      option.optionText
    )
    console.log('hypogramresponse', generateHypnogramArtResponse)
    const generateDalle2ArtResponse = await generateArtRequestDalle2(
      option.optionText
    )

    const createdHypnogramArt = await Art.create<Partial<IArt>>({
      externalArtId: generateHypnogramArtResponse.externalArtId,
      optionId: option._id,
      artDescription: option.optionText,
      artProvider: ArtProviderEnum.HYPNOGRAM,
      generating: true,
    })

    const createdDalle2Art = await Art.create<Partial<IArt>>({
      externalArtId: generateDalle2ArtResponse.externalArtId,
      optionId: option._id,
      artDescription: option.optionText,
      artProvider: ArtProviderEnum.DALLE2,
      generating: true,
    })

    await Option.updateOne({ _id: option._id }, { generated: true })

    return { Dalle2: createdDalle2Art, Hypnogram: createdHypnogramArt }
  }
  return null
}

export const getGenratedArt = async () => {
  const hypnogramArt = await Art.findOne<IArt>({
    generating: true,
    artProvider: ArtProviderEnum.HYPNOGRAM,
  })
  const dalle2Art = await Art.findOne<IArt>({
    generating: true,
    artProvider: ArtProviderEnum.DALLE2,
  })
  let hypnogramSuccess, dalle2Success
  if (hypnogramArt && hypnogramArt.externalArtId) {
    const hypnogramImageBuffer = await getGeneratedArtHypnogram(
      hypnogramArt.externalArtId
    )
    if (hypnogramImageBuffer) {
      console.log('got Hypnogram image')
      hypnogramSuccess = await uploadBufferToFileStorage(
        hypnogramImageBuffer,
        hypnogramArt
      )
    } else {
      console.log('no Hypnogram image')
    }
  }
  if (dalle2Art && dalle2Art.externalArtId) {
    const dalle2ImageBuffer = await getGeneratedArtDalle2(
      dalle2Art.externalArtId
    )
    if (dalle2ImageBuffer) {
      console.log('got Dalle2 image')
      dalle2Success = await uploadBufferToFileStorage(
        dalle2ImageBuffer,
        dalle2Art
      )
    } else {
      console.log('no Dalle2 image')
    }
  }
  return hypnogramSuccess && dalle2Success
}
