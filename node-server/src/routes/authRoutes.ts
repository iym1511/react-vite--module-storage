import { Router } from 'express';
import { signUp, login, refresh, logout, me } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticateToken, me);

export default router;
