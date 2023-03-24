import express from 'express';
import validateResource from 'src/middleware/validateResource';
import { createSessionSchema } from 'src/schema/auth.schema';
import {
  createSessionHandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from 'src/controllers/auth.controller';

const router = express.Router();
router.post('/', validateResource(createSessionSchema), createSessionHandler);
router.post('/refresh', refreshAccessTokenHandler);
router.post('/logout', logoutHandler);
export default router;
