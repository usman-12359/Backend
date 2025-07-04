import { createLogger, format, transports } from 'winston';
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
);

export const logger = createLogger({
  level: 'info',
  format: logFormat,
  
});
