import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';

import { errorHandler } from './middlewares/error-handler';
import { availableNumbersRaffleRouter } from './routes/available-numbers';
import { indexRaffleRouter } from './routes/index';
import { createRaffleRouter } from './routes/new';
import { updateRaffleRouter } from './routes/update';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(cors({ credentials: true, origin: true }));
app.use(json());
app.use(cookieSession({ signed: false, secure: false }));

app.use(availableNumbersRaffleRouter);
app.use(indexRaffleRouter);
app.use(createRaffleRouter);
app.use(updateRaffleRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
