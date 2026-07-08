import React from 'react';
import { PortfolioData } from '../../lib/portfolioData';

interface ResumeTabProps {
  editedData: PortfolioData;
  setEditedData: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

export default function ResumeTab({ editedData, setEditedData }: ResumeTabProps) {
  const handleProjectChange = (index: number, field: 'name' | 'desc', value: string) => {
    setEditedData(prev => {
      const updated = [...prev.resumeProjects];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        resumeProjects: updated
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="font-display font-bold text-white text-base">Resume PDF Configurations</h4>
        <span className="font-mono text-[9px] text-neutral-500">ROOT.RESUME_PROJECTS</span>
      </div>

      <p className="text-xs text-neutral-400 font-sans leading-relaxed">
        The portfolio features an intelligent, client-side dynamic PDF builder powered by jsPDF. Edit the highlighted projects below to customize the content rendered when visitors click the "Download Resume" action button.
      </p>

      <div className="space-y-4">
        {editedData.resumeProjects.map((project, index) => (
          <div key={index} className="border border-white/5 bg-neutral-900/40 rounded-2xl p-6 space-y-4">
            <h5 className="font-display text-xs font-bold text-brand-orange uppercase tracking-wider">
              Resume Featured Project #{index + 1}
            </h5>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Project Description (PDF summary)</label>
                <textarea
                  value={project.desc}
                  onChange={(e) => handleProjectChange(index, 'desc', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange font-sans leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
