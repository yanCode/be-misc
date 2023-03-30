import { faker } from '@faker-js/faker';
import UserModel from 'src/models/user.model';
import { pick } from 'lodash';
import { signAccessToken, signRefreshToken } from 'src/services/auth.service';
import { SessionModel } from 'src/models/session.model';

export const API_PRFIX = '/v1/api';
export const userInput = {
  firstName: 'Davin',
  lastName: 'Lind',
  email: 'davin.lind@example.com',
  password: 'M5j2RgG3b9hCDqh',
  passwordConfirmation: 'M5j2RgG3b9hCDqh',
};
export type LoggedUserInfo = {
  accessToken: string;
  refreshToken: string;
  email: string;
  password: string;
  userId: string;
};

export const userLogin: (email?: string) => Promise<LoggedUserInfo> = async (
  email = faker.internet.email()
) => {
  const testUser = { ...userInput, email };

  const registeredUser = await UserModel.create(testUser);
  registeredUser.verified = true;
  const accessToken = signAccessToken(registeredUser);
  const refreshToken = await signRefreshToken({
    userId: registeredUser._id.toString(),
  });

  return {
    ...pick(testUser, 'email', 'password'),
    accessToken,
    refreshToken,
    userId: registeredUser._id.toString(),
  };
};

export const cleanLogin = async (userId: string) => {
  await UserModel.deleteOne({ _id: userId });
  await SessionModel.deleteOne({ user: userId });
};

export type UserInputType = typeof userInput;
