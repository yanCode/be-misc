import dbConnect from './utils/DbConnect.utils';
import { log } from './utils/logger.utils';
import { createServer } from 'src/services/server';
import config from 'config';

const app = createServer();
const port = config.get<number>('port');
app.listen(port, () => {
  log.info(`App started at localhost:${port}`);
  dbConnect();
});
