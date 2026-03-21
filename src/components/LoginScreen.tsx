import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Sprout, LogIn, Mail, Lock, UserPlus, Info, AlertCircle } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authNotAllowed, setAuthNotAllowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setAuthNotAllowed(false);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google Login failed", err);
      setError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setAuthNotAllowed(false);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth error", err);
      if (err.code === 'auth/operation-not-allowed') {
        setAuthNotAllowed(true);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("An account already exists with this email.");
      } else {
        setError(err.message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = async () => {
    const testEmail = 'test@khetikhazana.in';
    const testPassword = 'kisan123';
    setEmail(testEmail);
    setPassword(testPassword);
    setError(null);
    setAuthNotAllowed(false);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        try {
          await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        } catch (createErr: any) {
          if (createErr.code === 'auth/operation-not-allowed') {
            setAuthNotAllowed(true);
          } else {
            setError(createErr.message || "Failed to create test account.");
          }
        }
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthNotAllowed(true);
      } else {
        setError(err.message || "Failed to sign in with test account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0e05] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#f2c94c]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#1b4332]/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#1b4332]/40 border border-[#f2c94c]/20 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-[#1a0e05] p-4 rounded-full border border-[#f2c94c]/30 mb-4">
            <Sprout size={48} className="text-[#f2c94c]" />
          </div>
          <h1 className="text-3xl font-bold font-poppins text-white mb-6">KhetiKhazana</h1>
          <div className="border-l-[4px] border-[#3b82f6] pl-4 py-3 text-left w-full bg-white rounded-r-md shadow-md">
            <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
              Gamifying Financial Literacy for Bharat - Interactive Learning through Play
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm mb-6 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {authNotAllowed && (
          <div className="bg-blue-900/40 border border-blue-500/50 text-blue-100 p-4 rounded-xl text-sm mb-6 text-left">
            <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
              <Info size={18} /> Action Required
            </h3>
            <p className="mb-2">Email/Password authentication is not enabled in your Firebase project.</p>
            <ol className="list-decimal pl-5 space-y-1 text-blue-200/80">
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-[#f2c94c] hover:underline">Firebase Console</a></li>
              <li>Select your project</li>
              <li>Go to <strong>Authentication</strong> &gt; <strong>Sign-in method</strong></li>
              <li>Click <strong>Add new provider</strong> &gt; <strong>Email/Password</strong></li>
              <li>Toggle <strong>Enable</strong> and click <strong>Save</strong></li>
            </ol>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#f2c94c]/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#f2c94c]/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f2c94c] text-[#1a0e05] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? (
              <><UserPlus size={18} /> Create Account</>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-white/60 mb-6">
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="hover:text-[#f2c94c] transition-colors">
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
          <button type="button" onClick={fillTestCredentials} className="text-[#f2c94c] hover:underline">
            Use Test Account
          </button>
        </div>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-white/40 text-sm">OR</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
}
