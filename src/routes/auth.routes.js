/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rateLimiter = require('../middleware/rateLimiter.middleware');

// Public routes (with strict rate limiting)
router.post('/register', rateLimiter.authLimiter, AuthController.register);

router.post('/login', rateLimiter.authLimiter, AuthController.login);

router.post(
  '/refresh',
  authMiddleware.verifyRefreshToken,
  AuthController.refreshToken
);

// Protected routes
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
