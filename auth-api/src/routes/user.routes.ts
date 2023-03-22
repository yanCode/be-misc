import express from 'express';
import validateResource from '../middleware/validateResource';
import {
  createUserSchema,
  forgotPasswordSchema,
  verifyUserSchema,
} from '../schema/user.schema';
import {
  createUserHandler,
  forgotPasswordHandler,
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
export default router;
