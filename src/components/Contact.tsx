import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Instagram, Youtube, Github, Mail, MapPin, CheckCircle2, RefreshCw } from 'lucide-react';
import { playSynthBeep } from './AudioController';
import { usePortfolio } from '../lib/portfolioData';

interface ContactProps {
  theme: 'dark' | 'light';
}

export default function Contact({ theme }: ContactProps) {
  const { data: portfolioData } = usePortfolio();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleInputFocus = (field: string) => {
    playSynthBeep(1100, 'sine', 0.02);
    setActiveInput(field);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      playSynthBeep(350, 'sawtooth', 0.15); // Low error buzz
      return;
    }

    playSynthBeep(900, 'sine', 0.1);
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setIsSubmitting(false);
        setIsSuccess(true);
        setSubmitMessage(result.message || 'Message transmitted successfully.');
        setEmailStatus(result.emailStatus || 'sent');
        playSynthBeep(1200, 'sine', 0.25); // Success chime
        setFormState({ name: '', email: '', message: '' });
        
        setTimeout(() => {
          setIsSuccess(false);
        }, 8000);
      } else {
        throw new Error(result.error || result.message || 'Submission failed.');
      }
    } catch (err: any) {
      console.error('Mail submit error:', err);
      setIsSubmitting(false);
      playSynthBeep(350, 'sawtooth', 0.2);
      
      let msg = err?.message || 'Check network connection.';
      if (msg.includes('Application-specific password required') || msg.includes('534') || msg.includes('Invalid login')) {
        msg = "Gmail Authentication Failure: An App Password is required. Since you have 2-Factor Authentication (2FA) enabled on your Google account, you cannot use your regular Gmail password. Please go to your Google Account Settings (myaccount.google.com), navigate to Security, search for 'App passwords', generate a 16-character App Password, and set it as SMTP_PASS in your AI Studio Settings.";
      }
      setSubmitError(msg);
    }
  };

  const isDark = theme === 'dark';

  return (
    <section
      id="contact"
      className={`relative py-24 px-4 w-full overflow-hidden z-10 ${
        isDark ? 'bg-transparent text-white' : 'text-black'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-center sm:text-left">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-orange mb-3">05 / ENCRYPTED GATEWAY</span>
          <h2 className={`font-display text-4xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            CONTACT & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">NETWORKS</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-brand-orange to-brand-red mt-4 mx-auto sm:mx-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Social Network nodes and metadata */}
          <div className="col-span-1 lg:col-span-5 flex flex-col">
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-6 text-brand-orange">
              Let's Coordinate Global Operations
            </h3>
            
            <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed mb-8">
              Want to collaborate on high-performance applications, integrate advanced AI modules, or commission premium motion interfaces? Get in touch via the secure portal, or check out my channels:
            </p>

            {/* Direct Contact specs */}
            <div className="space-y-4 mb-8">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="p-2.5 rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">Secure Email</span>
                  <span className="font-display text-xs font-semibold text-white">{portfolioData.profile.email}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="p-2.5 rounded-lg bg-brand-red/10 text-brand-red">
                  <MapPin className="w-4 h-4 animate-bounce" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">Operations Center</span>
                  <span className="font-display text-xs font-semibold text-white">{portfolioData.profile.location}</span>
                </div>
              </div>
            </div>

            {/* Social media connections deck */}
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-2">Authenticated Nodes</span>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Instagram */}
                <a
                  href={portfolioData.profile.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playSynthBeep(800, 'sine', 0.05)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/40 hover:bg-white/10 transition-all text-white/70 hover:text-white"
                >
                  <Instagram className="w-5 h-5 mb-2 text-pink-500 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Instagram</span>
                </a>

                {/* YouTube */}
                <a
                  href={portfolioData.profile.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playSynthBeep(900, 'sine', 0.05)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-red/40 hover:bg-white/10 transition-all text-white/70 hover:text-white"
                >
                  <Youtube className="w-5 h-5 mb-2 text-red-500 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">YouTube</span>
                </a>

                {/* GitHub */}
                <a
                  href={portfolioData.profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playSynthBeep(1000, 'sine', 0.05)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/40 hover:bg-white/10 transition-all text-white/70 hover:text-white"
                >
                  <Github className="w-5 h-5 mb-2 text-indigo-400 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Encrypted Glass Contact Form */}
          <div className="col-span-1 lg:col-span-7">
            <div className="glass-card rounded-2xl border border-white/5 p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              
              {/* Overlay pulse glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-[48px] pointer-events-none" />

              {/* Direct Mail Routing Status Banner */}
              <div className="mb-6 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-orange animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/80">Direct Mail Gateway Routing</span>
                  </div>
                  <span className="font-mono text-[9px] px-2.5 py-1 rounded bg-brand-orange/10 text-brand-orange border border-brand-orange/25">
                    ONLINE & ENCRYPTED
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name field */}
                <div className="relative flex flex-col">
                  <motion.label
                    animate={{
                      y: activeInput === 'name' || formState.name ? -6 : 14,
                      scale: activeInput === 'name' || formState.name ? 0.8 : 1,
                      color: activeInput === 'name' ? '#ff5f00' : 'rgba(255,255,255,0.4)',
                    }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute left-4 top-0 font-mono text-xs uppercase tracking-widest origin-left pointer-events-none"
                  >
                    IDENTIFICATION NAME
                  </motion.label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onFocus={() => handleInputFocus('name')}
                    onBlur={handleInputBlur}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 pt-6 pb-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 focus:border-brand-orange focus:bg-white/10 text-white font-sans text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* Email field */}
                <div className="relative flex flex-col">
                  <motion.label
                    animate={{
                      y: activeInput === 'email' || formState.email ? -6 : 14,
                      scale: activeInput === 'email' || formState.email ? 0.8 : 1,
                      color: activeInput === 'email' ? '#ff2a2a' : 'rgba(255,255,255,0.4)',
                    }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute left-4 top-0 font-mono text-xs uppercase tracking-widest origin-left pointer-events-none"
                  >
                    AUTHENTICATED EMAIL
                  </motion.label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={handleInputBlur}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 pt-6 pb-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 focus:border-brand-red focus:bg-white/10 text-white font-sans text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* Message field */}
                <div className="relative flex flex-col">
                  <motion.label
                    animate={{
                      y: activeInput === 'message' || formState.message ? -6 : 14,
                      scale: activeInput === 'message' || formState.message ? 0.8 : 1,
                      color: activeInput === 'message' ? '#ff5f00' : 'rgba(255,255,255,0.4)',
                    }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute left-4 top-0 font-mono text-xs uppercase tracking-widest origin-left pointer-events-none"
                  >
                    COMMUNICATION SPECIFICATION
                  </motion.label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onFocus={() => handleInputFocus('message')}
                    onBlur={handleInputBlur}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 pt-6 pb-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 focus:border-brand-orange focus:bg-white/10 text-white font-sans text-sm focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit error message if present */}
                {submitError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] leading-relaxed"
                  >
                    <span className="font-bold uppercase tracking-wider block mb-1">⚠️ GATEWAY DISPATCH EXCEPTION</span>
                    {submitError}
                  </motion.div>
                )}

                {/* Submit button */}
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Status checklist */}
                  <div className="hidden sm:flex flex-col font-mono text-[10px] text-white/30 tracking-widest">
                    <span>SECURITY: SHIELD v1.2 ACTIVE</span>
                    <span>MD5 CHECKSUM READY</span>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => playSynthBeep(1200, 'sine', 0.04)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red text-white font-display font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_15px_rgba(255,95,0,0.25)] hover:shadow-[0_0_25px_rgba(255,95,0,0.5)] cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmitting packet...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 animate-pulse" />
                        <span>Transmit Packet</span>
                      </>
                    )}
                  </motion.button>
                </div>

              </form>

              {/* Form Success Overlay */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="p-4 rounded-full bg-brand-orange/10 border border-brand-orange/40 text-brand-orange mb-4 shadow-[0_0_20px_rgba(255,95,0,0.2)]">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                    <h3 className="font-display text-lg font-black uppercase tracking-wider text-white mb-2">Packet Transmitted Successfully</h3>
                    <p className="font-mono text-xs text-white/80 max-w-sm mb-2 leading-relaxed">
                      {submitMessage}
                    </p>
                    {emailStatus === 'stored_only' ? (
                      <p className="font-mono text-[10px] text-yellow-500 max-w-xs mb-4 leading-relaxed">
                        ⚠️ Note: SMTP_USER and SMTP_PASS are not configured in your hosting environment. The message was stored safely in your Firestore database instead of being emailed.
                      </p>
                    ) : emailStatus === 'failed' ? (
                      <div className="text-center max-w-sm mb-4">
                        <p className="font-mono text-[10px] text-yellow-500 leading-relaxed">
                          ⚠️ Email dispatch skipped: Invalid login/App Password required.
                        </p>
                        <p className="font-mono text-[9px] text-white/50 mt-1 leading-normal">
                          But don't worry! Your message is safely stored in the Firestore database, and the admin will see it in the Admin Panel.
                        </p>
                      </div>
                    ) : (
                      <p className="font-mono text-[10px] text-green-400 max-w-xs mb-4 leading-relaxed">
                        ✓ Bypassed main gateways and successfully dispatched to your email.
                      </p>
                    )}
                    <span className="font-mono text-[9px] text-brand-orange tracking-widest uppercase animate-pulse">GATEWAY READY FOR NEW INPUTS</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
