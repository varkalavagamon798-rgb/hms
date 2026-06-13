// Mock MFA session storage - Replace with real database
import { v4 as uuidv4 } from 'crypto';

interface MfaSession {
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
}

let mfaSessionsDatabase: Map<string, MfaSession> = new Map();

const SESSION_EXPIRY_MINUTES = 10;

export const createMfaSession = async (userId: string, email: string): Promise<string> => {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_EXPIRY_MINUTES);

  mfaSessionsDatabase.set(token, {
    token,
    userId,
    email,
    expiresAt,
  });

  return token;
};

export const getMfaSession = async (token: string): Promise<MfaSession | null> => {
  const session = mfaSessionsDatabase.get(token);
  if (!session) return null;

  // Check if expired
  if (new Date() > session.expiresAt) {
    mfaSessionsDatabase.delete(token);
    return null;
  }

  return session;
};

export const deleteMfaSession = async (token: string): Promise<void> => {
  mfaSessionsDatabase.delete(token);
};
