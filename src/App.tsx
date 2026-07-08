import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, ArrowUp, Sparkles } from 'lucide-react';

// Components
import LoadingScreen from './components/LoadingScreen';
import AudioController, { playSynthBeep } from './components/AudioController';
import CustomCursor from './components/CustomCursor';
import Background3D from './components/Background3D';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './admin/AdminPanel';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Track hash or search query changes for secure #/admin or ?admin=true routes
  useEffect(() => {
    const checkAdminRoute = () => {
      const isHashAdmin = window.location.hash === '#/admin';
      const isQueryAdmin = window.location.search.includes('admin=true');
      if (isHashAdmin || isQueryAdmin) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    // Reset hash or query to avoid loop
    if (window.location.hash === '#/admin') {
      window.location.hash = '';
    }
    if (window.location.search.includes('admin=true')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.pathname + url.hash);
    }
  };

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('raju_portfolio_theme');
    if (savedTheme === 'light') {
      setTheme('light');
    }
  }, []);

  // Track scroll position for header sticky blurs and ScrollToTop visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('raju_portfolio_theme', nextTheme);
    playSynthBeep(nextTheme === 'dark' ? 500 : 1000, 'sine', 0.12);
  };

  const handleScrollTo = (id: string) => {
    playSynthBeep(800, 'sine', 0.05);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen font-sans antialiased overflow-x-hidden selection:bg-brand-orange/30 selection:text-white transition-colors duration-500 ${
      theme === 'dark' ? 'bg-dark-bg text-white' : 'bg-white text-black'
    }`}>
      
      {/* 1. Preloading Entrance */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full"
        >
          {/* 2. Interactive 3D Physics Canvas Background */}
          <Background3D theme={theme} />

          {/* 3. Custom Tracking Cursor */}
          <CustomCursor />

          {/* 4. Ambient Web Audio synth triggers */}
          <AudioController />

          {/* 5. Sticky Floating Navigation Header */}
          <header id="master-header" className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/5 backdrop-blur-md ${
            theme === 'dark' ? 'bg-black/40' : 'bg-white/40'
          }`}>
            <div className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              
              {/* Brand Logo */}
              <div 
                onClick={() => handleScrollTo('home')}
                className="flex items-center gap-2 cursor-pointer relative group"
              >
                <span className="font-display text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">
                  RP
                </span>
                <span className={`font-mono text-[9px] tracking-[0.3em] uppercase mt-1 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-black/50'}`}>
                  Raju Patel
                </span>
                {/* Micro-glow underline on hover */}
                <div className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gradient-to-r from-brand-orange to-brand-red group-hover:with-full transition-all duration-300" style={{ width: '0%' }} />
              </div>

              {/* Desktop Navigation Link rails */}
              <nav className={`hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest ${
                theme === 'dark' ? 'text-white/60' : 'text-black/60'
              }`}>
                <button onClick={() => handleScrollTo('home')} className="hover:text-brand-orange cursor-pointer transition-colors">Home</button>
                <button onClick={() => handleScrollTo('about')} className="hover:text-brand-orange cursor-pointer transition-colors">About</button>
                <button onClick={() => handleScrollTo('projects')} className="hover:text-brand-orange cursor-pointer transition-colors">Projects</button>
                <button onClick={() => handleScrollTo('skills')} className="hover:text-brand-orange cursor-pointer transition-colors">Skills</button>
                <button onClick={() => handleScrollTo('gallery')} className="hover:text-brand-orange cursor-pointer transition-colors">Gallery</button>
                <button onClick={() => handleScrollTo('contact')} className="hover:text-brand-orange cursor-pointer transition-colors">Contact</button>
              </nav>

              {/* Desktop Controls (Theme + Status Indicators) */}
              <div className="flex items-center gap-4">
                
                {/* Luxury Theme Switcher */}
                <button
                  onClick={toggleTheme}
                  onMouseEnter={() => playSynthBeep(1200, 'sine', 0.02)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-brand-orange hover:border-brand-orange' 
                      : 'bg-black/5 border-black/10 text-brand-orange hover:border-brand-orange'
                  }`}
                  title={theme === 'dark' ? "Light Mode" : "Dark Mode"}
                >
                  {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                </button>

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => {
                    playSynthBeep(900, 'sine', 0.05);
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className={`md:hidden p-2.5 rounded-xl border cursor-pointer transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                  }`}
                >
                  {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
                </button>
              </div>

            </div>
          </header>

          {/* 6. Mobile Side Drawer Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed top-[71px] right-0 bottom-0 w-72 z-30 border-l border-white/10 shadow-2xl flex flex-col p-6 backdrop-blur-xl ${
                  theme === 'dark' ? 'bg-black/90' : 'bg-white/95'
                }`}
              >
                {/* Tech specifications in menu header */}
                <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                  <Sparkles className="w-4 h-4 text-brand-orange animate-spin" />
                  <span className={`font-mono text-[9px] uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
                    GATEWAY SYSTEM CALIBRATION
                  </span>
                </div>

                <div className="flex flex-col gap-5 font-display text-lg font-bold uppercase tracking-wide">
                  <button onClick={() => handleScrollTo('home')} className={`text-left cursor-pointer hover:text-brand-orange transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Home</button>
                  <button onClick={() => handleScrollTo('about')} className={`text-left cursor-pointer hover:text-brand-orange transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>About</button>
                  <button onClick={() => handleScrollTo('projects')} className={`text-left cursor-pointer hover:text-brand-orange transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Projects</button>
                  <button onClick={() => handleScrollTo('skills')} className={`text-left cursor-pointer hover:text-brand-orange transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Skills</button>
                  <button onClick={() => handleScrollTo('gallery')} className={`text-left cursor-pointer hover:text-brand-orange transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Gallery</button>
                  <button onClick={() => handleScrollTo('contact')} className={`text-left cursor-pointer hover:text-brand-orange transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Contact</button>
                </div>

                {/* Mobile Socials in bottom side menu */}
                <div className="mt-auto border-t border-white/5 pt-6 font-mono text-[9px] text-white/30 tracking-wider">
                  <span>RP_GATEWAY_V3.0 // SHIELD INGRESS</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 7. Core Interactive Modules */}
          <main className="relative z-10">
            <Hero theme={theme} />
            <About theme={theme} />
            <Projects theme={theme} />
            <Skills theme={theme} />
            <Gallery theme={theme} />
            <Contact theme={theme} />
          </main>

          {/* 8. Global Brand Footer */}
          <Footer theme={theme} />

          {/* 10. Secure Admin Portal Panel */}
          <AdminPanel isOpen={isAdminOpen} onClose={handleCloseAdmin} theme={theme} />

          {/* 9. Floating Scroll-To-Top Trigger */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                onClick={() => handleScrollTo('home')}
                onMouseEnter={() => playSynthBeep(1200, 'sine', 0.02)}
                className={`fixed bottom-24 right-6 p-3 rounded-full cursor-pointer transition-all z-30 shadow-lg border ${
                  theme === 'dark'
                    ? 'bg-black/85 border-brand-orange/30 text-brand-orange hover:bg-black hover:border-brand-orange'
                    : 'bg-white/90 border-brand-orange/30 text-brand-orange hover:bg-white hover:border-brand-orange'
                }`}
                title="Scroll to Top"
              >
                <ArrowUp className="w-5 h-5 animate-pulse" />
              </motion.button>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </div>
  );
}
