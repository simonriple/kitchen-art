import mongoose from 'mongoose'

export interface IOption {
  _id: string
  optionText: string
  votes: number
  generated: boolean
}

const OptionSchema = new mongoose.Schema<IOption>({
  optionText: String,
  votes: { type: Number, default: 0, index: true },
  generated: { type: Boolean, default: false },
})

export default mongoose.models.Option || mongoose.model('Option', OptionSchema)
