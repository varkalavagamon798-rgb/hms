import speakeasy from 'speakeasy';
import { config } from '../config';

export const generateMfaSecret = (email: string) => {
  return speakeasy.generateSecret({
    name: `HMS Platform (${email})`,
    issuer: 'HMS Platform',
  });
};

export const verifyMfaToken = (secret: string, token: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: config.mfaWindowSize,
  });
};
