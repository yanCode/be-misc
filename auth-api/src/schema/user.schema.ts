import { object, string, TypeOf } from 'zod';
import mongoose from 'mongoose';

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Email must be a valid email'),

    firstName: string({
      required_error: 'First name is required',
    }),

    lastName: string({
      required_error: 'Last name is required',
    }),

    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters'),

    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string().refine((data) => mongoose.Types.ObjectId.isValid(data), {
      message: 'id must be an ObjectId',
    }),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Email must be a valid email'
    ),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string().refine((data) => mongoose.Types.ObjectId.isValid(data), {
      message: 'id must be an ObjectId',
    }),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password must be at least 6 characters'
    ),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
