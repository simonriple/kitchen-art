import RequestHandler from '../../../components/RequestHandler'
import Art, { IArt, OptionArts } from '../../../model/Art'

const artTodayHandler = new RequestHandler<OptionArts>()

artTodayHandler.get = async (req, res) => {
  const art = await Art.aggregate<OptionArts>([
    { $match: { generating: false } },
    { $sort: { generatedDate: -1 } },
    {
      $group: {
        _id: '$optionId',
        description: { $first: '$artDescription' },
        images: { $push: '$$ROOT' },
      },
    },
    { $limit: 1 },
  ])
  // sort({ generatedDate: -1 }).aggregate({})
  art.map((ar) => console.log(ar))
  // console.log(art)
  res.status(200).json(art[0])
}

export default artTodayHandler.handleRequest
