import { createLogger, format, transports } from 'winston';
import dotenv from "dotenv";

dotenv.config();

const { combine, timestamp, printf, errors, json } = format;


const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});


const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', 
  format: combine(
    timestamp(),
    errors({ stack: true }), 
    json() 
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }), 
    new transports.File({ filename: 'logs/combined.log' }), 
  ],
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), logFormat),
    })
  );
}

export default logger;