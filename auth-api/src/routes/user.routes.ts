import express from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler } from '../controllers/user.contoller';

const router = express.Router();
router.post(
  '/users',
  validateResource(createUserSchema),
  createUserHandler,
  (req, res) => {
    res.send('OK');
  }
);
export default router;
