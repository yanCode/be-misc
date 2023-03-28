import express from 'express';
import { deserializeUser } from 'src/middleware/deserializeUser';
import router from 'src/routes';
import swaggerDocs from 'src/utils/swagger.utils';
import config from 'config';

export function createServer() {
  const port = config.get<number>('port');
  const app = express();
  app.use(express.json());
  app.use(deserializeUser);
  app.use('/v1/api', router);
  swaggerDocs(app, port);

  app.all('*', (req, res) => {
    res.status(404).send(`Cannot find ${req.originalUrl} on this server`);
  });
  return app;
}
