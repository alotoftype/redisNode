import logger from "loglevel";
import {startServer} from "./start"

logger.setLevel('info');

console.log('application loaded')
startServer()