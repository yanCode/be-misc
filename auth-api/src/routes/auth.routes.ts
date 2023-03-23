import express from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/auth.schema';
import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from '../controllers/auth.controller';

const router = express.Router();
router.post('/', validateResource(createSessionSchema), createSessionHandler);
router.post('/refresh', refreshAccessTokenHandler);
export default router;
