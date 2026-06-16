import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
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
              <li><Link to="/about" className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg tracking-wider mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} Luminae Beauty. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="/privacy" className="hover:text-[var(--text-color)] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[var(--text-color)] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
