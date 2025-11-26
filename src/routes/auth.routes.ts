import { Router } from 'express';
import {
  register,
  login,
  googleSignIn,
  refreshToken,
  logout,
  logoutAll,
  getCurrentUser,
  updateProfile,
  deleteAccount,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes - Authentication
router.post('/register', register); // Email/Password registration
router.post('/login', login); // Email/Password login
router.post('/google', googleSignIn); // Google OAuth
router.post('/refresh', refreshToken); // Refresh access token

// Protected routes - User management
router.post('/logout', authenticateToken, logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.get('/me', authenticateToken, getCurrentUser);
router.patch('/profile', authenticateToken, updateProfile);
router.delete('/account', authenticateToken, deleteAccount);

export default router;
