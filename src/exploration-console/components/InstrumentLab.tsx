import React, { useState, useEffect } from 'react';
import { ScienceSite, ScientificInstrument, NasaMission } from '../types';
import { soundFx } from '../utils/audio';

interface InstrumentLabProps {
  mission: NasaMission;
  site: ScienceSite;
  onClose: () => void;
  onLogDiscovery: (siteId: string) => void;
  isLogged: boolean;
}

export const InstrumentLab: React.FC<InstrumentLabProps> = ({
  mission,
  site,
  onClose,
  onLogDiscovery,
  isLogged,
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(
    site.primaryInstrumentId || mission.instruments[0]?.id || ''
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [activeTab, setActiveTab] = useState<'empirical' | 'methodology' | 'conclusions' | 'impact'>('empirical');

  const currentInstrument = mission.instruments.find((i) => i.id === selectedInstId) || mission.instruments[0];

  const handleRunTest = () => {
    setIsScanning(true);
    setScanProgress(0);
    soundFx.playSpectrometerHum();

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          soundFx.playDiscoveryChime();
          onLogDiscovery(site.id);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const spectra = currentInstrument.referenceSpectra;
  const minX = Math.min(...spectra.points.map((p) => p.x));
  const maxX = Math.max(...spectra.points.map((p) => p.x));
  const minY = Math.min(...spectra.points.map((p) => p.y));
  const maxY = Math.max(...spectra.points.map((p) => p.y));

  const chartW = 540;
  const chartH = 220;
  const padL = 60;
  const padR = 25;
  const padT = 25;
  const padB = 45;

  const getCanvasX = (val: number) => {
    if (maxX === minX) return padL;
    return padL + ((val - minX) / (maxX - minX)) * (chartW - padL - padR);
  };

  const getCanvasY = (val: number) => {
    if (maxY === minY) return chartH / 2;
    return chartH - padB - ((val - minY) / (maxY - minY)) * (chartH - padT - padB);
  };

  const visibleCount = Math.max(1, Math.round((spectra.points.length * scanProgress) / 100));
  const visiblePoints = spectra.points.slice(0, visibleCount);
  const svgPathData = visiblePoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getCanvasX(p.x).toFixed(1)} ${getCanvasY(p.y).toFixed(1)}`)
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-xl border border-slate-700 bg-[#0b0e17] shadow-2xl text-slate-200">
        
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#07090e]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>NASA INVESTIGATION WORKBENCH</span>
              <span>·</span>
              <span className="text-slate-400">{mission.name}</span>
            </div>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-white">
              {site.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {site.geologicFeature} · {site.historicalDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isLogged && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                EMPIRICAL DISCOVERY LOGGED
              </span>
            )}
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-slate-500 hover:text-white"
            >
              CLOSE [ESC]
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800 bg-[#111625] p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Instrument:</span>
              <div className="flex flex-wrap gap-1.5">
                {mission.instruments.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setSelectedInstId(inst.id);
                      setScanProgress(100);
                      soundFx.playChirp();
                    }}
                    className={`rounded px-3 py-1.5 font-mono text-xs transition-colors ${
                      selectedInstId === inst.id
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {inst.acronym} — {inst.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunTest}
              disabled={isScanning}
              className={`rounded-lg px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-lg transition-all ${
                isScanning
                  ? 'bg-amber-500 text-black cursor-wait animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
              }`}
            >
              {isScanning ? `INTEGRATING SPECTRA (${scanProgress}%)...` : `RUN ${currentInstrument.acronym} TEST`}
            </button>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#080b13] p-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-cyan-300">
                  {spectra.label}
                </span>
                <span className="block font-mono text-[11px] text-slate-400">
                  Target: {currentInstrument.targetElementsOrPhenomena.join(' · ')}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-500">
                Unit: {currentInstrument.dataUnit}
              </span>
            </div>

            <div className="relative overflow-x-auto">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-56 select-none">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const yVal = minY + (maxY - minY) * (1 - pct);
                  const yPos = getCanvasY(yVal);
                  return (
                    <g key={i}>
                      <line x1={padL} y1={yPos} x2={chartW - padR} y2={yPos} stroke="#1e293b" strokeDasharray="3 3" />
                      <text x={padL - 8} y={yPos + 4} textAnchor="end" fill="#64748b" className="font-mono text-[10px]">
                        {yVal.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                <line x1={padL} y1={chartH - padB} x2={chartW - padR} y2={chartH - padB} stroke="#334155" />
                <text x={chartW / 2} y={chartH - 8} textAnchor="middle" fill="#94a3b8" className="font-mono text-[11px]">
                  {spectra.xLabel}
                </text>

                <text
                  x={-chartH / 2}
                  y={16}
                  transform="rotate(-90)"
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="font-mono text-[11px]"
                >
                  {spectra.yLabel}
                </text>

                {visiblePoints.length > 1 && (
                  <path
                    d={`${svgPathData} L ${getCanvasX(visiblePoints[visiblePoints.length - 1].x)} ${chartH - padB} L ${getCanvasX(visiblePoints[0].x)} ${chartH - padB} Z`}
                    fill="url(#curveGradient)"
                  />
                )}

                {visiblePoints.length > 1 && (
                  <path d={svgPathData} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                )}

                {visiblePoints.map((pt, pIdx) => {
                  const px = getCanvasX(pt.x);
                  const py = getCanvasY(pt.y);
                  return (
                    <g key={pIdx}>
                      <circle cx={px} cy={py} r="4" fill="#38bdf8" stroke="#080b13" strokeWidth="1.5" />
                      {pt.label && (
                        <text
                          x={px}
                          y={py - 8}
                          textAnchor={px > chartW - 100 ? 'end' : px < 100 ? 'start' : 'middle'}
                          fill="#e2e8f0"
                          className="font-mono text-[9px] font-semibold"
                        >
                          {pt.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div>
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('empirical')}
                className={`px-4 py-2.5 font-mono text-xs border-b-2 transition-colors ${
                  activeTab === 'empirical'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. WHAT THE ROBOT OBSERVED
              </button>
              <button
                onClick={() => setActiveTab('methodology')}
                className={`px-4 py-2.5 font-mono text-xs border-b-2 transition-colors ${
                  activeTab === 'methodology'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. HOW IT MEASURED IT
              </button>
              <button
                onClick={() => setActiveTab('conclusions')}
                className={`px-4 py-2.5 font-mono text-xs border-b-2 transition-colors ${
                  activeTab === 'conclusions'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                3. WHAT SCIENTISTS DETERMINED
              </button>
              <button
                onClick={() => setActiveTab('impact')}
                className={`px-4 py-2.5 font-mono text-xs border-b-2 transition-colors ${
                  activeTab === 'impact'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                4. WHY IT MATTERS
              </button>
            </div>

            <div className="pt-4 text-sm leading-relaxed">
              {activeTab === 'empirical' && (
                <div className="space-y-3">
                  <p className="text-slate-200">{site.observations.summary}</p>
                  <div className="rounded-lg border border-slate-800 bg-[#070a12] p-3.5 space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                      Empirical Sensor Recordings
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      {site.observations.empiricalPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'methodology' && (
                <div className="space-y-3">
                  <p className="text-slate-200">{site.measurementMethod.summary}</p>
                  <div className="rounded-lg border border-slate-800 bg-[#070a12] p-3.5 space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                      Instrumentation & Test Protocols
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      {site.measurementMethod.testProtocol.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'conclusions' && (
                <div className="space-y-3">
                  <p className="text-slate-200">{site.scientificDeterminations.summary}</p>
                  <div className="rounded-lg border border-slate-800 bg-[#070a12] p-3.5 space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                      Definitive Conclusions Reached by Science Teams
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      {site.scientificDeterminations.keyConclusions.map((kc, i) => (
                        <li key={i}>{kc}</li>
                      ))}
                    </ul>
                    {site.scientificDeterminations.chemicalFormulasOrModels && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="font-mono text-[11px] text-amber-300 uppercase">Chemical Stoichiometry & Models:</span>
                        {site.scientificDeterminations.chemicalFormulasOrModels.map((chem, i) => (
                          <div key={i} className="font-mono text-xs text-emerald-400 mt-0.5">
                            {chem}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'impact' && (
                <div className="space-y-3">
                  <p className="text-slate-200">{site.whyItMatters.summary}</p>
                  <div className="rounded-lg border border-slate-800 bg-[#070a12] p-3.5 space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                      Lasting Impact on Astrobiology & Planetary Science
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      {site.whyItMatters.impactOnScience.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-slate-700/60 bg-[#07090e] p-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                      Official NASA Sources & Archival Records
                    </span>
                    <ul className="mt-1 space-y-1 text-xs">
                      {site.nasaSources.map((src, idx) => (
                        <li key={idx} className="text-slate-300">
                          <strong className="text-cyan-300">{src.title}</strong> — {src.citation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 bg-[#07090e] text-xs font-mono">
          <span className="text-slate-400">
            Source: {mission.nasaPrimarySource}
          </span>
          <button
            onClick={onClose}
            className="rounded bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-slate-200 transition-colors"
          >
            Return to 3D Navigation
          </button>
        </div>
      </div>
    </div>
  );
};
