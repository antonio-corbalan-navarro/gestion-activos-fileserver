import pg from 'pg';
import { DB } from './server';

const { Pool } = pg;

const pool = new Pool({
  // connectionString: process.env.DATABASE_URL
  // user: DB.user,
  // password: DB.password,
  // host: DB.host,
  // port: Number(DB.port),
  // database: DB.database,
  user: 'postgres',
  password: 'CVp4zrD3lmPcNbNmdpJm',
  host: 'dilustech.com',
  port: 5432,
  database: 'dilusAppDB',
})

export default pool;
