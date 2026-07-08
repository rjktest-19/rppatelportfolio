import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Elegant variable-speed counting algorithm for realistic loading look
    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 2; // Jump by 2% to 10%
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 800); // Wait for fade exit animation
        }, 600);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-bg text-white"
        >
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-brand-orange/5 blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-[30vw] h-[30vw] rounded-full bg-brand-red/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Concentric Animated Circles */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-brand-orange/30 animate-orbit"
                style={{ borderWidth: '2px' }}
              />
              
              {/* Middle Ring */}
              <motion.div
                className="absolute inset-2 rounded-full border border-brand-red/40 animate-orbit-reverse"
                style={{ borderWidth: '1px' }}
              />

              {/* Glowing Inner Solid Ring */}
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-brand-orange shadow-[0_0_20px_rgba(255,95,0,0.5)] animate-neon-pulse"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Central Logo */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ letterSpacing: '-0.1em', opacity: 0 }}
                  animate={{ letterSpacing: '0.1em', opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="font-display text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red"
                >
                  RP
                </motion.span>
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 mt-1 uppercase">Raju Patel</span>
              </div>
            </div>

            {/* loading Status */}
            <div className="mt-10 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-mono text-3xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
              >
                {progress.toString().padStart(3, '0')}%
              </motion.div>
              
              <div className="w-48 h-[2px] bg-white/10 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-orange to-brand-red"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-orange mt-3"
              >
                Initializing Core 3D VM
              </motion.p>
            </div>
          </div>

          {/* Bottom Technical Indicators */}
          <div className="absolute bottom-8 left-10 right-10 flex justify-between font-mono text-[10px] text-white/30">
            <span>PLATFORM: REACT v19.0.1</span>
            <span className="animate-pulse">● SECURE GATEWAY ENCRYPTED</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
