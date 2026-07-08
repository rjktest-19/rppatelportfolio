import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Eye, Calendar, Tag, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryItem } from '../types';
import { playSynthBeep } from './AudioController';
import { usePortfolio } from '../lib/portfolioData';
import rajuPortrait from '../assets/images/raju_portrait_1783246047760.jpg';
import rajuOrangeAvatar from '../assets/images/raju_orange_avatar_1783246064560.jpg';
import rajuRedAvatar from '../assets/images/raju_red_avatar_1783246083647.jpg';

interface GalleryProps {
  theme: 'dark' | 'light';
}

export default function Gallery({ theme }: GalleryProps) {
  const { data } = usePortfolio();
  const GALLERY_ITEMS = data.gallery;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
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
  }, [lightboxIndex]);

  const openLightbox = (index: number) => {
    playSynthBeep(1100, 'sine', 0.1);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    playSynthBeep(600, 'sine', 0.05);
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (lightboxIndex === null) return;
    playSynthBeep(850, 'sine', 0.04);
    if (direction === 'next') {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
    } else {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  const isDark = theme === 'dark';

  return (
    <section
      id="gallery"
      className={`relative py-24 px-4 w-full overflow-hidden z-10 ${
        isDark ? 'bg-transparent text-white' : 'text-black'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-center sm:text-left">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-orange mb-3">04 / BRAND SHOWCASE</span>
          <h2 className={`font-display text-4xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            IDENTITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">GALLERY</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-brand-orange to-brand-red mt-4 mx-auto sm:mx-0" />
        </div>

        {/* Dynamic Gallery Grid */}
        {GALLERY_ITEMS && GALLERY_ITEMS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {GALLERY_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden glass-card border border-white/5 shadow-2xl cursor-pointer flex flex-col justify-between h-full min-h-[360px]"
              >
                <div className="relative overflow-hidden w-full h-[240px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/5 transition-all duration-500 pointer-events-none" />
                  
                  {/* Glowing ring aura on hover */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-brand-orange/0 to-brand-red/0 group-hover:from-brand-orange/20 group-hover:to-brand-red/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  <div className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-black/60 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-black/35 border-t border-white/5">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-orange mb-1 flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <h3 className="font-display text-base font-bold text-white uppercase tracking-wider group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-xs font-light line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Philosophy Promo Card placeholder within the grid */}
            <div className="p-6 sm:p-8 rounded-2xl glass-card border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-lg h-full min-h-[360px] bg-black/20">
              <div className="absolute top-0 right-0 w-44 h-44 bg-brand-orange/5 rounded-full blur-[64px] pointer-events-none" />
              <div>
                <h3 className="font-display text-sm font-bold uppercase text-white tracking-widest mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-orange animate-pulse" />
                  <span>Cinematic Identity Philosophy</span>
                </h3>
                <p className="text-white/60 text-xs font-light leading-relaxed mb-4">
                  "An application interface should never look like generic rows of input boxes. It is an artistic medium. The choice of shadows, glowing accents, and high-contrast overlays dictate how a user feels. Raju Patel believes design is not just what it looks like, but how the elements interact and communicate with our senses."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto font-mono text-[9px] text-white/40 tracking-widest uppercase border-t border-white/5 pt-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> ESTABLISHED: 2026</span>
                <span>● TOKENS CHECKED</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 bg-black/10 rounded-2xl">
            <p className="text-sm font-mono text-neutral-400">No showcase exhibits saved in the portfolio gallery.</p>
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            {/* Close trigger clicking anywhere in backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={closeLightbox} />

            <div className="relative w-full max-w-5xl z-10 flex flex-col items-center">
              
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-14 right-0 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:text-brand-orange hover:border-brand-orange cursor-pointer transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image Viewport with controllers */}
              <div className="relative w-full flex items-center justify-center h-[55vh] sm:h-[65vh]">
                
                {/* Left Controller */}
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-2 sm:left-4 p-3 rounded-xl bg-black/60 border border-white/10 text-white hover:text-brand-orange hover:border-brand-orange cursor-pointer transition-all z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right Controller */}
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-2 sm:right-4 p-3 rounded-xl bg-black/60 border border-white/10 text-white hover:text-brand-orange hover:border-brand-orange cursor-pointer transition-all z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Main Lightbox Image */}
                <motion.div
                  key={lightboxIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-[85%] max-h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex items-center justify-center"
                >
                  <img
                    src={GALLERY_ITEMS[lightboxIndex]?.url || ''}
                    alt={GALLERY_ITEMS[lightboxIndex]?.title || ''}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[55vh] sm:max-h-[65vh] object-contain select-none pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </motion.div>
              </div>

              {/* Lightbox Information Frame */}
              <div className="w-full max-w-2xl text-center mt-6 flex flex-col items-center px-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-orange mb-1 border border-brand-orange/30 px-2.5 py-0.5 rounded bg-brand-orange/5">
                  {GALLERY_ITEMS[lightboxIndex]?.category || ''}
                </span>
                <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider mb-2">
                  {GALLERY_ITEMS[lightboxIndex]?.title || ''}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm font-light max-w-lg leading-relaxed">
                  {GALLERY_ITEMS[lightboxIndex]?.description || ''}
                </p>
                <span className="font-mono text-[10px] text-white/30 tracking-widest mt-4">
                  SLIDE {lightboxIndex + 1} OF {GALLERY_ITEMS.length}
                </span>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
