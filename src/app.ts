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
import { routerV1 } from './routes';
import { checkUser, requireAuth, isAllowedDocument, isAllowedImage } from './middlewares/auth';
import bodyParser from 'body-parser';

// Create server:
const app = express();

// Server configuration:
app.use(cors(
  {
    origin: [
      'http://localhost:3000',
      'https://diluswebappdev.vercel.app',
      'https://app.dilustech.com',
      "https://dev.dilustech.com"
    ],
    credentials: true
  }
));

app.use(morgan('dev'));
app.use(express.json());
app.use(compression());
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '1024mb',
  parameterLimit: 100_000_000
}))

// Routes import:
app.use('/', checkUser, requireAuth, routerV1);

// TODO: Export storage router
// Storage Routes:
const CURRENT_DIR = path.dirname(__filename)

app.use('/images', checkUser, requireAuth, isAllowedImage)
app.use('/images/station', express.static(join(CURRENT_DIR, './uploads/images/station')))
app.use('/images/instrument', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/images/instrument')))
app.use('/images/calibration', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/images/calibration')))
app.use('/images/report', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/images/report')))
app.use('/images/ticket', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/images/ticket')))
app.use('/images/response', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/images/response')))

app.use('/documents', checkUser, requireAuth, isAllowedDocument)
app.use('/documents/station', express.static(join(CURRENT_DIR, './uploads/documents/station')))
app.use('/documents/instrument', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/documents/instrument')))
app.use('/documents/calibration', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/documents/calibration')))
app.use('/documents/report', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/documents/report')))
app.use('/documents/ticket', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/documents/ticket')))
app.use('/documents/response', checkUser, requireAuth, express.static(join(CURRENT_DIR, './uploads/documents/response')))

// Default error handler:
app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log('Default error handler')
  next(createError(404));
  return 
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('ERROR 500 TRY')
    console.log('code', res.statusCode)
    res.status(err.status || 500).json({
      error: err.message,
    });
    res.end()
    return
  } catch (error) {
    console.log('ERROR 500 CATCH')
    return
  }
});

// Run server:
app.listen(API.port, () => {
  console.log(`API RUNNING AT [http://localhost:${API.port}]`);
  console.log({ ESTO: API.deploy })
  if (API.deploy === 'local') {
    console.log(`MODE DESARROLLO`);
  } else {
    console.log(`MODE PRODUCCIÓN`);
  }
});