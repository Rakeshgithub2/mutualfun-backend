/**
 * Authentication Controller
 * Handles user registration, login, Google OAuth, and token management
 */

const bcrypt = require('bcrypt');
const axios = require('axios');
const crypto = require('crypto');
const { authConfig } = require('../config/auth.config');
const User = require('../models/User.model');
const EmailService = require('../services/email.service');

class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Email and password are required',
        });
      }

      // Validate password strength
      const passwordValidation = authConfig.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Weak password',
          message: passwordValidation.errors,
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists',
          message: 'An account with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user',
      });

      await user.save();

      // Send welcome email (don't wait for it)
      EmailService.sendWelcomeEmail(user.email, user.firstName).catch((err) =>
        console.error('Welcome email failed:', err)
      );

      // Generate tokens
      const accessToken = authConfig.generateAccessToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = authConfig.generateRefreshToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        message: error.message,
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Missing credentials',
          message: 'Email and password are required',
        });
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        });
      }

      // Generate tokens
      const accessToken = authConfig.generateAccessToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = authConfig.generateRefreshToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: error.message,
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refreshToken(req, res) {
    try {
      // Token is verified by middleware
      const { userId, email, role } = req.user;

      // Generate new access token
      const accessToken = authConfig.generateAccessToken({
        userId,
        email,
        role,
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        error: 'Token refresh failed',
        message: error.message,
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId)
        .select('-password -__v')
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile',
        message: error.message,
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, phone } = req.body;
      const updates = {};

      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (phone) updates.phone = phone;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password -__v');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        message: error.message,
      });
    }
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Missing fields',
          message: 'Current password and new password are required',
        });
      }

      // Validate new password strength
      const passwordValidation = authConfig.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Weak password',
          message: passwordValidation.errors,
        });
      }

      // Get user with password
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password',
          message: 'Current password is incorrect',
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password',
        message: error.message,
      });
    }
  }

  /**
   * Logout (client-side token invalidation)
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // Optionally, you can maintain a blacklist of tokens

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed',
        message: error.message,
      });
    }
  }

  /**
   * Initiate Google OAuth flow
   * GET /api/auth/google
   */
  static async googleAuth(req, res) {
    try {
      const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;

      if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
        return res.status(500).json({
          success: false,
          error: 'Google OAuth not configured',
          message: 'Missing Google OAuth credentials',
        });
      }

      // Build Google OAuth URL
      const googleAuthUrl = new URL(
        'https://accounts.google.com/o/oauth2/v2/auth'
      );
      googleAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
      googleAuthUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
      googleAuthUrl.searchParams.append('response_type', 'code');
      googleAuthUrl.searchParams.append('scope', 'email profile');
      googleAuthUrl.searchParams.append('access_type', 'offline');
      googleAuthUrl.searchParams.append('prompt', 'consent');

      res.json({
        success: true,
        data: {
          authUrl: googleAuthUrl.toString(),
        },
      });
    } catch (error) {
      console.error('Google OAuth initiation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initiate Google OAuth',
        message: error.message,
      });
    }
  }

  /**
   * Handle Google OAuth callback
   * GET /api/auth/google/callback
   */
  static async googleCallback(req, res) {
    try {
      const { code } = req.query;

      if (!code) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/error?message=No authorization code received`
        );
      }

      const {
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI,
        FRONTEND_URL,
      } = process.env;

      // Exchange authorization code for access token
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        }
      );

      const { access_token } = tokenResponse.data;

      // Get user info from Google
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const {
        email,
        given_name,
        family_name,
        picture,
        id: googleId,
      } = userInfoResponse.data;

      // Find or create user
      let user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Create new user
        user = new User({
          email: email.toLowerCase(),
          firstName: given_name,
          lastName: family_name,
          profilePicture: picture,
          authProvider: 'google',
          googleId,
          role: 'user',
          emailVerified: true, // Google emails are pre-verified
        });
        await user.save();
      } else {
        // Update existing user with Google data
        user.authProvider = 'google';
        user.googleId = googleId;
        if (!user.profilePicture) user.profilePicture = picture;
        user.lastLogin = new Date();
        user.emailVerified = true;
        await user.save();
      }

      // Generate JWT tokens
      const accessToken = authConfig.generateAccessToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = authConfig.generateRefreshToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      // Redirect to frontend with tokens
      const redirectUrl = new URL(`${FRONTEND_URL}/auth/callback`);
      redirectUrl.searchParams.append('accessToken', accessToken);
      redirectUrl.searchParams.append('refreshToken', refreshToken);

      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const errorMessage = encodeURIComponent(
        error.message || 'Google authentication failed'
      );
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/error?message=${errorMessage}`
      );
    }
  }

  /**
   * Forgot Password - Step 1: Send OTP
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Missing email',
          message: 'Email is required',
        });
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({
          success: true,
          message:
            'If an account exists with this email, you will receive an OTP',
        });
      }

      // Check if user is a Google OAuth user
      if (user.authProvider === 'google') {
        return res.status(400).json({
          success: false,
          error: 'Google account',
          message:
            'Please use Google to sign in. Password reset is not available for Google accounts.',
        });
      }

      // Generate 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in user document
      user.resetPasswordOTP = otp;
      user.resetPasswordOTPExpiry = otpExpiry;
      await user.save();

      // Send OTP email
      const emailResult = await EmailService.sendPasswordResetOTP(
        user.email,
        otp,
        user.firstName
      );

      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Email sending failed',
          message: 'Failed to send OTP. Please try again.',
        });
      }

      res.json({
        success: true,
        message: 'OTP sent to your email. Valid for 10 minutes.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process request',
        message: error.message,
      });
    }
  }

  /**
   * Verify OTP - Step 2
   * POST /api/auth/verify-otp
   */
  static async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          error: 'Missing fields',
          message: 'Email and OTP are required',
        });
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: 'Invalid email',
        });
      }

      // Check if OTP exists
      if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
        return res.status(400).json({
          success: false,
          error: 'No OTP requested',
          message: 'Please request a password reset first',
        });
      }

      // Check if OTP expired
      if (new Date() > user.resetPasswordOTPExpiry) {
        return res.status(400).json({
          success: false,
          error: 'OTP expired',
          message: 'OTP has expired. Please request a new one.',
        });
      }

      // Verify OTP
      if (user.resetPasswordOTP !== otp) {
        return res.status(400).json({
          success: false,
          error: 'Invalid OTP',
          message: 'The OTP you entered is incorrect',
        });
      }

      // Generate a temporary token for password reset
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await user.save();

      res.json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          resetToken, // Frontend will use this to reset password
        },
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify OTP',
        message: error.message,
      });
    }
  }

  /**
   * Reset Password - Step 3: Set new password
   * POST /api/auth/reset-password
   */
  static async resetPassword(req, res) {
    try {
      const { email, resetToken, newPassword } = req.body;

      if (!email || !resetToken || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Missing fields',
          message: 'Email, reset token, and new password are required',
        });
      }

      // Validate password strength
      const passwordValidation = authConfig.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Weak password',
          message: passwordValidation.errors,
        });
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: 'Invalid email',
        });
      }

      // Verify reset token
      if (!user.resetPasswordToken || user.resetPasswordToken !== resetToken) {
        return res.status(400).json({
          success: false,
          error: 'Invalid token',
          message: 'Invalid or expired reset token',
        });
      }

      // Check if token expired
      if (new Date() > user.resetPasswordTokenExpiry) {
        return res.status(400).json({
          success: false,
          error: 'Token expired',
          message: 'Reset token has expired. Please start over.',
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear reset tokens
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpiry = undefined;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;

      await user.save();

      // Send confirmation email (don't wait for it)
      EmailService.sendPasswordChangedEmail(user.email, user.firstName).catch(
        (err) => console.error('Password changed email failed:', err)
      );

      res.json({
        success: true,
        message:
          'Password reset successful. You can now login with your new password.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password',
        message: error.message,
      });
    }
  }
}

module.exports = AuthController;
