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
  forgotPassword,
  verifyOTP,
  resetPassword,
} from '../controllers/auth.controller';
import { googleLogin } from '../controllers/googleAuth';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes - Authentication
router.post('/register', register); // Email/Password registration with firstName/lastName
router.post('/login', login); // Email/Password login
router.post('/google', googleLogin); // 🚀 Production-ready Google OAuth
router.post('/refresh', refreshToken); // Refresh access token

// Password reset routes (public)
router.post('/forgot-password', forgotPassword); // Request password reset OTP
router.post('/verify-otp', verifyOTP); // Verify OTP code
router.post('/reset-password', resetPassword); // Reset password with OTP

// Protected routes - User management
router.post('/logout', authenticateToken, logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.get('/me', authenticateToken, getCurrentUser);
router.patch('/profile', authenticateToken, updateProfile);
router.delete('/account', authenticateToken, deleteAccount);

export default router;
