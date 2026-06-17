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
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';

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
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
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
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
