import React, { useState } from 'react';
import { ScienceSite, NasaMission } from '../types';
import { CosmoSiteEnrichment } from '../data/siteCosmoData';


interface ScienceReportModalProps {
  mission: NasaMission;
  site: ScienceSite;
  enrichedSite: CosmoSiteEnrichment | null;
  onClose: () => void;
}

export const ScienceReportModal: React.FC<ScienceReportModalProps> = ({
  mission,
  site,
  enrichedSite,
  onClose,
}) => {
  const plainTitle = enrichedSite?.plainEnglishTitle || site.name;
  const plainDiscovery = enrichedSite?.plainEnglishDiscovery || site.scientificDeterminations.summary;
  const formulas = site.scientificDeterminations.chemicalFormulasOrModels || [
    '2Fe³⁺ + 3SO₄²⁻ + 2K⁺ + 6H₂O → KFe₃(SO₄)₂(OH)₆ + 4H⁺',
  ];


  const [userImages, setUserImages] = useState<string[]>([]);
  const [fieldNote, setFieldNote] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setUserImages((prev) => [previewUrl, ...prev]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/20 bg-[#141016] shadow-2xl text-slate-100">
        
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 bg-white/5">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              <span>NASA Scientific Discovery Determination</span>
              <span>·</span>
              <span className="text-slate-300">{mission.name}</span>
            </div>
            <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {plainTitle}
            </h2>
            <span className="font-sans text-xs sm:text-sm text-slate-400 font-medium">
              {site.name} ({site.geologicFeature}) · {site.historicalDate} · {mission.targetDestination}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/10 hover:bg-white/20 h-9 w-9 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer text-base font-bold"
          >
            ✕
          </button>
        </div>

       
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
          
          
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3.5">
  <div className="flex items-center justify-between">
    <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
      <span>📷</span> Discovery Documentation
    </span>
    <span className="font-mono text-[10px] text-slate-400">NASA Archive</span>
  </div>

  {site.media?.type === 'photo' && (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-black/60 shadow">
      <img src={site.media.url} alt={site.media.caption ?? site.name} className="w-full h-full object-cover" />
    </div>
  )}
  {site.media?.type === 'video' && (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-black/60 shadow">
      <video src={site.media.url} controls className="w-full h-full object-cover" />
    </div>
  )}
  {site.media?.caption && (
    <p className="text-[11px] italic text-slate-400">{site.media.caption}</p>
  )}
  {!site.media && (
    <p className="text-xs text-slate-500 italic">No NASA image or video on file for this site yet.</p>
  )}
</div>

         
          <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-5 space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-bold block">
              💡 Summary in Plain English
            </span>
            <p className="text-base sm:text-lg leading-relaxed text-white font-medium">
              {plainDiscovery}
            </p>
          </div>

         
          <div className="rounded-2xl border border-white/15 bg-black/40 p-5 space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold block">
              1. What Scientists Determined from the Evidence
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {site.scientificDeterminations.summary}
            </p>

            <div className="pt-2">
              <span className="font-mono text-xs uppercase text-slate-400 font-semibold block mb-1.5">
                Key Scientific Conclusions:
              </span>
              <ul className="space-y-1.5 text-sm text-slate-200">
                {site.scientificDeterminations.keyConclusions.map((conclusion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                    <span>{conclusion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-bold block">
                Formulas & Planetary Formation Models:
              </span>
              <div className="space-y-2">
                {formulas.map((formula, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs sm:text-sm text-amber-200 overflow-x-auto"
                  >
                    {formula}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-5 space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-purple-300 font-bold block">
              2. Why Does It Matter?
            </span>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              {site.whyItMatters.summary}
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs uppercase text-purple-200 font-semibold block mb-1.5">
                Impact on Astronomy, Geology & Humanity:
              </span>
              <ul className="space-y-1.5 text-sm text-slate-200">
                {site.whyItMatters.impactOnScience.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">★</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold block">
              Official NASA Archival Citations
            </span>
            <div className="space-y-2 text-xs text-slate-300">
              {site.nasaSources.map((source, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-black/30 p-2.5">
                  <span className="font-bold text-white block">{source.title}</span>
                  <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                    {source.citation}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-4 bg-white/5">
          <span className="font-mono text-xs text-slate-400">
            NASA Planetary Data System (PDS) Archival Record
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-2.5 font-sans text-xs sm:text-sm font-bold text-slate-950 transition-all cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
