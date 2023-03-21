import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = express.Router();

router.get('/_health', (_, res) => {
  res.send('OK');
});

router.use(authRoutes);
router.use(userRoutes);

export default router;
