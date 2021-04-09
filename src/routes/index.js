import express from "express"

export default function getRoutes(){
  const router = express.Router()
  router.use('/welcome', async(req, res) =>{
    res.status(200).send('Hello');
  })
  return router
}

