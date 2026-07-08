import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Shield, Sparkles, Zap, Award, CheckCircle } from 'lucide-react';
import { playSynthBeep } from './AudioController';
import { usePortfolio } from '../lib/portfolioData';
import rajuPortrait from '../assets/images/raju_portrait_1783246047760.jpg';

interface AboutProps {
  theme: 'dark' | 'light';
}

// Child element for count up stats
function StatCounter({ target, suffix = '', delay = 0, label }: { target: number; suffix?: string; delay?: number; label: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(elementRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1800; // 1.8 seconds

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easedProgress = progress * (2 - progress);
      const currentCount = Math.floor(easedProgress * target);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
        // Play subtle success chime
        playSynthBeep(900 + target * 2, 'sine', 0.1);
      }
    };

    setTimeout(() => {
      requestAnimationFrame(step);
    }, delay);
  }, [isInView, target, delay]);

  return (
    <div ref={elementRef} className="flex flex-col items-center sm:items-start p-4 rounded-xl bg-white/5 border border-white/5 shadow-sm">
      <span className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">
        {count}
        {suffix}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 mt-1">{label}</span>
    </div>
  );
}

export default function About({ theme }: AboutProps) {
  const { data } = usePortfolio();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 3D Tilt effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates around card center (from -0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Convert to maximum rotation degrees (e.g. max 12 degrees)
    setTilt({
      x: -mouseY * 15,
      y: mouseX * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isDark = theme === 'dark';

  return (
    <section
      id="about"
      className={`relative py-24 px-4 w-full overflow-hidden z-10 transition-colors duration-500 ${
        isDark ? 'bg-transparent text-white' : 'text-black'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-center sm:text-left">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-orange mb-3">01 / BRAND BIO</span>
          <h2 className={`font-display text-4xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            DEVELOPER <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">MINDSET</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-brand-orange to-brand-red mt-4 mx-auto sm:mx-0" />
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: 3D Image Glass Frame */}
          <div className="col-span-1 lg:col-span-5 flex justify-center">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: 1000,
              }}
              className="relative w-72 h-96 sm:w-80 sm:h-[420px] cursor-pointer"
            >
              <motion.div
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y,
                  transformStyle: 'preserve-3d',
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="relative w-full h-full rounded-2xl overflow-hidden glass-card border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col p-3"
              >
                {/* 3D Inner layered border */}
                <div 
                  style={{ transform: 'translateZ(20px)' }}
                  className="absolute inset-4 rounded-xl border border-brand-orange/30 pointer-events-none z-20"
                />

                {/* Main Portrait Portrait */}
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={rajuPortrait}
                    alt="Raju Patel Close Up Portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none transition-all duration-500 saturate-[0.8] hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-black/10 to-transparent z-10" />
                </div>

                {/* Title badge in card */}
                <div
                  style={{ transform: 'translateZ(30px)' }}
                  className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between px-4 py-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/5"
                >
                  <div className="flex flex-col">
                    <span className="font-display text-xs font-bold text-white uppercase tracking-wider">{data.profile.name}</span>
                    <span className="font-mono text-[9px] text-brand-orange tracking-widest mt-0.5">{data.profile.role}</span>
                  </div>
                  <Award className="w-5 h-5 text-brand-orange animate-pulse" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Mindset Text & Skills Highlight */}
          <div className="col-span-1 lg:col-span-7 flex flex-col">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold uppercase tracking-wide mb-6 text-brand-orange"
            >
              Transforming Abstract Imagination into Functional Reality
            </motion.h3>

            <div className={`space-y-6 font-light leading-relaxed text-sm sm:text-base ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              <p>
                As a dynamic creative developer, I thrive at the intersections of structural system architecture and motion aesthetics. I write highly optimized, elegant code designed for speed, security, and delightful user interactivity.
              </p>
              <p>
                My philosophy is rooted in the belief that a portfolio is more than static sheets of code; it is an immersive medium to communicate identity, craft, and forward-thinking vision. Whether designing lightweight cross-platform applications or scripting cinematic physics-based animations, my target is absolute technical and artistic perfection.
              </p>
            </div>

            {/* Core Capability Pillars */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {/* Flutter */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold uppercase text-white tracking-wider mb-1">Flutter & Firebase</h4>
                  <p className="font-sans text-[11px] text-white/50 leading-normal">Fast native mobile solutions with cloud-scale real-time databases.</p>
                </div>
              </div>

              {/* Web Dev */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-brand-red/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-brand-red/10 text-brand-red mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold uppercase text-white tracking-wider mb-1">Web Development</h4>
                  <p className="font-sans text-[11px] text-white/50 leading-normal">High-performance React architectures styled with sleek utility code.</p>
                </div>
              </div>

              {/* UI/UX */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold uppercase text-white tracking-wider mb-1">UI/UX Design</h4>
                  <p className="font-sans text-[11px] text-white/50 leading-normal">Cinematic visual layouts, smooth motion curves, and glass styling.</p>
                </div>
              </div>

              {/* AI Tools */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-brand-red/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-brand-red/10 text-brand-red mt-0.5">
                  <CheckCircle className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold uppercase text-white tracking-wider mb-1">AI Tools & Gemini</h4>
                  <p className="font-sans text-[11px] text-white/50 leading-normal">Smarter apps integrating advanced generative LLM model endpoints.</p>
                </div>
              </div>
            </div>

            {/* Counters Section */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <StatCounter target={50} suffix="+" label="Projects Done" delay={0} />
              <StatCounter target={5} suffix="+" label="Years Experience" delay={200} />
              <StatCounter target={30} suffix="+" label="Happy Clients" delay={400} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
