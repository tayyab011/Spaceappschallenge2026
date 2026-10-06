import React from 'react';
import { NasaMission, ScienceSite } from '../types';
import { NASA_MISSIONS } from '../data/nasaMissions';

interface MissionDossierViewProps {
  currentMission: NasaMission;
  onSelectMission: (mission: NasaMission) => void;
  onClose: () => void;
  onOpenSiteLab: (site: ScienceSite) => void;
  onExportZip: () => void;
  isExportingZip: boolean;
}

export const MissionDossierView: React.FC<MissionDossierViewProps> = ({
  currentMission,
  onSelectMission,
  onClose,
  onOpenSiteLab,
  onExportZip,
  isExportingZip,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-xl border border-slate-700 bg-[#0b0e17] shadow-2xl text-slate-200">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-6 py-4 bg-[#07090e]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>NASA ARCHIVAL RESEARCH DOSSIER</span>
              <span>·</span>
              <span>8 HISTORICAL MISSIONS</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {currentMission.name} — {currentMission.missionFormalName}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExportZip}
              disabled={isExportingZip}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-2 font-mono text-xs font-bold text-slate-950 uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
            >
              {isExportingZip ? 'PACKAGING ARCHIVE...' : 'EXPORT MISSION DOSSIER (.ZIP)'}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3.5 py-1.5 font-mono text-xs text-slate-300 hover:border-slate-500 hover:text-white"
            >
              CLOSE [ESC]
            </button>
          </div>
        </div>

       
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800 bg-[#0e121d] px-6 py-2.5">
          <span className="font-mono text-xs text-slate-500 uppercase shrink-0 mr-2">Missions:</span>
          {NASA_MISSIONS.map((m) => {
            const isSelected = m.id === currentMission.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMission(m)}
                className={`rounded px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                #{m.number} {m.name}
              </button>
            );
          })}
        </div>

       
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-800 bg-[#0f1422] p-3">
              <span className="block font-mono text-[10px] uppercase text-slate-400">Launch Date</span>
              <span className="font-mono text-xs text-white font-semibold">{currentMission.launchDate}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0f1422] p-3">
              <span className="block font-mono text-[10px] uppercase text-slate-400">Arrival / Encounter</span>
              <span className="font-mono text-xs text-white font-semibold">{currentMission.encounterOrArrivalDate}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0f1422] p-3">
              <span className="block font-mono text-[10px] uppercase text-slate-400">Target Body</span>
              <span className="font-mono text-xs text-cyan-300 font-semibold">{currentMission.targetDestination}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0f1422] p-3">
              <span className="block font-mono text-[10px] uppercase text-slate-400">Mass / Power</span>
              <span className="font-mono text-xs text-amber-300 font-semibold">
                {currentMission.specs.vehicleMassKg} kg · {currentMission.specs.powerOutputWatts} W
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-cyan-400">Mission Overview</h3>
            <p className="text-sm leading-relaxed text-slate-200">
              {currentMission.briefing}
            </p>
          </div>

          
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-cyan-400">Scientific Payload & Sensors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentMission.instruments.map((inst) => (
                <div key={inst.id} className="rounded-lg border border-slate-800 bg-[#0c101c] p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{inst.name}</span>
                    <span className="font-mono text-[11px] text-cyan-400 uppercase">[{inst.acronym}]</span>
                  </div>
                  <p className="text-xs text-slate-300">{inst.description}</p>
                  <div className="pt-1 text-[11px] font-mono text-slate-400">
                    <span className="text-amber-400">Target: </span>
                    {inst.targetElementsOrPhenomena.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-cyan-400">Key Scientific Investigation Sites</h3>
            <div className="space-y-4">
              {currentMission.sites.map((site) => (
                <div key={site.id} className="rounded-lg border border-slate-800 bg-[#0c101c] p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-base font-bold text-white">{site.name}</h4>
                      <span className="font-mono text-xs text-slate-400">{site.geologicFeature} · {site.historicalDate}</span>
                    </div>
                    <button
                      onClick={() => onOpenSiteLab(site)}
                      className="rounded bg-cyan-500 hover:bg-cyan-400 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-950 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      OPEN INSTRUMENT LAB
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-mono text-amber-400 uppercase font-semibold">1. Spacecraft Observation:</span>
                      <p className="mt-1 text-slate-300">{site.observations.summary}</p>
                    </div>
                    <div>
                      <span className="font-mono text-cyan-400 uppercase font-semibold">2. Measurement Protocol:</span>
                      <p className="mt-1 text-slate-300">{site.measurementMethod.summary}</p>
                    </div>
                    <div>
                      <span className="font-mono text-emerald-400 uppercase font-semibold">3. Scientific Determination:</span>
                      <p className="mt-1 text-slate-300">{site.scientificDeterminations.summary}</p>
                    </div>
                    <div>
                      <span className="font-mono text-purple-400 uppercase font-semibold">4. Why It Matters to Humanity:</span>
                      <p className="mt-1 text-slate-300">{site.whyItMatters.summary}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500 uppercase">NASA Archival Citation: </span>
                    {site.nasaSources.map((s) => s.title).join('; ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#070a13] p-4 space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400">Historical Significance</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentMission.historicalSignificance}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 bg-[#07090e] text-xs font-mono">
          <span className="text-slate-400">
            Primary NASA Source: {currentMission.nasaPrimarySource}
          </span>
          <button
            onClick={onClose}
            className="rounded bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-slate-200"
          >
            Back to 3D Cockpit
          </button>
        </div>
      </div>
    </div>
  );
};
