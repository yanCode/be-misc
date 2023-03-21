import express from 'express';

const router = express.Router();
router.post('/users', (req, res) => {
  res.send('OK');
});
export default router;
