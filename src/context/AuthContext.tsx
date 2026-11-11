import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthView, CaptchaChallenge } from '../types';
import { authApi, RegisterPayload, LoginPayload } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
  pendingEmail: string;
  setPendingEmail: (email: string) => void;
  pendingResetToken: string;
  setPendingResetToken: (token: string) => void;
  verificationCodeHint: string | null;
  setVerificationCodeHint: (code: string | null) => void;
  captchaChallenge: CaptchaChallenge | null;
  fetchCaptchaChallenge: () => Promise<CaptchaChallenge>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ message?: string; verificationCodeHint?: string }>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  googleAuth: (credential?: string, userInfo?: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message?: string; resetTokenHint?: string }>;
  resetPassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  systemStatus: {
    status: string;
    database: string;
    mongoConnected: boolean;
    googleOAuthConfigured: boolean;
  } | null;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState<AuthView>('signin');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingResetToken, setPendingResetToken] = useState('');
  const [verificationCodeHint, setVerificationCodeHint] = useState<string | null>(null);
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  // Check existing session on mount
  const refreshSession = async () => {
    try {
      const data = await authApi.getMe();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
    authApi.getSystemStatus().then(setSystemStatus).catch(() => null);
  }, []);

  const fetchCaptchaChallenge = async (): Promise<CaptchaChallenge> => {
    const challenge = await authApi.getCaptchaChallenge();
    setCaptchaChallenge(challenge);
    return challenge;
  };

  const login = async (payload: LoginPayload) => {
    const data = await authApi.login(payload);
    if (data.user) {
      setUser(data.user);
    }
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authApi.register(payload);
    setPendingEmail(payload.email);
    if (data.verificationCodeHint) {
      setVerificationCodeHint(data.verificationCodeHint);
    }
    return data;
  };

  const verifyEmail = async (code: string) => {
    const data = await authApi.verifyEmail(pendingEmail, code);
    if (data.user) {
      setUser(data.user);
    }
  };

  const resendVerification = async () => {
    if (!pendingEmail) return;
    const data = await authApi.resendVerification(pendingEmail);
    if (data.verificationCodeHint) {
      setVerificationCodeHint(data.verificationCodeHint);
    }
  };

  const googleAuth = async (credential?: string, userInfo?: any) => {
    const data = await authApi.googleAuth(credential, userInfo);
    if (data.user) {
      setUser(data.user);
    }
  };

  const forgotPassword = async (email: string) => {
    setPendingEmail(email);
    const data = await authApi.forgotPassword(email);
    if (data.resetTokenHint) {
      setPendingResetToken(data.resetTokenHint);
    }
    return data;
  };

  const resetPassword = async (newPassword: string, confirmPassword: string) => {
    await authApi.resetPassword(pendingResetToken, newPassword, confirmPassword);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setAuthView('signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        authView,
        setAuthView,
        pendingEmail,
        setPendingEmail,
        pendingResetToken,
        setPendingResetToken,
        verificationCodeHint,
        setVerificationCodeHint,
        captchaChallenge,
        fetchCaptchaChallenge,
        login,
        register,
        verifyEmail,
        resendVerification,
        googleAuth,
        forgotPassword,
        resetPassword,
        logout,
        systemStatus,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
