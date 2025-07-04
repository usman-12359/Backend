import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  SERVICE_NAME: process.env.SERVICE_NAME,
  JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EMAIL: process.env.EMAIL,
  DATABASE_LINK: process.env.DATABASE_LINK,
  DATABASE_NAME: process.env.DATABASE_NAME,
};
