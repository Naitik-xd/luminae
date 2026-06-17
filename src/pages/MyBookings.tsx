import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { X, Edit2, XCircle } from 'lucide-react';

export function MyBookings() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [modifyingBook, setModifyingBook] = useState(false);
  
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const fetchBookings = async () => {
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
  };

  useEffect(() => {
    if (!loading && user) {
      fetchBookings();
    } else if (!loading && !user) {
      setDataLoading(false);
    }
  }, [user, loading]);

  const handleModifyClick = (booking: any) => {
    setEditingBooking(booking);
    setEditDate(booking.booking_date);
    setEditTime(booking.booking_time);
    setEditNotes(booking.special_notes || '');
  };

  const handleModifySave = async () => {
    if (!editingBooking) return;
    setModifyingBook(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_date: editDate,
          booking_time: editTime,
          special_notes: editNotes
        })
        .eq('id', editingBooking.id);
      
      if (error) throw error;
      toast.success('Your booking has been successfully modified.');
      setEditingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      toast.error('Failed to modify booking.');
    } finally {
      setModifyingBook(false);
    }
  };

  const handleCancelClick = async (booking: any) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setCancellingBookingId(booking.id);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id)
        .select('*, salons(name), services(name)')
        .single();
        
      if (error) throw error;
      
      toast.success('Your appointment has been cancelled.');
      
      // Trigger edge function
      if (data) {
        await fetch('https://lxijmxhrtimxgvqosgvx.supabase.co/functions/v1/send-status-update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWpteGhydGlteGd2cW9zZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzM2MTgsImV4cCI6MjA5NzE0OTYxOH0.LOf3fEM8x2c7jiCOimVk99XEFZ0LDnMSsGiB6dAhht0'
          },
          body: JSON.stringify({
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            salon_name: data.salons?.name || data.salon_name,
            service_name: data.services?.name || data.service_name,
            booking_date: data.booking_date,
            booking_time: data.booking_time,
            new_status: 'cancelled'
          })
        }).catch(err => console.error("Edge function failed:", err));
      }
      
      await fetchBookings();
    } catch (err: any) {
      toast.error('Failed to cancel booking.');
    } finally {
      setCancellingBookingId(null);
    }
  };

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
          <p className="text-[var(--text-muted)] mt-4">You have no bookings yet.</p>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
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
                <p className="text-sm text-[var(--text-muted)] mb-3 font-medium">{booking.services?.name}</p>
                <div className="text-sm space-y-1 mb-4 text-[var(--text-color)]">
                  <p><strong>Date:</strong> {booking.booking_date}</p>
                  <p><strong>Time:</strong> {booking.booking_time}</p>
                  {booking.special_notes && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 italic mt-2 line-clamp-2">"{booking.special_notes}"</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">ID: {booking.id.slice(0,8)}</p>
                
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleModifyClick(booking)}
                      className="text-xs flex items-center gap-1 text-[var(--text-muted)] hover:text-[#C9A84C] transition-colors bg-[var(--border-color)]/20 px-2 py-1 rounded"
                    >
                      <Edit2 size={12} /> Modify
                    </button>
                  )}
                  
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button 
                      disabled={cancellingBookingId === booking.id}
                      onClick={() => handleCancelClick(booking)}
                      className="text-xs flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded disabled:opacity-50"
                    >
                      <XCircle size={12} /> {cancellingBookingId === booking.id ? '...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-sm max-w-md w-full relative">
            <button onClick={() => setEditingBooking(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-color)]">
              <X size={20} />
            </button>
            <h2 className="font-serif text-2xl mb-6 text-[#C9A84C]">Modify Booking</h2>
            
            <div className="mb-6 bg-[var(--bg-color)] p-3 rounded-sm border border-[var(--border-color)]/50">
              <p className="text-sm"><span className="text-[var(--text-muted)]">Salon:</span> {editingBooking.salons?.name}</p>
              <p className="text-sm mt-1"><span className="text-[var(--text-muted)]">Service:</span> {editingBooking.services?.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={editDate} 
                  onChange={e => setEditDate(e.target.value)} 
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm py-2 px-3 focus:outline-none focus:border-[#C9A84C] text-sm" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Time</label>
                <select 
                  value={editTime} 
                  onChange={e => setEditTime(e.target.value)} 
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm py-2 px-3 focus:outline-none focus:border-[#C9A84C] text-sm" 
                  required
                >
                  {['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Special Notes</label>
                <textarea 
                  value={editNotes} 
                  onChange={e => setEditNotes(e.target.value)} 
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm py-2 px-3 focus:outline-none focus:border-[#C9A84C] text-sm resize-none" 
                  rows={3}
                ></textarea>
              </div>
            </div>

            <button 
              disabled={modifyingBook}
              onClick={handleModifySave}
              className="w-full mt-6 py-3 bg-[#C9A84C] text-black uppercase tracking-widest text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {modifyingBook ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
