"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRoutes;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRoutes() {
  const router = _express.default.Router();

  router.use('/welcome', async (req, res) => {
    res.status(200).send('Hello');
  });
  return router;
}