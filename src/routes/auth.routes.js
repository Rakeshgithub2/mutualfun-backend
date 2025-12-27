/**
 * Authentication Routes
 * Clean implementation with Google OAuth
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rateLimiter = require('../middleware/rateLimiter.middleware');

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// Email/Password Authentication
router.post('/register', rateLimiter.authLimiter, AuthController.register);
router.post('/login', rateLimiter.authLimiter, AuthController.login);
router.post(
  '/refresh',
  authMiddleware.verifyRefreshToken,
  AuthController.refreshToken
);

// Password Reset Flow
router.post(
  '/forgot-password',
  rateLimiter.authLimiter,
  AuthController.forgotPassword
);
router.post('/verify-otp', rateLimiter.authLimiter, AuthController.verifyOTP);
router.post(
  '/reset-password',
  rateLimiter.authLimiter,
  AuthController.resetPassword
);

// ============================================================================
// GOOGLE OAUTH ROUTES
// ============================================================================

// Step 1: Initiate Google OAuth flow
// Frontend calls this to get Google authorization URL
router.get('/google', AuthController.googleAuth);

// Step 2: Google redirects back to this callback with authorization code
// This route exchanges code for tokens and creates/updates user
router.get('/google/callback', AuthController.googleCallback);

// ============================================================================
// PROTECTED ROUTES
// ============================================================================

router.get('/profile', authMiddleware.verifyToken, AuthController.getProfile);
router.put(
  '/profile',
  authMiddleware.verifyToken,
  AuthController.updateProfile
);
router.post(
  '/change-password',
  authMiddleware.verifyToken,
  rateLimiter.authLimiter,
  AuthController.changePassword
);
router.post('/logout', authMiddleware.verifyToken, AuthController.logout);

module.exports = router;
