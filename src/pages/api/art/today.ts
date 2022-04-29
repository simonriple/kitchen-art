import RequestHandler from '../../../components/RequestHandler'
import Art, { IArt } from '../../../model/Art'

const artTodayHandler = new RequestHandler<IArt>()

artTodayHandler.get = async (req, res) => {
  const art = await Art.findOne({}).sort({ generatedDate: -1 })
  res.status(200).json(art)
}

export default artTodayHandler.handleRequest
