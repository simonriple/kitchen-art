import { retryFetch } from '../../components/fetcher'
import { GenerateArtRequest, GetGeneratedArtRequest } from './IArtProvider'
interface GenerateArtHypnogramResponse {
  image_id: string
  promt: string
}
export const generateArtRequestHypnogram: GenerateArtRequest = async (
  optionText: string
) =>
  await retryFetch(
    `${process.env.HYPNOGRAM_ART_GENERATOR}`,
    undefined,
    undefined,
    {
      method: 'post',
      body: JSON.stringify({
        prompt: optionText,
        high_resolution: false,
        algo_version: 1,
      }),
      headers: { 'Content-Type': 'application/json' },
    }
  )
    .then((res) => res.json())
    .then((res: GenerateArtHypnogramResponse) => ({
      externalArtId: res.image_id,
    }))

export const getGeneratedArtHypnogram: GetGeneratedArtRequest = async (
  externalArtId: string
) =>
  await retryFetch(`${process.env.HYPNOGRAM_ART_STORAGE}/${externalArtId}.jpg`)
    .then((res) => res.arrayBuffer())
    .then((ab) => Buffer.from(ab))
