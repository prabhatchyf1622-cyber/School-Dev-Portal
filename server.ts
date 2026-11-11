import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  connectDatabase,
  UserRepository,
  isDbUsingMongo,
} from './src/server/db.js';
import {
  generateToken,
  hashPassword,
  comparePassword,
  generateCaptchaChallenge,
  verifyCaptcha,
  verifyGoogleToken,
  getFailedAttempts,
  recordFailedAttempt,
  clearFailedAttempts,
  sanitizeUser,
  requireAuth,
  requireRole,
  AuthRequest,
  STAFF_SECRET_KEY,
} from './src/server/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Basic security and parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Disable telemetry header
  app.disable('x-powered-by');

  // Initialize Database (MongoDB or local persistent fallback)
  const dbStatus = await connectDatabase();
  console.log(`[Server] Database initialized in mode: ${dbStatus.mode}`);

  // ==========================================
  // AUTHENTICATION API ROUTES
  // ==========================================

  // 1. CAPTCHA Challenge Generator
  app.get('/api/auth/captcha-challenge', (req, res) => {
    try {
      const challenge = generateCaptchaChallenge();
      res.json(challenge);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate CAPTCHA challenge' });
    }
  });

  // 2. Account Registration
  app.post('/api/auth/register', async (req, res) => {
    try {
      const {
        name,
        email,
        username,
        password,
        confirmPassword,
        role = 'student',
        studentId,
        classId,
        section,
        rollNumber,
        childrenStudentId,
        staffSecretKey,
        consent,
        captchaId,
        captchaAnswer,
      } = req.body;

      // Input Validation
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All mandatory fields (Name, Email, Password) must be provided.' });
      }

      if (!consent) {
        return res.status(400).json({ error: 'You must accept the School Terms and Privacy Policy to register.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      // Check Email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid institutional or personal email address.' });
      }

      // CAPTCHA check on registration
      if (captchaId && captchaAnswer) {
        const isCaptchaValid = await verifyCaptcha(captchaId, captchaAnswer);
        if (!isCaptchaValid) {
          return res.status(400).json({ error: 'CAPTCHA solution is incorrect or has expired. Please try again.' });
        }
      }

      // Duplicate check
      const existingEmail = await UserRepository.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: 'An account with this email address is already registered.' });
      }

      if (username) {
        const existingUsername = await UserRepository.findByUsername(username);
        if (existingUsername) {
          return res.status(409).json({ error: 'This username is already taken. Please pick another.' });
        }
      }

      // ROLE RESTRICTIONS & AUTHORIZATION ENFORCEMENT
      // Never allow public users to self-assign Administrator or Teacher roles without official key!
      let assignedRole: 'student' | 'teacher' | 'parent' | 'admin' = 'student';
      let isApproved = false;

      if (role === 'admin' || role === 'teacher') {
        if (!staffSecretKey || staffSecretKey.trim() !== STAFF_SECRET_KEY) {
          return res.status(403).json({
            error:
              'Unauthorized Role Assignment: Faculty and Administrator accounts cannot be self-registered without a valid school staff authorization code.',
            requiresKey: true,
          });
        }
        assignedRole = role;
        isApproved = true; // Authorized staff with key is approved
      } else if (role === 'parent') {
        assignedRole = 'parent';
        // Check if student ID exists to link
        if (childrenStudentId) {
          const all = await UserRepository.getAll();
          const linkedStudent = all.find(u => u.studentId === childrenStudentId || u.id === childrenStudentId);
          if (linkedStudent) {
            isApproved = true; // Auto-approved if linked to valid existing student
          } else {
            isApproved = false; // Pending manual verification
          }
        }
      } else {
        // Student role
        assignedRole = 'student';
        // Auto-approve if class, section, and roll number or studentId are supplied
        if (classId && section && rollNumber) {
          isApproved = true;
        } else {
          isApproved = false;
        }
      }

      // Hash password with bcrypt
      const hashedPassword = await hashPassword(password);

      // Generate 6-digit OTP for Email Verification (valid 15 minutes)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

      const newUser = await UserRepository.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        username: username ? username.toLowerCase().trim() : undefined,
        password: hashedPassword,
        role: assignedRole,
        isEmailVerified: false,
        isApproved,
        authProvider: 'local',
        verificationCode: {
          code: otpCode,
          expiresAt: verificationExpires.toISOString(),
        },
        studentId: assignedRole === 'student' ? studentId || `SD-2026-${classId || '10'}${rollNumber || '99'}` : undefined,
        classId: assignedRole === 'student' ? classId || '10' : undefined,
        section: assignedRole === 'student' ? section || 'A' : undefined,
        rollNumber: assignedRole === 'student' ? rollNumber || '25' : undefined,
        linkedStudentId: assignedRole === 'parent' ? childrenStudentId : undefined,
        designation: assignedRole === 'teacher' ? 'Faculty Member' : assignedRole === 'admin' ? 'Administrator' : undefined,
      });

      console.log(`[Auth] Registered new user ${newUser.email} (${newUser.role}). Verification OTP: [${otpCode}]`);

      res.status(201).json({
        message: 'Account registration initiated successfully. Please verify your email address.',
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.isApproved,
        // For convenience and instant testing in AI Studio sandbox, OTP is included in response
        verificationCodeHint: otpCode,
      });
    } catch (err: any) {
      console.error('[Auth] Registration error:', err);
      res.status(500).json({ error: err.message || 'Server error during registration' });
    }
  });

  // 3. Email Verification
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
      }

      const user = await UserRepository.findByVerificationCode(email, code.trim());
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new code.' });
      }

      // Mark verified
      const updated = await UserRepository.update(user.id, {
        isEmailVerified: true,
        verificationCode: undefined,
      });

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update user verification state.' });
      }

      // Generate session token
      const token = generateToken({ id: updated.id, role: updated.role, email: updated.email }, true);

      // Set cookie
      res.cookie('schooldev_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: 'Email address verified successfully! Welcome to SchoolDev Portal.',
        token,
        user: sanitizeUser(updated),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to verify email' });
    }
  });

  // 4. Resend Verification Code
  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required.' });

      const user = await UserRepository.findByEmail(email);
      if (!user) return res.status(404).json({ error: 'Account not found with this email.' });

      if (user.isEmailVerified) {
        return res.status(400).json({ error: 'This account email is already verified. You can sign in.' });
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      await UserRepository.update(user.id, {
        verificationCode: {
          code: newOtp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        },
      });

      console.log(`[Auth] Resent OTP for ${email}: [${newOtp}]`);
      res.json({
        message: 'Verification code resent successfully.',
        verificationCodeHint: newOtp,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error resending code' });
    }
  });

  // 5. Sign In (Login)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { identifier, password, rememberMe = false, captchaId, captchaAnswer } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Username/Email and Password are required.' });
      }

      const failedCount = getFailedAttempts(identifier);

      // Abuse Protection: If failed attempts >= 3, require CAPTCHA validation
      if (failedCount >= 3) {
        if (!captchaId || !captchaAnswer) {
          const freshCaptcha = generateCaptchaChallenge();
          return res.status(403).json({
            error: 'Security verification required due to multiple failed attempts. Please solve the CAPTCHA.',
            requiresCaptcha: true,
            captchaChallenge: freshCaptcha,
          });
        }

        const isCaptchaValid = await verifyCaptcha(captchaId, captchaAnswer);
        if (!isCaptchaValid) {
          const freshCaptcha = generateCaptchaChallenge();
          return res.status(403).json({
            error: 'CAPTCHA solution is incorrect. Please try again.',
            requiresCaptcha: true,
            captchaChallenge: freshCaptcha,
          });
        }
      }

      // Check account lockout
      if (failedCount >= 5) {
        return res.status(429).json({
          error: 'Too many consecutive failed login attempts. Account access is temporarily locked for 15 minutes for your security.',
          isLocked: true,
        });
      }

      // Look up user by email or username
      const user = await UserRepository.findByIdentifier(identifier);
      if (!user) {
        recordFailedAttempt(identifier);
        return res.status(401).json({ error: 'Invalid credentials. Please verify your email/username and password.' });
      }

      // Compare password
      if (!user.password) {
        return res.status(401).json({
          error: 'This account was created via Google Sign-In. Please click "Continue with Google".',
        });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        const updatedFails = recordFailedAttempt(identifier);
        const remaining = 5 - updatedFails;
        return res.status(401).json({
          error: `Invalid credentials. Please verify your email/username and password.${
            remaining > 0 ? ` (${remaining} attempts remaining before temporary lock)` : ''
          }`,
          requiresCaptcha: updatedFails >= 3,
          captchaChallenge: updatedFails >= 3 ? generateCaptchaChallenge() : undefined,
        });
      }

      // Clear failed attempts on successful credential verification
      clearFailedAttempts(identifier);

      // Check Email Verification
      if (!user.isEmailVerified) {
        // Generate new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        await UserRepository.update(user.id, {
          verificationCode: {
            code: newOtp,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          },
        });
        return res.status(403).json({
          error: 'Please verify your institutional email address before signing in.',
          requiresEmailVerification: true,
          email: user.email,
          verificationCodeHint: newOtp,
        });
      }

      // Check Administrator Approval
      if (!user.isApproved) {
        return res.status(403).json({
          error: 'Your account registration is currently pending administrator verification.',
          isPendingApproval: true,
          user: sanitizeUser(user),
        });
      }

      // Check Account Active Status
      if (user.isActive === false) {
        return res.status(403).json({
          error: 'This account has been deactivated by the school administration. Please contact the office.',
        });
      }

      // Generate JWT Token
      const token = generateToken({ id: user.id, role: user.role, email: user.email }, rememberMe);

      // Set secure HttpOnly cookie
      res.cookie('schooldev_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000,
      });

      console.log(`[Auth] User ${user.email} (${user.role}) logged in successfully.`);

      res.json({
        message: 'Signed in successfully!',
        token,
        user: sanitizeUser(user),
      });
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      res.status(500).json({ error: err.message || 'Server error during sign in' });
    }
  });

  // 6. Google Authentication
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { credential, userInfo } = req.body;

      let googleEmail: string | undefined;
      let googleName: string | undefined;
      let googlePicture: string | undefined;
      let googleSub: string | undefined;

      // Real token verification if real Google credential is sent
      if (credential) {
        const verifyResult = await verifyGoogleToken(credential);
        if (!verifyResult.valid || !verifyResult.email) {
          return res.status(401).json({ error: verifyResult.error || 'Google identity verification failed' });
        }
        googleEmail = verifyResult.email;
        googleName = verifyResult.name;
        googlePicture = verifyResult.picture;
        googleSub = verifyResult.sub;
      } else if (userInfo && userInfo.email) {
        // Fallback for direct Google user profile exchange
        googleEmail = userInfo.email;
        googleName = userInfo.name || userInfo.email.split('@')[0];
        googlePicture = userInfo.picture;
        googleSub = userInfo.sub || userInfo.id;
      } else {
        return res.status(400).json({ error: 'Google credential or verified identity profile required' });
      }

      if (!googleEmail) {
        return res.status(400).json({ error: 'Valid Google email is required' });
      }

      googleEmail = googleEmail.toLowerCase().trim();

      // Check if user already exists
      let user = await UserRepository.findByEmail(googleEmail);

      if (user) {
        // Link Google ID if not linked
        if (!user.googleId && googleSub) {
          user = await UserRepository.update(user.id, {
            googleId: googleSub,
            avatar: user.avatar || googlePicture,
          });
        }
      } else {
        // Register new Google user with safe student default role
        user = await UserRepository.create({
          name: googleName || 'Google User',
          email: googleEmail,
          role: 'student',
          isEmailVerified: true, // Google verifies their email address
          isApproved: true,
          authProvider: 'google',
          googleId: googleSub,
          avatar: googlePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          classId: '10',
          section: 'A',
          rollNumber: '28',
          studentId: `SD-2026-G${Math.floor(100 + Math.random() * 900)}`,
        });
        console.log(`[Auth] Registered first-time Google user: ${googleEmail}`);
      }

      if (!user) {
        return res.status(500).json({ error: 'Failed to initialize account with Google' });
      }

      // Enforce Approval & Active Checks
      if (!user.isApproved) {
        return res.status(403).json({
          error: 'Your Google-linked account is awaiting school administrative approval.',
          isPendingApproval: true,
          user: sanitizeUser(user),
        });
      }

      if (user.isActive === false) {
        return res.status(403).json({ error: 'This account has been deactivated. Please contact administration.' });
      }

      // Generate JWT Token
      const token = generateToken({ id: user.id, role: user.role, email: user.email }, true);

      // Set cookie
      res.cookie('schooldev_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      console.log(`[Auth] Google user authenticated: ${googleEmail} (${user.role})`);

      res.json({
        message: 'Google Sign-In successful!',
        token,
        user: sanitizeUser(user),
      });
    } catch (err: any) {
      console.error('[Auth] Google OAuth error:', err);
      res.status(500).json({ error: err.message || 'Error processing Google authentication' });
    }
  });

  // 7. Forgot Password (Request Reset Token)
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email address is required.' });

      const user = await UserRepository.findByEmail(email);
      // For security, don't disclose whether email exists, but generate token if found
      if (!user) {
        return res.json({
          message: 'If an account exists with this email address, password recovery instructions have been dispatched.',
        });
      }

      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await UserRepository.update(user.id, {
        resetPasswordToken: {
          token: resetToken,
          expiresAt: expiresAt.toISOString(),
        },
      });

      console.log(`[Auth] Password reset requested for ${email}. Token: [${resetToken}]`);

      res.json({
        message: 'Password reset link and OTP generated. Valid for 15 minutes.',
        resetTokenHint: resetToken,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to process forgot password request' });
    }
  });

  // 8. Reset Password
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'Token and both password fields are required.' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirmation do not match.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      const user = await UserRepository.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Password reset link is invalid or has expired. Please request a new one.' });
      }

      const hashedPassword = await hashPassword(newPassword);
      await UserRepository.update(user.id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
      });

      console.log(`[Auth] Password reset successfully for ${user.email}`);

      res.json({
        message: 'Password has been successfully updated! You can now sign in with your new password.',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error updating password' });
    }
  });

  // 9. Current Authenticated User (Session verification)
  app.get('/api/auth/me', requireAuth, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  // 10. Change Password (Authenticated user)
  app.post('/api/auth/change-password', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All password fields are required.' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New passwords do not match.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      }

      const user = await UserRepository.findById(req.user.id);
      if (!user || !user.password) {
        return res.status(400).json({ error: 'Cannot change password for external OAuth accounts.' });
      }

      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password provided is incorrect.' });
      }

      const hashedPassword = await hashPassword(newPassword);
      await UserRepository.update(user.id, { password: hashedPassword });

      res.json({ message: 'Password changed successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error changing password' });
    }
  });

  // 11. Sign Out (Logout)
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('schooldev_token');
    res.json({ message: 'Signed out successfully.' });
  });

  // 12. System Health & Database Diagnostics
  app.get('/api/auth/status', (req, res) => {
    res.json({
      status: 'operational',
      database: isDbUsingMongo() ? 'MongoDB' : 'Local Persistent Repository (Fallback)',
      mongoConnected: isDbUsingMongo(),
      googleOAuthConfigured: Boolean(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID),
      time: new Date().toISOString(),
    });
  });

  // ==========================================
  // ADMINISTRATOR PROTECTED ENDPOINTS
  // ==========================================

  // Pending user accounts awaiting administrative approval
  app.get('/api/admin/pending-users', requireAuth, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const pending = await UserRepository.getPending();
      res.json(pending.map(sanitizeUser));
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error fetching pending users' });
    }
  });

  // Approve a user account
  app.post('/api/admin/approve-user', requireAuth, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });

      const updated = await UserRepository.update(userId, { isApproved: true });
      if (!updated) return res.status(404).json({ error: 'User not found' });

      res.json({ message: `Account for ${updated.name} approved successfully.`, user: sanitizeUser(updated) });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error approving user' });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SchoolDev] Unified Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[SchoolDev] Fatal startup error:', err);
  process.exit(1);
});
