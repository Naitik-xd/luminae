import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';

export function MyBookings() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      if (!user?.email) return;
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, salons(name), services(name)')
          .eq('customer_email', user.email)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setBookings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    }

    if (!loading && user) {
      loadBookings();
    } else if (!loading && !user) {
      setDataLoading(false);
    }
  }, [user, loading]);

  if (loading || dataLoading) {
    return <div className="p-20 text-center flex justify-center"><div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 py-16 px-6 max-w-7xl mx-auto w-full pt-32"
    >
      <div className="mb-12">
        <h1 className="font-serif text-4xl mb-2 text-[#C9A84C]">My Bookings</h1>
        <p className="text-[var(--text-muted)] font-light tracking-wide">View and manage your appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length === 0 ? (
          <p className="text-[var(--text-muted)]">You have no bookings yet.</p>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-xl">{booking.salons?.name}</h3>
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'text-green-500 bg-green-500/10' :
                      booking.status === 'cancelled' ? 'text-red-500 bg-red-500/10' :
                      booking.status === 'completed' ? 'text-blue-500 bg-blue-500/10' :
                      'text-yellow-500 bg-yellow-500/10'
                    }`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-2">{booking.services?.name}</p>
                <div className="text-sm">
                  <p><strong>Date:</strong> {booking.booking_date}</p>
                  <p><strong>Time:</strong> {booking.booking_time}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">ID: {booking.id.slice(0,8)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
