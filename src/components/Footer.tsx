import { motion } from 'motion/react';
import { Instagram, Youtube, Github, Mail, ShieldAlert } from 'lucide-react';
import { playSynthBeep } from './AudioController';

interface FooterProps {
  theme: 'dark' | 'light';
}

export default function Footer({ theme }: FooterProps) {
  const handleScrollTo = (id: string) => {
    playSynthBeep(800, 'sine', 0.05);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDark = theme === 'dark';

  return (
    <footer
      id="footer"
      className={`relative py-12 px-6 border-t border-white/5 z-10 transition-colors duration-500 ${
        isDark ? 'bg-transparent text-white' : 'text-black'
      }`}
    >
      {/* Visual background ambient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[1px] bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Brand Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => handleScrollTo('home')}>
            <span className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">
              RP
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 mt-1 uppercase">Raju Patel</span>
          </div>
          <span className="font-mono text-[10px] text-white/30 tracking-wider">
            HIGH-END DIGITAL DESIGN ENGINE v3.0
          </span>
        </div>

        {/* Middle: Fast Navigation Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-widest text-white/55">
          <button onClick={() => handleScrollTo('home')} className="hover:text-brand-orange cursor-pointer transition-colors">Home</button>
          <button onClick={() => handleScrollTo('about')} className="hover:text-brand-orange cursor-pointer transition-colors">About</button>
          <button onClick={() => handleScrollTo('projects')} className="hover:text-brand-orange cursor-pointer transition-colors">Projects</button>
          <button onClick={() => handleScrollTo('skills')} className="hover:text-brand-orange cursor-pointer transition-colors">Skills</button>
          <button onClick={() => handleScrollTo('gallery')} className="hover:text-brand-orange cursor-pointer transition-colors">Gallery</button>
          <button onClick={() => handleScrollTo('contact')} className="hover:text-brand-orange cursor-pointer transition-colors">Contact</button>
        </div>

        {/* Right Side: Network Badges */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-4 text-white/40">
            <a
              href="https://instagram.com/rajupatel__910"
              target="_blank"
              rel="noreferrer"
              onClick={() => playSynthBeep(800, 'sine', 0.05)}
              className="hover:text-brand-orange transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com/@rajupatel__910"
              target="_blank"
              rel="noreferrer"
              onClick={() => playSynthBeep(900, 'sine', 0.05)}
              className="hover:text-brand-orange transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/6287rajubabu"
              target="_blank"
              rel="noreferrer"
              onClick={() => playSynthBeep(1000, 'sine', 0.05)}
              className="hover:text-brand-orange transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/30 tracking-widest uppercase select-none">
            <ShieldAlert className="w-3 h-3 text-brand-orange animate-pulse" />
            <span>SECURE ENCRYPTED NODE</span>
          </div>
        </div>

      </div>

      {/* Trademark signature line */}
      <div className="w-full max-w-6xl mx-auto text-center mt-12 font-mono text-[9px] text-white/20 tracking-wider">
        © 2026 RAJU PATEL. ALL RIGHTS RESERVED. SECURELY HOSTED IN CLOUD COMPILER.
      </div>
    </footer>
  );
}
