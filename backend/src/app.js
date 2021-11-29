import express from 'express';
import morgan from 'morgan';

import { api } from './routes/index.js';
import logger from './logger.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(morgan('combined', { stream: logger.stream }));

app.use('/api', api);

app.use(errorHandler);

export default app;