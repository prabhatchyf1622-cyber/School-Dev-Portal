import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'schooldev_super_secure_jwt_secret_key_2026';
const STAFF_SECRET_KEY = process.env.STAFF_SECRET_KEY || 'SD-FACULTY-2026';

// Extend Express Request
export interface AuthRequest extends Request {
  user?: any;
}

// Generate Auth Token
export function generateToken(payload: { id: string; role: string; email: string }, rememberMe: boolean = false): string {
  const expiresIn = rememberMe ? '30d' : '24h';
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify Auth Token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Password Hashing
export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  if (!plain || !hashed) return false;
  return bcrypt.compare(plain, hashed);
}

// CAPTCHA Engine
// Cryptographically signed challenges with 5-minute expiry
interface CaptchaPayload {
  answerHash: string;
  expiresAt: number;
}

export function generateCaptchaChallenge(): { challengeId: string; prompt: string; expiresAt: number } {
  // Simple, pleasant, accessibility-friendly math or phrase challenge
  const ops = ['+', '-'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let num1 = Math.floor(Math.random() * 12) + 1;
  let num2 = Math.floor(Math.random() * 9) + 1;

  if (op === '-' && num1 < num2) {
    [num1, num2] = [num2, num1];
  }

  const answer = op === '+' ? num1 + num2 : num1 - num2;
  const prompt = `Solve: ${num1} ${op} ${num2} = ?`;
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Hash the answer with a secret salt
  const answerHash = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(String(answer).trim())
    .digest('hex');

  const challengeToken = jwt.sign({ answerHash, expiresAt }, JWT_SECRET, { expiresIn: '5m' });

  return {
    challengeId: challengeToken,
    prompt,
    expiresAt,
  };
}

export async function verifyCaptcha(challengeId: string, answer: string): Promise<boolean> {
  // If user provided an external Turnstile / reCAPTCHA secret in environment, verify with Google/Cloudflare
  if (process.env.RECAPTCHA_SECRET_KEY && challengeId.startsWith('turnstile_') || challengeId.startsWith('recaptcha_')) {
    try {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${answer}`,
      });
      const data = await verifyRes.json() as any;
      if (data && data.success) return true;
    } catch (err) {
      console.warn('[CAPTCHA] External verification failed, checking built-in challenge:', err);
    }
  }

  // Built-in cryptographic verification
  try {
    const decoded = jwt.verify(challengeId, JWT_SECRET) as CaptchaPayload;
    if (!decoded || Date.now() > decoded.expiresAt) return false;

    const computedHash = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(String(answer).trim())
      .digest('hex');

    return computedHash === decoded.answerHash;
  } catch {
    return false;
  }
}

// Verify Google ID Token
export async function verifyGoogleToken(idToken: string): Promise<{
  valid: boolean;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  error?: string;
}> {
  try {
    // Validate with Google OAuth2 Tokeninfo Endpoint
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!res.ok) {
      const errBody = await res.text();
      return { valid: false, error: `Google OAuth verification failed: ${errBody}` };
    }
    const data = await res.json() as any;
    if (!data.email) {
      return { valid: false, error: 'Google account has no email associated' };
    }

    // Check audience if client ID is set
    const expectedClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (expectedClientId && data.aud !== expectedClientId) {
      return { valid: false, error: 'Token audience does not match configured Google Client ID' };
    }

    return {
      valid: true,
      email: data.email,
      name: data.name || data.given_name || 'Google User',
      picture: data.picture,
      sub: data.sub,
    };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Error reaching Google OAuth verification servers' };
  }
}

// Rate Limiting & Abuse Prevention Guard
const failedAttemptsMap = new Map<string, { count: number; lastAttempt: number }>();

export function getFailedAttempts(identifier: string): number {
  const entry = failedAttemptsMap.get(identifier.toLowerCase());
  if (!entry) return 0;
  // Expire after 15 minutes
  if (Date.now() - entry.lastAttempt > 15 * 60 * 1000) {
    failedAttemptsMap.delete(identifier.toLowerCase());
    return 0;
  }
  return entry.count;
}

export function recordFailedAttempt(identifier: string): number {
  const key = identifier.toLowerCase();
  const current = getFailedAttempts(key);
  const updated = current + 1;
  failedAttemptsMap.set(key, { count: updated, lastAttempt: Date.now() });
  return updated;
}

export function clearFailedAttempts(identifier: string): void {
  failedAttemptsMap.delete(identifier.toLowerCase());
}

// Sanitization: Strip sensitive hashes and tokens before returning to client
export function sanitizeUser(user: any): any {
  if (!user) return null;
  const { password, verificationCode, resetPasswordToken, failedLoginAttempts, lockUntil, ...safe } = user;
  return safe;
}

// Middleware: Require Authentication
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies.schooldev_token) {
    token = req.cookies.schooldev_token;
  }

  // 2. Check Authorization Bearer header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in.', code: 'UNAUTHORIZED' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    res.status(401).json({ error: 'Session expired or invalid token. Please sign in again.', code: 'SESSION_EXPIRED' });
    return;
  }

  const user = await UserRepository.findById(decoded.id);
  if (!user || user.isActive === false) {
    res.status(401).json({ error: 'Account deactivated or not found.', code: 'ACCOUNT_DEACTIVATED' });
    return;
  }

  req.user = sanitizeUser(user);
  next();
}

// Middleware: Require Specific Role(s)
export function requireRole(allowedRoles: ('student' | 'teacher' | 'parent' | 'admin')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access Denied: Requires one of [${allowedRoles.join(', ')}] permissions. Current role: ${req.user.role}`,
        code: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
}

export { STAFF_SECRET_KEY, JWT_SECRET };
