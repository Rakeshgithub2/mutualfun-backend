/**
 * Authentication Controller
 * Handles user registration, login, and token management
 */

const bcrypt = require('bcrypt');
const { authConfig } = require('../config/auth.config');
const User = require('../models/User.model');

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
}

module.exports = AuthController;
