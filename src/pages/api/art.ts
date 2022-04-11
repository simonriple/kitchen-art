import RequestHandler from "../../components/RequestHandler";
import Art, { IArt } from "../../model/Art";
import Option from "../../model/Option";
import { generateArt } from "../../services/artService";

const artHandler = new RequestHandler<IArt[]>();

artHandler.get = async (req, res) => {
    const arts = await Art.find({})
    res.status(200).json(arts)
}

artHandler.post = async (req, res) => {
    const optionId = req.body.optionId;
    const option = await Option.findOne({_id: optionId})
    const art = await generateArt(option)
    const createdArt = await Art.create(art)
    res.status(200).json(createdArt)
}

export default artHandler.handleRequest