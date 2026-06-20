import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar as CalendarIcon, Clock, Scissors, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { supabase, supabaseKey } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function Booking() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  
  const [salons, setSalons] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salon_id: id || '',
    service_id: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to book an appointment');
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [user, authLoading, navigate, location.pathname]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  useEffect(() => {
    async function fetchSalons() {
      try {
        const { data, error } = await supabase.from('salons').select('*');
        if (error) throw error;
        setSalons(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSalons();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      if (!formData.salon_id) {
        setServices([]);
        return;
      }
      try {
        const { data, error } = await supabase.from('services').select('*').eq('salon_id', formData.salon_id);
        if (error) throw error;
        setServices(data || []);
      } catch (err: any) {
        toast.error('Failed to load services for selected salon.');
      }
    }
    fetchServices();
  }, [formData.salon_id]);

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const notes = formData.notes.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error('Booking date cannot be in the past');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        salon_id: formData.salon_id,
        service_id: formData.service_id,
        booking_date: formData.date,
        booking_time: formData.time,
        special_notes: notes,
        status: 'pending'
      });
      if (error) throw error;

      // Extract names for the email receipt
      const salonName = getSalonName();
      const serviceName = services.find(s => s.id === formData.service_id)?.name || 'Selected Service';
      
      // Call edge function to send confirmation email
      try {
        const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-booking-confirmation`;
        const emailRes = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            salon_name: salonName,
            service_name: serviceName,
            booking_date: formData.date,
            booking_time: formData.time,
            special_notes: notes
          })
        });
        
        if (!emailRes.ok) {
           console.warn('Silent fallback: Email could not be sent (Resend sandbox limit or other API issue)');
        }
      } catch (emailErr) {
        console.warn('Silent fallback: Email API request failed', emailErr);
      }

      setStep(3);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place booking');
    } finally {
      setSubmitting(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'salon_id') {
      setFormData(prev => ({ ...prev, service_id: '' })); // reset service on salon change
    }
  };

  const times = ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];

  if (authLoading || loading) {
    return <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const getSalonName = () => {
    return salons.find(s => s.id === formData.salon_id)?.name || 'Selected Salon';
  };

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 py-16 md:py-24 px-6 max-w-4xl mx-auto w-full"
    >
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Reservation</h1>
        <p className="text-[var(--accent-color)] tracking-widest uppercase text-sm font-medium">{getSalonName()}</p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 md:p-14 relative shadow-2xl rounded-sm">
        {/* Progress Bar */}
        {step < 3 && (
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--border-color)]">
            <motion.div 
              className="h-full bg-[var(--accent-color)]"
              initial={{ width: '50%' }}
              animate={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
             <motion.div
               key="step1"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-10"
             >
                <div className="space-y-8">
                  <h2 className="font-serif text-3xl border-b border-[var(--border-color)] pb-4">Personal Details</h2>
                  
                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium flex items-center gap-2">
                       <MapPin size={14} /> Salon Location
                    </label>
                    <select 
                      value={formData.salon_id}
                      onChange={(e) => updateForm('salon_id', e.target.value)}
                      className="w-full bg-[var(--bg-color)] border-2 border-[var(--border-color)] p-4 focus:outline-none focus:border-[var(--accent-color)] transition-colors appearance-none rounded-sm shadow-inner text-lg"
                    >
                      <option value="" disabled>Select a salon</option>
                      {salons.map(s => <option key={s.id} value={s.id}>{s.name} - {s.area}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 relative">
                       <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium">Full Name</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => updateForm('name', e.target.value)}
                         className="w-full bg-transparent border-b-2 border-[var(--border-color)] py-3 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-lg"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium">Phone Number</label>
                       <input 
                         type="tel" 
                         value={formData.phone}
                         onChange={(e) => updateForm('phone', e.target.value)}
                         className="w-full bg-transparent border-b-2 border-[var(--border-color)] py-3 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-lg"
                       />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium">Email Address</label>
                     <input 
                       type="email" 
                       value={formData.email}
                       onChange={(e) => updateForm('email', e.target.value)}
                       className="w-full bg-transparent border-b-2 border-[var(--border-color)] py-3 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-lg"
                     />
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button 
                    onClick={handleNext}
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.salon_id}
                    className="bg-[var(--text-color)] text-[var(--bg-color)] px-10 py-4 tracking-widest uppercase text-sm font-medium disabled:opacity-50 hover:shadow-[0_0_15px_var(--accent-color)] transition-shadow rounded-sm"
                  >
                    Continue to Booking
                  </button>
                </div>
             </motion.div>
          )}

          {step === 2 && (
             <motion.div
               key="step2"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
             >
                <form onSubmit={handleSubmit} className="space-y-10">
                  <h2 className="font-serif text-3xl border-b border-[var(--border-color)] pb-4">Appointment Details</h2>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium flex items-center gap-2">
                        <Scissors size={14} /> Selected Service
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.length === 0 ? (
                           <div className="text-[var(--text-muted)] italic">No services listed for this salon.</div>
                        ) : (
                          services.map(s => (
                            <div 
                              key={s.id}
                              onClick={() => updateForm('service_id', s.id)}
                              className={cn(
                                "border-2 p-5 cursor-pointer transition-all rounded-sm font-serif text-lg",
                                formData.service_id === s.id 
                                 ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--accent-color)] shadow-sm" 
                                 : "border-[var(--border-color)] hover:border-[var(--text-color)]"
                              )}
                            >
                              <div className="flex justify-between">
                                 <span>{s.name}</span>
                                 <span className="text-[var(--accent-color)]">₹{s.price}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium flex items-center gap-2">
                          <CalendarIcon size={14} /> Date
                        </label>
                        <input 
                          type="date"
                          value={formData.date}
                          onChange={(e) => updateForm('date', e.target.value)}
                          className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] p-4 focus:outline-none focus:border-[var(--accent-color)] transition-colors appearance-none rounded-sm shadow-inner"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium flex items-center gap-2">
                          <Clock size={14} /> Time Slot
                        </label>
                         <select 
                          value={formData.time}
                          onChange={(e) => updateForm('time', e.target.value)}
                          className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] p-4 focus:outline-none focus:border-[var(--accent-color)] transition-colors appearance-none rounded-sm shadow-inner text-lg"
                        >
                          <option value="" disabled>Select a time</option>
                          {times.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-medium">Special Requests (Optional)</label>
                       <textarea 
                         rows={3}
                         value={formData.notes}
                         onChange={(e) => updateForm('notes', e.target.value)}
                         className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] p-4 focus:outline-none focus:border-[var(--accent-color)] transition-colors resize-none rounded-sm"
                         placeholder="Any specific instructions for your stylist?"
                       />
                    </div>
                  </div>

                  <div className="pt-8 flex justify-between items-center border-t border-[var(--border-color)]">
                    <button 
                      type="button"
                      onClick={handlePrev}
                      className="text-[var(--text-muted)] hover:text-[var(--text-color)] tracking-widest uppercase text-sm transition-colors border-b border-transparent hover:border-[var(--text-color)] pb-1"
                    >
                      Go Back
                    </button>
                    <button 
                      type="submit"
                      disabled={!formData.service_id || !formData.date || !formData.time || submitting}
                      className="bg-[var(--accent-color)] text-white px-10 py-4 tracking-widest uppercase text-sm disabled:opacity-50 hover:shadow-[0_0_15px_var(--accent-color)] transition-shadow rounded-sm font-medium"
                    >
                      {submitting ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
             </motion.div>
          )}

          {step === 3 && (
             <motion.div
               key="step3"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-16 space-y-8"
             >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-[var(--accent-color)]/20"
                >
                  <Check size={48} />
                </motion.div>
                <h2 className="font-serif text-5xl">Reservation Confirmed</h2>
                <p className="text-[var(--text-muted)] font-light max-w-md mx-auto text-lg leading-relaxed">
                  Your curated experience at <strong className="font-medium text-[var(--text-color)]">{getSalonName()}</strong> awaits. 
                  We'll see you on <span className="text-[var(--text-color)] font-medium">{formData.date}</span> at <span className="text-[var(--text-color)] font-medium">{formData.time}</span>.
                </p>
                <div className="pt-10 w-full flex justify-center">
                   <button 
                     onClick={() => navigate('/')}
                     className="bg-[var(--text-color)] text-[var(--bg-color)] px-10 py-4 tracking-widest uppercase text-sm hover:shadow-[0_0_20px_var(--accent-color)] transition-all rounded-sm font-medium"
                   >
                     Return to Directory
                   </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
