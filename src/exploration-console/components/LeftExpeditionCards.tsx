import React from 'react';
import { NasaMission, ScienceSite } from '../types';
import { CosmoSiteEnrichment } from '../data/siteCosmoData';

interface LeftExpeditionCardsProps {
  mission: NasaMission;
  activeSite: ScienceSite | null;
  enrichedSite: CosmoSiteEnrichment | null;
  hasReachedDestination: boolean;
  onDriveToSite: () => void;
  onClose: () => void;
}

export const LeftExpeditionCards: React.FC<LeftExpeditionCardsProps> = ({
  mission,
  activeSite,
  enrichedSite,
  hasReachedDestination,
  onDriveToSite,
  onClose,
}) => {
  const isRover = mission.missionType === 'surface_rover';
  const isCrewed = mission.name.toLowerCase().includes('apollo');
  const observedLabel = isCrewed
    ? 'What Astronauts Observed'
    : isRover
    ? 'What Rover Observed'
    : 'What Spacecraft Observed';

  const site = activeSite || mission.sites[0];

  const discoveryType =
    enrichedSite?.plainEnglishTitle ||
    site?.geologicFeature ||
    (isRover ? 'Aqueous Planetary Mineral Discovery' : 'Interplanetary Magnetic & Particle Discovery');

  const plainObservation =
    site?.observations.summary ||
    'High-resolution cameras and spectrometers observed distinct surface formations, layered bedrock strata, and mineral deposits consistent with historical geological activity.';

  const minerals = enrichedSite?.mineralRatio || [];
 
  const breakdownLabel = enrichedSite?.breakdownLabel || 'Chemical & Mineral Breakdown';

  return (
    <div className="pointer-events-none flex flex-col gap-3 w-[285px] sm:w-[325px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-130px)] overflow-y-auto pr-1">
      
      <div className="pointer-events-auto rounded-2xl border border-white/15 bg-[#161218]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl text-slate-100 transition-all hover:border-white/25">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Type of Discovery
          </span>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 h-6 w-6 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Close Left Panel"
          >
            ✕
          </button>
        </div>

        {hasReachedDestination ? (
          <>
            <h3 className="font-sans text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">
              {discoveryType}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="truncate">{site?.name || 'Primary Landmark'}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 truncate">{site?.geologicFeature || 'Surface Sector'}</span>
            </div>
          </>
        ) : (
          <div className="space-y-2 py-1">
            <span className="font-sans text-sm text-slate-300 block font-medium">
              Instruments Stowed · En Route
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arrive at the target destination to deploy cameras and reveal discovery data.
            </p>
            <button
              onClick={onDriveToSite}
              className="mt-1 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 font-sans text-xs font-bold text-slate-950 transition-colors cursor-pointer"
            >
              ▶ Drive to Site Now
            </button>
          </div>
        )}
      </div>

    
      {hasReachedDestination && (
        <div className="pointer-events-auto rounded-2xl border border-white/15 bg-[#161218]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl text-slate-100 transition-all hover:border-white/25">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
              {observedLabel}
            </span>
            <span className="text-[10px] text-slate-400">Archival Evidence</span>
          </div>

          <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {plainObservation}
          </p>

          {minerals.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wide text-slate-200">
                  {breakdownLabel}
                </span>
                <span className="font-mono text-[10px] text-amber-400">PDS Analysis</span>
              </div>
              <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-black/50 border border-white/10">
                {minerals.map((m, i) => (
                  <div
                    key={i}
                    style={{ width: `${m.percentage}%`, backgroundColor: m.color }}
                    title={`${m.name}: ${m.percentage}%`}
                  />
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                {minerals.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-semibold text-white flex items-center gap-1.5 truncate">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                        <span className="truncate">{m.name}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300 shrink-0">
                        {m.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{m.formula}</span>
                      <span className="text-slate-300 font-sans italic truncate ml-1">{m.simpleExplanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};