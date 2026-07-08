import React from 'react';
import { ArrowDownToLine, ArrowUpToLine, Sparkles } from 'lucide-react';
import { PortfolioData } from '../../lib/portfolioData';

interface BackupTabProps {
  editedData: PortfolioData;
  setEditedData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  jsonInput: string;
  setJsonInput: (val: string) => void;
  handleJsonImport: () => void;
}

export default function BackupTab({
  editedData,
  setEditedData,
  jsonInput,
  setJsonInput,
  handleJsonImport
}: BackupTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="font-display font-bold text-white text-base">Database Backup & Import</h4>
        <span className="font-mono text-[9px] text-neutral-500">ROOT.JSON_IO</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4 text-brand-orange" />
            <h5 className="font-display text-xs font-bold text-white uppercase tracking-wider">Export Current System Database</h5>
          </div>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Copy the raw string below and save it inside a text document to back up your full portfolio configurations (biography details, projects list, skills level matrix, and artwork links).
          </p>
          <textarea
            readOnly
            value={JSON.stringify(editedData, null, 2)}
            onClick={(e) => {
              (e.target as HTMLTextAreaElement).select();
            }}
            rows={10}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-[10px] text-neutral-300 focus:outline-none font-mono leading-normal cursor-pointer"
            title="Click to select all for easy copy"
          />
          <span className="block text-[9px] font-mono text-neutral-500 text-right uppercase">Click payload above to select all</span>
        </div>

        {/* Import Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowUpToLine className="w-4 h-4 text-brand-orange" />
            <h5 className="font-display text-xs font-bold text-white uppercase tracking-wider">Import Portfolio Database</h5>
          </div>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Paste a valid exported JSON string into the text container below, then press "Trigger System Overwrite" to override local storage parameters in your device engine instantly.
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={10}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-[10px] text-neutral-300 focus:outline-none font-mono leading-normal"
            placeholder="Paste your exported portfolio JSON structure here..."
          />
          <button
            onClick={handleJsonImport}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Trigger System Overwrite
          </button>
        </div>
      </div>
    </div>
  );
}
