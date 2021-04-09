"use strict";

var _loglevel = _interopRequireDefault(require("loglevel"));

var _start = require("./start");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_loglevel.default.setLevel('info');

(0, _start.startServer)();