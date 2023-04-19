import config from 'config';
import { createServer } from 'src/services/server';
import dBConnect from 'src/utils/DbConnect.utils';
import { log } from 'src/utils/logger.utils';

const app = createServer();
const port = config.get<number>('port');
app.listen(port, () => {
  log.info(`App started at localhost:${port}`);
  dBConnect();
});
