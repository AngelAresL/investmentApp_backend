import { createLogger, format, transports } from 'winston';
import dotenv from "dotenv";

dotenv.config();

const { combine, timestamp, printf, errors, json } = format;

// Definir formato de los logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Crear el logger con Winston
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', // Nivel de log por defecto
  format: combine(
    timestamp(),
    errors({ stack: true }), // Mostrar stacktrace si es un error
    json() // Los logs estarán en formato JSON
  ),
  transports: [
    new transports.Console(), // Mostrar logs en la consola
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Guardar errores en archivo
    new transports.File({ filename: 'logs/combined.log' }), // Guardar todos los logs en archivo
  ],
});

// Si no estamos en producción, usa el formato legible en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), logFormat),
    })
  );
}

export default logger;