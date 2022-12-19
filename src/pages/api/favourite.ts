import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../middleware/mongodb'
import Art from '../../model/Art'

const voteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('favourite request')
  const imageId = req.body.imageId
  if (req.method !== 'POST' || !imageId) res.status(400)
  try {
    await Art.updateOne({ _id: imageId }, { $inc: { favourites: 1 } })
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400)
  }
}

export default connectDB(voteHandler)
