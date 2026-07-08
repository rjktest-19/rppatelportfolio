import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Skill, GalleryItem, IdentityPhoto } from '../types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize client-side Firebase
let clientDb: any = null;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  if (firebaseConfig.firestoreDatabaseId) {
    clientDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    clientDb = getFirestore(app);
  }
  console.log("Client-side Firestore initialized successfully");
} catch (err) {
  console.error("Failed to initialize client-side Firestore:", err);
}

// Asset imports for fallback default images
import rajuAvatar from '../assets/images/raju_avatar.png';
import rajuOrangeAvatar from '../assets/images/raju_orange_avatar_1783246064560.jpg';
import rajuPortrait from '../assets/images/raju_portrait_1783246047760.jpg';
import rajuRedAvatar from '../assets/images/raju_red_avatar_1783246083647.jpg';

export interface ProfileInfo {
  name: string;
  role: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  bioSummary: string;
  githubUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  web3FormsKey: string;
  projectsCompleted: number;
  yearsExperience: number;
  globalContributions: string;
  clientSatisfaction: number;
}

export interface CompetencyItem {
  title: string;
  desc: string;
}

export interface SelectedProjectWork {
  name: string;
  desc: string;
}

export interface PortfolioData {
  profile: ProfileInfo;
  competencies: CompetencyItem[];
  resumeProjects: SelectedProjectWork[];
  projects: Project[];
  skills: Skill[];
  gallery: GalleryItem[];
  identityPhotos: IdentityPhoto[];
}

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: 'RAJU PATEL',
    role: 'Senior Creative Developer',
    subtitle: 'CORE ENGINE DEVELOPER & CREATIVE DESIGNER',
    email: 'rb62876565@gmail.com',
    phone: '+91 62876 56500',
    location: 'Patna, Bihar, India',
    avatarUrl: rajuAvatar,
    bioSummary: 'Highly skilled and dynamic creative developer operating at the intersection of high-performance system architectures and premium visual interfaces. Extensive expertise in constructing lightweight, responsive frameworks, scalable mobile solutions, and fully integrated generative AI engines. Passionate about craftsmanship, pixel-perfect layouts, and synthesizing immersive user-centric digital products.',
    githubUrl: 'https://github.com/6287rajubabu',
    youtubeUrl: 'https://youtube.com/@rajupatel__910',
    instagramUrl: 'https://instagram.com/rajupatel__910',
    web3FormsKey: 'rb62876565@gmail.com', // fallback Web3Forms access email
    projectsCompleted: 42,
    yearsExperience: 5,
    globalContributions: '1.2K',
    clientSatisfaction: 100
  },
  competencies: [
    {
      title: 'Cross-Platform App Development',
      desc: 'Building clean native apps using Flutter and Dart. Expert in advanced state management, offline-first architectures, caching, and secure local data syncing.'
    },
    {
      title: 'Full-Stack Web Architectures',
      desc: 'Designing fast, scalable web projects with React, Vite, Node.js, and TypeScript. Styled with tailored layouts, beautiful micro-interactions, and high-performance assets.'
    },
    {
      title: 'Intelligent AI Integration',
      desc: 'Seamless implementation of secure AI models (Google GenAI SDK, Gemini API) using server-side endpoints to power intelligent assistants, content generators, and smart analytics.'
    }
  ],
  resumeProjects: [
    {
      name: 'Interactive Design Dashboard v3.0',
      desc: 'A premium portfolio featuring highly fluid motion layouts, interactive WebGL physics backgrounds, custom web synthesizers for micro-audio cues, and dual-theme persistence.'
    },
    {
      name: 'Secure Communication Gateways',
      desc: 'Full-stack validated forms with automatic spam filtering, dynamic localStorage state handling, real-time input status indicators, and direct transactional email deliverability.'
    }
  ],
  projects: [
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
  ],
  skills: [
    { name: 'Flutter & Dart', category: 'frontend', level: 95, iconName: 'flutter', color: '#ff5f00' },
    { name: 'React & TypeScript', category: 'frontend', level: 92, iconName: 'react', color: '#00b4d8' },
    { name: 'Firebase Ecosystem', category: 'backend', level: 90, iconName: 'firebase', color: '#ffc300' },
    { name: 'UI/UX & Figma', category: 'design', level: 94, iconName: 'design', color: '#ff2a2a' },
    { name: 'AI & Gemini API', category: 'tools', level: 88, iconName: 'ai', color: '#7b2cbf' }
  ],
  gallery: [
    {
      id: 'exhibit-nebula',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      title: 'Nebula Dashboard UI',
      description: 'A dark-mode high-fidelity tablet interface showcasing real-time data telemetry widgets, customized charts, and radial gauges.',
      category: 'Branding'
    },
    {
      id: 'exhibit-glow',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      title: 'Glow Gaming Identity Kit',
      description: 'Complete visual branding package for Esports tournaments including vector hoodies, custom 3D typography templates, and broadcast overlay assets.',
      category: 'Illustration'
    },
    {
      id: 'exhibit-cyberpunk',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      title: 'Cyberpunk Arcade Console',
      description: 'Retro-futuristic concept art for an arcade gameplay physical cabinet with intensive neon emissive lighting and vector decals.',
      category: 'Branding'
    }
  ],
  identityPhotos: [
    {
      id: 'portrait',
      url: rajuPortrait,
      title: 'Sweat Close-up Portrait',
      description: 'A dramatic, raw, high-contrast B&W studio portrait representing pure developer grit, hard work, and intensive focus.'
    },
    {
      id: 'orange',
      url: rajuOrangeAvatar,
      title: 'Orange Creator Halo',
      description: 'Modern circular avatar design with glowing neon orange trims and brush stroke RP art, highlighting web creativity.'
    },
    {
      id: 'red',
      url: rajuRedAvatar,
      title: 'Red Esports Identity',
      description: 'Intense red circular avatar matching standard gaming team logos, custom 3D typography, and hoodie apparel branding.'
    }
  ]
};

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);

  useEffect(() => {
    const loadInitialData = async () => {
      let initialData = defaultPortfolioData;
      try {
        const stored = localStorage.getItem('raju_portfolio_data');
        if (stored) {
          initialData = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Error loading static local storage cache', e);
      }

      const processMerge = (parsed: any): PortfolioData => {
        let mergedGallery = parsed.gallery || defaultPortfolioData.gallery;
        // Auto-migrate if old overlapping avatar exhibit IDs are found
        if (
          !mergedGallery ||
          mergedGallery.length === 0 ||
          mergedGallery.some((item: any) => item.id === 'exhibit-portrait' || item.id === 'exhibit-orange' || item.id === 'exhibit-red')
        ) {
          mergedGallery = defaultPortfolioData.gallery;
        }

        // Clean any broken/unresponsive unsplash URLs in cache
        mergedGallery = mergedGallery.map((item: any) => {
          if (item.url && (item.url.includes('photo-1542751371-adc38448a05e') || item.url.includes('photo-1612287230202-1bf1d85d1bdf'))) {
            return {
              ...item,
              url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
            };
          }
          return item;
        });

        let mergedProjects = parsed.projects || defaultPortfolioData.projects;
        mergedProjects = mergedProjects.map((item: any) => {
          if (item.image && item.image.includes('photo-1542751371-adc38448a05e')) {
            return {
              ...item,
              image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
            };
          }
          return item;
        });

        return {
          ...defaultPortfolioData,
          ...parsed,
          profile: {
            ...defaultPortfolioData.profile,
            ...(parsed.profile || {})
          },
          projects: mergedProjects,
          skills: parsed.skills || defaultPortfolioData.skills,
          gallery: mergedGallery,
          identityPhotos: parsed.identityPhotos || defaultPortfolioData.identityPhotos,
          competencies: parsed.competencies || defaultPortfolioData.competencies,
          resumeProjects: parsed.resumeProjects || defaultPortfolioData.resumeProjects,
        };
      };

      setData(processMerge(initialData));

      let loadedFromFirestore = false;
      if (clientDb) {
        try {
          const docRef = doc(clientDb, 'portfolio', 'data');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const freshData = docSnap.data();
            const merged = processMerge(freshData);
            setData(merged);
            localStorage.setItem('raju_portfolio_data', JSON.stringify(merged));
            loadedFromFirestore = true;
            console.log('Successfully loaded portfolio data directly from Cloud Firestore (Primary)');
          }
        } catch (fsErr) {
          console.error('Error fetching directly from Cloud Firestore, falling back to server API:', fsErr);
        }
      }

      if (!loadedFromFirestore) {
        try {
          const res = await fetch('/api/portfolio');
          if (res.ok) {
            const freshData = await res.json();
            const merged = processMerge(freshData);
            setData(merged);
            localStorage.setItem('raju_portfolio_data', JSON.stringify(merged));
            console.log('Successfully loaded portfolio data from Backend Proxy API (Fallback)');
          }
        } catch (err) {
          console.warn('Could not fetch from server API or Firestore. Using local storage/default data.', err);
        }
      }
    };

    loadInitialData();
  }, []);

  const updateData = async (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('raju_portfolio_data', JSON.stringify(newData));

    let savedToFirestore = false;
    if (clientDb) {
      try {
        const docRef = doc(clientDb, 'portfolio', 'data');
        await setDoc(docRef, newData);
        savedToFirestore = true;
        console.log('Successfully saved portfolio data directly to Cloud Firestore (Primary)');
      } catch (fsErr) {
        console.error('Error saving directly to Cloud Firestore:', fsErr);
      }
    }

    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      console.log('Synced portfolio data with Backend Proxy API');
    } catch (err) {
      console.warn('Could not sync with backend proxy API (expected on static deployments like Vercel):', err);
    }
  };

  const resetData = async () => {
    setData(defaultPortfolioData);
    localStorage.setItem('raju_portfolio_data', JSON.stringify(defaultPortfolioData));

    let resetInFirestore = false;
    if (clientDb) {
      try {
        const docRef = doc(clientDb, 'portfolio', 'data');
        await setDoc(docRef, defaultPortfolioData);
        resetInFirestore = true;
        console.log('Successfully reset portfolio data directly in Cloud Firestore (Primary)');
      } catch (fsErr) {
        console.error('Error resetting directly in Cloud Firestore:', fsErr);
      }
    }

    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(defaultPortfolioData)
      });
      console.log('Synced reset with Backend Proxy API');
    } catch (err) {
      console.warn('Could not sync reset with backend proxy API (expected on static deployments like Vercel):', err);
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
