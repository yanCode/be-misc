import express from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/auth.schema';
import { createSessionHandler } from '../controllers/auth.controller';

const router = express.Router();
router.post('/', validateResource(createSessionSchema), createSessionHandler);
export default router;
