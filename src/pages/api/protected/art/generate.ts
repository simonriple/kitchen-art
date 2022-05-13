import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import RequestHandler from '../../../../components/RequestHandler'
import { IArt } from '../../../../model/Art'
import { startArtGeneration } from '../../../../services/artService'

const artHandler = new RequestHandler<IArt[]>()

artHandler.post = async (req, res) => {
  const createdArt = await startArtGeneration()
  res.status(200).json(createdArt)
}

export default withApiAuthRequired(artHandler.handleRequest)
