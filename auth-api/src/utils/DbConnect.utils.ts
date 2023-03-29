import * as mongoose from 'mongoose';
import config from 'config';
import { log } from './logger.utils';

async function dBConnect() {
  const dbUri = config.get<string>('dbUri');
  try {
    await mongoose.connect(dbUri, {
      user: 'root',
      pass: 'password',
      dbName: 'user-api-test',
      connectTimeoutMS: 1000,
      socketTimeoutMS: 1000,
    });
    log.info('connected to DB...');
  } catch (e) {
    log.fatal('FATAL: database cannot be connected...');
    throw e;
  }
}

export default dBConnect;
