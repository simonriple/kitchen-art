import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../middleware/mongodb'
export default class RequestHandler<T> {
  get: (req: NextApiRequest, res: NextApiResponse<T>) => void
  post: (req: NextApiRequest, res: NextApiResponse<T>) => void
  put: (req: NextApiRequest, res: NextApiResponse<T>) => void
  delete: (req: NextApiRequest, res: NextApiResponse<T>) => void
  handleRequest = connectDB((req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST' && this.post) {
      this.post(req, res)
    } else if (req.method === 'PUT' && this.put) {
      this.put(req, res)
    } else if (req.method === 'GET' && this.get) {
      this.get(req, res)
    } else if (req.method === 'DELETE' && this.delete) {
      this.delete(req, res)
    } else {
      res.status(404)
    }
  })
}