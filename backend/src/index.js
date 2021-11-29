import logger from './logger.js';
import app from './app.js';

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  logger.info(`App is listening on ${PORT}`);
});