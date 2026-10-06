import React from 'react';
import { GlossaryTerm } from '../data/scientificGlossary';

interface GlossaryModalProps {
  term: GlossaryTerm | null;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ term, onClose }) => {
  if (!term) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-[#161218] p-6 shadow-2xl text-slate-200 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
              Scientific Glossary & NASA Instruments
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {term.term}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 h-7 w-7 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
          <span className="text-xs uppercase font-bold text-cyan-300 block">
            Plain English Explanation
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {term.simpleExplanation}
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 space-y-1">
          <span className="text-[11px] uppercase font-bold text-amber-300 block">
            Everyday Analogy
          </span>
          <p className="text-xs text-amber-100 leading-relaxed">
            {term.analogyOrExample}
          </p>
        </div>

        {term.usedInMissions.length > 0 && (
          <div className="flex items-center gap-2 pt-1 font-mono text-xs text-slate-400">
            <span>Used on Missions:</span>
            <div className="flex flex-wrap gap-1">
              {term.usedInMissions.map((m, i) => (
                <span
                  key={i}
                  className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-white/10 hover:bg-white/20 py-2.5 font-sans text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer text-center"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
