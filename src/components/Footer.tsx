import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { theme } = useTheme();

  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (activeModal) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for reaching out! We will get back to you within 24 hours');
    closeModal();
  };

  return (
    <>
      <footer className="bg-[var(--card-bg)] border-t border-[var(--border-color)] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link to="/" className="font-serif text-3xl tracking-wider font-bold block mb-6">
                LUMINAE<span className="text-[var(--accent-color)]">.</span>
              </Link>
              <p className="text-[var(--text-muted)] max-w-sm font-light leading-relaxed mb-8">
                Delhi's premier bridal and beauty booking platform. Experience luxury treatments curated just for you.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-full border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-2 rounded-full border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="p-2 rounded-full border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-serif text-lg tracking-wider mb-6">Explore</h4>
              <ul className="space-y-4">
                <li><Link to="/salons" className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Salons in Delhi</Link></li>
                <li><Link to="/ai-stylist" className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">AI Stylist</Link></li>
                <li><button onClick={() => setActiveModal('story')} className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Our Story</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg tracking-wider mb-6">Support</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setActiveModal('contact')} className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Contact Us</button></li>
                <li><button onClick={() => setActiveModal('faq')} className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">FAQ</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-muted)]">
            <p>&copy; {new Date().getFullYear()} Luminae Beauty. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <button onClick={() => setActiveModal('terms')} className="hover:text-[var(--text-color)] transition-colors">Privacy Policy</button>
              <button onClick={() => setActiveModal('terms')} className="hover:text-[var(--text-color)] transition-colors">Terms</button>
            </div>
          </div>
          
          <div className="mt-8 text-center flex flex-col items-center">
            <Link to="/admin" className="text-[11px] text-[var(--text-muted)]/50 hover:text-[var(--text-muted)] transition-colors">
              Admin Access
            </Link>
            <p 
              style={{
                fontSize: '11px',
                color: theme === 'light' ? 'rgba(100,100,100,0.6)' : 'rgba(150,150,150,0.7)',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '8px auto 0 auto',
                lineHeight: 1.6,
                fontStyle: 'normal',
                borderTop: '1px solid rgba(150,150,150,0.15)',
                paddingTop: '12px'
              }}
            >
              ⚠️ This platform is built for SuperXgen AI Startup Buildathon 2026 and is not a real commercial service. All salon listings, bookings and features are for demonstration purposes only.
            </p>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_0_40px_rgba(201,168,76,0.15)]">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors p-2"
            >
              <X size={24} />
            </button>
            
            {activeModal === 'contact' && (
              <div>
                <h2 className="font-serif text-3xl mb-4 text-[var(--accent-color)]">Contact Us</h2>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="uppercase tracking-widest text-xs mb-2 text-[var(--text-muted)]">Email</h3>
                    <p>naitik.270810@outlook.com</p>
                  </div>
                  <div>
                    <h3 className="uppercase tracking-widest text-xs mb-2 text-[var(--text-muted)]">Phone</h3>
                    <p>Coming Soon</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="uppercase tracking-widest text-xs mb-2 text-[var(--text-muted)]">Address</h3>
                    <p>New Delhi, India</p>
                  </div>
                </div>
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <input type="text" placeholder="Your Name" required className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm py-3 px-4 focus:outline-none focus:border-[var(--accent-color)]" />
                  <input type="email" placeholder="Your Email" required className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm py-3 px-4 focus:outline-none focus:border-[var(--accent-color)]" />
                  <textarea placeholder="Your Message" rows={4} required className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm py-3 px-4 focus:outline-none focus:border-[var(--accent-color)] resize-none"></textarea>
                  <button type="submit" className="bg-[var(--accent-color)] text-black font-medium tracking-widest uppercase py-3 px-6 mt-2 hover:bg-opacity-90 transition-colors rounded-sm">Send Message</button>
                </form>
              </div>
            )}

            {activeModal === 'faq' && (
              <div>
                <h2 className="font-serif text-3xl mb-8 text-[var(--accent-color)]">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">How do I book an appointment?</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">You can browse our salons or use the AI Stylist to find the perfect service, then click "Book Appointment" to choose your date and time.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">What is the cancellation policy?</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">You can cancel or reschedule for free up to 24 hours before your booking through the "My Bookings" page.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">What payment methods are accepted?</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">Payment is collected at the salon. We accept all major credit cards, UPI, and cash.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">How does the AI Stylist work?</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">Our AI understands your preferences, events, and skin/hair type to recommend exact salons and services tailored to you in Delhi.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">How can I contact a salon directly?</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">Once a booking is confirmed, you will receive an email with the salon's direct contact details.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">How do I reschedule?</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">Simply go to "My Bookings", select modify on your pending booking, and choose a new date and time.</p>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div>
                <h2 className="font-serif text-3xl mb-6 text-[var(--accent-color)]">Terms of Service</h2>
                <div className="prose prose-invert max-w-none text-[var(--text-muted)] leading-relaxed text-sm">
                  <p className="mb-4">Welcome to LUMINAE. By accessing or using our platform, you agree to be bound by these Terms of Service. LUMINAE acts as a booking intermediary between clients and elite salons in New Delhi.</p>
                  <p className="mb-4">Users must provide accurate information when booking. Appointments are subject to salon availability and confirmation. LUMINAE is not responsible for the direct service quality provided by independent partner salons, though we maintain strict vetting standards.</p>
                  <p>In accordance with privacy policies, we secure your data and only share necessary booking details with your chosen salon. For full legal policies regarding data protection and liability, please contact our support team.</p>
                </div>
              </div>
            )}

            {activeModal === 'story' && (
              <div className="text-center">
                <h2 className="font-serif text-3xl mb-6 text-[var(--accent-color)]">Our Story</h2>
                <div className="mx-auto w-16 h-px bg-[var(--accent-color)] mb-6"></div>
                <p className="text-[var(--content-text)] font-light leading-relaxed mb-6 text-lg">
                  LUMINAE was born from a singular vision: to bring Delhi's finest, most exclusive beauty experiences into one accessible, premium platform.
                </p>
                <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                  We noticed that finding truly high-end, reliable bridal and aesthetic services in the city often relied on fragmented word-of-mouth. So, we partnered with the most prestigious ateliers and combined them with an intelligent AI concierge.
                </p>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Today, LUMINAE is more than a booking site—it's a trusted companion for your most important moments, ensuring you always find your perfect glow.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
