import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import RequestHandler from '../../../components/RequestHandler'
import Art, { IArt } from '../../../model/Art'
import Option from '../../../model/Option'
import { generateArt } from '../../../services/artService'

const artHandler = new RequestHandler<IArt[]>()

//TODO only admin
artHandler.post = async (req, res) => {
  const optionId = req.body.optionId
  const option = await Option.findOne().sort({ votes: -1 })
  console.log('option with most votes', option)
  const art = await generateArt(option)
  const createdArt = await Art.create(art)
  res.status(200).json(createdArt)
}

export default withApiAuthRequired(artHandler.handleRequest)
