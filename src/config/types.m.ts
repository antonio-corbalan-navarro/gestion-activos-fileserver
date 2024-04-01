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
}

export interface Error {
  status?: number;
  message?: string;
}

export interface Smtp {
  user?: string;
  pass?: string;
  host?: string;
  port?: number;
}