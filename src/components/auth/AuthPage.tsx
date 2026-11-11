import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import {
  GraduationCap,
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  KeyRound,
  ArrowLeft,
  School,
  Check,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { CaptchaChallenge } from '../../types';

export const AuthPage: React.FC = () => {
  const {
    user,
    authView,
    setAuthView,
    login,
    register,
    verifyEmail,
    resendVerification,
    googleAuth,
    forgotPassword,
    resetPassword,
    pendingEmail,
    setPendingEmail,
    pendingResetToken,
    setPendingResetToken,
    verificationCodeHint,
    fetchCaptchaChallenge,
    systemStatus,
  } = useAuth();

  const { setIsPublicSite, theme, toggleTheme } = useSchool();

  // Local form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'teacher' | 'parent' | 'admin'>('student');
  const [regClass, setRegClass] = useState('10');
  const [regSection, setRegSection] = useState('A');
  const [regRoll, setRegRoll] = useState('25');
  const [regStudentId, setRegStudentId] = useState('');
  const [regChildStudentId, setRegChildStudentId] = useState('');
  const [regStaffKey, setRegStaffKey] = useState('');
  const [regConsent, setRegConsent] = useState(false);

  // Verification state
  const [otpCode, setOtpCode] = useState('');

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // CAPTCHA state
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [requiresCaptcha, setRequiresCaptcha] = useState(false);

  // Feedback & Loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear notices on view change
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authView]);

  // Load CAPTCHA challenge when needed
  const loadCaptcha = async () => {
    try {
      const challenge = await fetchCaptchaChallenge();
      setCaptcha(challenge);
      setCaptchaAnswer('');
    } catch (err: any) {
      console.warn('Could not fetch CAPTCHA:', err);
    }
  };

  useEffect(() => {
    if (requiresCaptcha || authView === 'signup') {
      loadCaptcha();
    }
  }, [requiresCaptcha, authView]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({
        identifier: identifier.trim(),
        password,
        rememberMe,
        captchaId: captcha?.challengeId,
        captchaAnswer: captchaAnswer.trim(),
      });
      // Login successful: will automatically update context and redirect
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
      if (err.requiresCaptcha) {
        setRequiresCaptcha(true);
        if (err.captchaChallenge) {
          setCaptcha(err.captchaChallenge);
        } else {
          loadCaptcha();
        }
      }
      if (err.requiresEmailVerification) {
        setPendingEmail(err.email || identifier);
        setAuthView('verify');
      }
      if (err.isPendingApproval) {
        setAuthView('pending_approval');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const data = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        username: regUsername.trim() || undefined,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        role: regRole,
        studentId: regStudentId.trim() || undefined,
        classId: regRole === 'student' ? regClass : undefined,
        section: regRole === 'student' ? regSection : undefined,
        rollNumber: regRole === 'student' ? regRoll : undefined,
        childrenStudentId: regRole === 'parent' ? regChildStudentId.trim() : undefined,
        staffSecretKey: regRole === 'teacher' || regRole === 'admin' ? regStaffKey.trim() : undefined,
        consent: regConsent,
        captchaId: captcha?.challengeId,
        captchaAnswer: captchaAnswer.trim() || undefined,
      });

      setSuccessMessage(data.message || 'Registration submitted! Please verify your email.');
      setAuthView('verify');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check form details.');
      loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Email Verification Submit
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await verifyEmail(otpCode.trim());
      setSuccessMessage('Email verified successfully! Entering portal...');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const data = await forgotPassword(resetEmail.trim());
      setSuccessMessage('Recovery code generated. You can now reset your password.');
      setAuthView('reset');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to request reset token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await resetPassword(newPassword, confirmNewPassword);
      setSuccessMessage('Password updated successfully! Please sign in with your new password.');
      setTimeout(() => {
        setAuthView('signin');
        setPassword('');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Account Auto-Fill
  const quickFill = (demoRole: 'student' | 'teacher' | 'parent' | 'admin') => {
    if (demoRole === 'student') {
      setIdentifier('aarav.sharma@student.schooldev.edu');
      setPassword('Password@123');
    } else if (demoRole === 'teacher') {
      setIdentifier('priya.verma@faculty.schooldev.edu');
      setPassword('Password@123');
    } else if (demoRole === 'parent') {
      setIdentifier('rajesh.sharma@parent.schooldev.edu');
      setPassword('Password@123');
    } else {
      setIdentifier('principal@schooldev.edu');
      setPassword('Password@123');
    }
  };

  // Google Sign-In Handler
  const handleGoogleClick = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      // In sandbox preview, provide simulated Google Identity verification payload or real OAuth
      await googleAuth(undefined, {
        email: 'alex.chen@student.schooldev.edu',
        name: 'Alex Chen',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        sub: 'google_oauth_sub_9918237',
      });
    } catch (err: any) {
      if (err.isPendingApproval) {
        setAuthView('pending_approval');
      } else {
        setErrorMessage(err.message || 'Google authentication encountered an error.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white block leading-tight">
              SchoolDev
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Unified Operating System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsPublicSite(true)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explore</span> Public Website
          </button>

          {/* Theme Switcher in Top Right */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[580px]">
          {/* Left Decorative & Institutional Pane (5 spans on desktop/laptop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-8 sm:p-10 text-white flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)]" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Enterprise School Security & Access</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Centralized Academic & Operating Portal
                </h1>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A unified digital platform connecting Students, Faculty, Parents, and Administrative leadership under role-enforced access controls.
                </p>
              </div>

              {/* 4 Pillars List */}
              <div className="space-y-3 pt-2">
                {[
                  { title: 'Students', desc: 'Homework, digital attendance, examination results & AI tutor.' },
                  { title: 'Faculty', desc: 'Grading assignments, lesson plans & timetable management.' },
                  { title: 'Parents', desc: 'Progress tracking, fee ledger invoices & teacher communication.' },
                  { title: 'Administration', desc: 'Institutional analytics, user lifecycle & school directives.' },
                ].map(p => (
                  <div key={p.title} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">{p.title}</div>
                      <div className="text-[11px] text-slate-400">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Status / Database Mode */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Database: {systemStatus?.database || 'Local Store (MongoDB Ready)'}</span>
              <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Auth Active
              </span>
            </div>
          </div>

          {/* Mobile & Tablet Compact Brand Strip (< lg) */}
          <div className="lg:hidden p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold leading-tight">SchoolDev Portal</div>
                  <div className="text-[10px] text-slate-400">Central Operating System</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Protected
              </div>
            </div>
          </div>

          {/* Right Interactive Form Pane */}
          <div className="lg:col-span-7 p-4 sm:p-8 lg:p-10 flex flex-col justify-center">
            {/* Error & Success Feedback Banners */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Authentication Error:</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Success:</span>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {/* VIEW 1: SIGN IN (WELCOME) */}
            {authView === 'signin' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Sign in to your School Account
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Enter your school email or username to access your dashboard.
                  </p>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-3 shadow-xs transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Or with institutional credentials
                  </span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        placeholder="e.g. student@schooldev.edu or aarav10a"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthView('forgot')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* CAPTCHA challenge box if required */}
                  {requiresCaptcha && captcha && (
                    <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-200">
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-amber-600" />
                          Security Check: {captcha.prompt}
                        </span>
                        <button
                          type="button"
                          onClick={loadCaptcha}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={captchaAnswer}
                        onChange={e => setCaptchaAnswer(e.target.value)}
                        placeholder="Type answer here"
                        className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Keep me signed in (30 days)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Auto-Fill Demo Accounts Box */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                    <span>Quick Fill Demo Personas (Pass: Password@123):</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => quickFill('student')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors"
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFill('teacher')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors"
                    >
                      👩‍🏫 Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFill('parent')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors"
                    >
                      👨‍👩‍👧 Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFill('admin')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors"
                    >
                      🏛️ Principal
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    New to SchoolDev Portal?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAuthView('signup')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Create an Account
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: REGISTRATION (SIGN UP) */}
            {authView === 'signup' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Register Institutional Account
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Select your category and provide school credentials.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthView('signin')}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </button>
                </div>

                {/* Role Selector Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Account Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { role: 'student', label: 'Student', icon: '🎓' },
                      { role: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
                      { role: 'teacher', label: 'Faculty', icon: '👩‍🏫' },
                      { role: 'admin', label: 'Admin', icon: '🏛️' },
                    ].map(r => (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setRegRole(r.role as any)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          regRole === r.role
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-sm">{r.icon}</div>
                        <div className="text-[11px] mt-0.5">{r.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Ishaan Mehra"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="student@schooldev.edu"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Student Specific Fields */}
                  {regRole === 'student' && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Class
                        </label>
                        <select
                          value={regClass}
                          onChange={e => setRegClass(e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="10">Class 10</option>
                          <option value="9">Class 9</option>
                          <option value="11">Class 11</option>
                          <option value="12">Class 12</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Section
                        </label>
                        <input
                          type="text"
                          value={regSection}
                          onChange={e => setRegSection(e.target.value)}
                          placeholder="A"
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Roll No
                        </label>
                        <input
                          type="text"
                          value={regRoll}
                          onChange={e => setRegRoll(e.target.value)}
                          placeholder="25"
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Parent Specific Fields */}
                  {regRole === 'parent' && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Linked Child Student ID (or Roll Number) *
                      </label>
                      <input
                        type="text"
                        required
                        value={regChildStudentId}
                        onChange={e => setRegChildStudentId(e.target.value)}
                        placeholder="e.g. SD-2026-1014 or Aarav Sharma"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Must match an enrolled student for automatic record verification.
                      </span>
                    </div>
                  )}

                  {/* Faculty & Admin Staff Secret Key Requirement */}
                  {(regRole === 'teacher' || regRole === 'admin') && (
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-200">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        <span>Staff Authorization Key Required</span>
                      </div>
                      <p className="text-[11px] text-amber-700 dark:text-amber-300">
                        To protect institutional data, staff accounts require an authorized school clearance key. (Sandbox Key: <code className="font-mono font-bold">SD-FACULTY-2026</code>)
                      </p>
                      <input
                        type="password"
                        required
                        value={regStaffKey}
                        onChange={e => setRegStaffKey(e.target.value)}
                        placeholder="Enter official staff authorization key"
                        className="w-full p-2 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Password (min 8 chars) *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* CAPTCHA box */}
                  {captcha && (
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Bot Protection: </span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{captcha.prompt}</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={captchaAnswer}
                        onChange={e => setCaptchaAnswer(e.target.value)}
                        placeholder="Answer"
                        className="w-24 p-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center font-mono"
                      />
                    </div>
                  )}

                  {/* Terms Consent */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      required
                      checked={regConsent}
                      onChange={e => setRegConsent(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>
                      I agree to the School Code of Conduct, Academic Data Governance Policies, and Institutional Terms.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Already registered? </span>
                  <button
                    type="button"
                    onClick={() => setAuthView('signin')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: EMAIL VERIFICATION */}
            {authView === 'verify' && (
              <div className="space-y-6 max-w-md mx-auto w-full">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Verify Your Email Address</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We sent a 6-digit confirmation code to <span className="font-semibold text-slate-900 dark:text-white">{pendingEmail}</span>.
                  </p>
                </div>

                {verificationCodeHint && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-center">
                    <span className="text-[11px] text-blue-700 dark:text-blue-300 block font-medium">Sandbox Direct OTP Hint:</span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(verificationCodeHint)}
                      className="mt-1 font-mono text-base font-extrabold text-blue-600 dark:text-blue-400 underline"
                      title="Click to automatically fill code"
                    >
                      {verificationCodeHint} (Click to Auto-Fill)
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-widest text-xl font-mono py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otpCode.length < 6}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Verifying...' : 'Confirm & Open Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={resendVerification}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthView('signin')}
                    className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 4: FORGOT PASSWORD */}
            {authView === 'forgot' && (
              <div className="space-y-6 max-w-md mx-auto w-full">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Recover Your Password</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your registered email address to receive a secure recovery code.
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="your.email@schooldev.edu"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Dispatching...' : 'Send Recovery Instructions'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthView('signin')}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold"
                  >
                    ← Remember password? Return to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 5: RESET PASSWORD */}
            {authView === 'reset' && (
              <div className="space-y-6 max-w-md mx-auto w-full">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Set New Password</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your new secure password (minimum 8 characters).
                  </p>
                </div>

                {pendingResetToken && (
                  <div className="text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 font-mono text-center truncate">
                    Token: {pendingResetToken}
                  </div>
                )}

                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Updating...' : 'Save New Password & Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* VIEW 6: ACCOUNT PENDING APPROVAL */}
            {authView === 'pending_approval' && (
              <div className="text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Shield className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Registration Under Review</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your account registration has been submitted and is currently being verified against official school enrollment records by the Administration Directorate.
                </p>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <div><strong>Notice:</strong> Verification typically takes 1 business day.</div>
                  <div><strong>Support:</strong> admissions@schooldev.edu</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthView('signin')}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold rounded-xl"
                >
                  Return to Sign In
                </button>
              </div>
            )}

            {/* VIEW 7: ACCESS DENIED */}
            {authView === 'access_denied' && (
              <div className="text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Access Denied (403 Forbidden)</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your current verified role does not have authorization to access this administrative or faculty section.
                </p>
                <button
                  type="button"
                  onClick={() => setAuthView('signin')}
                  className="px-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                >
                  Switch Account
                </button>
              </div>
            )}

            {/* VIEW 8: SESSION EXPIRED */}
            {authView === 'session_expired' && (
              <div className="text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Session Expired</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  For your security, school sessions automatically expire periodically. Please re-authenticate to continue.
                </p>
                <button
                  type="button"
                  onClick={() => setAuthView('signin')}
                  className="px-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                >
                  Sign In Again
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
        © 2026 SchoolDev Operating System · Enterprise Role-Based Access Control · ISO/IEC 27001 Standard Architecture
      </footer>
    </div>
  );
};
