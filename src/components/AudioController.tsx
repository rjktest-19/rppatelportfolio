import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

let audioCtx: AudioContext | null = null;
let droneOsc: OscillatorNode | null = null;
let droneGain: GainNode | null = null;
let filterNode: BiquadFilterNode | null = null;

// Initialize Audio Context on user gesture
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a futuristic futuristic beep
export const playSynthBeep = (freq = 800, type: OscillatorType = 'sine', duration = 0.08) => {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Frequency slide for tech feel
    if (type === 'sawtooth') {
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
    } else {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
    }
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context not initialized or blocked
  }
};

// Start soft background space drone
const startDrone = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (droneOsc) {
      stopDrone();
    }

    // Deep low pad
    droneOsc = ctx.createOscillator();
    droneOsc.type = 'triangle';
    droneOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

    // Lowpass filter to make it warm
    filterNode = ctx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(220, ctx.currentTime);
    filterNode.Q.setValueAtTime(2, ctx.currentTime);

    droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    
    // Smooth ramp in
    droneGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.0);

    // Dynamic modulation using LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.2; // Slow cycle 5s
    lfoGain.gain.value = 80; // Modulate filter cutoff by 80Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filterNode.frequency);

    droneOsc.connect(filterNode);
    filterNode.connect(droneGain);
    droneGain.connect(ctx.destination);

    lfo.start();
    droneOsc.start();
  } catch (e) {
    console.warn("Could not start background audio drone", e);
  }
};

const stopDrone = () => {
  try {
    if (droneGain && audioCtx) {
      droneGain.gain.cancelScheduledValues(audioCtx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (droneOsc) {
          droneOsc.stop();
          droneOsc.disconnect();
          droneOsc = null;
        }
        droneGain = null;
      }, 500);
    }
  } catch (e) {
    // Already stopped
  }
};

export default function AudioController() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeBeats, setActiveBeats] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    localStorage.setItem('raju_portfolio_muted', nextMute ? 'true' : 'false');

    if (!nextMute) {
      // Unmuted
      getAudioContext();
      startDrone();
      playSynthBeep(600, 'sine', 0.15);
    } else {
      // Muted
      stopDrone();
    }
  };

  useEffect(() => {
    // Check local storage preference
    const savedMute = localStorage.getItem('raju_portfolio_muted');
    if (savedMute === 'false') {
      // Keep muted initially to comply with browser autoplay policies, but show hint
    }
    
    return () => {
      stopDrone();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Visual equalizer animation when not muted
  useEffect(() => {
    if (isMuted) {
      setActiveBeats([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const beats = Array.from({ length: 4 }, () => Math.floor(Math.random() * 16) + 4);
      setActiveBeats(beats);
    }, 150);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMuted]);

  return (
    <div id="audio-control-container" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {!isMuted && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full glass-card border border-brand-orange/20"
          >
            <Radio className="w-3 h-3 text-brand-orange animate-pulse" />
            <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest mr-1">Synth Ambient</span>
            <div className="flex items-end gap-[2px] h-3 w-6 px-1">
              {activeBeats.map((height, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${height}px` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-[2px] bg-brand-orange rounded-full"
                  style={{ transformOrigin: 'bottom' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="sound-toggle-btn"
        onClick={toggleSound}
        onMouseEnter={() => !isMuted && playSynthBeep(1200, 'sine', 0.04)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-3.5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isMuted
            ? 'bg-black/80 hover:bg-black text-white/50 border border-white/10'
            : 'bg-gradient-to-tr from-brand-orange to-brand-red text-white shadow-[0_0_20px_rgba(255,95,0,0.4)] border border-brand-orange/40'
        }`}
        title={isMuted ? "Enable Ambient Audio" : "Mute Sound"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </motion.button>
    </div>
  );
}
