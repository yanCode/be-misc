import express from 'express';
import config from 'config';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = config.get('port');
app.listen(port, () => {
  console.log(`App started at localhost:${port}`);
});
