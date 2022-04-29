import mongoose from 'mongoose'
import Option, { IOption } from './Option'

export interface IArt {
  _id: string
  optionId: string
  artUrl: string
  artDescription: string
  generatedDate: Date
}

const ArtSchema = new mongoose.Schema<IArt>({
  optionId: String,
  artUrl: String,
  artDescription: String,
  generatedDate: { type: Date, default: Date.now, index: true },
})

export default mongoose.models.Art || mongoose.model('Art', ArtSchema)
