import { Request, Response } from 'express';
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from 'src/schema/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from 'src/services/user.service';
import { sendEmail } from 'src/utils/mailer.utils';
import { nanoid } from 'nanoid';
import { log } from 'src/utils/logger.utils';

export async function createUserHandler(
  req: Request<unknown, unknown, CreateUserInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    await sendEmail({
      from: 'dev@shengyan.dev',
      to: user.email,
      subject: 'Please verify your account',
      text: `verification code ${user.verificationCode}`,
    });
    return res.send(`User successfully Created with id: ${user._id}`);
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send('account already exists');
    }
    res.status(400).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const v = req.params.verificationCode;
  //find the user by id
  const user = await findUserById(id);
  if (!user) {
    return res.status(400).send('Could not verify user');
  }
  if (user.verified) {
    return res.status(400).send('User already verified');
  }
  if (user.verificationCode === v) {
    user.verified = true;
    await user.save();
    return res.send(`User successfully verified with id: ${user._id}`);
  }
  return res.status(400).send('Could not verify user');
}

export async function forgotPasswordHandler(
  req: Request<unknown, unknown, ForgotPasswordInput>,
  res: Response
) {
  const message =
    'If a user with this email exists, a password reset code will be sent to this email';
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    log.debug(`Could not find user with email: ${email}`);
    return res.send(message);
  }
  if (!user.verified) {
    return res.send(
      'This user cannot be reset password, please contact admin.'
    );
  }

  user.passwordResetCode = nanoid();
  await user.save();
  await sendEmail({
    to: user.email,
    from: 'test@shengyan.dev',
    text: `password reset code ${user.passwordResetCode}. Id: ${user._id}`,
  });
  log.debug(`password reset code sent to ${user.email}`);
  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<
    ResetPasswordInput['params'],
    unknown,
    ResetPasswordInput['body']
  >,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;
  const user = await findUserById(id);
  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.send('Invalid password reset code');
  }

  user.passwordResetCode = null;
  user.password = password;
  await user.save();
  return res.send('Password successfully reset');
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
