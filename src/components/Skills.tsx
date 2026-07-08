import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Smartphone, Flame, Atom, Palette, Cpu, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { Skill } from '../types';
import { playSynthBeep } from './AudioController';
import { usePortfolio } from '../lib/portfolioData';

interface SkillsProps {
  theme: 'dark' | 'light';
}

const SKILL_ITEMS: Skill[] = [
  { name: 'Flutter & Dart', category: 'frontend', level: 95, iconName: 'flutter', color: '#ff5f00' },
  { name: 'React & TypeScript', category: 'frontend', level: 92, iconName: 'react', color: '#00b4d8' },
  { name: 'Firebase Ecosystem', category: 'backend', level: 90, iconName: 'firebase', color: '#ffc300' },
  { name: 'UI/UX & Figma', category: 'design', level: 94, iconName: 'design', color: '#ff2a2a' },
  { name: 'AI & Gemini API', category: 'tools', level: 88, iconName: 'ai', color: '#7b2cbf' }
];

// Individual circular skill gauge component
const SkillCircularProgress: React.FC<{ skill: Skill; delay: number }> = ({ skill, delay }) => {
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(elementRef, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Easing out sine
      const eased = Math.sin((progressRatio * Math.PI) / 2);
      setProgress(eased * skill.level);

      if (progressRatio < 1) {
        requestAnimationFrame(step);
      } else {
        setProgress(skill.level);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, skill.level, delay]);

  // SVG parameters
  const radius = 50;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const renderIcon = () => {
    switch (skill.iconName) {
      case 'flutter': return <Smartphone className="w-5 h-5" style={{ color: skill.color }} />;
      case 'firebase': return <Flame className="w-5 h-5" style={{ color: skill.color }} />;
      case 'react': return <Atom className="w-5 h-5" style={{ color: skill.color }} />;
      case 'design': return <Palette className="w-5 h-5" style={{ color: skill.color }} />;
      case 'ai': return <Cpu className="w-5 h-5" style={{ color: skill.color }} />;
      default: return <Sparkles className="w-5 h-5" style={{ color: skill.color }} />;
    }
  };

  return (
    <div ref={elementRef} className="flex flex-col items-center p-5 rounded-2xl glass-card border border-white/5 hover:border-white/10 transition-all duration-300 relative group">
      {/* Background glow orbs on hover */}
      <div 
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" 
        style={{ backgroundColor: skill.color }}
      />

      <div className="relative w-28 h-28 flex items-center justify-center mb-4">
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
          />
          {/* Active Glowing Circle */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="transparent"
            stroke={skill.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 5px ${skill.color})`,
              transition: 'stroke-dashoffset 0.1s ease-out'
            }}
          />
        </svg>

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse" style={{ animationDuration: '4s' }}>
          {renderIcon()}
        </div>
      </div>

      <span className="font-display text-sm font-bold text-white uppercase tracking-wider text-center">
        {skill.name}
      </span>
      <span className="font-mono text-xs text-white/50 mt-1 font-semibold" style={{ color: skill.color }}>
        {Math.round(progress)}%
      </span>
    </div>
  );
}

export default function Skills({ theme }: SkillsProps) {
  const { data } = usePortfolio();
  const [activeDiagnosis, setActiveDiagnosis] = useState<Skill | null>(null);
  const [chargingValue, setChargingValue] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  const handleChargeSkill = (skill: Skill) => {
    if (isCharging) return;

    setIsCharging(true);
    setActiveDiagnosis(skill);
    setChargingValue(0);

    // Audio frequency scaling logic for sci-fi synthesis
    let currentVal = 0;
    const interval = setInterval(() => {
      currentVal += 5;
      if (currentVal >= skill.level) {
        currentVal = skill.level;
        clearInterval(interval);
        setIsCharging(false);
        // High success pitch
        playSynthBeep(1300, 'sine', 0.25);
      } else {
        // Stepwise chirp going higher
        playSynthBeep(400 + currentVal * 8, 'triangle', 0.04);
      }
      setChargingValue(currentVal);
    }, 45);
  };

  const isDark = theme === 'dark';

  return (
    <section
      id="skills"
      className={`relative py-24 px-4 w-full overflow-hidden z-10 ${
        isDark ? 'bg-transparent text-white' : 'text-black'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-center sm:text-left">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-orange mb-3">03 / CORE POWER</span>
          <h2 className={`font-display text-4xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            SKILLS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">MATRIX</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-brand-orange to-brand-red mt-4 mx-auto sm:mx-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: 3D Gauge Circle Clusters */}
          <div className="col-span-1 lg:col-span-7">
            <h3 className="font-display text-lg font-bold uppercase text-white tracking-widest mb-8 text-center sm:text-left">
              Proficiency Status Indicators
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {data.skills.map((skill, i) => (
                <SkillCircularProgress key={skill.name} skill={skill} delay={i * 150} />
              ))}
            </div>
          </div>

          {/* Right Panel: Advanced Skill Charging / Diagnostic deck */}
          <div className="col-span-1 lg:col-span-5">
            <div className="glass-card rounded-2xl border border-white/5 p-6 sm:p-8 flex flex-col h-full relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-sm font-bold uppercase text-white tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Subsystem Diagnostic Deck</span>
                </h3>
                <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">STABLE GATEWAY v3.1</span>
              </div>

              <p className="text-white/60 text-xs font-light leading-relaxed mb-6">
                Select any skill vector below to initiate an interactive diagnostic test and calibrate latency metrics:
              </p>

              {/* Skills Interactive List */}
              <div className="space-y-3 mb-8">
                {data.skills.map((skill) => (
                  <button
                    key={skill.name}
                    disabled={isCharging}
                    onClick={() => handleChargeSkill(skill)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 disabled:opacity-75 disabled:hover:border-white/5 cursor-pointer text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: skill.color, boxShadow: `0 0 8px ${skill.color}` }} />
                      <span className="font-display text-xs font-bold text-white uppercase tracking-wider group-hover:text-brand-orange transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 tracking-wider">INIT DIAGNOSTIC</span>
                  </button>
                ))}
              </div>

              {/* Live telemetry diagnostic readout block */}
              <div className="bg-black/90 rounded-xl border border-white/15 p-4 flex flex-col min-h-48 relative overflow-hidden font-mono text-[11px] text-white/50 leading-relaxed">
                
                {/* Visual scanning line */}
                {isCharging && (
                  <motion.div
                    animate={{ y: [0, 180, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-[1.5px] bg-brand-orange/40 z-10"
                  />
                )}

                <AnimatePresence mode="wait">
                  {activeDiagnosis ? (
                    <motion.div
                      key={activeDiagnosis.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-2"
                    >
                      <span className="text-brand-orange font-bold">&gt; CALIBRATING SYSTEM: {activeDiagnosis.name.toUpperCase()}</span>
                      
                      <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded mt-1">
                        <span>CALIBRATION PROGRESS</span>
                        <span className="text-white font-bold">{Math.round(chargingValue)}%</span>
                      </div>

                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                        <div className="h-full" style={{ width: `${chargingValue}%`, backgroundColor: activeDiagnosis.color }} />
                      </div>

                      {chargingValue >= activeDiagnosis.level ? (
                        <div className="flex flex-col gap-1.5 mt-2.5">
                          <span className="text-green-500 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> STATUS: FULLY OPTIMIZED & CALIBRATED
                          </span>
                          <span className="text-white/40">&gt; Core latency verified at 12ms</span>
                          <span className="text-white/40">&gt; Security checksum valid [0x4F7C8]</span>
                          <span className="text-white/40">&gt; Flutter VM responsive on frame grids</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 mt-2.5">
                          <span className="text-brand-red font-semibold animate-pulse flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> DIAGNOSTIC IN PROCESS...
                          </span>
                          <span className="text-white/30">&gt; Loading local node references...</span>
                          <span className="text-white/30">&gt; Fetching thread pool states...</span>
                          <span className="text-white/30">&gt; Syncing frame rates to 120 FPS...</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-white/30 gap-2">
                      <Cpu className="w-8 h-8 opacity-40 mb-2 animate-pulse" />
                      <span>DECK IN IDLE MODE</span>
                      <span>No Diagnostic vector selected</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
