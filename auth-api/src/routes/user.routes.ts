import express from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema, verifyUserSchema } from '../schema/user.schema';
import {
  createUserHandler,
  verifyUserHandler,
} from '../controllers/user.contoller';

const router = express.Router();
router.post('/users', validateResource(createUserSchema), createUserHandler);

router.post(
  '/users/verify/:id/:verificationCode',
  validateResource(verifyUserSchema),
  verifyUserHandler
);
export default router;
