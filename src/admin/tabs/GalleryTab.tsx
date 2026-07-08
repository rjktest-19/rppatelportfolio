import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { PortfolioData } from '../../lib/portfolioData';
import { GalleryItem } from '../../types';
import { playSynthBeep } from '../../components/AudioController';

interface GalleryTabProps {
  editedData: PortfolioData;
  setEditedData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  selectedGalleryId: string;
  setSelectedGalleryId: (id: string) => void;
}

export default function GalleryTab({
  editedData,
  setEditedData,
  selectedGalleryId,
  setSelectedGalleryId
}: GalleryTabProps) {
  const selectedGallery = editedData.gallery.find(g => g.id === selectedGalleryId) || editedData.gallery[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="font-display font-bold text-white text-base">Manage Gallery Exhibits</h4>
        <button
          onClick={() => {
            const newEx: GalleryItem = {
              id: `gallery-item-${Date.now()}`,
              url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
              title: 'New Gallery Showcase',
              description: 'Enter catchy artwork or branding caption...',
              category: 'Portrait'
            };
            setEditedData(prev => ({
              ...prev,
              gallery: [...prev.gallery, newEx]
            }));
            setSelectedGalleryId(newEx.id);
            playSynthBeep(1100, 'sine', 0.05);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-brand-orange/20 border border-brand-orange/40 hover:bg-brand-orange/30 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Artwork
        </button>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Gallery Navigator list */}
        <div className="w-full lg:w-1/3 border border-white/5 bg-black/10 rounded-2xl p-4 space-y-1.5 h-[50vh] overflow-y-auto">
          <span className="block text-[8px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Art Exhibit Stack</span>
          {editedData.gallery.map(g => (
            <button
              key={g.id}
              onClick={() => { setSelectedGalleryId(g.id); playSynthBeep(900, 'sine', 0.01); }}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium tracking-tight truncate flex items-center justify-between group transition-all cursor-pointer ${
                selectedGalleryId === g.id
                  ? 'bg-brand-orange/20 border border-brand-orange/30 text-white' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{g.title}</span>
              <Trash2
                onClick={(e) => {
                  e.stopPropagation();
                  setEditedData(prev => ({
                    ...prev,
                    gallery: prev.gallery.filter(item => item.id !== g.id)
                  }));
                  playSynthBeep(400, 'triangle', 0.1);
                }}
                className="w-3.5 h-3.5 text-neutral-600 hover:text-brand-red opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-2"
              />
            </button>
          ))}
        </div>

        {/* Editor form */}
        {selectedGallery ? (
          <div className="flex-1 border border-white/5 bg-neutral-900/40 rounded-2xl p-6 space-y-4 h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Exhibit Title</label>
                <input
                  type="text"
                  value={selectedGallery.title}
                  onChange={(e) => {
                    const updated = editedData.gallery.map(item => item.id === selectedGallery.id ? { ...item, title: e.target.value } : item);
                    setEditedData(prev => ({ ...prev, gallery: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Artwork Category</label>
                <select
                  value={selectedGallery.category}
                  onChange={(e) => {
                    const updated = editedData.gallery.map(item => item.id === selectedGallery.id ? { ...item, category: e.target.value as any } : item);
                    setEditedData(prev => ({ ...prev, gallery: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Branding">Branding</option>
                  <option value="Illustration">Illustration</option>
                </select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[9px] font-mono uppercase text-neutral-400">Image Source (URL or Upload File)</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Paste Image URL or select a file..."
                      value={selectedGallery.url}
                      onChange={(e) => {
                        const updated = editedData.gallery.map(item => item.id === selectedGallery.id ? { ...item, url: e.target.value } : item);
                        setEditedData(prev => ({ ...prev, gallery: updated }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id={`gallery-upload-${selectedGallery.id}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            if (base64) {
                              const updated = editedData.gallery.map(item => item.id === selectedGallery.id ? { ...item, url: base64 } : item);
                              setEditedData(prev => ({ ...prev, gallery: updated }));
                              playSynthBeep(1200, 'sine', 0.05);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor={`gallery-upload-${selectedGallery.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 border border-white/5 hover:border-brand-orange/40 hover:bg-neutral-700/80 rounded-xl text-xs text-neutral-200 cursor-pointer font-mono font-bold transition-all whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                      Upload
                    </label>
                  </div>
                </div>

                {selectedGallery.url && (
                  <div className="mt-2 border border-white/5 bg-neutral-900/60 p-2 rounded-2xl flex items-center gap-4">
                    <img 
                      src={selectedGallery.url} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-xl border border-white/10" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div>
                      <span className="block text-[8px] font-mono text-neutral-400 uppercase">Live Preview</span>
                      <span className="text-[10px] text-neutral-400 line-clamp-1 break-all max-w-[200px] font-mono">
                        {selectedGallery.url.startsWith('data:') ? 'Base64 Encoded Image Data' : selectedGallery.url}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Description Caption</label>
              <textarea
                value={selectedGallery.description}
                onChange={(e) => {
                  const updated = editedData.gallery.map(item => item.id === selectedGallery.id ? { ...item, description: e.target.value } : item);
                  setEditedData(prev => ({ ...prev, gallery: updated }));
                }}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none font-sans leading-relaxed"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-white/5 bg-neutral-900/40 rounded-2xl h-[50vh] text-neutral-500 text-xs">
            No artwork selected. Add or select one to edit.
          </div>
        )}
      </div>
    </div>
  );
}
