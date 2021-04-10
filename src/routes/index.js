import express from "express"

export function getRoutes(){
  const router = express.Router()
  router.use('/', welcome)
  return router
}


async function welcome(req, res) {
  res.status(200).send({ "message": "ok"})
}
