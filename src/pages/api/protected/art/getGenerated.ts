import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import RequestHandler from '../../../../components/RequestHandler'
import { IArt } from '../../../../model/Art'
import { getGenratedArt } from '../../../../services/artService'

const artHandler = new RequestHandler<IArt[]>()

artHandler.post = async (req, res) => {
  const art = await getGenratedArt()
  if (art) {
    res.status(200)
  }
  res.status(400)
}

export default withApiAuthRequired(artHandler.handleRequest)
