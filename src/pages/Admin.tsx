import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (!user || !isAdmin) return;
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, salons(name), services(name)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setBookings(data || []);
      } catch (err: any) {
        toast.error('Failed to load bookings');
      } finally {
        setFetching(false);
      }
    }
    fetchBookings();
  }, [user, isAdmin]);

  if (loading || (isAdmin && fetching)) {
    return <div className="p-20 text-center flex justify-center"><div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  if (!user || !isAdmin) return <Navigate to="/" />;

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 py-16 px-6 max-w-7xl mx-auto w-full"
    >
      <div className="mb-12">
        <h1 className="font-serif text-4xl mb-2">Admin Dashboard</h1>
        <p className="text-[var(--text-muted)] font-light tracking-wide">Manage Luminae Platform Bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
           <h3 className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-4">Total Bookings</h3>
           <p className="font-serif text-4xl">{stats.total}</p>
         </div>
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
           <h3 className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-4">Pending Review</h3>
           <p className="font-serif text-4xl text-yellow-500">{stats.pending}</p>
         </div>
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
           <h3 className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-4">Confirmed</h3>
           <p className="font-serif text-4xl text-green-500">{stats.confirmed}</p>
         </div>
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
           <h3 className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-4">Completed</h3>
           <p className="font-serif text-4xl text-blue-500">{stats.completed}</p>
         </div>
      </div>

      {/* Table */}
      <div className="border border-[var(--border-color)] bg-[var(--card-bg)] overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] text-xs uppercase tracking-widest bg-black/5">
               <th className="p-4 font-normal">ID</th>
               <th className="p-4 font-normal">Customer</th>
               <th className="p-4 font-normal">Salon & Service</th>
               <th className="p-4 font-normal">Date & Time</th>
               <th className="p-4 font-normal">Status</th>
               <th className="p-4 font-normal">Action</th>
             </tr>
           </thead>
           <tbody>
             {bookings.map(row => (
               <tr key={row.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--border-color)]/20 transition-colors">
                  <td className="p-4 text-sm font-mono text-[var(--text-muted)]">{row.id.slice(0,8)}</td>
                  <td className="p-4 text-sm">
                    <div>{row.customer_name}</div>
                    <div className="text-[var(--text-muted)] text-xs mt-1">{row.customer_email}</div>
                    <div className="text-[var(--text-muted)] text-xs">{row.customer_phone}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <div>{row.salons?.name || 'Unknown Salon'}</div>
                    <div className="text-[var(--text-muted)] text-xs mt-1">{row.services?.name || 'Unknown Service'}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <div>{row.booking_date}</div>
                    <div className="text-[var(--text-muted)] text-xs mt-1">{row.booking_time}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 text-xs uppercase tracking-widest ${
                      row.status === 'confirmed' ? 'text-green-500 bg-green-500/10' :
                      row.status === 'cancelled' ? 'text-red-500 bg-red-500/10' :
                      row.status === 'completed' ? 'text-blue-500 bg-blue-500/10' :
                      'text-yellow-500 bg-yellow-500/10'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <select 
                      value={row.status}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
                      className="bg-transparent border border-[var(--border-color)] text-xs p-2 focus:outline-none focus:border-[var(--accent-color)]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="cancelled">Cancel</option>
                      <option value="completed">Complete</option>
                    </select>
                  </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </motion.div>
  );
}
