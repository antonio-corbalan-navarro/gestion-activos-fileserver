import pg from 'pg';
import { DB, API, SERVER_DB } from './server';

const { Pool } = pg;

let config = {}

if (API.deploy === 'local') {
  config = {
    user: DB.user,
    password: DB.password,
    host: DB.host,
    port: Number(DB.port),
    database: DB.database,
  }
} else {
  config = {
    user: SERVER_DB.user,
    password: SERVER_DB.password,
    host: SERVER_DB.host,
    port: Number(SERVER_DB.port),
    database: SERVER_DB.database,
  }
}

const pool = new Pool(config)

export default pool;
