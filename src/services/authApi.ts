import { User, CaptchaChallenge } from '../types';

export interface AuthSuccessResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  username?: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  studentId?: string;
  classId?: string;
  section?: string;
  rollNumber?: string;
  childrenStudentId?: string;
  staffSecretKey?: string;
  consent: boolean;
  captchaId?: string;
  captchaAnswer?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
  captchaId?: string;
  captchaAnswer?: string;
}

export const authApi = {
  async getCaptchaChallenge(): Promise<CaptchaChallenge> {
    const res = await fetch('/api/auth/captcha-challenge');
    if (!res.ok) throw new Error('Failed to retrieve security challenge');
    return res.json();
  },

  async register(payload: RegisterPayload) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  },

  async verifyEmail(email: string, code: string): Promise<AuthSuccessResponse> {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Email verification failed');
    }
    return data;
  },

  async resendVerification(email: string) {
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to resend code');
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthSuccessResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const error: any = new Error(data.error || 'Authentication failed');
      error.requiresCaptcha = data.requiresCaptcha;
      error.captchaChallenge = data.captchaChallenge;
      error.requiresEmailVerification = data.requiresEmailVerification;
      error.isPendingApproval = data.isPendingApproval;
      error.email = data.email;
      error.verificationCodeHint = data.verificationCodeHint;
      throw error;
    }
    return data;
  },

  async googleAuth(credential?: string, userInfo?: any): Promise<AuthSuccessResponse> {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, userInfo }),
    });
    const data = await res.json();
    if (!res.ok) {
      const error: any = new Error(data.error || 'Google authentication failed');
      error.isPendingApproval = data.isPendingApproval;
      throw error;
    }
    return data;
  },

  async forgotPassword(email: string) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to process request');
    return data;
  },

  async resetPassword(token: string, newPassword: string, confirmPassword: string) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset password');
    return data;
  },

  async getMe(): Promise<{ user: User } | null> {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  async getSystemStatus(): Promise<any> {
    const res = await fetch('/api/auth/status');
    return res.json();
  },
};
