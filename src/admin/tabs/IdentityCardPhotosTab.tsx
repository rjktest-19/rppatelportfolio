import React from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { PortfolioData } from '../../lib/portfolioData';
import { IdentityPhoto } from '../../types';
import { playSynthBeep } from '../../components/AudioController';

// Fallback assets
import rajuPortrait from '../../assets/images/raju_portrait_1783246047760.jpg';
import rajuOrangeAvatar from '../../assets/images/raju_orange_avatar_1783246064560.jpg';
import rajuRedAvatar from '../../assets/images/raju_red_avatar_1783246083647.jpg';

interface IdentityCardPhotosTabProps {
  editedData: PortfolioData;
  setEditedData: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

const DEFAULT_PHOTOS = {
  portrait: rajuPortrait,
  orange: rajuOrangeAvatar,
  red: rajuRedAvatar
};

export default function IdentityCardPhotosTab({ editedData, setEditedData }: IdentityCardPhotosTabProps) {
  // Ensure identityPhotos array is initialized
  const identityPhotos = editedData.identityPhotos || [
    { id: 'portrait', url: DEFAULT_PHOTOS.portrait, title: 'Sweat Close-up Portrait', description: 'Dramatic, raw B&W portrait.' },
    { id: 'orange', url: DEFAULT_PHOTOS.orange, title: 'Orange Creator Halo', description: 'Modern circular avatar with orange glow.' },
    { id: 'red', url: DEFAULT_PHOTOS.red, title: 'Red Esports Identity', description: 'Esports circular avatar with red accents.' }
  ];

  const portraitItem = identityPhotos.find(item => item.id === 'portrait') || { id: 'portrait', url: DEFAULT_PHOTOS.portrait, title: 'Sweat Close-up Portrait', description: 'Dramatic, raw B&W portrait.' };
  const orangeItem = identityPhotos.find(item => item.id === 'orange') || { id: 'orange', url: DEFAULT_PHOTOS.orange, title: 'Orange Creator Halo', description: 'Modern circular avatar with orange glow.' };
  const redItem = identityPhotos.find(item => item.id === 'red') || { id: 'red', url: DEFAULT_PHOTOS.red, title: 'Red Esports Identity', description: 'Esports circular avatar with red accents.' };

  // Handle specific card updates
  const updateCard = (id: 'portrait' | 'orange' | 'red', updates: Partial<IdentityPhoto>) => {
    const updated = identityPhotos.map(item => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    });
    setEditedData((prev: PortfolioData) => ({ ...prev, identityPhotos: updated }));
  };

