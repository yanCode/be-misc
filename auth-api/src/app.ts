import express from 'express';
import config from 'config';
import dbConnect from './utils/DbConnect.utils';
import { log } from './utils/logger.utils';
import swaggerDocs from 'src/utils/swagger.utils';
import { deserializeUser } from 'src/middleware/deserializeUser';
import router from 'src/routes';

const app = express();
const port = config.get<number>('port');
swaggerDocs(app, port);
app.use(express.json());
app.use(deserializeUser);
app.use('/v1/api', router);

app.all('*', (req, res) => {
  res.status(404).send(`Cannot find ${req.originalUrl} on this server`);
});

app.listen(port, () => {
  log.info(`App started at localhost:${port}`);
  dbConnect();
});
