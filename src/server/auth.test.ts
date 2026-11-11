import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateCaptchaChallenge,
  verifyCaptcha,
  sanitizeUser,
} from './auth.js';
import { UserRepository } from './db.js';

test('Password hashing and verification with bcrypt', async () => {
  const plainPassword = 'SchoolSecurePassword!123';
  const hashed = await hashPassword(plainPassword);

  assert.notEqual(hashed, plainPassword);
  assert.ok(hashed.startsWith('$2'));

  const matches = await comparePassword(plainPassword, hashed);
  assert.equal(matches, true);

  const wrongMatches = await comparePassword('WrongPassword', hashed);
  assert.equal(wrongMatches, false);
});

test('JWT generation and verification', () => {
  const mockUser = {
    id: 'usr-test-123',
    email: 'test@schooldev.edu',
    role: 'teacher' as const,
  };

  const token = generateToken(mockUser);
  assert.ok(typeof token === 'string');
  assert.ok(token.length > 20);

  const decoded = verifyToken(token);
  assert.ok(decoded);
  assert.equal(decoded.id, mockUser.id);
  assert.equal(decoded.email, mockUser.email);
  assert.equal(decoded.role, mockUser.role);

  const invalidDecoded = verifyToken('corrupted.jwt.token');
  assert.equal(invalidDecoded, null);
});

test('Cryptographic CAPTCHA generation and math answer verification', async () => {
  const challenge = generateCaptchaChallenge();
  assert.ok(challenge.challengeId);
  assert.ok(challenge.prompt);

  // Extract expected answer from prompt e.g. "Solve: 14 + 7 = ?"
  const match = challenge.prompt.match(/Solve: (\d+) ([+-]) (\d+) = \?/);
  assert.ok(match, 'Prompt should match math pattern');

  const num1 = parseInt(match[1], 10);
  const op = match[2];
  const num2 = parseInt(match[3], 10);
  const expectedAnswer = op === '+' ? num1 + num2 : num1 - num2;

  // Correct answer should pass
  const isValid = await verifyCaptcha(challenge.challengeId, expectedAnswer.toString());
  assert.equal(isValid, true);

  // Wrong answer should fail
  const isWrongValid = await verifyCaptcha(challenge.challengeId, '99999');
  assert.equal(isWrongValid, false);
});

test('sanitizeUser strips password and sensitive security tokens', () => {
  const rawRecord = {
    id: 'usr-999',
    name: 'Test Administrator',
    email: 'admin@schooldev.edu',
    password: '$2a$10$hashedpasswordstringthatmustneverleak',
    role: 'admin' as const,
    avatar: 'https://example.com/avatar.jpg',
    isEmailVerified: true,
    isApproved: true,
    authProvider: 'local' as const,
    failedLoginAttempts: 0,
    verificationCode: { code: '849201', expiresAt: '2026-11-09T18:00:00Z' },
    resetPasswordToken: { token: 'expiring-token-123', expiresAt: '2026-11-09T18:00:00Z' },
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  const sanitized = sanitizeUser(rawRecord);

  assert.equal((sanitized as any).password, undefined);
  assert.equal((sanitized as any).verificationCode, undefined);
  assert.equal((sanitized as any).resetPasswordToken, undefined);
  assert.equal(sanitized.id, 'usr-999');
  assert.equal(sanitized.email, 'admin@schooldev.edu');
  assert.equal(sanitized.role, 'admin');
  assert.equal(sanitized.isEmailVerified, true);
});

test('UserRepository finds seeded personas and handles user lookups', async () => {
  const student = await UserRepository.findByEmail('aarav.sharma@student.schooldev.edu');
  assert.ok(student, 'Seeded student should exist');
  assert.equal(student.role, 'student');
  assert.equal(student.username, 'aarav10a');

  const admin = await UserRepository.findByEmail('principal@schooldev.edu');
  assert.ok(admin, 'Seeded principal admin should exist');
  assert.equal(admin.role, 'admin');

  // Verify username lookup via identifier
  const byUsername = await UserRepository.findByIdentifier('aarav10a');
  assert.ok(byUsername);
  assert.equal(byUsername.id, student.id);
});
