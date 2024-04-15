import 'dotenv/config';
import { Server, Database } from './types.m';

export const DB: Database = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  dbPassword: process.env.DB_PASSWORD_ENCRYPT,
};

export const SERVER_DB: Database = {
  user: process.env.USER,
  password: process.env.SERVER_DATABASE_PASSWORD,
  host: process.env.SERVER_DATABASE_HOST,
  port: process.env.PORT,
  database: process.env.SERVER_DATABASE,
  dbPassword: process.env.DB_PASSWORD_ENCRYPT,
}

export const API: Server = {
  port: process.env.API_PORT,
  host: process.env.API_HOST,
  password: process.env.API_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  deploy: process.env.DEPLOY
};

export const { ACCESS_TOKEN_SECRET } = process.env as {
  [key: string]: string;
};

export const { ACCESS_TOKEN_SECRET_ADMIN } = process.env as {
  [key: string]: string;
};
