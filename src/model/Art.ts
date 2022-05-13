import mongoose from 'mongoose'
import Option, { IOption } from './Option'

export interface IArt {
  _id: string
  externalArtId?: string
  optionId: string
  artUrl: string
  artDescription: string
  generating: boolean
  generatedDate: Date
  averageColor?: string
}

const ArtSchema = new mongoose.Schema<IArt>({
  externalArtId: String,
  optionId: String,
  artUrl: String,
  artDescription: String,
  generating: { type: Boolean, default: false },
  generatedDate: { type: Date, default: Date.now, index: true },
  averageColor: String,
})

export default mongoose.models.Art || mongoose.model('Art', ArtSchema)
