import RequestHandler from '../../../components/RequestHandler'
import Art, { IArt, OptionArts } from '../../../model/Art'

const artHandler = new RequestHandler<OptionArts[]>()

artHandler.get = async (req, res) => {
  const arts = await Art.aggregate<OptionArts>([
    { $match: { generating: false } },
    { $sort: { generatedDate: -1 } },
    {
      $group: {
        _id: '$optionId',
        description: { $first: '$artDescription' },
        images: { $push: '$$ROOT' },
      },
    },
  ])

  res.status(200).json(arts)
}

export default artHandler.handleRequest
