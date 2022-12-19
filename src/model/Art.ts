import mongoose from 'mongoose'
import { ArtProviderEnum } from './ArtProvider'
import Option, { IOption } from './Option'

export interface OptionArts {
  _id: string
  description: string
  images: IArt[]
}
export interface IArt {
  _id: string
  externalArtId?: string
  optionId: string
  artUrl: string
  artDescription: string
  artProvider?: ArtProviderEnum
  generating: boolean
  generatedDate: Date
  averageColor?: string
  favourites: number
}

const ArtSchema = new mongoose.Schema<IArt>({
  externalArtId: String,
  optionId: String,
  artUrl: String,
  artDescription: String,
  artProvider: { type: Number, enum: ArtProviderEnum },
  generating: { type: Boolean, default: false },
  generatedDate: { type: Date, default: Date.now, index: true },
  averageColor: String,
  favourites: { type: Number, default: 0 },
})

export default mongoose.models.Art || mongoose.model('Art', ArtSchema)
