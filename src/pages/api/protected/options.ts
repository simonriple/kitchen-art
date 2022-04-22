import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import RequestHandler from '../../../components/RequestHandler'
import Option, { IOption } from '../../../model/Option'

const optionsHandler = new RequestHandler<IOption[]>()

optionsHandler.delete = async (req, res) => {
  console.log('delete request')
  const optionId = req.body.optionId
  try {
    await Option.deleteOne({ _id: optionId })
    res.status(200).end()
  } catch (error) {
    console.log(error)
    res.status(400).end()
  }
}

export default withApiAuthRequired(optionsHandler.handleRequest)
