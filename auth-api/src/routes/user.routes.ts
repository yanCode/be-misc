import express from 'express';
import validateResource from '../middleware/validateResource';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../schema/user.schema';
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controllers/user.contoller';

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

router.get('/me', getCurrentUserHandler);

export default router;
