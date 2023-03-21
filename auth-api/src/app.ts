import express from 'express';
import config from 'config';
import dotenv from 'dotenv';
import dbConnect from './utils/DbConnect';
import { log } from './utils/logger';
import router from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/v1/api', router);
const port = config.get('port');
app.listen(port, () => {
  log.info(`App started at localhost:${port}`);
  dbConnect();
});
