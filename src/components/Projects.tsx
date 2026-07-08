import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Layers, Code, Play, CheckCircle, Cpu, Timer, Star, X } from 'lucide-react';
import { Project } from '../types';
import { playSynthBeep } from './AudioController';
import { usePortfolio } from '../lib/portfolioData';

interface ProjectsProps {
  theme: 'dark' | 'light';
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'apex-shopping',
    title: 'Apex Shopping Hub',
    description: 'A premium, ultra-fast e-commerce application with dynamic shopping carts, catalog filters, and slick dark layouts.',
    fullDescription: 'Apex Shopping Hub is a top-tier retail web application engineered for maximum performance and design fidelity. Built with React and TypeScript, it implements a highly responsive local state cart engine that handles item addition, quantities, and price calculators with zero layout shift. Features high-contrast bento product cards, live query filters, simulated secure credit gateways, and automated transaction logs.',
    category: 'Web Apps',
    tags: ['React', 'TypeScript', 'Tailwind', 'State Engine'],
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=800&q=80',
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'LocalStore Persistence'],
    stats: [
      { label: 'Cart Latency', value: '0ms (Instant)' },
      { label: 'Catalog Load', value: '0.4s' },
      { label: 'Lighthouse Score', value: '100%' }
    ],
    features: [
      'Reactive bento-grid storefront with dynamic search, price sliders, and category tabs',
      'Buttery-smooth drawer-based shopping cart with persistent cached checkout state',
      'Futuristic secure simulation payment gateway with active card logo recognition',
      'Interactive receipts with automated transaction status indicators and downloadable logs'
    ],
    links: {
      github: 'https://github.com/rajupatel/apex-shopping',
      live: '#'
    }
  },
  {
    id: 'nexus-ai',
    title: 'Nexus Chat AI',
    description: 'Cinematic AI client with Gemini Integration, vector retrieval, and advanced contextual memory.',
    fullDescription: 'Nexus Chat AI is a high-performance generative assistant interface built with Express, React, and the Gemini API. It uses custom Vector-DB embeddings to index documents locally, allowing the AI to answer context-aware queries about uploaded files instantly. Styled in a futuristic deep purple glassmorphism layout, it features streaming text tokens, conversational speech-to-text, and visual grounding.',
    category: 'AI Tools',
    tags: ['React', 'Gemini API', 'Node.js', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    techStack: ['TypeScript', 'Gemini SDK', 'Express', 'Tailwind CSS v4', 'Web Speech API'],
    stats: [
      { label: 'API Response', value: '120ms' },
      { label: 'Token Speed', value: '45 t/s' },
      { label: 'Accuracy', value: '98.4%' }
    ],
    features: [
      'Streaming text generation with zero-flicker React renders',
      'Local vector-embeddings for offline semantic search indexing',
      'Advanced vocal speech recognition and reading synthesizer',
      'Fully customizable system instructional templates'
    ],
    links: {
      github: 'https://github.com/rajupatel/nexus-ai',
      live: 'https://ai.studio/build'
    }
  },
  {
    id: 'nova-cross',
    title: 'Nova Cross',
    description: 'Immersive cross-platform mobile travel app with offline maps caching and Firebase authentication.',
    fullDescription: 'Nova Cross is a premium travel catalog app built with Flutter and Firebase, designed for adventure enthusiasts. It features offline maps caching using customized vector tiles, live coordinate synchronization via Firestore, and fully encrypted credential flows. The app features luxury high-contrast typography, seamless page transitions, and physical spring-back swipe decks.',
    category: 'Mobile Apps',
    tags: ['Flutter', 'Dart', 'Firebase', 'Maps API'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    techStack: ['Dart', 'Flutter SDK', 'Firebase Auth', 'Cloud Firestore', 'Mapbox SDK'],
    stats: [
      { label: 'Frame Rate', value: '120 FPS' },
      { label: 'Off-line Maps', value: 'Up to 2GB' },
      { label: 'Synch Latency', value: '40ms' }
    ],
    features: [
      'Buttery smooth 120 FPS gestures on modern iOS and Android screens',
      'Encrypted cloud authentication with Google and email integrations',
      'Dynamic real-time offline geographic caching engine',
      'Rich multi-layer interactive map markers and path routing'
    ],
    links: {
      github: 'https://github.com/rajupatel/nova-cross',
      live: '#'
    }
  },
  {
    id: 'hyperion',
    title: 'Hyperion Analytics',
    description: 'High-end collaborative data canvas with responsive Recharts and D3 dashboards.',
    fullDescription: 'Hyperion is a modern full-stack analytics platform specializing in visual charts. Designed as a real-time responsive whiteboard, it uses D3.js and Recharts to generate highly customizable node networks, interactive timeseries streams, and bento-grid modules. Features persistent Express sessions, multi-user cursors, and instant CSV/PDF reporting.',
    category: 'Web Apps',
    tags: ['React', 'D3.js', 'Recharts', 'Express'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    techStack: ['React 18', 'D3.js', 'Recharts', 'Express', 'Tailwind CSS v4'],
    stats: [
      { label: 'Render Latency', value: '4ms' },
      { label: 'Data Points', value: '100K+' },
      { label: 'File Sizes', value: 'Under 80KB' }
    ],
    features: [
      'Interactive D3 canvas with fluid dragging nodes and coordinate pinning',
      'Ultra-responsive Recharts bento cards with responsive resizing observers',
      'Optimized server-side parsing caching for high-density tables',
      'Dynamic PDF/CSV report generation and visual image snapshots'
    ],
    links: {
      github: 'https://github.com/rajupatel/hyperion',
      live: '#'
    }
  },
  {
    id: 'vortex',
    title: 'Vortex Horizon',
    description: 'A neon physics-driven HTML5 synthwave shooter game featuring custom audio nodes.',
    fullDescription: 'Vortex Horizon is a 2D neon arcade experience built entirely inside the HTML5 Canvas. Running a custom-scripted physics system, it renders glowing retro vector geometries, interactive particle trails, and reactive sound generators. Players dodge cosmic orbs while enjoying procedural synth music synced directly to their laser shots.',
    category: 'Game Projects',
    tags: ['Canvas API', 'TypeScript', 'Web Audio', 'Math'],
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    techStack: ['HTML5 Canvas', 'TypeScript', 'Web Audio API', 'Vector Physics'],
    stats: [
      { label: 'Performance', value: '60 FPS stable' },
      { label: 'Physics Entities', value: '500+' },
      { label: 'Bundle Size', value: '42KB gzip' }
    ],
    features: [
      'Custom rigid-body physics engine with sub-pixel collision vectors',
      'Interactive 3D mathematical background matrix grid warping',
      'Acoustic Web Audio Synthesizer modulating notes to game events',
      'High-score local storage tracker and global status telemetry'
    ],
    links: {
      github: 'https://github.com/rajupatel/vortex-horizon',
      live: '#'
    }
  }
];


// Project card utilizing individual 3D tracking
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalised mouse coords from -0.5 to 0.5
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    // Set rotation degrees
    setTilt({
      x: -y * 12,
      y: x * 12
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        playSynthBeep(1000, 'sine', 0.1);
        onClick();
      }}
      style={{ perspective: 1000 }}
      className="cursor-pointer"
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          transformStyle: 'preserve-3d'
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="group relative rounded-2xl glass-card overflow-hidden border border-white/5 hover:border-brand-orange/30 p-4 flex flex-col h-[380px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,95,0,0.15)] transition-all duration-300"
      >
        {/* Animated glow background inside card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/0 via-white/0 to-brand-red/0 group-hover:from-brand-orange/5 group-hover:to-brand-red/5 transition-all duration-500 pointer-events-none" />

        {/* Thumbnail Screen */}
        <div className="w-full h-44 rounded-xl overflow-hidden relative mb-5 border border-white/5 bg-black/40">
          {/* Glass reflection glaze */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent z-10 pointer-events-none" />
          
          <div className="w-full h-full relative transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
            {project.image.startsWith('http') || project.image.startsWith('/') || project.image.startsWith('data:') ? (
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none filter saturate-[0.8] group-hover:saturate-100 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full" style={{ background: project.image }} />
            )}
            
            {/* Ambient dark bottom vignette to ensure typography is ultra readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

            {/* Tech grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            
            {/* Central glowing category tag */}
            <motion.div 
              style={{ transform: 'translateZ(15px)' }}
              className="absolute px-3.5 py-1.5 rounded-xl bg-black/75 border border-white/10 flex items-center gap-1.5 z-20"
            >
              <Code className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
              <span className="font-display text-[9px] uppercase font-bold text-white tracking-widest">{project.category}</span>
            </motion.div>
          </div>
        </div>

        {/* Project Meta Info */}
        <div className="flex flex-col flex-grow">
          {/* Tag row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white/5 font-mono text-[9px] text-white/55 tracking-wider uppercase border border-white/5">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-brand-orange transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Bottom anchor action */}
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-brand-orange/80 group-hover:text-brand-orange">
          <span>Explore Architecture</span>
          <Play className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects({ theme }: ProjectsProps) {
  const { data } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Lock body scroll when project modal is active
  React.useEffect(() => {
    if (selectedProject) {
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
  }, [selectedProject]);

  const CATEGORIES: string[] = ['All', ...(Array.from(new Set(data.projects.map(p => p.category))) as string[])];

  const filteredProjects = activeCategory === 'All'
    ? data.projects
    : data.projects.filter(p => p.category === activeCategory);

  const selectCategory = (cat: string) => {
    playSynthBeep(800, 'sine', 0.05);
    setActiveCategory(cat);
  };

  const isDark = theme === 'dark';

  return (
    <section
      id="projects"
      className={`relative py-24 px-4 w-full overflow-hidden z-10 ${
        isDark ? 'bg-transparent text-white' : 'text-black'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col mb-12 text-center sm:text-left">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-orange mb-3">02 / CORE WORK</span>
          <h2 className={`font-display text-4xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            SELECTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">PROJECTS</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-brand-orange to-brand-red mt-4 mx-auto sm:mx-0" />
        </div>

        {/* Category Filters row */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center sm:justify-start">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`px-4.5 py-2 rounded-xl font-display text-xs uppercase font-bold tracking-wider cursor-pointer border transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-brand-orange to-brand-red border-transparent text-white shadow-[0_4px_12px_rgba(255,95,0,0.35)]'
                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3D Grid container */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Immersive Specifications Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="w-full max-w-4xl glass-card rounded-3xl border border-brand-orange/30 overflow-hidden shadow-2xl relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  playSynthBeep(600, 'sine', 0.05);
                  setSelectedProject(null);
                }}
                className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-black/60 border border-white/15 text-white/70 hover:text-white cursor-pointer hover:border-brand-orange transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Graphic Banner */}
              <div className="w-full h-48 sm:h-64 relative border-b border-white/15 overflow-hidden flex items-center justify-center bg-black/40">
                {selectedProject.image.startsWith('http') || selectedProject.image.startsWith('/') || selectedProject.image.startsWith('data:') ? (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none filter saturate-[0.8]"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full" style={{ background: selectedProject.image }} />
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 z-10" />

                {/* Tech Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_28px] z-10 pointer-events-none" />
                
                {/* Visual central typography */}
                <motion.h3 
                  initial={{ tracking: '-0.1em', opacity: 0 }}
                  animate={{ tracking: '0.15em', opacity: 1 }}
                  className="font-display text-3xl sm:text-5xl font-black text-white uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] relative z-20 text-center px-4"
                >
                  {selectedProject.title}
                </motion.h3>
              </div>

              {/* Modal Contents */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[60vh] overflow-y-auto">
                
                {/* Left: Description & Specs */}
                <div className="md:col-span-8 flex flex-col">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="font-mono text-[10px] uppercase text-brand-orange tracking-widest border border-brand-orange/30 px-2 py-0.5 rounded bg-brand-orange/5">
                      {selectedProject.category}
                    </span>
                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                      ID: {selectedProject.id}__V1
                    </span>
                  </div>

                  <p className="text-white/80 font-light text-sm sm:text-base leading-relaxed mb-6">
                    {selectedProject.fullDescription}
                  </p>

                  <h4 className="font-display text-xs font-bold uppercase text-white tracking-widest mb-3.5 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-brand-orange animate-pulse" />
                    <span>Technical Architecture Features</span>
                  </h4>

                  <ul className="space-y-2.5 mb-6">
                    {selectedProject.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                        <CheckCircle className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                        <span className="leading-normal">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack badge list */}
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 font-mono text-[10px] text-white/60 tracking-wider">
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Telemetry Metrics & Links */}
                <div className="md:col-span-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-xs font-bold uppercase text-white tracking-widest mb-4 flex items-center gap-2">
                      <Timer className="w-4 h-4 text-brand-red animate-pulse" />
                      <span>Telemetry Metrics</span>
                    </h4>

                    {/* Spec Indicators */}
                    <div className="space-y-4 mb-8">
                      {selectedProject.stats.map((stat, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between gap-1.5 relative overflow-hidden">
                          {/* Inner pulsing meter line */}
                          <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand-orange to-brand-red" style={{ width: i === 0 ? '90%' : i === 1 ? '75%' : '95%' }} />
                          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</span>
                          <span className="font-display text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col gap-3">
                    {/* Live URL */}
                    <a
                      href={selectedProject.links.live}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => playSynthBeep(1100, 'sine', 0.1)}
                      className="w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red text-white text-center font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,95,0,0.25)] hover:shadow-[0_0_25px_rgba(255,95,0,0.45)] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Launch Prototype</span>
                    </a>

                    {/* Github */}
                    <a
                      href={selectedProject.links.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => playSynthBeep(900, 'sine', 0.1)}
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white text-center font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      <Github className="w-4 h-4" />
                      <span>Explore Source Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
