import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import { join } from "node:path";
import path from "node:path"
import { API } from './config/server';
import { routerV1 } from './routes/v1';
import swaggerRouter from './routes/swagger';
import { checkUser, requireAuth } from './middlewares/auth';

// Create server:
const app = express();

// Server configuration:
app.use(cors(
  {
    origin: [
      'http://localhost:3000/auth/login',
      'http://localhost:3000/auth/loginadmin',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true
  }
));

app.use(morgan('dev'));
app.use(express.json());
app.use(compression());
app.use(cookieParser());

// Routes import:
app.use('/v1/api', checkUser, requireAuth, routerV1);
app.use(swaggerRouter)

// TODO: Export storage router
// Storage Routes:
const CURRENT_DIR = path.dirname(__filename)

app.use('/images', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/images')))
app.use('/docs', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/documents')))

// Default error handler:
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(err.status || 500).json({
      error: err.message,
    });
  } catch (error) {
    next(error)
  }
});

// Run server:
app.listen(API.port, () => {
  console.log(`API RUNNING AT [http://localhost:${API.port}]`);
});
