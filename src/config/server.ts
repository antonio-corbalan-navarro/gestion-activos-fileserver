import 'dotenv/config';
import { Server, Database, Smtp } from './types.m';

export const DB: Database = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  dbPassword: process.env.DB_PASSWORD_ENCRYPT,
};

export const API: Server = {
  port: process.env.API_PORT,
  host: process.env.API_HOST,
  password: process.env.API_PASSWORD,
  emailHost: process.env.EMAIL_HOST
};

export const SMTP: Smtp = {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  host: process.env.SMTP_HOST,
  port: Number(process.env.STMP_PORT)
}

export const { ACCESS_TOKEN_SECRET } = process.env as {
  [key: string]: string;
};

export const { ACCESS_TOKEN_SECRET_ADMIN } = process.env as {
  [key: string]: string;
};
