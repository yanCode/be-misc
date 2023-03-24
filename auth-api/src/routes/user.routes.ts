import express from 'express';
import validateResource from 'src/middleware/validateResource';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from 'src/schema/user.schema';
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from 'src/controllers/user.contoller';
import { requireLoggedUser } from '../middleware/requireLoggedUser';

const router = express.Router();
router.post('/', validateResource(createUserSchema), createUserHandler);

router.post(
  '/verify/:id/:verificationCode',
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post(
  '/forgot-password',
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);
router.post(
  '/reset-password/:id/:passwordResetCode',
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

router.get('/me', requireLoggedUser, getCurrentUserHandler);

export default router;
