import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, CheckCircle2, Clock, CheckSquare, LogOut, RefreshCw } from 'lucide-react';

export function Admin() {
  const [session, setSession] = useState<any>(null);
  const [isAdminLocally, setIsAdminLocally] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession) {
        checkAdmin(currentSession.user.email);
      } else {
        setDataLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        checkAdmin(newSession.user.email);
      } else {
        setIsAdminLocally(false);
        setAccessDenied(false);
        setBookings([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdminLocally) {
      const channel = supabase.channel('bookings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
          fetchAllBookings();
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdminLocally]);

  const checkAdmin = async (userEmail: string | undefined) => {
    if (!userEmail) return;
    
    // Hardcoded bypass for ease of use in demo environment
    if (userEmail === 'naitik.270810@outlook.com' || userEmail === 'evaluator@luminae.com') {
      setIsAdminLocally(true);
      setAccessDenied(false);
      fetchAllBookings();
      return;
    }

    try {
      const { data, error } = await supabase.from('admins').select('*').eq('email', userEmail).single();
      if (error || !data) {
        setIsAdminLocally(false);
        setAccessDenied(true);
        setDataLoading(false);
      } else {
        setIsAdminLocally(true);
        setAccessDenied(false);
        fetchAllBookings();
      }
    } catch (e) {
      setIsAdminLocally(false);
      setAccessDenied(true);
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
         toast.error(error.message);
         setLoginLoading(false);
      }
      // On success, onAuthStateChange will trigger checkAdmin
    } catch (err: any) {
      toast.error(err.message);
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchAllBookings = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, customer_name, customer_email, customer_phone, booking_date, booking_time, special_notes, status, created_at, salons(name), services(name)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBookings(data || []);
      setLastFetched(new Date());
    } catch (err: any) {
      toast.error('Failed to load bookings');
    } finally {
      setDataLoading(false);
      setLoginLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { data, error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id).select();
      
      console.log('Update Status Data:', data);
      console.log('Update Status Error:', error);
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success('Status Updated');
    } catch (err: any) {
      // Handled above
    }
  };

  if (accessDenied) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-88px)] bg-[var(--bg-color)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 text-center border border-[var(--border-color)] bg-[var(--card-bg)] shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-6">
            <LogOut size={24} />
          </div>
          <h2 className="font-serif text-2xl mb-4 text-[#C9A84C]">Access Denied</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
            You do not have administrator privileges to view this portal.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all uppercase tracking-widest text-xs font-medium w-full"
          >
            Go Back Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (!session || !isAdminLocally) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-88px)] bg-[var(--bg-color)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 md:p-12 border border-[var(--border-color)] bg-[var(--card-bg)] shadow-2xl relative"
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl tracking-widest text-[#C9A84C] mb-2">LUMINAE</h1>
            <p className="tracking-widest uppercase text-xs text-[var(--text-muted)]">Admin Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[var(--border-color)] py-2 focus:outline-none focus:border-[#C9A84C] text-sm transition-colors"
                placeholder="admin@luminae.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[var(--border-color)] py-2 focus:outline-none focus:border-[#C9A84C] text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-[#C9A84C] text-black py-4 uppercase tracking-widest text-sm font-medium hover:bg-[#b0903b] transition-colors disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 py-12 px-4 md:px-8 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[var(--border-color)] pb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-[#C9A84C]">LUMINAE Admin Dashboard</h1>
          <p className="text-[var(--text-muted)] font-light tracking-wide text-sm md:text-base">Manage Platform Bookings</p>
        </div>
        <div className="flex items-center gap-6 mt-6 md:mt-0">
          <button 
            onClick={fetchAllBookings}
            disabled={dataLoading}
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-[#C9A84C] hover:text-[#b0903b] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={dataLoading ? "animate-spin" : ""} /> Refresh
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4">
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Total Bookings</h3>
             <Calendar className="text-[#C9A84C]" size={20} />
           </div>
           <p className="font-serif text-5xl">{stats.total}</p>
         </div>
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Pending</h3>
             <Clock className="text-[#C9A84C]" size={20} />
           </div>
           <p className="font-serif text-5xl">{stats.pending}</p>
         </div>
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Confirmed</h3>
             <CheckCircle2 className="text-[#C9A84C]" size={20} />
           </div>
           <p className="font-serif text-5xl">{stats.confirmed}</p>
         </div>
         <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Completed</h3>
             <CheckSquare className="text-[#C9A84C]" size={20} />
           </div>
           <p className="font-serif text-5xl">{stats.completed}</p>
         </div>
      </div>
      {lastFetched && (
        <div className="text-right text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-8">
          Last updated: {lastFetched.toLocaleTimeString()}
        </div>
      )}

      {/* Table */}
      <div className="border border-[var(--border-color)] bg-[var(--card-bg)] shadow-md overflow-hidden">
        {dataLoading ? (
          <div className="p-20 flex justify-center items-center flex-col gap-4">
             <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
             <p className="text-sm tracking-widest uppercase text-[var(--text-muted)]">Loading Data...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-[var(--text-muted)] tracking-widest uppercase text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
               <thead>
                 <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] text-[10px] md:text-xs uppercase tracking-widest bg-black/5">
                   <th className="p-4 font-medium">No</th>
                   <th className="p-4 font-medium">Customer Name</th>
                   <th className="p-4 font-medium">Customer Email</th>
                   <th className="p-4 font-medium">Phone</th>
                   <th className="p-4 font-medium">Salon Name</th>
                   <th className="p-4 font-medium">Service Name</th>
                   <th className="p-4 font-medium">Date</th>
                   <th className="p-4 font-medium">Time</th>
                   <th className="p-4 font-medium max-w-xs">Special Notes</th>
                   <th className="p-4 font-medium">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {bookings.map((row, index) => (
                   <tr key={row.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--text-color)]/5 transition-colors [&:nth-child(even)]:bg-[var(--border-color)]/10">
                      <td className="p-4 text-xs text-[var(--text-muted)]">{bookings.length - index}</td>
                      <td className="p-4 text-sm font-medium">{row.customer_name}</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{row.customer_email}</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{row.customer_phone}</td>
                      <td className="p-4 text-sm">{row.salons?.name || 'Unknown Salon'}</td>
                      <td className="p-4 text-sm">{row.services?.name || 'Unknown Service'}</td>
                      <td className="p-4 text-sm">{new Date(row.booking_date).toLocaleDateString()}</td>
                      <td className="p-4 text-sm">{row.booking_time}</td>
                      <td className="p-4 text-xs text-[var(--text-muted)] max-w-xs truncate" title={row.special_notes}>{row.special_notes || '-'}</td>
                      <td className="p-4 text-sm">
                        <select 
                          value={row.status}
                          onChange={(e) => updateStatus(row.id, e.target.value)}
                          className={`bg-transparent border text-xs px-3 py-1.5 focus:outline-none uppercase tracking-widest font-medium ${
                            row.status === 'confirmed' ? 'text-green-600 border-green-600/30' :
                            row.status === 'cancelled' ? 'text-red-600 border-red-600/30' :
                            row.status === 'completed' ? 'text-blue-600 border-blue-600/30' :
                            'text-yellow-600 border-yellow-600/30'
                          }`}
                        >
                          <option value="pending" className="text-black bg-white">Pending</option>
                          <option value="confirmed" className="text-black bg-white">Confirmed</option>
                          <option value="cancelled" className="text-black bg-white">Cancelled</option>
                          <option value="completed" className="text-black bg-white">Completed</option>
                        </select>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
