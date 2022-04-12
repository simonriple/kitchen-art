import mongoose from 'mongoose'

export interface IOption {
  _id: string
  optionText: string
  votes: number
}

const OptionSchema = new mongoose.Schema<IOption>({
  optionText: String,
  votes: { type: Number, default: 0, index: true },
})

export default mongoose.models.Option || mongoose.model('Option', OptionSchema)
