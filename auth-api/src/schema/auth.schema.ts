import { object, string, TypeOf } from 'zod';

export const VAGUE_CREATE_SESSION_FAILED_MESSAGE = 'Invalid email or password';
export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: VAGUE_CREATE_SESSION_FAILED_MESSAGE,
    }).email(VAGUE_CREATE_SESSION_FAILED_MESSAGE),
    password: string({
      required_error: VAGUE_CREATE_SESSION_FAILED_MESSAGE,
    }).min(6, VAGUE_CREATE_SESSION_FAILED_MESSAGE),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];
