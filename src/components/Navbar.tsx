import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, User, Shield, Calendar, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        isScrolled
          ? 'py-4 border-b'
          : 'bg-transparent py-6'
      )}
      style={{
        background: isScrolled 
          ? theme === 'light' ? 'rgba(250, 247, 244, 0.95)' : 'rgba(10, 10, 10, 0.95)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottomColor: isScrolled 
          ? theme === 'light' ? '#E8D5C4' : 'var(--border-color)' 
          : 'transparent',
        boxShadow: isScrolled && theme === 'light' ? '0 2px 20px rgba(183,110,121,0.1)' : undefined
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className={cn(
          "font-serif text-2xl lg:text-3xl tracking-wider font-bold",
          "bg-clip-text text-transparent bg-gradient-to-r",
          theme === 'light' ? "from-[#8B3A3A] to-[#C9956C]" : "from-[#C9A84C] to-[#E8C97A]"
        )}>
          LUMINAE.
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.hash ? (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.hash)}
                className={cn(
                  'text-sm uppercase tracking-widest transition-colors duration-300 relative group font-medium',
                  theme === 'light' ? 'text-[#2C1810]' : 'text-[#F5F5F5]'
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-[1px] transition-all duration-300 group-hover:w-full w-0",
                  theme === 'light' ? 'bg-[#B76E79]' : 'bg-[#C9A84C]'
                )} />
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.path!}
                className={cn(
                  'text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-1 relative group font-medium',
                  theme === 'light' 
                    ? 'text-[#2C1810]' 
                    : (location.pathname === link.path ? 'text-[#C9A84C]' : 'text-[#F5F5F5]')
                )}
              >
                {link.name}
                {!(link as any).isSpecial && (
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-[1px] transition-all duration-300 group-hover:w-full",
                    location.pathname === link.path ? "w-full" : "w-0",
                    theme === 'light' ? 'bg-[#B76E79]' : 'bg-[#C9A84C]'
                  )} />
                )}
                {(link as any).showAdminBadge && <Shield size={14} className="text-[#C9A84C]" />}
              </Link>
            )
          ))}
          
          <button
            onClick={toggleTheme}
            className={cn("p-2 rounded-full transition-colors", theme === 'light' ? 'text-[#C9956C] hover:bg-[#2C1810]/5' : 'text-[#C9A84C] hover:bg-[#F5F5F5]/10')}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                  className="w-[36px] h-[36px] rounded-full border border-[#C9A84C] text-[#C9A84C] flex items-center justify-center text-sm font-bold uppercase transition-transform hover:scale-105"
                >
                  {user.email?.[0] || 'U'}
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "absolute right-0 top-full mt-2 w-[220px] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-[9999] overflow-hidden border",
                        theme === 'light' ? 'bg-[#FAF7F4] border-[#E8D5C4]' : 'bg-[#1A1A1A] border-[#333333]'
                      )}
                    >
                      <div className="p-4 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-bold uppercase flex-shrink-0">
                            {user.email?.[0] || 'U'}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate" style={{ color: theme === 'light' ? '#2C1810' : '#F5F5F5' }}>
                              {user.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link 
                          to="/my-bookings" 
                          onClick={() => setIsDropdownOpen(false)}
                          className={cn(
                            "flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg transition-colors",
                            theme === 'light' ? 'hover:bg-[#2C1810]/5 text-[#2C1810]' : 'hover:bg-[#FFFFFF]/5 text-[#F5F5F5]'
                          )}
                        >
                          <Calendar size={16} />
                          My Bookings
                        </Link>
                        <Link 
                          to="/profile" 
                          onClick={() => setIsDropdownOpen(false)}
                          className={cn(
                            "flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg transition-colors",
                            theme === 'light' ? 'hover:bg-[#2C1810]/5 text-[#2C1810]' : 'hover:bg-[#FFFFFF]/5 text-[#F5F5F5]'
                          )}
                        >
                          <User size={16} />
                          Profile Settings
                        </Link>
                        
                        <div className="h-[1px] w-full bg-[var(--border-color)] my-2"></div>
                        
                        <button
                          type="button"
                          onClick={async () => { 
                            setIsDropdownOpen(false); 
                            await supabase.auth.signOut();
                            navigate('/');
                          }}
                          className={cn(
                            "flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg transition-colors text-red-500",
                            theme === 'light' ? 'hover:bg-red-500/10' : 'hover:bg-red-500/10'
                          )}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  "text-sm uppercase tracking-widest px-6 py-2.5 rounded-sm transition-all duration-300",
                  theme === 'light' 
                    ? "bg-[#2C1810] text-[#FAF7F4] hover:shadow-[0_0_15px_rgba(44,24,16,0.3)]" 
                    : "bg-[#C9A84C] text-[#0A0A0A] hover:shadow-[0_0_15px_#C9A84C]"
                )}
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
          
          {user && (
            <div className="relative" ref={mobileDropdownRef}>
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMobileDropdownOpen(!isMobileDropdownOpen); }}
                className="w-[36px] h-[36px] rounded-full border border-[#C9A84C] text-[#C9A84C] flex items-center justify-center text-sm font-bold uppercase transition-transform hover:scale-105"
              >
                {user.email?.[0] || 'U'}
              </button>
              <AnimatePresence>
                {isMobileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute right-0 top-full mt-2 w-[220px] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-[9999] overflow-hidden border",
                      theme === 'light' ? 'bg-[#FAF7F4] border-[#E8D5C4]' : 'bg-[#1A1A1A] border-[#333333]'
                    )}
                  >
                    <div className="p-4 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-bold uppercase flex-shrink-0">
                          {user.email?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm truncate" style={{ color: theme === 'light' ? '#2C1810' : '#F5F5F5' }}>
                            {user.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link 
                        to="/my-bookings" 
                        onClick={() => setIsMobileDropdownOpen(false)}
                        className={cn(
                          "flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg transition-colors",
                          theme === 'light' ? 'hover:bg-[#2C1810]/5 text-[#2C1810]' : 'hover:bg-[#FFFFFF]/5 text-[#F5F5F5]'
                        )}
                      >
                        <Calendar size={16} />
                        My Bookings
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMobileDropdownOpen(false)}
                        className={cn(
                          "flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg transition-colors",
                          theme === 'light' ? 'hover:bg-[#2C1810]/5 text-[#2C1810]' : 'hover:bg-[#FFFFFF]/5 text-[#F5F5F5]'
                        )}
                      >
                        <User size={16} />
                        Profile Settings
                      </Link>
                      
                      <div className="h-[1px] w-full bg-[var(--border-color)] my-2"></div>
                      
                      <button
                        type="button"
                        onClick={async () => { 
                          setIsMobileDropdownOpen(false); 
                          await supabase.auth.signOut();
                          navigate('/');
                        }}
                        className={cn(
                          "flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg transition-colors text-red-500",
                          theme === 'light' ? 'hover:bg-red-500/10' : 'hover:bg-red-500/10'
                        )}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

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
            {user ? null : (
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
