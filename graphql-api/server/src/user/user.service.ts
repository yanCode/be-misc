import { LoginInput, RegisterUserInput } from './user.dto';
import { prisma } from '../utils/prisma';
import argon2 from 'argon2';

export async function createUser(input: RegisterUserInput) {
  //hash the password
  const hashedPassword = await argon2.hash(input.password);
  //insert the user into the database
  return prisma.user.create({
    data: {
      ...input,
      email: input.email.toLowerCase(),
      password: hashedPassword,
    },
  });
}

export async function findUserByEmailOrUsername(
  emailOrUsername: LoginInput['usernameOrEmail']
) {
  return prisma.user.findFirst({
    where: {
      OR: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() },
      ],
    },
  });
}

export async function verifyPassword({
  password,
  candidatePassword,
}: {
  password: string;
  candidatePassword: string;
}) {
  return argon2.verify(password, candidatePassword);
}
