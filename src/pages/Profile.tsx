import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { User, Phone, Mail, Calendar, Save } from 'lucide-react';

export function Profile() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [dataLoading, setDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
          setCreatedAt(new Date(data.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setDataLoading(false);
      }
    }

    if (!loading && user) {
      loadProfile();
    } else if (!loading && !user) {
      setDataLoading(false);
    }
  }, [user, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          phone: phone,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Update Auth user metadata as well
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 max-w-4xl w-full mx-auto px-6 py-12"
    >
      <div className="mb-12">
        <h1 className="font-serif text-4xl mb-4 text-[var(--accent-color)]">Profile Settings</h1>
        <p className="text-[var(--text-muted)]">Manage your personal information and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <div className={cn(
            "p-8 rounded-xl border flex flex-col items-center text-center",
            theme === 'light' ? "bg-white border-[#E8D5C4] shadow-sm" : "bg-[var(--card-bg)] border-[var(--border-color)]"
          )}>
            <div className="w-24 h-24 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C] flex items-center justify-center text-[#C9A84C] text-3xl font-serif mb-4 flex-shrink-0">
              {fullName?.[0] || user.email?.[0] || 'U'}
            </div>
            
            <h2 className={cn("text-xl font-bold mb-1", theme === 'light' ? "text-[#2C1810]" : "text-[#F5F5F5]")}>
              {fullName || 'User'}
            </h2>
            <p className="text-[var(--text-muted)] text-sm mb-6 w-full truncate px-2">{user.email}</p>
            
            <div className="w-full h-[1px] bg-[var(--border-color)] mb-6"></div>
            
            <div className="w-full flex items-center gap-3 text-sm text-[var(--text-muted)] justify-center">
              <Calendar size={16} className="text-[#C9A84C]" />
              <span>Member since {createdAt || 'recently'}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className={cn(
            "p-8 rounded-xl border",
            theme === 'light' ? "bg-white border-[#E8D5C4] shadow-sm" : "bg-[var(--card-bg)] border-[var(--border-color)]"
          )}>
            <h3 className="font-serif text-2xl mb-6 text-[#C9A84C]">Edit Profile</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg py-3 px-4 focus:outline-none focus:border-[#C9A84C] text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </label>
                <input 
                  type="email" 
                  value={user.email || ''}
                  disabled
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-sm opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-[var(--text-muted)] mt-2">Email address cannot be changed.</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-2">
                  <Phone size={14} /> Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg py-3 px-4 focus:outline-none focus:border-[#C9A84C] text-sm transition-colors"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full md:w-auto px-8 py-3 bg-[#C9A84C] text-[#0A0A0A] font-medium rounded-lg hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
