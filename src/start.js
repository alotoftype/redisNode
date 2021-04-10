import express from "express";
import "express-async-errors";
import logger from "loglevel";

import {getRoutes} from "./routes";

function startServer({port = process.env.PORT} = {}){
  const app = express()
  app.use("/api", getRoutes())
  app.use("/", async(req, res)=>{
    res.status(200).send({ "message":"Lets Get started"})
  })
  
  app.use(errorMiddleware)

  return new Promise(resolve => {
    const server = app.listen(port, ()=> {
      logger.info(`Listening on port ${server.address().port}`)
      const originalClose = server.close.bind(server)
      server.close = () => {
        return new Promise(resolveClose => {
          originalClose(resolveClose)
        })
      }

      setupCloseOnExit(server)

      resolve(server)
    })
  })
}

function errorMiddleware(error, req, res, next){
  if(res.headersSent){
    next(error)
  } else {
    logger.error(error)
    res.status(500)
    res.json({
      message: error.message,
      ...(process.env.NODE_ENV === "production" ? null : { stack: error.stack})
    })
  }
}

function setupCloseOnExit(server){
  async function exitHandler(options = {}){
    await server
      .close()
      .then(() => {
        logger.info("Server successfully closed")
      })
      .catch(error => {
        logger.warn("Something went wrong closing the server", error.stack)
      })
    if(options.exit) process.exit()
  }
  process.on("exit", exitHandler)
  
  process.on("SIGINI", exitHandler.bind(null, {exit: true}))

  process.on("SIGUSR1", exitHandler.bind(null, {exit: true}))
  process.on("SIGUSR2", exitHandler.bind(null, {exit: true}))

  process.on("uncaughtException", exitHandler.bind(null, {exit: true}))
}

export {startServer}
