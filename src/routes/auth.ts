import { Router } from 'express';
import { register, login, refreshTokens } from '../controllers/auth';
import {
  redirectToGoogle,
  handleGoogleCallback,
} from '../controllers/googleAuth';
import { googleSignIn } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokens);

// Google OAuth - Redirect flow (GET)
router.get('/google', redirectToGoogle);
router.get('/google/callback', handleGoogleCallback);

// Google OAuth - ID Token verification flow (POST)
router.post('/google', googleSignIn);

export default router;
