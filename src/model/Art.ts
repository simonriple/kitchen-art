import mongoose from 'mongoose'
import Option, { IOption } from './Option'

export interface IArt {
  _id: string
  optionId: string
  artUrl: string
  artDescription: string
}

const ArtSchema = new mongoose.Schema<IArt>({
  optionId: String,
  artUrl: String,
  artDescription: String,
})

export default mongoose.models.Art || mongoose.model('Art', ArtSchema)
