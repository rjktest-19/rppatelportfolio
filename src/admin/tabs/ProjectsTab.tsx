import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { PortfolioData } from '../../lib/portfolioData';
import { Project } from '../../types';
import { playSynthBeep } from '../../components/AudioController';

interface ProjectsTabProps {
  editedData: PortfolioData;
  setEditedData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
}

export default function ProjectsTab({
  editedData,
  setEditedData,
  selectedProjectId,
  setSelectedProjectId
}: ProjectsTabProps) {
  const selectedProject = editedData.projects.find(p => p.id === selectedProjectId) || editedData.projects[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="font-display font-bold text-white text-base">Manage Portfolio Projects</h4>
        <button
          onClick={() => {
            const newProj: Project = {
              id: `custom-proj-${Date.now()}`,
              title: 'New Custom Project',
              description: 'Enter short catchy summary description...',
              fullDescription: 'Enter highly detailed project description here...',
              category: 'Web Apps',
              tags: ['React', 'TypeScript'],
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
              techStack: ['React', 'TypeScript', 'Tailwind'],
              stats: [{ label: 'Performance', value: '100%' }],
              features: ['Advanced responsive UI layout', 'Localized state manager'],
              links: { github: '#', live: '#' }
            };
            setEditedData(prev => ({
              ...prev,
              projects: [newProj, ...prev.projects]
            }));
            setSelectedProjectId(newProj.id);
            playSynthBeep(1100, 'sine', 0.05);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-brand-orange/20 border border-brand-orange/40 hover:bg-brand-orange/30 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Project Navigator list */}
        <div className="w-full lg:w-1/3 border border-white/5 bg-black/10 rounded-2xl p-4 space-y-1.5 h-[50vh] overflow-y-auto">
          <span className="block text-[8px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Project Database</span>
          {editedData.projects.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedProjectId(p.id); playSynthBeep(900, 'sine', 0.01); }}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium tracking-tight truncate flex items-center justify-between group transition-all cursor-pointer ${
                selectedProjectId === p.id || (!selectedProjectId && editedData.projects[0]?.id === p.id)
                  ? 'bg-brand-orange/20 border border-brand-orange/30 text-white' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{p.title}</span>
              <Trash2
                onClick={(e) => {
                  e.stopPropagation();
                  setEditedData(prev => ({
                    ...prev,
                    projects: prev.projects.filter(proj => proj.id !== p.id)
                  }));
                  playSynthBeep(400, 'triangle', 0.1);
                }}
                className="w-3.5 h-3.5 text-neutral-600 hover:text-brand-red opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-2"
              />
            </button>
          ))}
        </div>

        {/* Editor form */}
        {selectedProject ? (
          <div className="flex-1 border border-white/5 bg-neutral-900/40 rounded-2xl p-6 space-y-4 h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Project Title</label>
                <input
                  type="text"
                  value={selectedProject.title}
                  onChange={(e) => {
                    const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, title: e.target.value } : p);
                    setEditedData(prev => ({ ...prev, projects: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Category</label>
                <select
                  value={selectedProject.category}
                  onChange={(e) => {
                    const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, category: e.target.value as any } : p);
                    setEditedData(prev => ({ ...prev, projects: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                >
                  <option value="Web Apps">Web Apps</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Game Projects">Game Projects</option>
                </select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[9px] font-mono uppercase text-neutral-400">Project Thumbnail Image Source (URL or Upload File)</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Paste Image URL or select a file..."
                      value={selectedProject.image}
                      onChange={(e) => {
                        const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, image: e.target.value } : p);
                        setEditedData(prev => ({ ...prev, projects: updated }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id={`project-image-upload-${selectedProject.id}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            if (base64) {
                              const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, image: base64 } : p);
                              setEditedData(prev => ({ ...prev, projects: updated }));
                              playSynthBeep(1200, 'sine', 0.05);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor={`project-image-upload-${selectedProject.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 border border-white/5 hover:border-brand-orange/40 hover:bg-neutral-700/80 rounded-xl text-xs text-neutral-200 cursor-pointer font-mono font-bold transition-all whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                      Upload
                    </label>
                  </div>
                </div>

                {selectedProject.image && (
                  <div className="mt-2 border border-white/5 bg-neutral-900/60 p-2 rounded-2xl flex items-center gap-4">
                    <img 
                      src={selectedProject.image} 
                      alt="Project Preview" 
                      className="w-20 h-12 object-cover rounded-xl border border-white/10" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div>
                      <span className="block text-[8px] font-mono text-neutral-400 uppercase">Project Image Preview</span>
                      <span className="text-[10px] text-neutral-400 line-clamp-1 break-all max-w-[200px] font-mono">
                        {selectedProject.image.startsWith('data:') ? 'Base64 Encoded Image Data' : selectedProject.image}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">GitHub Repository Link</label>
                <input
                  type="text"
                  value={selectedProject.links?.github || ''}
                  onChange={(e) => {
                    const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, links: { ...p.links, github: e.target.value } } : p);
                    setEditedData(prev => ({ ...prev, projects: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Live Demo / Target Link</label>
                <input
                  type="text"
                  value={selectedProject.links?.live || ''}
                  onChange={(e) => {
                    const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, links: { ...p.links, live: e.target.value } } : p);
                    setEditedData(prev => ({ ...prev, projects: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Catchy Cards Summary</label>
              <input
                type="text"
                value={selectedProject.description}
                onChange={(e) => {
                  const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, description: e.target.value } : p);
                  setEditedData(prev => ({ ...prev, projects: updated }));
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Full Detailed Pitch/Case Study Description</label>
              <textarea
                value={selectedProject.fullDescription}
                onChange={(e) => {
                  const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, fullDescription: e.target.value } : p);
                  setEditedData(prev => ({ ...prev, projects: updated }));
                }}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Tech Stack Tags (Comma Separated)</label>
              <input
                type="text"
                value={selectedProject.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                  const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, tags } : p);
                  setEditedData(prev => ({ ...prev, projects: updated }));
                }}
                placeholder="e.g. React, TypeScript, Framer Motion"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Core Performance Features (One per line)</label>
              <textarea
                value={selectedProject.features.join('\n')}
                onChange={(e) => {
                  const features = e.target.value.split('\n').filter(Boolean);
                  const updated = editedData.projects.map(p => p.id === selectedProject.id ? { ...p, features } : p);
                  setEditedData(prev => ({ ...prev, projects: updated }));
                }}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none font-sans"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-white/5 bg-neutral-900/40 rounded-2xl h-[50vh] text-neutral-500 text-xs">
            No project selected. Add or select one to edit.
          </div>
        )}
      </div>
    </div>
  );
}
