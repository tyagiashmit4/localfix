'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  Phone, 
  User, 
  CheckCircle2, 
  ChevronLeft, 
  Key, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // Views: 'login' (email/pass), 'otp' (mobile otp), 'signup', 'forgot' (forgot password)
  const [view, setView] = useState<'login' | 'otp' | 'signup' | 'forgot'>('login');
  
  // Common states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // SMS Banner notification state
  const [smsNotification, setSmsNotification] = useState<{
    show: boolean;
    message: string;
    code: string;
  } | null>(null);

  // 1. Credentials Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. OTP Login Form States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // 3. Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // 4. Forgot Password Recovery States
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpVerified, setForgotOtpVerified] = useState(false);
  const [forgotGeneratedOtp, setForgotGeneratedOtp] = useState('');

  // 5. Social Auth Modal States
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'Google' | 'Apple' | null>(null);
  const [socialName, setSocialName] = useState('');
  const [socialEmail, setSocialEmail] = useState('');
  const [socialPhone, setSocialPhone] = useState('');

  // 6. Live Providers Status for dynamic OAuth auto-switching
  const [providersStatus, setProvidersStatus] = useState({
    google: false,
    apple: false,
    twilio: false,
    pusher: false,
  });

  useEffect(() => {
    fetch('/api/auth/providers-status')
      .then(res => res.json())
      .then(data => setProvidersStatus(data))
      .catch(err => console.error('Failed to retrieve OAuth and SMS providers status:', err));
  }, []);

  // Clear states when view changes
  useEffect(() => {
    setError('');
    setSuccess('');
    setSmsNotification(null);
    setOtpSent(false);
    setForgotOtpSent(false);
    setForgotOtpVerified(false);
  }, [view]);

  // Toast auto-clear
  useEffect(() => {
    if (smsNotification?.show) {
      const timer = setTimeout(() => {
        setSmsNotification(prev => prev ? { ...prev, show: false } : null);
      }, 15000); // Show for 15s to let them read/copy the OTP
      return () => clearTimeout(timer);
    }
  }, [smsNotification]);

  // Helper to trigger simulated SMS banner
  const triggerSmsBanner = (message: string, code: string) => {
    setSmsNotification({
      show: true,
      message,
      code
    });
  };

  // --- SUBMIT HANDLERS ---

  // 1. Email/Password Credentials Login
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  // 2. Request OTP for Login
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Failed to send OTP. Please check your number.');
      } else {
        setGeneratedOtp(data.otp);
        setOtpSent(true);
        triggerSmsBanner(data.message, data.otp);
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  // 3. Verify OTP & Log In
  const handleVerifyOtpAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || !/^\d{6}$/.test(cleanOtp)) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setLoading(false);
        setError(verifyData.error || 'Incorrect verification code. Please check and try again.');
        return;
      }

      const result = await signIn('credentials', {
        phone,
        isOtpLogin: 'true',
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error || 'Authentication failed. Account not linked properly.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during verification.');
    }
  };

  // 4. Sign Up / Register new account
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signupName.trim() || signupName.trim().length < 3) {
      setError('Name must be at least 3 characters long.');
      return;
    }
    if (!signupEmail.trim() || !/\S+@\S+\.\S+/.test(signupEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    const cleanPhone = signupPhone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
          role: 'CUSTOMER'
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Failed to register account.');
      } else {
        setSuccess('Registration successful! Logging you in...');
        
        // Auto sign in user after registration
        const result = await signIn('credentials', {
          email: signupEmail,
          password: signupPassword,
          redirect: false,
        });

        if (result?.error) {
          setView('login'); // Fallback to standard login
        } else {
          router.push('/');
          router.refresh();
        }
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // 5. Request OTP for Password Reset
  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = forgotPhone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone, purpose: 'reset' }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Failed to request password reset code.');
      } else {
        setForgotGeneratedOtp(data.otp);
        setForgotOtpSent(true);
        triggerSmsBanner(data.message, data.otp);
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  // 6. Verify Forgot OTP
  const handleVerifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanOtp = forgotOtp.trim();
    if (!cleanOtp || !/^\d{6}$/.test(cleanOtp)) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone, otp: forgotOtp, generatedOtp: forgotGeneratedOtp })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Incorrect verification code. Please try again.');
        return;
      }

      setForgotOtpVerified(true);
      setSuccess('Verification successful! Choose a new password.');
    } catch (err) {
      setLoading(false);
      setError('An error occurred during verification.');
    }
  };

  // 7. Reset Password & Complete Log In
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: forgotPhone,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.error || 'Failed to update password.');
      } else {
        setSuccess('Password updated successfully! Logging in...');
        
        // Automatically sign in with the new credentials
        // We find the user details by doing a phone OTP login bypass
        const result = await signIn('credentials', {
          phone: forgotPhone,
          isOtpLogin: 'true',
          redirect: false,
        });

        setLoading(false);

        if (result?.error) {
          setView('login');
        } else {
          router.push('/');
          router.refresh();
        }
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during password update.');
    }
  };

  // --- INTERACTIVE MOCK OAUTH SIGN IN ---
  const handleMockOAuth = (provider: 'Google' | 'Apple') => {
    setError('');
    
    // Auto-sensing: if keys are present, immediately perform official NextAuth OAuth redirect
    if (provider === 'Google' && providersStatus.google) {
      setLoading(true);
      signIn('google');
      return;
    }
    if (provider === 'Apple' && providersStatus.apple) {
      setLoading(true);
      signIn('apple');
      return;
    }

    setSocialProvider(provider);
    setSocialName(provider === 'Google' ? 'Google User' : 'Apple User');
    setSocialEmail(provider === 'Google' ? 'user.google@gmail.com' : 'user.apple@icloud.com');
    setSocialPhone('');
    setSocialModalOpen(true);
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialName || !socialEmail || !socialPhone) {
      setError('Please fill in all social credentials.');
      return;
    }
    setError('');
    setLoading(true);
    setSocialModalOpen(false);

    try {
      const randSuffix = Math.floor(1000 + Math.random() * 9000);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: socialName,
          email: socialEmail,
          phone: socialPhone,
          password: `OAuth-bypass-secret-${randSuffix}`,
          isSocial: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setError(data.error || 'Failed to authenticate social profile.');
        return;
      }

      // Sign user in with NextAuth Credentials via phone login bypass
      const result = await signIn('credentials', {
        phone: socialPhone,
        isOtpLogin: 'true',
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setError(`Failed to authenticate with ${socialProvider}.`);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      setError('Social authentication simulation encountered an error.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 relative overflow-x-hidden font-sans">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]"></div>

      {/* Interactive SMS Broadcast Toast */}
      {smsNotification?.show && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-top-10 duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/10">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Simulated SMS Alert</span>
                <span className="text-[9px] text-slate-500">just now</span>
              </div>
              <p className="text-xs text-slate-300 font-bold mt-1.5 leading-relaxed">{smsNotification.message}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-sm text-emerald-400 font-black tracking-widest select-all shadow-inner">
                  {smsNotification.code}
                </div>
                <span className="text-[9px] text-slate-400 font-bold">Copy code & verify</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mx-auto mb-4 hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Local<span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Fix</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-2">Connecting trusted neighborhood service experts instantly</p>
        </div>

        {/* Auth Forms Box */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl p-8 space-y-6 relative overflow-hidden transition-all duration-300">
          
          {/* Top Tabs (Only show during credential / mobile views) */}
          {(view === 'login' || view === 'otp') && (
            <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
              <button 
                onClick={() => setView('login')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  view === 'login' 
                    ? 'bg-white text-slate-950 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Password Login
              </button>
              <button 
                onClick={() => setView('otp')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  view === 'otp' 
                    ? 'bg-white text-slate-950 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                OTP Mobile Login
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* VIEW 1: Password Login */}
          {view === 'login' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@localfix.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex justify-end pt-0.5">
                  <button 
                    type="button" 
                    onClick={() => setView('forgot')} 
                    className="text-[10px] font-black text-blue-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-500/10"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Enter Account</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 2: OTP Mobile Login */}
          {view === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 7777777777"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">Enter your registered 10-digit phone number</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Simulated OTP</span>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndLogin} className="space-y-4 animate-in slide-in-from-right-10 duration-200">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Number: <span className="text-slate-800 font-black">{phone}</span></span>
                    <button 
                      type="button" 
                      onClick={() => setOtpSent(false)} 
                      className="text-[10px] font-black text-blue-600 hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Code (OTP)</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP code"
                        maxLength={6}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Authenticate</span>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* VIEW 3: Create Account (Signup) */}
          {view === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-in slide-in-from-left-10 duration-200">
              <div className="flex items-center gap-1 -ml-1.5">
                <button type="button" onClick={() => setView('login')} className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <span className="text-xs font-black text-slate-800">Create New Account</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Ashmit Tyagi"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. ashmit@gmail.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-500/10"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register & Log In</span>}
              </button>
            </form>
          )}

          {/* VIEW 4: Forgot Password Flow */}
          {view === 'forgot' && (
            <div className="space-y-4 animate-in slide-in-from-right-10 duration-200">
              <div className="flex items-center gap-1 -ml-1.5">
                <button type="button" onClick={() => setView('login')} className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <span className="text-xs font-black text-slate-800 font-sans">Recover Password</span>
              </div>

              {!forgotOtpSent && (
                <form onSubmit={handleForgotRequestOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Registered Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        placeholder="e.g. 7777777777"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">We will send a verification code to this phone number</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Request Password Reset OTP</span>}
                  </button>
                </form>
              )}

              {forgotOtpSent && !forgotOtpVerified && (
                <form onSubmit={handleVerifyForgotOtp} className="space-y-4 animate-in slide-in-from-right-10 duration-200">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Number: <span className="text-slate-800 font-black">{forgotPhone}</span></span>
                    <button type="button" onClick={() => setForgotOtpSent(false)} className="text-[10px] font-black text-blue-600 hover:underline">Change Number</button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Enter Verification OTP</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP code"
                        maxLength={6}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    <span>Verify Code</span>
                  </button>
                </form>
              )}

              {forgotOtpVerified && (
                <form onSubmit={handleResetPassword} className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Choose New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        required
                        minLength={6}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password & Log In</span>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Auth Switch Link (Not shown in OTP/forgot details screen) */}
          {view === 'login' && (
            <p className="text-[11px] text-center text-slate-500 font-semibold">
              Don&apos;t have an account?{' '}
              <button 
                type="button" 
                onClick={() => setView('signup')} 
                className="text-blue-600 font-extrabold hover:text-indigo-700 cursor-pointer"
              >
                Create one now
              </button>
            </p>
          )}

          {view === 'signup' && (
            <p className="text-[11px] text-center text-slate-500 font-semibold">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setView('login')} 
                className="text-blue-600 font-extrabold hover:text-indigo-700 cursor-pointer"
              >
                Log in
              </button>
            </p>
          )}

          {/* Social Sign In Divider */}
          {(view === 'login' || view === 'otp' || view === 'signup') && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-3.5 bg-white text-slate-400 font-black uppercase tracking-wider">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => handleMockOAuth('Google')}
                  className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl text-[11px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.983 0-.746-.08-1.32-.176-1.888H12.24z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMockOAuth('Apple')}
                  className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl text-[11px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 text-slate-900 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.63.73-1.18 1.87-1.03 2.97.77.06 2.32-.61 2.98-1.42z"/>
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Social Auth credentials Modal */}
      {socialModalOpen && socialProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setSocialModalOpen(false)}
          />
          
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-150 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Branding line */}
            <div className={`h-1.5 w-full ${socialProvider === 'Google' ? 'bg-red-500' : 'bg-slate-900'}`} />
            
            <div className="p-6">
              <div className="text-center mb-6">
                {socialProvider === 'Google' ? (
                  <svg className="w-8 h-8 mx-auto text-red-500 mb-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.983 0-.746-.08-1.32-.176-1.888H12.24z"/>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 mx-auto text-slate-900 mb-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.63.73-1.18 1.87-1.03 2.97.77.06 2.32-.61 2.98-1.42z"/>
                  </svg>
                )}
                
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Sign in with {socialProvider}
                </h3>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                  Secure OAuth Simulation
                </p>
              </div>

              <form onSubmit={handleSocialSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Account Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={socialName}
                      onChange={(e) => setSocialName(e.target.value)}
                      required
                      placeholder="e.g. Ashmit Tyagi"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={socialEmail}
                      onChange={(e) => setSocialEmail(e.target.value)}
                      required
                      placeholder="e.g. ashmit@gmail.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Phone Number (Required for AuraServe)
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={socialPhone}
                      onChange={(e) => setSocialPhone(e.target.value)}
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit number (e.g. 9876543210)"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSocialModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 text-white font-extrabold rounded-2xl text-xs transition-colors cursor-pointer text-center ${socialProvider === 'Google' ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-850'}`}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
