import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in successfully!");
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        if (data.user) {
          // Insert into users table
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
          });
        }
        
        toast.success("Account created successfully!");
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="flex-1 flex w-full">
      {/* Visual Side */}
      <div className="hidden lg:block w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1512496015851-a1fbbfc6d1e4?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Beauty" 
          className="absolute inset-0 w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 p-20 flex flex-col justify-end">
          <h2 className="font-serif text-5xl text-white mb-6 leading-tight">
             Elegance is the only <i className="text-[var(--accent-color)]">beauty</i> <br/>that never fades.
          </h2>
          <p className="text-white/80 font-light tracking-wide uppercase text-sm">Join the Luminae Collective</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-20 bg-[var(--bg-color)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div>
            <h1 className="font-serif text-4xl mb-3">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-[var(--text-muted)] font-light">
              {isLogin ? 'Enter your details to access your appointments and preferences.' : 'Begin your journey of curated beauty experiences.'}
            </p>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="space-y-4">
             <button 
               onClick={handleGoogleLogin}
               className="w-full border border-[var(--border-color)] py-3 flex items-center justify-center gap-3 hover:bg-[var(--card-bg)] transition-colors"
             >
               <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               <span className="text-sm tracking-wide">Continue with Google</span>
             </button>

             <div className="relative flex items-center py-4">
               <div className="flex-grow border-t border-[var(--border-color)]"></div>
               <span className="flex-shrink-0 mx-4 text-[var(--text-muted)] text-xs uppercase tracking-widest">Or email</span>
               <div className="flex-grow border-t border-[var(--border-color)]"></div>
             </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Email</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-transparent border-b border-[var(--border-color)] p-2 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                 required
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-transparent border-b border-[var(--border-color)] p-2 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                 required
               />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--text-color)] text-[var(--bg-color)] py-4 tracking-widest uppercase text-sm disabled:opacity-50 hover:bg-[var(--accent-color)] hover:text-white transition-colors"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--text-color)] hover:text-[var(--accent-color)] border-b border-transparent hover:border-[var(--accent-color)] transition-all"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
