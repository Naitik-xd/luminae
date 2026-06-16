import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Heart, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function SalonDetail() {
  const { id } = useParams<{ id: string }>();
  const [salon, setSalon] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function fetchSalonData() {
      if (!id) return;
      try {
        const [salonRes, servicesRes] = await Promise.all([
          supabase.from('salons').select('*').eq('id', id).single(),
          supabase.from('services').select('*').eq('salon_id', id)
        ]);

        if (salonRes.error) throw salonRes.error;
        if (servicesRes.error) throw servicesRes.error;

        setSalon(salonRes.data);
        setServices(servicesRes.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSalonData();
  }, [id]);

  if (loading) {
    return <div className="p-20 text-center flex h-[60vh] flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mb-4" />
      <span className="font-serif tracking-widest text-[var(--text-muted)] animate-pulse uppercase">Curating Detail...</span>
    </div>;
  }

  if (error || !salon) {
    return <div className="p-20 text-center text-red-500 font-serif text-2xl h-[60vh] flex items-center justify-center">{error || 'Salon not found'}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1"
    >
      {/* Hero Image */}
      <div className="relative h-[65vh] w-full mt-[-88px]">
        <img src={salon.image_url} alt={salon.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-black/40 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 max-w-7xl mx-auto pb-16">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-left text-white"
          >
             <div className="flex items-center gap-4 mb-4">
               {salon.speciality && salon.speciality.map((tag: string) => (
                 <span key={tag} className="text-xs uppercase tracking-widest px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm">{tag}</span>
               ))}
               {salon.is_bridal_specialist && (
                 <span className="text-xs uppercase tracking-widest px-3 py-1 bg-[var(--accent-color)] text-white border border-[var(--accent-color)] rounded-sm flex items-center gap-1">
                   <Crown size={12} /> Bridal Specialist
                 </span>
               )}
             </div>
             <h1 className="font-serif text-5xl md:text-7xl mb-6 drop-shadow-xl font-bold">{salon.name}</h1>
             <div className="flex flex-wrap items-center gap-6 text-sm md:text-base tracking-widest font-light">
               <span className="flex items-center gap-2"><MapPin size={18} className="text-[var(--accent-color)]" /> {salon.address}</span>
               <span className="flex items-center gap-2 text-[var(--highlight-color)]"><Star size={18} fill="currentColor" /> {salon.rating} ({salon.review_count} Reviews)</span>
             </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-20">
          <section>
            <h2 className="font-serif text-4xl mb-6">About the Space</h2>
            <p className="text-[var(--text-muted)] leading-relaxed font-light text-lg">
              {salon.description}
            </p>
            {salon.best_for && salon.best_for.length > 0 && (
              <div className="mt-8">
                <p className="text-[var(--text-color)] font-medium mb-3 uppercase tracking-widest text-sm">Best for</p>
                <div className="flex flex-wrap gap-2">
                  {salon.best_for.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full text-sm text-[var(--text-muted)]">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-4xl mb-10">Curated Services</h2>
            {services.length === 0 ? (
               <div className="text-[var(--text-muted)] italic">No services listed currently.</div>
            ) : (
              <div className="space-y-6">
                {services.map((service, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    key={service.id} 
                    className="flex justify-between items-center p-6 bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all group shadow-sm rounded-sm"
                  >
                    <div>
                      <h3 className="text-xl font-serif mb-2 group-hover:text-[var(--accent-color)] transition-colors">{service.name}</h3>
                      <div className="flex items-center gap-4 text-[var(--text-muted)] text-sm tracking-widest uppercase font-light">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {service.duration_minutes} min</span>
                        <span className="bg-[var(--bg-color)] px-2 py-0.5 rounded-xs border border-[var(--border-color)]">{service.category}</span>
                      </div>
                    </div>
                    <div className="font-serif text-2xl text-[var(--highlight-color)]">
                      ₹{service.price}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="sticky top-32 bg-[var(--card-bg)] border border-[var(--border-color)] p-8 shadow-xl rounded-sm"
           >
             <h3 className="font-serif text-3xl mb-8 flex items-center justify-between">
                Reserve 
                <Heart size={24} className="text-[var(--text-muted)] hover:text-red-500 hover:fill-red-500 cursor-pointer transition-all" />
             </h3>
             <div className="space-y-6 mb-10 text-sm text-[var(--text-muted)] font-light">
               <div className="flex items-start gap-4 p-4 bg-[var(--bg-color)] rounded-sm border border-[var(--border-color)]">
                 <MapPin className="text-[var(--accent-color)] flex-shrink-0" size={20} /> 
                 <span className="leading-relaxed">{salon.address}</span>
               </div>
               <div className="flex items-center gap-4 p-4 bg-[var(--bg-color)] rounded-sm border border-[var(--border-color)]">
                 <Clock className="text-[var(--accent-color)] flex-shrink-0" size={20} /> 
                 <span className="tracking-widest capitalize">{salon.opening_time} - {salon.closing_time}</span>
               </div>
             </div>
             
             <Link 
               to={`/booking/${salon.id}`}
               className="w-full inline-flex items-center justify-center bg-[var(--text-color)] text-[var(--bg-color)] py-4 tracking-widest uppercase text-sm hover:shadow-[0_0_20px_var(--accent-color)] transition-all duration-300 rounded-sm font-medium"
             >
               Book Consultation
             </Link>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
