// Mock database for users - Replace with real database (PostgreSQL, MongoDB, etc.)
import { User } from '../types';
import { v4 as uuidv4 } from 'crypto';

// In-memory storage (for demo purposes only - use real DB in production)
let usersDatabase: Map<string, User> = new Map();

// Initialize with sample users
const initializeUsers = async () => {
  const sampleUsers: User[] = [
    {
      user_id: 'u-001',
      email: 'admin@hospital.com',
      full_name: 'Dr. Admin User',
      password_hash: '$2a$10$rPv5CXnCPsEVxj7T5rWvQe/6I2S8PZ5pZ0Z5pZ5pZ5pZ5pZ5pZ5pZ', // bcrypt hash of 'Admin@1234'
      role: 'SUPER_ADMIN',
      hospital_id: 'h-001',
      is_mfa_enabled: false,
      avatar_url: undefined,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      login_attempts: 0,
    },
    {
      user_id: 'u-002',
      email: 'doctor@hospital.com',
      full_name: 'Dr. John Smith',
      password_hash: '$2a$10$rPv5CXnCPsEVxj7T5rWvQe/6I2S8PZ5pZ0Z5pZ5pZ5pZ5pZ5pZ5pZ',
      role: 'DOCTOR',
      hospital_id: 'h-001',
      is_mfa_enabled: true,
      mfa_secret: 'JBSWY3DPEBLW64TMMQ======', // Sample secret
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      login_attempts: 0,
    },
  ];

  sampleUsers.forEach(user => {
    usersDatabase.set(user.email, user);
  });
};

initiializeUsers().catch(console.error);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = usersDatabase.get(email.toLowerCase());
  return user || null;
};

export const findUserById = async (userId: string): Promise<User | null> => {
  for (const user of usersDatabase.values()) {
    if (user.user_id === userId) {
      return user;
    }
  }
  return null;
};

export const updateUserLoginAttempts = async (email: string, attempts: number, lockedUntil?: string): Promise<void> => {
  const user = usersDatabase.get(email.toLowerCase());
  if (user) {
    user.login_attempts = attempts;
    if (lockedUntil) {
      user.locked_until = lockedUntil;
    }
    user.updated_at = new Date().toISOString();
  }
};

export const updateLastLogin = async (userId: string): Promise<void> => {
  for (const user of usersDatabase.values()) {
    if (user.user_id === userId) {
      user.last_login_at = new Date().toISOString();
      user.login_attempts = 0;
      user.locked_until = undefined;
      user.updated_at = new Date().toISOString();
      break;
    }
  }
};
