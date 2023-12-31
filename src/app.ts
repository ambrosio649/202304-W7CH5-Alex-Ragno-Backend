import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';
import { userRouter } from './routers/user.router.js';

import createDebug from 'debug';
const debug = createDebug('W6:App');

export const app = express();

debug('Loaded Express App');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use((_req, _res, next) => {
  debug('Soy un middleware');
  next();
});

app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.send('Hello Express!');
});

app.use('/user', userRouter);

app.use(errorHandler);
