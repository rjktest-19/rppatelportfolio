import React from 'react';
import { Upload } from 'lucide-react';
import { ProfileInfo, PortfolioData } from '../../lib/portfolioData';

interface ProfileTabProps {
  editedData: PortfolioData;
  handleProfileChange: (key: keyof ProfileInfo, value: any) => void;
}

export default function ProfileTab({ editedData, handleProfileChange }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="font-display font-bold text-white text-base">Edit Professional Profile</h4>
        <span className="font-mono text-[9px] text-neutral-500">ROOT.PROFILE_INFO</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Profile Name</label>
          <input
            type="text"
            value={editedData.profile.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Professional Title</label>
          <input
            type="text"
            value={editedData.profile.role}
            onChange={(e) => handleProfileChange('role', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Subtitle tagline (Caps)</label>
          <input
            type="text"
            value={editedData.profile.subtitle}
            onChange={(e) => handleProfileChange('subtitle', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div className="md:col-span-2 space-y-2 border-b border-white/5 pb-4">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Avatar Image Source (URL or Upload File)</label>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Paste Avatar Image URL or select a file..."
                value={editedData.profile.avatarUrl}
                onChange={(e) => handleProfileChange('avatarUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                id="profile-avatar-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64 = event.target?.result as string;
                      if (base64) {
                        handleProfileChange('avatarUrl', base64);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="profile-avatar-upload"
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-neutral-800 border border-white/5 hover:border-brand-orange/40 hover:bg-neutral-700/80 rounded-xl text-xs text-neutral-200 cursor-pointer font-mono font-bold transition-all whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-brand-orange" />
                Upload
              </label>
            </div>
          </div>

          {editedData.profile.avatarUrl && (
            <div className="mt-2 border border-white/5 bg-neutral-900/60 p-2.5 rounded-2xl flex items-center gap-4">
              <img 
                src={editedData.profile.avatarUrl} 
                alt="Avatar Preview" 
                className="w-16 h-16 object-cover rounded-full border-2 border-brand-orange/40" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/raju_avatar.png';
                }}
              />
              <div>
                <span className="block text-[8px] font-mono text-neutral-400 uppercase">Avatar Preview</span>
                <span className="text-[10px] text-neutral-400 line-clamp-1 break-all max-w-[280px] font-mono">
                  {editedData.profile.avatarUrl.startsWith('data:') ? 'Base64 Encoded Image Data' : editedData.profile.avatarUrl}
                </span>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Email Gateway Address</label>
          <input
            type="text"
            value={editedData.profile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Phone operations</label>
          <input
            type="text"
            value={editedData.profile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Operation Location</label>
          <input
            type="text"
            value={editedData.profile.location}
            onChange={(e) => handleProfileChange('location', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Web3Forms Access Key / Target Email</label>
          <input
            type="text"
            value={editedData.profile.web3FormsKey}
            onChange={(e) => handleProfileChange('web3FormsKey', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Professional Bio Summary</label>
        <textarea
          value={editedData.profile.bioSummary}
          onChange={(e) => handleProfileChange('bioSummary', e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange font-sans leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Github Profile URL</label>
          <input
            type="text"
            value={editedData.profile.githubUrl}
            onChange={(e) => handleProfileChange('githubUrl', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Youtube Channel URL</label>
          <input
            type="text"
            value={editedData.profile.youtubeUrl}
            onChange={(e) => handleProfileChange('youtubeUrl', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Instagram Profile URL</label>
          <input
            type="text"
            value={editedData.profile.instagramUrl}
            onChange={(e) => handleProfileChange('instagramUrl', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Projects Completed</label>
          <input
            type="number"
            value={editedData.profile.projectsCompleted}
            onChange={(e) => handleProfileChange('projectsCompleted', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Experience (Years)</label>
          <input
            type="number"
            value={editedData.profile.yearsExperience}
            onChange={(e) => handleProfileChange('yearsExperience', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Global Contributions</label>
          <input
            type="text"
            value={editedData.profile.globalContributions}
            onChange={(e) => handleProfileChange('globalContributions', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Client Satisfaction (%)</label>
          <input
            type="number"
            value={editedData.profile.clientSatisfaction}
            onChange={(e) => handleProfileChange('clientSatisfaction', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
          />
        </div>
      </div>
    </div>
  );
}
