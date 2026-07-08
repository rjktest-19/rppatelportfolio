import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Unlock, Save, RotateCcw, X, Edit, Trash2, Plus, 
  ArrowDownToLine, ArrowUpToLine, HelpCircle, Check, 
  User, Briefcase, Award, Image as ImageIcon, FileText, Sparkles, Key
} from 'lucide-react';
import { usePortfolio, PortfolioData, ProfileInfo } from '../lib/portfolioData';
import { Project, Skill, GalleryItem } from '../types';
import { playSynthBeep } from '../components/AudioController';

// Tabs Components
import ProfileTab from './tabs/ProfileTab';
import ProjectsTab from './tabs/ProjectsTab';
import SkillsTab from './tabs/SkillsTab';
import GalleryTab from './tabs/GalleryTab';
import ResumeTab from './tabs/ResumeTab';
import BackupTab from './tabs/BackupTab';
import IdentityCardPhotosTab from './tabs/IdentityCardPhotosTab';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

type TabType = 'profile' | 'projects' | 'skills' | 'gallery' | 'identity' | 'resume' | 'backup';

export default function AdminPanel({ isOpen, onClose, theme }: AdminPanelProps) {
  const { data, updateData, resetData } = usePortfolio();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // Working states for edits
  const [editedData, setEditedData] = useState<PortfolioData>(JSON.parse(JSON.stringify(data)));
  const [jsonInput, setJsonInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  
  // Selected lists states
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number>(-1);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string>('');

  // Sync state with global data when panel opens
  useEffect(() => {
    if (isOpen) {
      setEditedData(JSON.parse(JSON.stringify(data)));
      setJsonInput(JSON.stringify(data, null, 2));
    }
  }, [isOpen, data]);

  // Lock body scroll when admin panel is open
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'RJ6565' || passcode === 'aavesh2026' || passcode === '6287' || passcode === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
      playSynthBeep(1000, 'sine', 0.1);
    } else {
      setLoginError('Invalid Administrator Passcode.');
      playSynthBeep(300, 'sawtooth', 0.15);
    }
  };

  const handleGlobalSave = () => {
    updateData(editedData);
    setSaveSuccess(true);
    playSynthBeep(1200, 'sine', 0.1);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleResetToDefault = () => {
    if (resetConfirm) {
      resetData();
      setEditedData(JSON.parse(JSON.stringify(data)));
      setResetConfirm(false);
      playSynthBeep(500, 'triangle', 0.2);
    } else {
      setResetConfirm(true);
      playSynthBeep(600, 'sine', 0.05);
    }
  };

  // Profile fields helper
  const handleProfileChange = (key: keyof ProfileInfo, value: any) => {
    setEditedData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value
      }
    }));
  };

  // Import JSON helper
  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed && parsed.profile && parsed.projects && parsed.skills) {
        setEditedData(parsed);
        updateData(parsed);
        setSaveSuccess(true);
        playSynthBeep(1200, 'sine', 0.1);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Invalid data structure. Missing core attributes.');
      }
    } catch (err: any) {
      alert(`Invalid JSON format: ${err.message}`);
      playSynthBeep(300, 'sawtooth', 0.15);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden">
      <div
        className={`relative w-full h-full md:w-[95vw] md:h-[90vh] md:rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          theme === 'dark' 
            ? 'bg-neutral-900 border-white/10 text-white' 
            : 'bg-zinc-900 border-white/10 text-white'
        }`}
      >
        
        {/* Header Banner */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red text-white">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-display text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">
                RP PATEL ADMIN
              </h2>
              <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">
                SECURE PORTFOLIO ENGINE CONTROL // RESTRICTED ACCESS
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              playSynthBeep(700, 'sine', 0.05);
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-[10px] font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            Exit System
          </button>
        </div>

        {!isAuthenticated ? (
          /* Login Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-950/45">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur text-center"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-6 border border-brand-orange/30">
                <Key className="w-8 h-8 text-brand-orange animate-pulse" />
              </div>
              
              <h3 className="font-display text-xl font-bold mb-2 text-white">Unlock Admin System</h3>
              <p className="text-xs text-neutral-400 mb-6 font-sans">
                Enter secure passcode to gain administrative control over portfolio database.
              </p>
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter Passcode..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-800 border border-white/10 text-white placeholder-neutral-500 font-mono text-center tracking-widest focus:outline-none focus:border-brand-orange text-sm"
                  />
                </div>
                {loginError && (
                  <p className="text-xs text-brand-red font-mono">{loginError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red text-white font-display text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Authenticate Gateway
                </button>
              </form>

              <p className="mt-6 text-[9px] text-neutral-500 font-mono uppercase tracking-wider">
                RP PATEL RESTRICTED NODE
              </p>
            </motion.div>
          </div>
        ) : (
          /* Admin Layout */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/10 flex flex-col py-4 shrink-0">
              <div className="flex-1 space-y-1 px-3 overflow-x-auto lg:overflow-x-visible flex lg:flex-col pb-2 lg:pb-0 gap-2 lg:gap-0">
                <button
                  onClick={() => { playSynthBeep(850, 'sine', 0.02); setActiveTab('profile'); }}
                  className={`shrink-0 lg:shrink-1 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'profile' 
                      ? 'bg-gradient-to-r from-brand-orange/15 to-brand-red/15 border-l-4 border-brand-orange text-white' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 text-brand-orange" />
                  Profile Details
                </button>
                <button
                  onClick={() => { playSynthBeep(850, 'sine', 0.02); setActiveTab('projects'); }}
                  className={`shrink-0 lg:shrink-1 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'projects' 
                      ? 'bg-gradient-to-r from-brand-orange/15 to-brand-red/15 border-l-4 border-brand-orange text-white' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-brand-orange" />
                  Project Work
                </button>
                <button
                  onClick={() => { playSynthBeep(850, 'sine', 0.02); setActiveTab('skills'); }}
                  className={`shrink-0 lg:shrink-1 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'skills' 
                      ? 'bg-gradient-to-r from-brand-orange/15 to-brand-red/15 border-l-4 border-brand-orange text-white' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-brand-orange" />
                  Skill Deck
                </button>
                <button
                  onClick={() => { playSynthBeep(850, 'sine', 0.02); setActiveTab('gallery'); }}
                  className={`shrink-0 lg:shrink-1 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'gallery' 
                      ? 'bg-gradient-to-r from-brand-orange/15 to-brand-red/15 border-l-4 border-brand-orange text-white' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-brand-orange" />
                  Gallery Items
                </button>
                <button
                  onClick={() => { playSynthBeep(850, 'sine', 0.02); setActiveTab('identity'); }}
                  className={`shrink-0 lg:shrink-1 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'identity' 
                      ? 'bg-gradient-to-r from-brand-orange/15 to-brand-red/15 border-l-4 border-brand-orange text-white' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  Identity Photos
                </button>
                <button
                  onClick={() => { playSynthBeep(850, 'sine', 0.02); setActiveTab('resume'); }}
                  className={`shrink-0 lg:shrink-1 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'resume' 
                      ? 'bg-gradient-to-r from-brand-orange/15 to-brand-red/15 border-l-4 border-brand-orange text-white' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-brand-orange" />
                  Resume PDF Config
                </button>
                <button
                  onClick={() => { playSynthBeep(850, 'sine', 0.02); setActiveTab('backup'); }}
                  className={`shrink-0 lg:shrink-1 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'backup' 
                      ? 'bg-gradient-to-r from-brand-orange/15 to-brand-red/15 border-l-4 border-brand-orange text-white' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4 text-brand-orange" />
                  Backup & Import
                </button>
              </div>
              
              {/* Save and Reset Bottom Buttons */}
              <div className="p-3 border-t border-white/10 space-y-2 hidden lg:block">
                <button
                  onClick={handleGlobalSave}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red hover:brightness-110 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-orange/10"
                >
                  {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {saveSuccess ? 'Changes Applied!' : 'Save & Apply'}
                </button>
                
                <button
                  onClick={handleResetToDefault}
                  className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-red-950/30 text-neutral-400 hover:text-brand-red text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resetConfirm ? 'Are you sure?' : 'Reset Default'}
                </button>
              </div>
            </div>

            {/* Content Canvas */}
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-neutral-950/20">
              {activeTab === 'profile' && (
                <ProfileTab 
                  editedData={editedData} 
                  handleProfileChange={handleProfileChange} 
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsTab 
                  editedData={editedData} 
                  setEditedData={setEditedData} 
                  selectedProjectId={selectedProjectId} 
                  setSelectedProjectId={setSelectedProjectId} 
                />
              )}

              {activeTab === 'skills' && (
                <SkillsTab 
                  editedData={editedData} 
                  setEditedData={setEditedData} 
                  selectedSkillIndex={selectedSkillIndex} 
                  setSelectedSkillIndex={setSelectedSkillIndex} 
                />
              )}

              {activeTab === 'gallery' && (
                <GalleryTab 
                  editedData={editedData} 
                  setEditedData={setEditedData} 
                  selectedGalleryId={selectedGalleryId} 
                  setSelectedGalleryId={setSelectedGalleryId} 
                />
              )}

              {activeTab === 'identity' && (
                <IdentityCardPhotosTab 
                  editedData={editedData} 
                  setEditedData={setEditedData} 
                />
              )}

              {activeTab === 'resume' && (
                <ResumeTab 
                  editedData={editedData} 
                  setEditedData={setEditedData} 
                />
              )}

              {activeTab === 'backup' && (
                <BackupTab 
                  editedData={editedData} 
                  setEditedData={setEditedData} 
                  jsonInput={jsonInput} 
                  setJsonInput={setJsonInput} 
                  handleJsonImport={handleJsonImport} 
                />
              )}
              
              {/* Save controls for mobile view */}
              <div className="mt-8 pt-4 border-t border-white/5 space-y-2 lg:hidden">
                <button
                  onClick={handleGlobalSave}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red hover:brightness-110 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saveSuccess ? 'Changes Applied!' : 'Save & Apply'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
