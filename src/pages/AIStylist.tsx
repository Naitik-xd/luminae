import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

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
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const callGeminiAPI = async (chatHistory: Message[], newPrompt: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.");
    }

    const contents = chatHistory.slice(1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: newPrompt }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_CONTEXT }]
        },
        contents: contents,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to fetch from Gemini API. Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected answer format from Gemini.");
    }
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isTyping) return;

    setError(null);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await callGeminiAPI(messages, messageText);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      setError(err.message || "I apologize, but I am unable to connect to my knowledge base right now.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
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
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
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
            <div className="text-red-500 text-center text-sm p-4 animate-pulse">
               {error}
            </div>
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
           
           <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask LUMI to transform your look..."
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-[#C9A84C] focus:shadow-[0_0_10px_#C9A84C33] transition-all text-sm font-light z-10"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20",
                  !input.trim() || isTyping 
                    ? "bg-[var(--border-color)] text-[var(--text-muted)] opacity-50" 
                    : "bg-[#C9A84C] text-black shadow-[0_0_15px_#C9A84C] hover:scale-105"
                )}
              >
                <CornerDownLeft size={16} />
              </button>
           </form>
           <p className="text-center text-[10px] text-[var(--text-muted)] mt-5 uppercase tracking-widest font-light">
             LUMI may produce inaccurate information. Please verify directly with the salon.
           </p>
        </div>

      </div>
    </motion.div>
  );
}
