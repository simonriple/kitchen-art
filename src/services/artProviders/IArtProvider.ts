export interface GenerateArtResponse {
  externalArtId: string
}

export type GenerateArtRequest = (text: string) => Promise<GenerateArtResponse>

export type GetGeneratedArtRequest = (externalArtId: string) => Promise<Buffer>
