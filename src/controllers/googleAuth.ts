import 'dotenv/config'; // Load environment variables first!
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { mongodb } from '../db/mongodb';
import { User, RefreshToken } from '../types/mongodb';
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/auth';
import { formatResponse } from '../utils/response';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  `http://localhost:${process.env.PORT || 3002}/auth/google/callback`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Debug logging
console.log('🔐 Google OAuth Configuration:');
console.log(
  '  CLIENT_ID:',
  CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : 'MISSING!'
);
console.log(
  '  CLIENT_SECRET:',
  CLIENT_SECRET ? `${CLIENT_SECRET.substring(0, 10)}...` : 'MISSING!'
);
console.log('  REDIRECT_URI:', REDIRECT_URI);
console.log('  FRONTEND_URL:', FRONTEND_URL);

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn(
    '⚠️  WARNING: Google OAuth credentials not configured - Google login will be disabled'
  );
}

const oauth2Client =
  CLIENT_ID && CLIENT_SECRET
    ? new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    : null;

export const redirectToGoogle = (req: Request, res: Response): void => {
  console.log('🔵 redirectToGoogle called');
  console.log('📋 Using CLIENT_ID:', CLIENT_ID ? 'Present' : 'MISSING!');

  if (!oauth2Client) {
    res.status(503).json({ error: 'Google OAuth is not configured' });
    return;
  }

  const state = req.query.state as string | undefined;
  const authUrlOptions: any = {
    access_type: 'offline',
    prompt: 'consent',
    scope: ['openid', 'email', 'profile'],
  };

  if (state) {
    authUrlOptions.state = state;
  }

  try {
    const url = oauth2Client.generateAuthUrl(authUrlOptions);
    console.log('✅ Generated OAuth URL:', url.substring(0, 100) + '...');
    res.redirect(url);
  } catch (error) {
    console.error('❌ Error generating OAuth URL:', error);
    res.status(500).json({ error: 'Failed to generate OAuth URL' });
  }
};

export const handleGoogleCallback = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  if (!oauth2Client) {
    return res.status(503).json({ error: 'Google OAuth is not configured' });
  }
  try {
    console.log('🔵 Google OAuth Callback Started');
    console.log('📋 Query params:', req.query);

    const code = req.query.code as string | undefined;
    if (!code) {
      console.error('❌ Missing authorization code');
      return res.status(400).json({ error: 'Missing code in callback' });
    }

    console.log('✅ Authorization code received');
    console.log('🔄 Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('✅ Tokens received from Google');
    console.log('✅ Tokens received from Google');
    // tokens contain access_token, id_token, refresh_token (if consented)
    const idToken = tokens.id_token;
    if (!idToken) {
      console.error('❌ No id_token in response');
      return res
        .status(400)
        .json({ error: 'No id_token returned from Google' });
    }

    console.log('🔄 Verifying ID token...');
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('✅ ID token verified, payload:', {
      email: payload?.email,
      name: payload?.name,
      picture: payload?.picture,
    });

    if (!payload || !payload.email) {
      console.error('❌ Missing email in payload');
      return res.status(400).json({ error: 'Google profile missing email' });
    }

    // UPSERT USER: Find or create, preserving existing watchlist
    console.log('🔄 Upserting user:', payload.email);
    const usersCollection = mongodb.getCollection<User>('users');

    // Build the update object - only set fields we want to update
    const updateFields: any = {
      googleId: payload.sub, // Google user ID
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      profilePicture: payload.picture || undefined,
      provider: 'google',
      isVerified: true, // Google emails are verified
      updatedAt: new Date(),
    };

    // For new users, also set these fields
    const setOnInsert: Partial<User> = {
      password: await hashPassword(crypto.randomBytes(20).toString('hex')), // Random password for OAuth users
      role: 'USER',
      kycStatus: 'PENDING',
      createdAt: new Date(),
    };

    // Upsert with googleId as the filter - preserves watchlist
    const filter = payload.sub
      ? { googleId: payload.sub }
      : { email: payload.email };
    const user = await usersCollection.findOneAndUpdate(
      filter,
      {
        $set: updateFields,
        $setOnInsert: setOnInsert,
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    if (!user) {
      console.error('❌ Failed to upsert user');
      return res.status(500).json({ error: 'Failed to create/update user' });
    }

    console.log('✅ User upserted successfully:', user.email);

    // Generate tokens
    console.log('🔄 Generating JWT tokens...');
    const userId = user._id!.toString();
    const accessToken = generateAccessToken({
      id: userId,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ id: userId });
    console.log('✅ JWT tokens generated');

    // Store refresh token in DB
    console.log('🔄 Storing refresh token in database...');
    const refreshTokensCollection =
      mongodb.getCollection<RefreshToken>('refresh_tokens');
    await refreshTokensCollection.insertOne({
      token: refreshToken,
      userId: user._id!,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });
    console.log('✅ Refresh token stored');

    // Encode user data in URL for frontend
    const userData = encodeURIComponent(
      JSON.stringify({
        id: userId,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
      })
    );

    // Redirect to frontend with tokens (careful: in production prefer httpOnly cookie)
    const redirectTo = `${FRONTEND_URL.replace(/\/$/, '')}/auth/success?accessToken=${encodeURIComponent(
      accessToken
    )}&refreshToken=${encodeURIComponent(refreshToken)}&user=${userData}`;

    console.log('✅ Redirecting to frontend success page');
    console.log('🎉 Google OAuth completed successfully for:', user.email);
    return res.redirect(redirectTo);
  } catch (error: any) {
    console.error('❌ Google OAuth callback error:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);

    // More helpful error response
    const errorMessage = error?.message || 'Google OAuth error';
    return res.status(500).json({
      error: 'Authentication failed',
      details: errorMessage,
      hint: 'Check backend terminal for full error details',
    });
  }
};
