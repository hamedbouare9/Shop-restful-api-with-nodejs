import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), customFormat),
  transports: [
    new transports.Console({
      format: combine(format.colorize(), format.simple()),
    }),
  ],
});

export default logger;
