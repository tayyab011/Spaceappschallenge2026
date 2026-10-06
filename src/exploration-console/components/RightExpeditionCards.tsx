import React, { useState, useEffect, useCallback } from 'react';
import { NasaMission, ScienceSite } from '../types';
import { CosmoSiteEnrichment } from '../data/siteCosmoData';
import { SCIENTIFIC_GLOSSARY, GlossaryTerm } from '../data/scientificGlossary';

interface SiteNote {
  id: string;
  text: string;
  status: 'checking' | 'verified' | 'unverified';
  createdAt: number;
}

const notesKey = (siteId: string) => `expedition_notes_${siteId}`;

function loadNotes(siteId: string): SiteNote[] {
  try {
    const raw = localStorage.getItem(notesKey(siteId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(siteId: string, notes: SiteNote[]) {
  try {
    localStorage.setItem(notesKey(siteId), JSON.stringify(notes));
  } catch {
  }
}

function checkClaimAgainstSite(claim: string, site: ScienceSite): boolean {
  const corpus = [
    site.observations.summary,
    ...site.observations.empiricalPoints,
    site.scientificDeterminations.summary,
    ...site.scientificDeterminations.keyConclusions,
    site.whyItMatters.summary,
    ...site.whyItMatters.impactOnScience,
    ...site.nasaSources.map((s) => `${s.title} ${s.citation}`),
  ]
    .join(' ')
    .toLowerCase();

  const stopWords = new Set(['the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'is', 'was', 'and', 'or', 'that', 'this', 'it', 'its', 'with', 'for', 'as', 'by', 'are', 'were']);
  const claimWords = claim
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  if (claimWords.length === 0) return false;

  const hits = claimWords.filter((w) => corpus.includes(w)).length;
  return hits / claimWords.length >= 0.5;
}

interface RightExpeditionCardsProps {
  mission: NasaMission;
  activeSite: ScienceSite | null;
  enrichedSite: CosmoSiteEnrichment | null;
  hasReachedDestination: boolean;
  onOpenDiscoveryModal: () => void;
  onOpenGlossary: (term: GlossaryTerm) => void;
  onDriveToSite: () => void;
  onClose: () => void;
}

export const RightExpeditionCards: React.FC<RightExpeditionCardsProps> = ({
  mission,
  activeSite,
  enrichedSite,
  hasReachedDestination,
  onOpenDiscoveryModal,
  onOpenGlossary,
  onDriveToSite,
  onClose,
}) => {
  const site = activeSite || mission.sites[0];

  const [notes, setNotes] = useState<SiteNote[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (site?.id) setNotes(loadNotes(site.id));
    else setNotes([]);
  }, [site?.id]);

  const handleAddNote = useCallback(() => {
    if (!site?.id || !draft.trim()) return;
    const note: SiteNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: draft.trim(),
      status: 'checking',
      createdAt: Date.now(),
    };
    const withPending = [...notes, note];
    setNotes(withPending);
    saveNotes(site.id, withPending);
    setDraft('');

    window.setTimeout(() => {
      const isReal = checkClaimAgainstSite(note.text, site);
      setNotes((prev) => {
        const next = isReal
          ? prev.map((n) => (n.id === note.id ? { ...n, status: 'verified' as const } : n))
          : prev.filter((n) => n.id !== note.id);
        saveNotes(site.id, next);
        return next;
      });
    }, 600);
  }, [draft, notes, site]);

  const plainMeasurement =
    site?.measurementMethod.summary ||
    'Measured using contact robotic arm sensors, alpha particle emissions, and high-magnification multi-spectral cameras.';

  const instruments = site?.measurementMethod.instrumentsUsed || [
    'APXS Spectrometer',
    'Microscopic Imager',
    'Rock Abrasion Tool',
  ];

  const findGlossaryTerm = (instrName: string): GlossaryTerm | null => {
    const lower = instrName.toLowerCase();
    if (lower.includes('apxs') || lower.includes('alpha proton') || lower.includes('alpha particle')) {
      return SCIENTIFIC_GLOSSARY['apxs'];
    }
    if (lower.includes('mössbauer') || lower.includes('mossbauer')) {
      return SCIENTIFIC_GLOSSARY['mossbauer'];
    }
    if (lower.includes('rat') || lower.includes('abrasion')) {
      return SCIENTIFIC_GLOSSARY['rat'];
    }
    if (lower.includes('microscopic') || lower.includes('hand lens')) {
      return SCIENTIFIC_GLOSSARY['microscopic_imager'];
    }
    if (lower.includes('trap') || lower.includes('charged particle')) {
      return SCIENTIFIC_GLOSSARY['ion_trap'];
    }
    if (lower.includes('magnetometer') || lower.includes('fluxgate')) {
      return SCIENTIFIC_GLOSSARY['magnetometer'];
    }
    if (lower.includes('spectrometer') || lower.includes('tes')) {
      return SCIENTIFIC_GLOSSARY['spectrometer'];
    }
    return {
      term: instrName,
      shortName: instrName,
      simpleExplanation: `NASA scientific equipment deployed on ${mission.name} to analyze geological, chemical, and atmospheric properties of ${mission.targetDestination}.`,
      analogyOrExample: 'An advanced precision instrument providing ground-truth planetary data.',
      usedInMissions: [mission.name],
    };
  };

  return (
    <div className="pointer-events-none flex flex-col gap-3 w-[285px] sm:w-[325px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-130px)] overflow-y-auto pl-1">
     
      <div className="pointer-events-auto rounded-2xl border border-white/15 bg-[#161218]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl text-slate-100 transition-all hover:border-white/25">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
            What & How Measured
          </span>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 h-6 w-6 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Close Right Panel"
          >
            ✕
          </button>
        </div>

        {hasReachedDestination ? (
          <>
            {site?.media?.type === 'photo' && (
              <img
                src={site.media.url}
                alt={site.media.caption ?? site.name}
                className="mb-3 w-full rounded-lg object-cover"
              />
            )}
            {site?.media?.type === 'video' && (
              <video
                src={site.media.url}
                controls
                className="mb-3 w-full rounded-lg"
              />
            )}
            {site?.media?.caption && (
              <p className="mb-3 -mt-2 text-[10px] italic text-slate-400">{site.media.caption}</p>
            )}

            <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {plainMeasurement}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                Field Notes
              </span>
              {notes.length > 0 && (
                <div className="mb-2 space-y-1.5">
                  {notes.map((n) => (
                    <div key={n.id} className="flex items-start gap-1.5 text-[11px] leading-snug">
                      <span
                        className={
                          n.status === 'verified'
                            ? 'shrink-0 text-emerald-400'
                            : 'shrink-0 text-slate-500 animate-pulse'
                        }
                        title={n.status === 'verified' ? 'Checked against NASA data' : 'Checking against NASA data…'}
                      >
                        {n.status === 'verified' ? '✓' : '…'}
                      </span>
                      <span className="text-slate-300">{n.text}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder="Add a note about this site…"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-sans text-[11px] text-slate-100 placeholder:text-slate-500 focus:border-purple-400/50 focus:outline-none"
                />
                <button
                  onClick={handleAddNote}
                  className="shrink-0 rounded-lg border border-purple-400/30 bg-purple-500/20 px-2.5 py-1 font-sans text-[11px] font-semibold text-purple-200 transition-colors hover:bg-purple-500/30 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                Instruments (Tap for plain explanation):
              </span>
              <div className="flex flex-wrap gap-1">
                {instruments.map((instr, idx) => {
                  const term = findGlossaryTerm(instr);
                  return (
                    <button
                      key={idx}
                      onClick={() => term && onOpenGlossary(term)}
                      className="group flex items-center gap-1 rounded-lg border border-purple-400/30 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-0.5 font-sans text-[11px] text-purple-200 transition-all cursor-pointer"
                      title="Click for simple explanation"
                    >
                      <span className="font-medium truncate max-w-[150px]">{instr}</span>
                      <span className="font-mono text-[9px] text-purple-300 group-hover:text-white">
                        ⓘ
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2 py-1">
            <span className="font-sans text-sm text-slate-300 block font-medium">
              Sensors Calibrating
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Robotic contact arm and spectrometers deploy upon arrival at the waypoint.
            </p>
            <button
              onClick={onDriveToSite}
              className="mt-1 rounded-lg bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/40 px-3 py-1.5 font-sans text-xs font-bold text-purple-200 transition-colors cursor-pointer"
            >
              ▶ Drive to Site Now
            </button>
          </div>
        )}
      </div>

     
      {hasReachedDestination && (
        <div className="pointer-events-auto rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-[#181318]/95 to-[#120f14]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl text-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              Scientific Determination
            </span>
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          </div>

          <h4 className="font-sans text-sm sm:text-base font-bold text-white leading-snug">
            {site?.scientificDeterminations.summary.slice(0, 110)}...
          </h4>

          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
            Formulas, chemical models, and why it matters to humanity.
          </p>

          <button
            onClick={onOpenDiscoveryModal}
            className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 px-4 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-[0.98]"
          >
            <span>What Scientists Discovered</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      )}

    </div>
  );
};
