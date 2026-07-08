import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, Code, Sparkles, Layers, MessageSquare, Download, CheckCircle } from 'lucide-react';
import { playSynthBeep } from './AudioController';
import { jsPDF } from 'jspdf';
import { usePortfolio } from '../lib/portfolioData';
import rajuAvatar from '../assets/images/raju_avatar.png';
import rajuOrangeAvatar from '../assets/images/raju_orange_avatar_1783246064560.jpg';
import rajuPortrait from '../assets/images/raju_portrait_1783246047760.jpg';
import rajuRedAvatar from '../assets/images/raju_red_avatar_1783246083647.jpg';

interface HeroProps {
  theme: 'dark' | 'light';
}

const ROLES = [
  "Creative Developer",
  "UI/UX Designer",
  "Full Stack Builder",
  "AI Tools Specialist",
  "Flutter Craftsman"
];

const PERSONAS = [
  {
    id: 'orange',
    name: 'Digital Creator',
    image: rajuOrangeAvatar,
    color: 'from-brand-orange to-amber-500',
    glowColor: 'rgba(255, 95, 0, 0.4)',
    accentText: 'text-brand-orange'
  },
  {
    id: 'portrait',
    name: 'Mindset Visionary',
    image: rajuPortrait,
    color: 'from-gray-500 to-slate-800',
    glowColor: 'rgba(255, 255, 255, 0.25)',
    accentText: 'text-white/80'
  },
  {
    id: 'red',
    name: 'Esports & Gaming',
    image: rajuRedAvatar,
    color: 'from-brand-red to-rose-600',
    glowColor: 'rgba(255, 42, 42, 0.4)',
    accentText: 'text-brand-red'
  }
];

