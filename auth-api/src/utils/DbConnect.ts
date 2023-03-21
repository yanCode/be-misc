import * as mongoose from 'mongoose';
import config from 'config';

async function dBConnect() {
  const dbUri = config.get<string>('dbUrl');
  try {
    await mongoose.connect(dbUri);
  } catch (e) {
    console.error('FATAL: database cannot be connected...');
    throw e;
  }
}

export default dBConnect;
