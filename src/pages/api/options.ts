import RequestHandler from '../../components/RequestHandler'
import Option, { IOption } from '../../model/Option'

const optionsHandler = new RequestHandler<IOption[]>()

optionsHandler.get = async (req, res) => {
  const options = await Option.find({})
  res.status(200).json(options)
}

optionsHandler.post = async (req, res) => {
  console.log('post request')
  try {
    const newOption = new Option({ optionText: req.body.optionText })
    const option = await Option.create(newOption)
    res.status(201).json(option)
  } catch (error) {
    res.status(400).end()
  }
}

//TODO adminOnly
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

export default optionsHandler.handleRequest
