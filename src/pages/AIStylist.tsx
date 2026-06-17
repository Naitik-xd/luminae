import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

function InlineBookingForm({ onSuccess, userEmail, userName }: { onSuccess: (summary: string) => void, userEmail: string, userName: string }) {
  const [salons, setSalons] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    customer_name: userName || '',
    customer_email: userEmail || '',
    customer_phone: '',
    salon_id: '',
    service_id: '',
    booking_date: '',
    booking_time: '',
    special_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

  useEffect(() => {
    supabase.from('salons').select('id, name').order('name').then(({ data }) => setSalons(data || []));
  }, []);

  useEffect(() => {
    if (formData.salon_id) {
      supabase.from('services').select('id, name').eq('salon_id', formData.salon_id).order('name').then(({ data }) => setServices(data || []));
    } else {
      setServices([]);
    }
  }, [formData.salon_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.salon_id || !formData.service_id || !formData.booking_date || !formData.booking_time) {
      setError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedSalon = salons.find(s => s.id === formData.salon_id);
      const selectedService = services.find(s => s.id === formData.service_id);
      const selectedSalonName = selectedSalon?.name || '';
      const selectedServiceName = selectedService?.name || '';

      console.log('Fetching Salon:', selectedSalonName);
      const { data: salonData, error: salonError } = await supabase.from('salons').select('id, name').ilike('name', '%' + selectedSalonName + '%').single();
      console.log('Salon Result:', salonData, salonError);

      if (salonError || !salonData) {
        throw new Error('Salon not found');
      }
      const salonId = salonData.id;

      console.log('Fetching Service:', selectedServiceName, 'for salon:', salonId);
      const { data: serviceData, error: serviceError } = await supabase.from('services').select('id, name').eq('salon_id', salonId).ilike('name', '%' + selectedServiceName + '%').single();
      console.log('Service Result:', serviceData, serviceError);

      if (serviceError || !serviceData) {
        throw new Error('Service not found');
      }
      const serviceId = serviceData.id;

      console.log('Inserting booking');
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          salon_id: salonId,
          service_id: serviceId,
          booking_date: formData.booking_date,
          booking_time: formData.booking_time,
          status: 'pending',
          special_notes: formData.special_notes
        })
        .select()
        .single();
      
      console.log('Booking Insert Result:', bookingData, bookingError);

      if (bookingError || !bookingData) throw new Error("Could not save booking.");

      await fetch('https://lxijmxhrtimxgvqosgvx.supabase.co/functions/v1/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWpteGhydGlteGd2cW9zZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzM2MTgsImV4cCI6MjA5NzE0OTYxOH0.LOf3fEM8x2c7jiCOimVk99XEFZ0LDnMSsGiB6dAhht0'
        },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          salon_name: selectedSalon?.name,
          service_name: selectedService?.name,
          booking_date: formData.booking_date,
          booking_time: formData.booking_time,
          special_notes: formData.special_notes
        })
      }).catch(err => console.error("Email failed:", err));

      onSuccess(`Your appointment has been booked successfully! Here are your details:\n\n**Salon:** ${selectedSalon?.name}\n**Service:** ${selectedService?.name}\n**Date:** ${formData.booking_date} at ${formData.booking_time}\n**Booking ID:** ${bookingData.id.slice(0,8)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#FAF7F4] dark:bg-[#2A2A2A] border border-[#E8D5C4] dark:border-[#3A3A3A] rounded-md py-2 px-3 focus:outline-none focus:border-[#C9A84C] text-sm text-[#2C1810] dark:text-[#F5F5F5] placeholder-[#9B8B85] dark:placeholder-[#666666]";
  const labelClass = "block text-xs uppercase tracking-widest text-[#2C1810] dark:text-[#F5F5F5] mb-1";

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 p-4 border border-[#E8D5C4] dark:border-[#3A3A3A] bg-[#FFF9F7] dark:bg-[#1A1A1A] rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-50" />
      <h3 className="font-serif text-lg text-[#C9A84C]">Booking Details</h3>
      
      {error && <div className="bg-[#DC2626] text-white text-xs px-3 py-1.5 rounded-full inline-block self-start font-medium tracking-wide">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input type="text" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={formData.customer_email} onChange={e => setFormData({...formData, customer_email: e.target.value})} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input type="tel" value={formData.customer_phone} onChange={e => setFormData({...formData, customer_phone: e.target.value})} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Select Salon</label>
          <select value={formData.salon_id} onChange={e => setFormData({...formData, salon_id: e.target.value, service_id: ''})} className={inputClass} required>
            <option value="" className="text-[#9B8B85] dark:text-[#666666]">Select a Salon...</option>
            {salons.map(s => <option key={s.id} value={s.id} className="text-[#2C1810] dark:text-[#F5F5F5]">{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Select Service</label>
          <select value={formData.service_id} onChange={e => setFormData({...formData, service_id: e.target.value})} className={inputClass} required disabled={!formData.salon_id}>
            <option value="" className="text-[#9B8B85] dark:text-[#666666]">Select a Service...</option>
            {services.map(s => <option key={s.id} value={s.id} className="text-[#2C1810] dark:text-[#F5F5F5]">{s.name}</option>)}
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className={labelClass}>Date</label>
            <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.booking_date} onChange={e => setFormData({...formData, booking_date: e.target.value})} className={inputClass} required />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Time</label>
            <select value={formData.booking_time} onChange={e => setFormData({...formData, booking_time: e.target.value})} className={inputClass} required>
              <option value="" className="text-[#9B8B85] dark:text-[#666666]">Select Time...</option>
              {timeSlots.map(t => <option key={t} value={t} className="text-[#2C1810] dark:text-[#F5F5F5]">{t}</option>)}
            </select>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Special Notes (Optional)</label>
          <textarea rows={2} value={formData.special_notes} onChange={e => setFormData({...formData, special_notes: e.target.value})} className={cn(inputClass, "resize-none")} placeholder="Any specific requirements..." />
        </div>
      </div>
      <button disabled={isSubmitting} type="submit" className="mt-2 w-full py-3 bg-[#C9A84C] text-white font-medium tracking-widest uppercase text-sm rounded-sm hover:bg-opacity-90 transition-colors disabled:opacity-50">
        {isSubmitting ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const SYSTEM_CONTEXT = `
You are LUMI, the luxury beauty consultant and AI Stylist of LUMINAE Delhi.
You know all 25 salons in the database including their areas, specialities, services, price ranges and best_for tags.
When a user describes their hair or skin concern, you recommend the most suitable salons and services from the database with reasons. 
You must ALWAYS respond in a warm, luxury, friendly tone matching the LUMINAE brand. Keep your responses concise, elegant, and perfectly formatted.
For each recommendation, give the salon name, area, why it matches, and price range.

Here is your complete salon knowledge base:
CP salons:
- Looks Salon specialises in bridal makeup hair spa dry hair
- Enrich Salon specialises in hair color smoothening oily skin
- Naturals Salon specialises in natural hair care bridal organic
- Affinity Salon specialises in luxury hair nail art damaged hair
- Green Trends specialises in organic sensitive skin eco friendly
- VLCC Wellness specialises in bridal glow skin whitening body
- Lakmé Salon CP specialises in bridal makeup party makeup hair styling
- YLG Salon specialises in quick grooming threading eyebrows

Rohini salons:
- Jawed Habib specialises in haircuts hair color mens grooming
- Looks Salon Rohini specialises in bridal packages party makeup pre bridal
- Naturals Rohini specialises in hair spa natural facials dry hair scalp
- Affinity Rohini specialises in keratin nail extensions balayage
- Glamour Studio specialises in full bridal mehendi pre bridal airbrush
- Pink Root Salon specialises in hair treatments bridal makeup waxing
- Studio 11 Salon specialises in hair styling facials oily skin smoothening
- Scissors and Shades specialises in balayage highlights color correction damaged hair
- Glam Affair Rohini specialises in engagement makeup bridal skin prep airbrush

South Delhi salons:
- Lakmé Salon GK specialises in celebrity makeup bridal luxury treatments
- Bodycraft Salon specialises in skin rejuvenation hair spa body anti aging
- Enrich Salon Lajpat specialises in nail art hair color bridal gel nails
- Jean Claude Biguine specialises in luxury hair premium bridal french techniques
- Strands Salon specialises in creative cuts balayage fashion color transformation
- Mirrors Salon specialises in high end bridal luxury facials premium makeup
- Gloss Salon specialises in everyday grooming quick services threading
- Juice Salon specialises in hair transformation color correction balayage highlights
- Toni and Guy specialises in premium cuts international styling luxury grooming
`;

const SUGGESTED_PROMPTS = [
  "I have dry damaged hair",
  "Best bridal salon in Rohini",
  "Oily skin facial under 1500",
  "Hair color in South Delhi"
];

export function AIStylist() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: `Welcome to Luminae, ${user?.user_metadata?.full_name?.split(' ')[0] || 'beautiful'}. I am LUMI, your personal AI styling concierge. Whether you're a bride-to-be, looking for a skin transformation, or preparing for a gala, describe your vision and I will match you with Delhi's finest artists.`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageTimestamps, setMessageTimestamps] = useState<number[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping, error]);

  useEffect(() => {
    console.log("Gemini API Key defined:", !!(import.meta as any).env.VITE_GEMINI_API_KEY);
  }, []);

  const callGeminiAPI = async (chatHistory: Message[]) => {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.");
    }

    const bookingInstruction = "If the user says anything like book, appointment, I want to book, book a salon, schedule — you MUST immediately respond with exactly ONE message containing ONLY this exact text: 'Great! I will get your appointment booked right away. Please fill in these details:[BOOKING_FORM]'. Do NOT ask any back-and-forth questions.";
    const fullPrompt = SYSTEM_CONTEXT + "\n\n" + bookingInstruction + "\n\n" + chatHistory.map(m => `${m.role}: ${m.content}`).join("\n");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }]
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const candidatePart = data.candidates?.[0]?.content?.parts?.[0];
    
    if (candidatePart?.text) {
      return candidatePart.text;
    } else {
      throw new Error("Unexpected API response format");
    }
  };

  const handleBooking = async (args: any) => {
    try {
      // 1. Find Salon ID
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('id')
        .eq('name', args.salon_name)
        .single();
        
      if (salonError || !salonData) {
        throw new Error(`Could not find salon: ${args.salon_name}.`);
      }

      // 2. Find Service ID
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('id')
        .eq('name', args.service_name)
        .eq('salon_id', salonData.id)
        .single();
        
      if (serviceError || !serviceData) {
        throw new Error(`Could not find service: ${args.service_name} at this salon.`);
      }

      // 3. Insert Booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_name: args.customer_name,
          customer_email: args.customer_email,
          customer_phone: args.customer_phone,
          salon_id: salonData.id,
          service_id: serviceData.id,
          booking_date: args.booking_date,
          booking_time: args.booking_time,
          status: 'pending',
          special_notes: ''
        })
        .select()
        .single();

      if (bookingError || !bookingData) {
        throw new Error("Database error while saving your booking.");
      }

      // 4. Call Edge Function for email (optional but required by prompt instructions)
      await fetch('https://lxijmxhrtimxgvqosgvx.supabase.co/functions/v1/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWpteGhydGlteGd2cW9zZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzM2MTgsImV4cCI6MjA5NzE0OTYxOH0.LOf3fEM8x2c7jiCOimVk99XEFZ0LDnMSsGiB6dAhht0'
        },
        body: JSON.stringify({
          customer_name: args.customer_name,
          customer_email: args.customer_email,
          customer_phone: args.customer_phone,
          salon_name: args.salon_name,
          service_name: args.service_name,
          booking_date: args.booking_date,
          booking_time: args.booking_time,
          special_notes: ''
        })
      }).catch(err => console.error("Email failed:", err));

      return `Your booking is confirmed! Details have been saved to our system. Your Booking ID is: **${bookingData.id.slice(0,8)}**. An email confirmation will be sent shortly.`;
    } catch (err: any) {
      return `I encountered an issue while booking: ${err.message}. Please verify the salon and service details or try again.`;
    }
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isTyping) return;

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentMessages = messageTimestamps.filter(t => t > oneMinuteAgo);
    
    if (recentMessages.length >= 10) {
      setError("Please slow down, LUMI needs a moment to breathe.");
      return;
    }

    setMessageTimestamps([...recentMessages, now]);
    setError(null);
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageText };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
    }
    setIsTyping(true);

    try {
      const responseText = await callGeminiAPI(currentMessages);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to communicate with AI Stylist");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSend(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 mx-auto w-full max-w-5xl px-0 md:px-6 py-0 md:py-8 h-[calc(100vh-88px)] md:h-[calc(100vh-88px-80px)] min-h-[600px] overflow-hidden drop-shadow-2xl"
    >
      <div className="flex-1 bg-[var(--bg-color)] md:bg-[var(--card-bg)] border-x md:border border-[var(--border-color)] flex flex-col overflow-hidden relative shadow-2xl md:rounded-lg">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-color)] bg-[var(--card-bg)] flex items-center justify-between z-10 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C]/30 flex items-center justify-center relative bg-black shadow-[0_0_15px_#C9A84C55]">
                <div className="absolute inset-0 rounded-full border border-[#C9A84C] animate-ping opacity-20" />
                <span className="font-serif text-xl tracking-widest text-[#C9A84C]">L</span>
             </div>
             <div>
               <h1 className="font-serif text-xl md:text-2xl tracking-wide flex items-center gap-2">
                 LUMI <Sparkles size={16} className="text-[#C9A84C]" />
               </h1>
               <p className="text-[#C9A84C] font-light text-xs tracking-widest uppercase">AI Stylist</p>
             </div>
           </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth bg-[var(--bg-color)]">
          {messages.map((msg) => (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={msg.id}
               className={cn(
                 "flex gap-4 max-w-[90%] md:max-w-[80%]",
                 msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
               )}
             >
                {msg.role === 'model' && (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-serif text-sm bg-black text-[#C9A84C] border border-[#C9A84C]/30 shadow-md">
                    L
                  </div>
                )}
                <div className={cn(
                  "p-5 rounded-2xl text-sm leading-relaxed shadow-sm font-light",
                  msg.role === 'user' 
                    ? "bg-[#D8A7A0] text-black rounded-tr-none" 
                    : "bg-[#111] text-[#E0E0E0] border border-[#333] rounded-tl-none [&_strong]:text-[#C9A84C] [&_h1]:text-[#C9A84C] [&_h2]:text-[#C9A84C] [&_h3]:text-[#C9A84C]"
                )}>
                  {msg.role === 'model' ? (
                     <div className="prose prose-sm prose-invert max-w-none">
                       {msg.content.includes('[BOOKING_FORM]') ? (
                         <>
                           <ReactMarkdown>{msg.content.replace('[BOOKING_FORM]', '')}</ReactMarkdown>
                           <InlineBookingForm 
                             userEmail={user?.email || ''} 
                             userName={user?.user_metadata?.full_name || ''} 
                             onSuccess={(summary) => {
                               const successMsg: Message = { id: Date.now().toString(), role: 'model', content: summary };
                               setMessages(prev => [...prev, successMsg]);
                             }}
                           />
                         </>
                       ) : (
                         <ReactMarkdown>{msg.content}</ReactMarkdown>
                       )}
                     </div>
                  ) : (
                    msg.content
                  )}
                </div>
             </motion.div>
          ))}
          
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%] mr-auto">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-serif text-sm bg-black text-[#C9A84C] border border-[#C9A84C]/30 shadow-md">L</div>
                <div className="p-5 rounded-2xl rounded-tl-none bg-[#111] border border-[#333] flex gap-2 items-center">
                   <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </motion.div>
          )}

          {error && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[90%] md:max-w-[80%] mr-auto">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-serif text-sm bg-black text-red-500 border border-red-500/30 shadow-md">
                  !
                </div>
                <div className="p-5 rounded-2xl rounded-tl-none bg-[#111] text-red-400 border border-red-500/30 text-sm leading-relaxed shadow-sm font-light">
                   {error}
                </div>
             </motion.div>
          )}

          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-[var(--border-color)] bg-[var(--card-bg)] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
           <div className="mb-4 flex flex-nowrap justify-start overflow-x-auto gap-2 pb-2 scrollbar-none">
             {SUGGESTED_PROMPTS.map((prompt) => (
               <button
                 key={prompt}
                 onClick={() => handleSend(prompt)}
                 disabled={isTyping}
                 className="flex-shrink-0 text-xs md:text-sm px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-muted)] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors whitespace-nowrap"
               >
                 {prompt}
               </button>
             ))}
           </div>
           
           <form onSubmit={handleSubmit} className="relative flex items-end">
              <textarea 
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask LUMI to transform your look..."
                rows={1}
                enterKeyHint={isMobile ? "enter" : undefined}
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[24px] py-4 pl-6 pr-16 focus:outline-none focus:border-[#C9A84C] focus:shadow-[0_0_10px_#C9A84C33] transition-all text-sm font-light z-10 resize-none overflow-y-auto"
                style={{ minHeight: '54px', maxHeight: '150px' }}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "absolute right-2 bottom-[7px] w-10 h-10 rounded-full flex items-center justify-center transition-all z-20",
                  !input.trim() || isTyping 
                    ? "bg-[var(--border-color)] text-[var(--text-muted)] opacity-50" 
                    : "bg-[#C9A84C] text-black shadow-[0_0_15px_#C9A84C] hover:scale-105"
                )}
              >
                <CornerDownLeft size={16} />
              </button>
           </form>
           
           {!isMobile && (
             <p className="hidden md:block text-center text-[10px] text-[var(--text-muted)] mt-2 font-light">
               Press Enter to send, Shift+Enter for new line
             </p>
           )}
           
           <p className="text-center text-[10px] text-[var(--text-muted)] mt-3 uppercase tracking-widest font-light">
             LUMI may produce inaccurate information. Please verify directly with the salon.
           </p>
        </div>

      </div>
    </motion.div>
  );
}
