import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  out: { opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const navigate = useNavigate();

  const [featuredSalons, setFeaturedSalons] = useState<any[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      const { data } = await supabase.from('salons').select('*').eq('is_featured', true).limit(6);
      if (data) {
        setFeaturedSalons(data);
      }
    }
    loadFeatured();

    // GSAP Scroll Effect for Hero
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: 100,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants as any}
      className="flex flex-col flex-1"
    >
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pb-40 pt-20">
        {/* Background - Cinematic Animated Gradient */}
        <motion.div style={{ y }} className="absolute -inset-y-32 inset-x-0 z-0">
          <div className="absolute inset-0 hero-gradient-bg z-0" />
          <div className="absolute inset-0 texture-overlay z-10" />
        </motion.div>

        {/* Floating Particles (CSS handled, simple divs here) */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
           <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#C9A84C] shadow-[0_0_15px_#C9A84C] animate-ping" />
           <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#C9A84C] shadow-[0_0_20px_#C9A84C] animate-pulse delay-75" />
           <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-[#C9A84C] shadow-[0_0_15px_#C9A84C] animate-bounce" />
           <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_10px_#C9A84C] animate-ping delay-150" />
           <div className="absolute top-2/4 left-1/2 w-2 h-2 rounded-full bg-[#C9A84C] shadow-[0_0_15px_#C9A84C] animate-pulse delay-300" />
        </div>

        <div className="relative z-20 text-center px-6 flex flex-col items-center justify-between gap-8 h-full place-content-center my-auto">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 ref={textRef} className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-widest leading-tight drop-shadow-2xl">
              Find Your <i className="text-[var(--accent-color)]">Glow</i> <br /> in Delhi
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/80 font-light text-lg md:text-xl max-w-2xl mx-auto"
          >
            Curated luxury bridal and beauty experiences. Book the city's finest stylists with ease.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link 
              to="/salons" 
              className="px-8 py-4 bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all duration-300 tracking-widest uppercase text-sm font-medium border border-transparent hover:border-white shadow-[0_0_20px_rgba(183,110,121,0.4)] block mt-4"
            >
              Explore Salons
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1, duration: 1 }}
           className="absolute bottom-[32px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 mt-[40px]"
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
            <motion.div 
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 bg-white"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Salons Teaser */}
      <section id="featured" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Curated Experiences</h2>
            <p className="text-[var(--text-muted)] font-light max-w-md">Discover the most sought-after beauty spaces in the capital.</p>
          </div>
          <Link to="/salons" className="hidden md:flex items-center gap-2 text-[var(--accent-color)] hover:text-opacity-80 transition-colors uppercase tracking-widest text-sm pb-2 border-b border-[var(--accent-color)]">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured Cards */}
          {featuredSalons.map((salon, idx) => (
             <Link key={salon.id} to={`/salons/${salon.id}`} className="block h-full">
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.6, delay: idx * 0.1 }}
                 className="group cursor-pointer h-full border border-[var(--border-color)] bg-[var(--card-bg)] p-4 flex flex-col hover:border-[var(--accent-color)]/50 transition-colors"
               >
                 <div className="relative aspect-[3/4] overflow-hidden mb-6">
                   <img 
                     src={salon.image_url}
                     alt={salon.name} 
                     className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                   />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 </div>
                 <h3 className="font-serif text-2xl mb-2">{salon.name}</h3>
                 <p className="text-[var(--text-muted)] text-sm mb-3">{salon.area}</p>
                 <div className="flex items-center gap-1 text-[var(--accent-color)] text-sm mt-auto">
                   <Star size={14} fill="currentColor" />
                   <span>{salon.rating} ({salon.reviews} reviews) - {salon.price_range}</span>
                 </div>
               </motion.div>
             </Link>
          ))}
        </div>
      </section>

      {/* Popular Services section */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-[var(--border-color)]">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Popular Services</h2>
          <p className="text-[var(--text-muted)] font-light max-w-lg mx-auto">Elevate your beauty ritual with our most requested specialized treatments.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Bridal Makeup", price: "Starting ₹12k", desc: "Airbrush & HD flawless finish" },
            { name: "Balayage Color", price: "Starting ₹4k", desc: "Seamless blending & highlights" },
            { name: "Keratin Spa", price: "Starting ₹3k", desc: "Frizz-free intense restructuring" },
            { name: "Hydra Facial", price: "Starting ₹2k", desc: "Deep pore glow & rejuvenation" }
          ].map((srv, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 0.6, delay: idx * 0.1 }}
               className="group p-8 border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] transition-colors duration-500 cursor-pointer"
             >
               <h3 className="font-serif text-2xl mb-2 group-hover:text-white transition-colors">{srv.name}</h3>
               <p className="font-mono text-sm mb-4 text-[var(--accent-color)] group-hover:text-white/80 transition-colors">{srv.price}</p>
               <p className="text-[var(--text-muted)] font-light text-sm group-hover:text-white/90 transition-colors">{srv.desc}</p>
             </motion.div>
          ))}
        </div>
      </section>

      {/* AI Stylist Teaser */}
      <section id="ai-stylist" className="bg-[var(--card-bg)] border-y border-[var(--border-color)] py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Meet Your <br /> 
              <i className="text-[var(--accent-color)]">Intelligent</i> Stylist
            </h2>
            <p className="text-[var(--text-muted)] font-light leading-relaxed mb-8">
              Describe your dream look, skin concerns, or upcoming event. Our AI seamlessly matches you with the perfect specialized artist and service from our elite network.
            </p>
            <Link 
              to="/ai-stylist" 
              className="group inline-flex items-center gap-3 border border-[var(--text-color)] px-8 py-4 bg-transparent hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all duration-500 tracking-widest uppercase text-sm font-medium relative top-0 hover:-top-1 shadow-none hover:shadow-[0_10px_30px_rgba(201,168,76,0.3)]"
            >
              Consult Now
              <motion.span
                 animate={{ x: [0, 5, 0] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                 className="group-hover:text-[var(--bg-color)]"
              >
                  <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square md:aspect-[4/3] bg-[var(--bg-color)] border border-[var(--border-color)] p-8 flex flex-col justify-center shadow-lg"
          >
             {/* Mock AI UI */}
             <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex-shrink-0" />
                  <div className="bg-[var(--card-bg)] text-sm p-4 rounded-xl rounded-tl-none border border-[var(--border-color)]">
                    "I have a winter wedding in South Delhi. My skin is dry and I want a dewy, glowing makeup look."
                  </div>
                </div>
                <div className="flex gap-4 items-start flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[var(--text-color)] flex-shrink-0 flex items-center justify-center text-[var(--bg-color)] font-serif italic text-xs">L</div>
                  <div className="bg-[var(--bg-color)] text-sm p-4 rounded-xl rounded-tr-none border border-[var(--border-color)]">
                    "For a dewy winter look, I recommend the <b>Hydra-Glow Bridal Package</b> at Aanya Studio in Defence Colony. They specialize in glass-skin prep..."
                  </div>
                </div>
             </div>
             
             {/* Decorative Corner accents */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--accent-color)] -translate-x-1 -translate-y-1" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--accent-color)] translate-x-1 translate-y-1" />
          </motion.div>
        </div>
      </section>
      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-4">Client Kind Words</h2>
          <p className="text-[var(--text-muted)] font-light mb-16 max-w-lg mx-auto">The Luminae experience as described by our elite clientele.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-[var(--bg-color)] p-8 border border-[var(--border-color)] text-left shadow-sm"
              >
                <div className="flex text-[var(--accent-color)] mb-6">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <p className="text-[var(--text-color)] font-light italic text-sm leading-relaxed mb-6">
                  "Absolutely flawless experience. The AI matched me with a stylist who perfectly understood my vision for a modern, glass-skin bridal look. The attention to detail was exceptional."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--border-color)] flex items-center justify-center font-serif text-sm">
                    {['S', 'M', 'K'][i-1]}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Reviewer {i}</h4>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mt-1">Verified Client</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