  // Handle specific card file uploads
  const handleFileUpload = (id: 'portrait' | 'orange' | 'red', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          updateCard(id, { url: base64 });
          playSynthBeep(1200, 'sine', 0.05);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset to original build images
  const resetToFactoryDefaults = () => {
    const updated: IdentityPhoto[] = [
      {
        id: 'portrait',
        url: DEFAULT_PHOTOS.portrait,
        title: 'Sweat Close-up Portrait',
        description: 'A dramatic, raw, high-contrast B&W studio portrait representing pure developer grit, hard work, and intensive focus.'
      },
      {
        id: 'orange',
        url: DEFAULT_PHOTOS.orange,
        title: 'Orange Creator Halo',
        description: 'Modern circular avatar design with glowing neon orange trims and brush stroke RP art, highlighting web creativity.'
      },
      {
        id: 'red',
        url: DEFAULT_PHOTOS.red,
        title: 'Red Esports Identity',
        description: 'Intense red circular avatar matching standard gaming team logos, custom 3D typography, and hoodie apparel branding.'
      }
    ];
    setEditedData((prev: PortfolioData) => ({ ...prev, identityPhotos: updated }));
    playSynthBeep(900, 'triangle', 0.15);
  };

  return (
    <div className="space-y-8">
      {/* Tab Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h3 className="text-sm font-display font-black uppercase tracking-wider text-white">
            Identity Photos (Identity Card Avatars)
          </h3>
          <p className="text-[10px] font-mono text-neutral-400 uppercase mt-1">
            Manage the three primary dynamic avatar images displayed inside the identity switcher on the homepage.
          </p>
        </div>

        <div>
          <button
            onClick={resetToFactoryDefaults}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700/80 border border-white/5 rounded-xl text-[10px] text-neutral-300 font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
            title="Reset default identity assets"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Main Core Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: PORTRAIT */}
        <div className="p-5 border border-white/5 bg-neutral-900/40 rounded-2xl space-y-4 flex flex-col justify-between hover:border-brand-orange/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                1. PORTRAIT IDENTITY
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-mono text-neutral-400 uppercase">
                Active Slot
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-black group">
                <img
                  src={portraitItem.url}
                  alt={portraitItem.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  <span className="text-[11px] font-display font-bold text-white line-clamp-1">{portraitItem.title}</span>
                  <span className="text-[9px] font-mono text-neutral-400">Portrait Slot</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={portraitItem.title}
                    onChange={(e) => updateCard('portrait', { title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Image URL or Local Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={portraitItem.url}
                      onChange={(e) => updateCard('portrait', { url: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-[10px] font-mono text-white focus:outline-none focus:border-brand-orange"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="portrait-upload"
                      className="hidden"
                      onChange={(e) => handleFileUpload('portrait', e)}
                    />
                    <label
                      htmlFor="portrait-upload"
                      className="px-2.5 bg-neutral-800 hover:bg-neutral-700 border border-white/5 rounded-lg flex items-center justify-center cursor-pointer"
                      title="Upload file"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Description</label>
                  <textarea
                    value={portraitItem.description}
                    onChange={(e) => updateCard('portrait', { description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-[10px] text-white focus:outline-none focus:border-brand-orange resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: ORANGE */}
        <div className="p-5 border border-white/5 bg-neutral-900/40 rounded-2xl space-y-4 flex flex-col justify-between hover:border-brand-orange/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                2. ORANGE IDENTITY
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-mono text-neutral-400 uppercase">
                Active Slot
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-black group">
                <img
                  src={orangeItem.url}
                  alt={orangeItem.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  <span className="text-[11px] font-display font-bold text-white line-clamp-1">{orangeItem.title}</span>
                  <span className="text-[9px] font-mono text-neutral-400">Orange Slot</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={orangeItem.title}
                    onChange={(e) => updateCard('orange', { title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Image URL or Local Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orangeItem.url}
                      onChange={(e) => updateCard('orange', { url: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-[10px] font-mono text-white focus:outline-none focus:border-brand-orange"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="orange-upload"
                      className="hidden"
                      onChange={(e) => handleFileUpload('orange', e)}
                    />
                    <label
                      htmlFor="orange-upload"
                      className="px-2.5 bg-neutral-800 hover:bg-neutral-700 border border-white/5 rounded-lg flex items-center justify-center cursor-pointer"
                      title="Upload file"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Description</label>
                  <textarea
                    value={orangeItem.description}
                    onChange={(e) => updateCard('orange', { description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-[10px] text-white focus:outline-none focus:border-brand-orange resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: RED */}
        <div className="p-5 border border-white/5 bg-neutral-900/40 rounded-2xl space-y-4 flex flex-col justify-between hover:border-brand-orange/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                3. RED IDENTITY
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-mono text-neutral-400 uppercase">
                Active Slot
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-black group">
                <img
                  src={redItem.url}
                  alt={redItem.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  <span className="text-[11px] font-display font-bold text-white line-clamp-1">{redItem.title}</span>
                  <span className="text-[9px] font-mono text-neutral-400">Red Slot</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={redItem.title}
                    onChange={(e) => updateCard('red', { title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Image URL or Local Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={redItem.url}
                      onChange={(e) => updateCard('red', { url: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-[10px] font-mono text-white focus:outline-none focus:border-brand-orange"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="red-upload"
                      className="hidden"
                      onChange={(e) => handleFileUpload('red', e)}
                    />
                    <label
                      htmlFor="red-upload"
                      className="px-2.5 bg-neutral-800 hover:bg-neutral-700 border border-white/5 rounded-lg flex items-center justify-center cursor-pointer"
                      title="Upload file"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Description</label>
                  <textarea
                    value={redItem.description}
                    onChange={(e) => updateCard('red', { description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-[10px] text-white focus:outline-none focus:border-brand-orange resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
