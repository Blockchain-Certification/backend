import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import Logger from '../shared/core/logger';
import cors from 'cors';
import {  environment } from '../config';
import '../shared/database/index'; // initialize database
import '../shared/cache';
import { limiter, fabricLoader } from '../shared/core/utils';
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from '../shared/core/apiError';
import router from './router';

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

fabricLoader;

const app = express();

app.enable('trust proxy');
app.use(cookieParser());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms  :date[clf]',
  ),
);
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);


app.use(cors({ 
  origin: ['http://194.163.180.21', 'http://localhost:3007', 'https://vbcc.high3ar.club'], 
  optionsSuccessStatus: 200, 
  credentials: true 
}));
app.use(helmet());  

// Routes
app.use('/api/v1', router);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));
// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    Logger.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});



export default app;
