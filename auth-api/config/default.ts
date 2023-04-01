import { ConnectOptions } from 'mongoose';
import { SmtpOptions } from 'src/typings';

export default {
  port: 3000,
  dbUri: 'mongodb://localhost:27017',
  dbConnectOpts: {
    user: 'root',
    pass: 'password',
    dbName: 'user-api',
    connectTimeoutMS: 1000,
    socketTimeoutMS: 1000,
  } as ConnectOptions,
  logLevel: 'info',
  accessTokenPrivateKey: '',
  refreshTokenPrivateKey: '',
  smtp: {
    user: 'xmlwoup4p2hsw4kr@ethereal.email',
    pass: 'r2e9kWuNgqG9KPRET9',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
  } as SmtpOptions,
};
