import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PortfolioData } from '../../lib/portfolioData';
import { Skill } from '../../types';
import { playSynthBeep } from '../../components/AudioController';

interface SkillsTabProps {
  editedData: PortfolioData;
  setEditedData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  selectedSkillIndex: number;
  setSelectedSkillIndex: (idx: number) => void;
}

export default function SkillsTab({
  editedData,
  setEditedData,
  selectedSkillIndex,
  setSelectedSkillIndex
}: SkillsTabProps) {
  const selectedSkill = editedData.skills[selectedSkillIndex] || editedData.skills[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="font-display font-bold text-white text-base">Manage Skills Deck</h4>
        <button
          onClick={() => {
            const newSkill: Skill = {
              name: 'Next Skill',
              category: 'frontend',
              level: 80,
              iconName: 'sparkles',
              color: '#ff5f00'
            };
            setEditedData(prev => ({
              ...prev,
              skills: [...prev.skills, newSkill]
            }));
            setSelectedSkillIndex(editedData.skills.length);
            playSynthBeep(1100, 'sine', 0.05);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-brand-orange/20 border border-brand-orange/40 hover:bg-brand-orange/30 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Skill
        </button>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Skill Navigator list */}
        <div className="w-full lg:w-1/3 border border-white/5 bg-black/10 rounded-2xl p-4 space-y-1.5 h-[50vh] overflow-y-auto">
          <span className="block text-[8px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Skill Deck Matrix</span>
          {editedData.skills.map((s, index) => (
            <button
              key={index}
              onClick={() => { setSelectedSkillIndex(index); playSynthBeep(900, 'sine', 0.01); }}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium tracking-tight truncate flex items-center justify-between group transition-all cursor-pointer ${
                selectedSkillIndex === index
                  ? 'bg-brand-orange/20 border border-brand-orange/30 text-white' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} ({s.level}%)
              </span>
              <Trash2
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete "${s.name}"?`)) {
                    setEditedData(prev => ({
                      ...prev,
                      skills: prev.skills.filter((_, sIdx) => sIdx !== index)
                    }));
                    if (selectedSkillIndex === index) {
                      setSelectedSkillIndex(-1);
                    }
                    playSynthBeep(400, 'triangle', 0.1);
                  }
                }}
                className="w-3.5 h-3.5 text-neutral-400/80 hover:text-brand-red opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer ml-2 shrink-0"
              />
            </button>
          ))}
        </div>

        {/* Editor form */}
        {selectedSkill ? (
          <div className="flex-1 border border-white/5 bg-neutral-900/40 rounded-2xl p-6 space-y-4 h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={selectedSkill.name}
                  onChange={(e) => {
                    const updated = editedData.skills.map((s, idx) => idx === selectedSkillIndex ? { ...s, name: e.target.value } : s);
                    setEditedData(prev => ({ ...prev, skills: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Proficiency Level (0 - 100%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={selectedSkill.level}
                  onChange={(e) => {
                    const level = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100);
                    const updated = editedData.skills.map((s, idx) => idx === selectedSkillIndex ? { ...s, level } : s);
                    setEditedData(prev => ({ ...prev, skills: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Sub-Category</label>
                <select
                  value={selectedSkill.category}
                  onChange={(e) => {
                    const updated = editedData.skills.map((s, idx) => idx === selectedSkillIndex ? { ...s, category: e.target.value as any } : s);
                    setEditedData(prev => ({ ...prev, skills: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                >
                  <option value="frontend">Frontend & Client</option>
                  <option value="backend">Backend & System</option>
                  <option value="design">Design & UI/UX</option>
                  <option value="tools">DevOps & Tools</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Brand Theme Hex Color</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedSkill.color}
                    onChange={(e) => {
                      const updated = editedData.skills.map((s, idx) => idx === selectedSkillIndex ? { ...s, color: e.target.value } : s);
                      setEditedData(prev => ({ ...prev, skills: updated }));
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none font-mono"
                  />
                  <input
                    type="color"
                    value={selectedSkill.color.startsWith('#') && selectedSkill.color.length === 7 ? selectedSkill.color : '#ff5f00'}
                    onChange={(e) => {
                      const updated = editedData.skills.map((s, idx) => idx === selectedSkillIndex ? { ...s, color: e.target.value } : s);
                      setEditedData(prev => ({ ...prev, skills: updated }));
                    }}
                    className="w-10 h-9 p-0 rounded bg-transparent border-0 cursor-pointer"
                  />
                </div>
              </div>
               <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Icon Representation Name</label>
                <select
                  value={selectedSkill.iconName}
                  onChange={(e) => {
                    const updated = editedData.skills.map((s, idx) => idx === selectedSkillIndex ? { ...s, iconName: e.target.value } : s);
                    setEditedData(prev => ({ ...prev, skills: updated }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none"
                >
                  <option value="flutter">Smartphone (Flutter)</option>
                  <option value="react">Atom (React/JS)</option>
                  <option value="firebase">Flame (Firebase/Cloud)</option>
                  <option value="design">Palette (Figma/Design)</option>
                  <option value="ai">Cpu (Intelligent AI/Tech)</option>
                  <option value="sparkles">Sparkles (Aesthetics)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${selectedSkill.name}"?`)) {
                    setEditedData(prev => ({
                      ...prev,
                      skills: prev.skills.filter((_, idx) => idx !== selectedSkillIndex)
                    }));
                    setSelectedSkillIndex(-1);
                    playSynthBeep(400, 'triangle', 0.1);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-950/20 border border-brand-red/30 hover:bg-brand-red/30 hover:border-brand-red/60 text-brand-red hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Skill
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-white/5 bg-neutral-900/40 rounded-2xl h-[50vh] text-neutral-500 text-xs">
            No skill selected. Add or select one to edit.
          </div>
        )}
      </div>
    </div>
  );
}
