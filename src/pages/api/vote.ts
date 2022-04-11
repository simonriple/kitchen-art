import { NextApiRequest, NextApiResponse } from "next";
import RequestHandler from "../../components/RequestHandler";
import connectDB from "../../middleware/mongodb";
import Option from "../../model/Option";

// const votesHandler = new RequestHandler<Vote[]>()

const voteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('vote request')
    const optionId = req.body.optionId
    if(req.method !== 'POST' || !optionId) res.status(400)
    try{
        await Option.updateOne({_id: optionId}, {$inc: {votes: 1} }) 
        res.status(200).json({success: true})
    }catch(error){
        res.status(400)
    }
}

export default connectDB(voteHandler)