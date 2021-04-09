"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startSever = startSever;

var _express = _interopRequireDefault(require("express"));

require("express-async-errors");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _routes = require("./routes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startSever({
  port = process.env.PORT
} = {}) {
  const app = (0, _express.default)();
  app.use("/api", (0, _routes.getRoutes)());
  app.use(errorMiddleware);
  return new Promise(resolve => {
    const server = app.listen(port, () => {
      _loglevel.default.info(`Listening on port ${sever.address().port}`);

      const originalClose = server.close.bind(server);

      server.close = () => {
        return new Promise(resolveClose => {
          originalClose(resolveClose);
        });
      };

      setupCloseOnExit(server);
      resolve(server);
    });
  });
}

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error);
  } else {
    _loglevel.default.error(error);

    res.status(500);
    res.json({
      message: error.message,
      ...(process.env.NODE_ENV === "production" ? null : {
        stack: error.stack
      })
    });
  }
}

function setupCloseOnExit(server) {
  async function exitHandler(options = {}) {
    await server.close().then(() => {
      _loglevel.default.info("Server successfully closed");
    }).catch(error => {
      _loglevel.default.warn("Something went wrong closing the server", error.stack);
    });
    if (options.exit) process.exit();
  }

  process.on("exit", exitHandler);
  process.on("SIGINI", exitHandler.bind(null, {
    exit: true
  }));
  process.on("SIGUSR1", exitHandler.bind(null, {
    exit: true
  }));
  process.on("SIGUSR2", exitHandler.bind(null, {
    exit: true
  }));
  process.on("uncaughtException", exitHandler.bind(null, {
    exit: true
  }));
}