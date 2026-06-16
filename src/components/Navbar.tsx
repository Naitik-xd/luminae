import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, User, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const scrollToSection = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isAdminEmail = isAdmin || user?.email === 'naitik.270810@outlook.com' || user?.email === 'evaluator@luminae.com';

  const navLinks = [
    { name: 'Featured', hash: '#featured' },
    { name: 'Services', hash: '#services' },
    { name: 'Salons', path: '/salons' },
    { name: 'AI Stylist', path: '/ai-stylist' },
    { name: 'Testimonials', hash: '#testimonials' },
    { name: 'Admin', path: '/admin', showAdminBadge: true, isSpecial: true },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        isScrolled
          ? 'bg-[var(--navbar-bg)] backdrop-blur-md shadow-sm py-4 border-b border-[var(--border-color)]'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="font-serif text-2xl lg:text-3xl tracking-wider font-bold">
          LUMINAE<span className="text-[var(--accent-color)]">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.hash ? (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.hash)}
                className="text-sm uppercase tracking-widest transition-colors duration-300 hover:text-[var(--accent-color)]"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.path!}
                className={cn(
                  'text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-1',
                  location.pathname === link.path
                    ? 'text-[var(--accent-color)]'
                    : 'hover:text-[var(--accent-color)]',
                  (link as any).isSpecial ? 'border border-[#C9A84C]/50 px-3 py-1.5 rounded-sm hover:border-[#C9A84C] hover:bg-[#C9A84C]/5' : ''
                )}
              >
                {link.name}
                {(link as any).showAdminBadge && <Shield size={14} className="text-[var(--accent-color)]" />}
              </Link>
            )
          ))}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-colors border border-transparent hover:border-[var(--text-color)]"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 hover:text-[var(--accent-color)] transition-colors">
                  <User size={18} />
                  <span className="text-sm border-b border-transparent hover:border-[var(--accent-color)]">{user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm uppercase tracking-widest text-[var(--accent-color)] hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-sm uppercase tracking-widest bg-[var(--text-color)] text-[var(--bg-color)] px-6 py-2.5 rounded-sm hover:shadow-[0_0_15px_var(--accent-color)] transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-[var(--bg-color)] flex flex-col items-center justify-center space-y-8 md:hidden overflow-hidden h-screen border-t border-[var(--border-color)] pt-12 pb-24"
          >
            {navLinks.map((link) => (
              link.hash ? (
                <button
                  key={link.name}
                  onClick={() => { scrollToSection(link.hash); setIsMobileMenuOpen(false); }}
                  className="text-2xl font-serif tracking-wider text-[var(--text-color)]"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'text-2xl font-serif tracking-wider flex items-center justify-center gap-2',
                    location.pathname === link.path
                      ? 'text-[var(--accent-color)]'
                      : 'text-[var(--text-color)]'
                  )}
                >
                  {link.name}
                  {(link as any).showAdminBadge && <Shield size={18} className="text-[var(--accent-color)]" />}
                </Link>
              )
            ))}
            {user ? (
               <button
               onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
               className="text-xl font-serif tracking-wider text-[var(--accent-color)]"
             >
               Logout
             </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 text-lg uppercase tracking-widest bg-[var(--text-color)] text-[var(--bg-color)] px-8 py-3 rounded-sm shadow-[0_0_15px_var(--accent-color)]"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
