export interface Database {
  user?: string;
  password?: string;
  host?: string;
  port?: string;
  database?: string;
  dbPassword?: string;
}

export interface Server {
  host?: string;
  port?: string;
  password?: string;
  emailHost?: string;
  deploy?: string;
}

export interface Error {
  status?: number;
  message?: string;
}