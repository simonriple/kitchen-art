import { NextApiRequest, NextApiResponse } from "next";


// const votesHandler = new RequestHandler<Vote[]>()
let tryN = 0 
const testHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('test request')
    if(tryN === 5 ) {
        tryN = 0
        return res.status(200).json({success: true})
    }else{
        res.status(400)
        tryN = tryN+1
    }
}

export default testHandler