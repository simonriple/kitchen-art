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
  if (
    hypnogramArt &&
    hypnogramArt.externalArtId &&
    dalle2Art &&
    dalle2Art.externalArtId
  ) {
    const [hypnogramImageBuffer, dalle2ImageBuffer] = await Promise.all([
      getGeneratedArtHypnogram(hypnogramArt.externalArtId),
      getGeneratedArtDalle2(dalle2Art.externalArtId),
    ])

    if (hypnogramImageBuffer && dalle2ImageBuffer) {
      console.log('got Hypnogram and dalle2 image')
      const [hypnogramSuccess, dalle2Success] = await Promise.all([
        uploadBufferToFileStorage(hypnogramImageBuffer, hypnogramArt),
        uploadBufferToFileStorage(dalle2ImageBuffer, dalle2Art),
      ])
      console.log('Sucessfully upladed images')
    } else {
      console.log('no images found')
    }
  }

  return hypnogramSuccess && dalle2Success
}
