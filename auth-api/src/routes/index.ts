import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = express.Router();

router.get('/_health', (_, res) => {
  res.send('OK');
});

router.use('/sessions', authRoutes);
router.use('/users', userRoutes);

export default router;
