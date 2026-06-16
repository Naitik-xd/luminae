import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { TiltCard } from '../components/TiltCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
};

export function Salons() {
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');
  const [specialityFilter, setSpecialityFilter] = useState('All');

  const areas = ['All', 'CP', 'South Delhi', 'Rohini'];
  const specialities = ['All', 'Bridal', 'Hair', 'Skin', 'Nails', 'Body'];

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

  const filteredSalons = salons.filter(salon => {
    const term = search.toLowerCase();
    const searchMatch = salon.name.toLowerCase().includes(term) || 
      (salon.speciality && salon.speciality.some((s: string) => s.toLowerCase().includes(term)));
    const areaMatch = areaFilter === 'All' || salon.area.includes(areaFilter);
    const specMatch = specialityFilter === 'All' || (salon.speciality && salon.speciality.includes(specialityFilter));
    return searchMatch && areaMatch && specMatch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 pb-24"
    >
      {/*...rest of UI */}
      {/* Header */}
      <div className="pt-24 pb-16 px-6 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl mb-6">The Directory</h1>
          <p className="text-[var(--text-muted)] max-w-2xl text-lg font-light">
            An exclusive curation of Delhi's premier beauty and wellness destinations, tailored for your aesthetic journey.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-[80px] z-30 bg-[var(--bg-color)]/95 backdrop-blur-md border-b border-[var(--border-color)] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent-color)]" size={18} />
            <input 
              type="text" 
              placeholder="Search salons..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--card-bg)] shadow-[0_0_10px_rgba(0,0,0,0.02)] border border-[var(--border-color)] rounded-sm py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="min-w-fit flex items-center gap-2 border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2 rounded-sm cursor-pointer hover:border-[var(--accent-color)] transition-colors">
               <MapPin size={16} className="text-[var(--accent-color)]" />
               <select 
                 value={areaFilter} 
                 onChange={(e) => setAreaFilter(e.target.value)}
                 className="bg-transparent border-none outline-none text-sm cursor-pointer appearance-none pr-6 text-[var(--text-color)]"
               >
                 {areas.map(a => <option key={a} value={a}>{a}</option>)}
               </select>
            </div>
            <div className="min-w-fit flex items-center gap-2 border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2 rounded-sm cursor-pointer hover:border-[var(--accent-color)] transition-colors">
               <Filter size={16} className="text-[var(--accent-color)]" />
               <select 
                 value={specialityFilter} 
                 onChange={(e) => setSpecialityFilter(e.target.value)}
                 className="bg-transparent border-none outline-none text-sm cursor-pointer appearance-none pr-6 text-[var(--text-color)]"
               >
                 {specialities.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-16 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-[var(--card-bg)] border border-[var(--border-color)] h-[400px] rounded-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {filteredSalons.map((salon) => (
                <motion.div
                  key={salon.id}
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Link to={`/salons/${salon.id}`} className="block h-full cursor-pointer group">
                    <TiltCard>
                      <div className={cn(
                        "bg-[var(--card-bg)] rounded-sm border h-full overflow-hidden transition-colors relative shadow-lg",
                        salon.is_featured ? "border-[var(--accent-color)]" : "border-[var(--border-color)] group-hover:border-[var(--accent-color)]/50"
                      )}>
                         <div className="aspect-[4/3] overflow-hidden relative">
                           {salon.is_featured && (
                             <div className="absolute top-4 right-4 z-20 bg-[var(--accent-color)] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
                               Featured
                             </div>
                           )}
                           {salon.is_bridal_specialist && (
                             <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md border border-[var(--accent-color)] text-[var(--accent-color)] p-1.5 rounded-full shadow-md" title="Bridal Specialist">
                               <Crown size={14} />
                             </div>
                           )}
                           <img src={salon.image_url} alt={salon.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70" />
                           <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap max-w-[80%]">
                              {salon.speciality?.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] tracking-widest uppercase border border-white/20 rounded-sm">
                                  {tag}
                                </span>
                              ))}
                           </div>
                         </div>
                         <div className="p-6">
                           <h3 className="font-serif text-2xl mb-2">{salon.name}</h3>
                           <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border-color)]">
                             <span className="text-[var(--text-muted)] text-sm flex items-center gap-1.5 font-light">
                               <MapPin size={14} className="text-[var(--accent-color)]" /> {salon.area}
                             </span>
                             <span className="text-[var(--highlight-color)] text-sm flex items-center gap-1">
                               <Star size={14} fill="currentColor" /> {salon.rating}
                             </span>
                           </div>
                         </div>
                      </div>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
        
        {!loading && !error && filteredSalons.length === 0 && (
          <motion.div 
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="py-20 text-center text-[var(--text-muted)]"
          >
            <p>No elegant destinations found matching your criteria.</p>
            <button 
              onClick={() => { setSearch(''); setAreaFilter('All'); setSpecialityFilter('All'); }}
              className="mt-4 text-[var(--accent-color)] border-b border-[var(--accent-color)] pb-1 text-sm uppercase tracking-widest hover:text-[var(--accent-hover)] transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
