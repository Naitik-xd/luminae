import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Salons } from './pages/Salons';
import { SalonDetail } from './pages/SalonDetail';
import { Booking } from './pages/Booking';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { AIStylist } from './pages/AIStylist';

import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="flex-1 flex flex-col relative">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/salons" element={<Salons />} />
          <Route path="/salons/:id" element={<SalonDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/ai-stylist" element={<AIStylist />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            <Navbar />
            <main className="flex-grow flex flex-col pt-[88px]"> {/* Space for fixed navbar */}
              <AnimatedRoutes />
            </main>
            <Footer />
            
            {/* Floating Admin Button */}
            <Link 
              to="/admin" 
              className="fixed bottom-6 right-6 z-[100] bg-[#111] border border-[#C9A84C]/30 text-[#C9A84C] px-5 py-3 rounded-full flex items-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C] transition-all duration-300 group"
            >
               <Shield size={16} className="group-hover:text-black" />
               <span className="text-xs uppercase tracking-widest font-medium">Admin Panel</span>
            </Link>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
