import express, { Request, Response, NextFunction } from 'express';
import Logger from './shared/core/logger';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './shared/database/index'; // initialize database
import { limiter } from './shared/core/utils';
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from './shared/core/apiError';
import helmet from 'helmet';
import router from './router';
import apiKey from './shared/middlewares/apiKey';
import morgan = require('morgan');

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

const app = express();
// Apply the rate limiter middleware to all requests
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :date[clf]'));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use(helmet());
// sercure api key
app.use(apiKey);
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
