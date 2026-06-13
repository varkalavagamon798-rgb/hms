import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
  jwtExpireIn: process.env.JWT_EXPIRE_IN || '1h',
  jwtRefreshExpireIn: process.env.JWT_REFRESH_EXPIRE_IN || '7d',
  mfaWindowSize: parseInt(process.env.MFA_WINDOW_SIZE || '2', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

