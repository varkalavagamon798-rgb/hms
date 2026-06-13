import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as userDb from '../database/users';
import * as mfaSessionDb from '../database/mfaSessions';
import { comparePassword, hashPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getTokenExpiry, TokenPayload } from '../utils/jwt';
import { verifyMfaToken } from '../utils/mfa';
import { LoginCredentials, MfaVerifyPayload } from '../types';

const router = Router();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

/**
 * POST /auth/login
 * Authenticate user and return tokens or MFA challenge
 */
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password }: LoginCredentials = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError(400, 'Email and password are required', 'MISSING_CREDENTIALS');
    }

    // Find user
    const user = await userDb.findUserByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    // Check if account is locked
    if (user.locked_until) {
      const now = new Date();
      const lockedUntil = new Date(user.locked_until);
      if (now < lockedUntil) {
        throw new AppError(423, 'Account locked due to too many failed attempts. Try again in 30 minutes.', 'ACCOUNT_LOCKED');
      }
      // Unlock account
      await userDb.updateUserLoginAttempts(email, 0);
      user.login_attempts = 0;
      user.locked_until = undefined;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      // Increment login attempts
      user.login_attempts += 1;
      let lockedUntil: string | undefined;
      if (user.login_attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + LOCKOUT_DURATION_MINUTES);
        lockedUntil = lockTime.toISOString();
      }
      await userDb.updateUserLoginAttempts(email, user.login_attempts, lockedUntil);
      throw new AppError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError(403, 'Account is deactivated', 'ACCOUNT_INACTIVE');
    }

    // Check if MFA is enabled
    if (user.is_mfa_enabled) {
      const mfaSessionToken = await mfaSessionDb.createMfaSession(user.user_id, user.email);
      return res.json({
        success: true,
        data: {
          requires_mfa: true,
          mfa_session_token: mfaSessionToken,
        },
      });
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      hospital_id: user.hospital_id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const expiresIn = getTokenExpiry();

    // Update last login
    await userDb.updateLastLogin(user.user_id);

    // Return tokens and user data
    res.json({
      success: true,
      data: {
        requires_mfa: false,
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          hospital_id: user.hospital_id,
          department_id: user.department_id,
          is_mfa_enabled: user.is_mfa_enabled,
          avatar_url: user.avatar_url,
          last_login_at: user.last_login_at,
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        code: 'LOGIN_ERROR',
      });
    }
  }
});

/**
 * POST /auth/mfa/verify
 * Verify MFA OTP and return tokens
 */
router.post('/mfa/verify', async (req: AuthRequest, res: Response) => {
  try {
    const { mfa_session_token, otp_code }: MfaVerifyPayload = req.body;

    if (!mfa_session_token || !otp_code) {
      throw new AppError(400, 'MFA session token and OTP code are required', 'MISSING_MFA_DATA');
    }

    // Get MFA session
    const session = await mfaSessionDb.getMfaSession(mfa_session_token);
    if (!session) {
      throw new AppError(400, 'Invalid or expired MFA session', 'INVALID_MFA_SESSION');
    }

    // Get user
    const user = await userDb.findUserById(session.userId);
    if (!user || !user.mfa_secret) {
      throw new AppError(401, 'User not found or MFA not enabled', 'MFA_SETUP_ERROR');
    }

    // Verify OTP
    const isValidOtp = verifyMfaToken(user.mfa_secret, otp_code);
    if (!isValidOtp) {
      throw new AppError(400, 'Invalid or expired OTP.', 'INVALID_OTP');
    }

    // Delete MFA session
    await mfaSessionDb.deleteMfaSession(mfa_session_token);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      hospital_id: user.hospital_id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const expiresIn = getTokenExpiry();

    // Update last login
    await userDb.updateLastLogin(user.user_id);

    res.json({
      success: true,
      data: {
        requires_mfa: false,
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          hospital_id: user.hospital_id,
          department_id: user.department_id,
          is_mfa_enabled: user.is_mfa_enabled,
          avatar_url: user.avatar_url,
          last_login_at: user.last_login_at,
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      console.error('MFA verify error:', error);
      res.status(500).json({
        success: false,
        message: 'MFA verification failed',
        code: 'MFA_VERIFY_ERROR',
      });
    }
  }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: AuthRequest, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new AppError(400, 'Refresh token is required', 'MISSING_REFRESH_TOKEN');
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refresh_token);

    // Get user
    const user = await userDb.findUserById(payload.user_id);
    if (!user || !user.is_active) {
      throw new AppError(401, 'User not found or inactive', 'USER_INACTIVE');
    }

    // Generate new tokens
    const tokenPayload: TokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      hospital_id: user.hospital_id,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    const expiresIn = getTokenExpiry();

    res.json({
      success: true,
      data: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Token refresh failed',
        code: 'REFRESH_ERROR',
      });
    }
  }
});

/**
 * POST /auth/logout
 * Logout user (invalidate refresh token on client side)
 */
router.post('/logout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // In a production app, you might invalidate the refresh token here
    // For now, just clear the token on the client side
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR',
    });
  }
});

export default router;
