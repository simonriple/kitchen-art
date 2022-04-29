import RequestHandler from '../../../components/RequestHandler'
import Art, { IArt } from '../../../model/Art'

const artHandler = new RequestHandler<IArt[]>()

artHandler.get = async (req, res) => {
  const arts = await Art.find({}).sort({ generatedDate: -1 })
  res.status(200).json(arts)
}

export default artHandler.handleRequest
