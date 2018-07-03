import {
    createLogger, format, transports
} from "winston";
import { logging } from "./config";

const logger = createLogger({
    level: logging.level,
    format: format.simple(),
    transports: [new transports.Console()]
});

export default logger.info;

const { info, warn, error, debug } = logger;

export {
    info,
    warn,
    error,
    debug
};
