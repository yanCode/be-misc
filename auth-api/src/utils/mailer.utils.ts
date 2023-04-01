import {
  createTransport,
  getTestMessageUrl,
  SendMailOptions,
} from 'nodemailer';
import config from 'config';

import { log } from './logger.utils';
import { SmtpOptions } from 'src/typings';

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log('creds', creds);
// }
// createTestCreds();
const smtp = config.get<SmtpOptions>('smtp');
const transporter = createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

export async function sendEmail(payload: SendMailOptions) {
  log.info(`sending email ${payload.text}`);
  //todo enable bellow send mail function when smtp.ethereal.email recovers
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      return log.error(err, 'Error sending email');
    }
    log.info(`Preview URL: ${getTestMessageUrl(info)}`);
  });
}