export default function Hero({ theme }: HeroProps) {
  const { data } = usePortfolio();
  
  // Dynamically resolve persona images and titles from data.identityPhotos (Identity Photos)
  const currentPersonas = PERSONAS.map(p => {
    const found = data?.identityPhotos?.find(item => item.id === p.id);
    return {
      ...p,
      image: found ? found.url : p.image,
      name: found ? found.title : p.name
    };
  });

  const [selectedPersonaId, setSelectedPersonaId] = useState('orange');
  const selectedPersona = currentPersonas.find(p => p.id === selectedPersonaId) || currentPersonas[0];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [cvDownloading, setCvDownloading] = useState(false);
  const [cvDone, setCvDone] = useState(false);

  // Lock body scroll when CV compiler modal is open
  useEffect(() => {
    if (showCVModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showCVModal]);

  // Typewriter effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const rolesList = [data.profile.role, ...ROLES.filter(r => r !== data.profile.role)];
    const currentFullRole = rolesList[currentRoleIndex % rolesList.length];
    
    const tick = () => {
      if (!isDeleting) {
        setTypedRole(currentFullRole.substring(0, typedRole.length + 1));
        if (typedRole === currentFullRole) {
          // Pause at end
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setTypedRole(currentFullRole.substring(0, typedRole.length - 1));
        if (typedRole === '') {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % rolesList.length);
          return;
        }
      }
      
      const speed = isDeleting ? 40 : 100;
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [typedRole, isDeleting, currentRoleIndex]);

  const handleScrollTo = (id: string) => {
    playSynthBeep(800, 'triangle', 0.1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectPersona = (p: typeof PERSONAS[0]) => {
    playSynthBeep(p.id === 'orange' ? 600 : p.id === 'red' ? 400 : 800, 'sine', 0.1);
    setSelectedPersonaId(p.id);
  };

  const triggerDownloadCV = async () => {
    playSynthBeep(900, 'sawtooth', 0.15);
    setShowCVModal(true);
    setCvDownloading(true);
    setCvDone(false);

    try {
      // Fetch avatar image
      const avatarUrl = rajuAvatar;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = avatarUrl;
      
      await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => {
          console.warn('Avatar failed to load. Using fallback graphics.');
          resolve(false);
        };
      });

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Left column: dark background (72mm width, full height)
      doc.setFillColor(20, 20, 23); // Slate charcoal
      doc.rect(0, 0, 72, 297, 'F');

      // Right column: clean white background
      doc.setFillColor(255, 255, 255);
      doc.rect(72, 0, 138, 297, 'F');

      // Left column header orange neon bar
      doc.setFillColor(255, 95, 0); // Brand Orange
      doc.rect(0, 0, 72, 4, 'F');
      doc.rect(0, 293, 72, 4, 'F');

      // Avatar Placement
      let hasAvatar = false;
      if (img.complete && img.naturalWidth !== 0) {
        let clippedImgData = '';
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const size = Math.min(img.naturalWidth, img.naturalHeight);
            canvas.width = size;
            canvas.height = size;
            
            // Create circular clip path
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
            
            // Draw image centered and cropped to fit the circle perfectly
            ctx.drawImage(
              img,
              (img.naturalWidth - size) / 2,
              (img.naturalHeight - size) / 2,
              size,
              size,
              0,
              0,
              size,
              size
            );
            clippedImgData = canvas.toDataURL('image/png');
          }
        } catch (canvasErr) {
          console.warn('Canvas clipping failed, using fallback raw image', canvasErr);
        }

        if (clippedImgData) {
          // Draw elegant glowing circular border
          doc.setDrawColor(255, 95, 0);
          doc.setLineWidth(0.8);
          doc.circle(36, 33, 19.5, 'S');

          // Draw clipped circular avatar image (size 38x38)
          doc.addImage(clippedImgData, 'PNG', 17, 14, 38, 38);
          hasAvatar = true;
        } else {
          // Draw elegant glowing circular border
          doc.setDrawColor(255, 95, 0);
          doc.setLineWidth(0.8);
          doc.circle(36, 33, 19.5, 'S');

          // Draw raw avatar image (size 38x38)
          doc.addImage(img, 'PNG', 17, 14, 38, 38);
          hasAvatar = true;
        }
      }

      if (!hasAvatar) {
        // Premium modern initials fallback avatar
        doc.setFillColor(255, 95, 0);
        doc.circle(36, 33, 18, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('RP', 36, 39, { align: 'center' });
      }

      // Sidebar Contacts Section
      let yLeft = 68;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 95, 0); // Brand Orange
      doc.text('CONTACT DETAILS', 8, yLeft);
      yLeft += 3;
      doc.setDrawColor(255, 95, 0);
      doc.setLineWidth(0.3);
      doc.line(8, yLeft, 64, yLeft);
      yLeft += 6;

      const contactItems = [
        { label: 'EMAIL GATEWAY', val: data.profile.email },
        { label: 'OPERATIONS', val: data.profile.location },
        { label: 'GITHUB NODE', val: data.profile.githubUrl.replace('https://', '') },
        { label: 'YOUTUBE STATION', val: data.profile.youtubeUrl.replace('https://', '') },
        { label: 'INSTAGRAM HUB', val: data.profile.instagramUrl.replace('https://', '') }
      ];

      contactItems.forEach(item => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(255, 42, 42); // Red Accent
        doc.text(item.label, 8, yLeft);
        yLeft += 3.5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(220, 220, 225);
        doc.text(item.val, 8, yLeft);
        yLeft += 6;
      });

      yLeft += 4;

      // Sidebar Technical Tool Deck (Canva Progress Bars)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 95, 0); // Orange
      doc.text('TECHNICAL DECK', 8, yLeft);
      yLeft += 3;
      doc.line(8, yLeft, 64, yLeft);
      yLeft += 6;

      const skillDeck = data.skills.slice(0, 6).map(s => ({
        name: s.name,
        level: s.level
      }));

      skillDeck.forEach(sk => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(220, 220, 225);
        doc.text(sk.name, 8, yLeft);
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 185);
        doc.text(`${sk.level}%`, 58, yLeft);
        yLeft += 3;

        // Draw track
        doc.setFillColor(45, 45, 50);
        doc.rect(8, yLeft, 56, 1.5, 'F');
        // Draw fill
        doc.setFillColor(255, 95, 0); // Orange level
        doc.rect(8, yLeft, (56 * sk.level) / 100, 1.5, 'F');
        yLeft += 5.5;
      });

      // Right Column Title Header
      let yRight = 18;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(18, 18, 20);
      doc.text(data.profile.name, 80, yRight);
      yRight += 6;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(255, 42, 42); // Red Accent
      doc.text(data.profile.subtitle, 80, yRight);
      yRight += 9;

      // Right Column Section 1: Professional Profile
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(255, 95, 0); // Orange
      doc.text('PROFESSIONAL PROFILE', 80, yRight);
      yRight += 3;
      doc.setDrawColor(240, 240, 245);
      doc.setLineWidth(0.4);
      doc.line(80, yRight, 200, yRight);
      yRight += 5;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 55);
      const summaryText = data.profile.bioSummary;
      const summaryLines = doc.splitTextToSize(summaryText, 118);
      doc.text(summaryLines, 80, yRight);
      yRight += summaryLines.length * 4.5 + 6;

      // Right Column Section 2: Core Competencies
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(255, 95, 0); // Orange
      doc.text('CORE COMPETENCIES', 80, yRight);
      yRight += 3;
      doc.line(80, yRight, 200, yRight);
      yRight += 5;

      const competencies = data.competencies;

      competencies.forEach(c => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(255, 42, 42); // Red accent
        doc.text(`> ${c.title}`, 80, yRight);
        yRight += 4;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(70, 70, 75);
        const descLines = doc.splitTextToSize(c.desc, 114);
        doc.text(descLines, 84, yRight);
        yRight += descLines.length * 4.2 + 5;
      });

      yRight += 1.5;

      // Right Column Section 3: Selected Projects
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(255, 95, 0); // Orange
      doc.text('SELECTED PROJECT WORK', 80, yRight);
      yRight += 3;
      doc.line(80, yRight, 200, yRight);
      yRight += 5;

      const projects = data.resumeProjects;

      projects.forEach(p => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(18, 18, 20);
        doc.text(p.name, 80, yRight);
        yRight += 4;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(70, 70, 75);
        const pDescLines = doc.splitTextToSize(p.desc, 118);
        doc.text(pDescLines, 80, yRight);
        yRight += pDescLines.length * 4.2 + 5.5;
      });

      // Right Column Footer Stamp
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 145);
      doc.text(`Digitally Compiled & Secured by ${data.profile.name} | Authentic Premium Resume.`, 80, 284);

      // Save PDF to trigger instant download
      doc.save(`${data.profile.name.replace(/\s+/g, '_')}_Resume.pdf`);
      
      setCvDownloading(false);
      setCvDone(true);
      playSynthBeep(1200, 'sine', 0.2);

      // Close modal shortly after success
      setTimeout(() => {
        setShowCVModal(false);
      }, 2500);

    } catch (err) {
      console.error('Failed to generate resume PDF:', err);
      setCvDownloading(false);
      setCvDone(false);
      setShowCVModal(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 overflow-hidden pt-20 z-10"
    >
      {/* Cinematic Lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-brand-orange/5 to-brand-red/5 blur-[160px] opacity-70 animate-neon-pulse" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Brand Text */}
        <div className="col-span-1 lg:col-span-7 flex flex-col text-center lg:text-left order-2 lg:order-1 items-center lg:items-start">
          
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-6 ${
              isDark ? 'bg-white/5 text-brand-orange border border-white/10' : 'bg-black/5 text-brand-orange border border-black/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-spin" style={{ animationDuration: '3s' }} />
            <span>Interactive Portfolio v3.0</span>
          </motion.div>

          {/* Name Display */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '-0.05em' }}
              animate={{ opacity: 1, letterSpacing: '0.02em' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`font-display text-5xl sm:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-none mb-4 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {data.profile.name.split(' ')[0]} {data.profile.name.split(' ').slice(1).join(' ') && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red drop-shadow-[0_0_15px_rgba(255,95,0,0.15)]">
                  {data.profile.name.split(' ').slice(1).join(' ')}
                </span>
              )}
            </motion.h1>
          </div>

          {/* Typing Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-6 h-8"
          >
            <span className={`font-mono text-sm uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-black/50'}`}>I am a</span>
            <div className="flex items-center">
              <span className="font-display text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red pr-1">
                {typedRole}
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'steps(2)' }}
                className="inline-block w-[3px] h-6 bg-brand-orange"
              />
            </div>
          </motion.div>

          {/* Intro Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`text-base sm:text-lg font-light leading-relaxed mb-8 max-w-lg ${
              isDark ? 'text-white/60' : 'text-black/60'
            }`}
          >
            {data.profile.bioSummary}
          </motion.p>

          {/* CTA Buttons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            {/* View Portfolio Button */}
            <motion.button
              onClick={() => handleScrollTo('projects')}
              onMouseEnter={() => playSynthBeep(1100, 'sine', 0.04)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-red text-white font-display font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,95,0,0.35)] cursor-pointer hover:shadow-[0_0_35px_rgba(255,95,0,0.5)] transition-all duration-300"
            >
              <Layers className="w-4 h-4" />
              <span>View Portfolio</span>
            </motion.button>

            {/* Contact Button */}
            <motion.button
              onClick={() => handleScrollTo('contact')}
              onMouseEnter={() => playSynthBeep(1000, 'sine', 0.04)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-full font-display font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border transition-all duration-300 ${
                isDark 
                  ? 'bg-white/5 text-white hover:bg-white/10 border-white/10 hover:border-brand-orange/40' 
                  : 'bg-black/5 text-black hover:bg-black/10 border-black/10 hover:border-brand-orange/40'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Me</span>
            </motion.button>

            {/* Download CV Button */}
            <motion.button
              onClick={triggerDownloadCV}
              onMouseEnter={() => playSynthBeep(1200, 'sine', 0.04)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-4 rounded-full font-display font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border transition-all duration-300 ${
                isDark 
                  ? 'bg-transparent text-brand-orange/80 hover:text-brand-orange border-brand-orange/20 hover:border-brand-orange/50' 
                  : 'bg-transparent text-brand-orange border-brand-orange/20 hover:border-brand-orange/50'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Get CV</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side: Center glowing profile image with interactive controller */}
        <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            
            {/* Outer Spinning Concentric glowing rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-brand-orange/30 p-2"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="absolute inset-3 rounded-full border border-double border-brand-red/20 p-2"
            />

            {/* Pulsing Solid Glowing Aura */}
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 20px rgba(255,95,0,0.15), inset 0 0 20px rgba(255,95,0,0.15)`,
                  `0 0 45px ${selectedPersona.glowColor}, inset 0 0 35px ${selectedPersona.glowColor}`,
                  `0 0 20px rgba(255,95,0,0.15), inset 0 0 20px rgba(255,95,0,0.15)`,
                ]
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute inset-6 rounded-full border-2 border-brand-orange/50"
            />

            {/* Main Avatar Card Frame */}
            <motion.div
              key={selectedPersona.id}
              initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative w-60 h-60 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-white/10 z-10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
            >
              {/* Overlay Glass Reflection */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-white/0 z-10 pointer-events-none" />
              
              {/* Raju Patel Profile Picture */}
              <img
                src={selectedPersona.image}
                alt={`Raju Patel - ${selectedPersona.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-110"
              />

              {/* Tag overlay inside the circle */}
              <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center">
                <span className="font-display text-xs font-bold uppercase text-white tracking-[0.3em] drop-shadow-md">
                  {selectedPersona.name}
                </span>
                <span className="font-mono text-[9px] text-white/50 tracking-widest mt-0.5">
                  RP__{selectedPersona.id === 'orange' ? '910' : selectedPersona.id === 'red' ? 'GAME' : 'CORE'}
                </span>
              </div>
            </motion.div>

            {/* Small abstract orbital badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-1 right-8 z-20 p-2.5 rounded-xl glass-card border border-brand-orange/30 shadow-lg flex items-center justify-center text-brand-orange"
            >
              <Code className="w-5 h-5 animate-pulse" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-1 left-8 z-20 p-2.5 rounded-xl glass-card border border-brand-red/30 shadow-lg flex items-center justify-center text-brand-red"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
            </motion.div>
          </div>

          {/* Persona selector Deck */}
          <div className="mt-8 flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-card border border-white/5 shadow-md z-20">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest mr-1">Identity:</span>
            {currentPersonas.map((p) => {
              const active = selectedPersonaId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => selectPersona(p)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-brand-orange to-brand-red text-white font-bold shadow-[0_0_12px_rgba(255,95,0,0.3)]'
                      : 'hover:bg-white/5 text-white/55'
                  }`}
                >
                  {p.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 cursor-pointer" onClick={() => handleScrollTo('about')}>
        <motion.span
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`font-mono text-[9px] uppercase tracking-[0.4em] mb-2 ${isDark ? 'text-white/40' : 'text-black/40'}`}
        >
          Scroll Down
        </motion.span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="p-1.5 rounded-full border border-brand-orange/35 flex items-center justify-center text-brand-orange shadow-[0_0_10px_rgba(255,95,0,0.15)]"
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </div>

      {/* high-tech CV Compiler Modal */}
      <AnimatePresence>
        {showCVModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-2xl border border-brand-orange/30 overflow-hidden shadow-2xl p-6 flex flex-col items-center"
            >
              {cvDownloading ? (
                <div className="flex flex-col items-center py-8 w-full">
                  {/* Digital compiler widget */}
                  <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-brand-orange border-t-transparent"
                    />
                    <Download className="w-8 h-8 text-brand-orange animate-bounce" />
                  </div>
                  
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-widest mb-1">Compiling Resume</h3>
                  <span className="font-mono text-xs text-brand-orange animate-pulse mb-6">SECURE COMPILATION...</span>

                  {/* Compiling lines */}
                  <div className="w-full bg-white/5 rounded-lg p-3 font-mono text-[10px] text-white/50 h-24 overflow-hidden relative">
                    <motion.div
                      animate={{ y: [0, -100] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                      className="flex flex-col gap-1.5"
                    >
                      <span>&gt; Connecting to Secure File Storage...</span>
                      <span>&gt; Pulling dynamic project records (50+)...</span>
                      <span>&gt; Optimizing layout structure...</span>
                      <span>&gt; Embedding verified Flutter, React, AI credentials...</span>
                      <span>&gt; Rendering high-contrast PDF document...</span>
                      <span>&gt; Encrypting package with SHA-256...</span>
                      <span>&gt; Compilation successful!</span>
                    </motion.div>
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-dark-bg to-transparent" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="p-4 rounded-full bg-brand-orange/20 border border-brand-orange/50 text-brand-orange mb-6 shadow-[0_0_20px_rgba(255,95,0,0.3)]">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider mb-2">Resume Secured</h3>
                  <p className="font-mono text-xs text-white/60 mb-6">
                    CV completed compiling successfully.<br />File: <span className="text-brand-orange">Raju_Patel_Resume.pdf</span>
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-orange animate-pulse">
                    Triggering download...
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
