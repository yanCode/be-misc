import express from 'express';
import config from 'config';
import dotenv from 'dotenv';
import dbConnect from './utils/DbConnect';
import { log } from './utils/logger';
import router from './routes';

dotenv.config();

const app = express();
app.use('/api/v1', router);
const port = config.get('port');
app.listen(port, () => {
  log.info(`App started at localhost:${port}`);
  dbConnect();
});
