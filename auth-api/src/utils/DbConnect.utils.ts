import * as mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';
import config from 'config';
import { log } from './logger.utils';

async function dBConnect() {
  const dbUri = config.get<string>('dbUri');
  try {
    await mongoose.connect(dbUri, config.get<ConnectOptions>('dbConnectOpts'));
    log.info('connected to DB...');
  } catch (e) {
    log.fatal('FATAL: database cannot be connected...');
    throw e;
  }
}

export default dBConnect;
