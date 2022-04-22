import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import RequestHandler from '../../../components/RequestHandler'
import Art, { IArt } from '../../../model/Art'
import Option from '../../../model/Option'
import { generateArt } from '../../../services/artService'

const artHandler = new RequestHandler<IArt[]>()

artHandler.post = async (req, res) => {
  const option = await Option.findOne({ generated: false }).sort({ votes: -1 })
  console.log('option with most votes', option)
  const art = await generateArt(option)
  const createdArt = await Art.create(art)
  await Option.updateOne({ _id: option._id }, { generated: true })
  res.status(200).json(createdArt)
}

export default withApiAuthRequired(artHandler.handleRequest)
