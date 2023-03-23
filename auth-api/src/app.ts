// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { deserializeUser } from './middleware/deserializeUser';
import express from 'express';
import config from 'config';
import dbConnect from './utils/DbConnect';
import { log } from './utils/logger';
import router from './routes';

// dotenv.config();

const app = express();
app.use(express.json());
app.use(deserializeUser);
app.use('/v1/api', router);
const port = config.get('port');

app.all('*', (req, res) => {
  res.status(404).send(`Cannot find ${req.originalUrl} on this server`);
});

app.listen(port, () => {
  log.info(`App started at localhost:${port}`);
  dbConnect();
});
