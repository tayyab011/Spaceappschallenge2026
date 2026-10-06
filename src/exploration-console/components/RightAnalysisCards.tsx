import React, { useState } from 'react';
import { CosmoSiteEnrichment } from '../data/siteCosmoData';

interface RightAnalysisCardsProps {
  enrichedSite: CosmoSiteEnrichment | null;
  siteName: string;
  onOpenReport: () => void;
}

export const RightAnalysisCards: React.FC<RightAnalysisCardsProps> = ({
  enrichedSite,
  siteName,
  onOpenReport,
}) => {
  const [viewMode, setViewMode] = useState<'structure' | 'composition'>('structure');

  const curve = enrichedSite?.densityCurve || {
    min: 1.2,
    current: 3.4,
    max: 7.9,
    unit: 'g/cm³',
    points: [4, 8, 14, 28, 55, 84, 98, 76, 52, 34, 22, 14, 8, 4],
  };

  const minerals = enrichedSite?.mineralRatio || [
    { name: 'Iron Oxide (Hematite)', formula: 'Fe₂O₃', percentage: 52, color: '#f59e0b', simpleExplanation: 'Water spheres' },
    { name: 'Jarosite Crystals', formula: 'KFe₃(SO₄)₂', percentage: 26, color: '#eab308', simpleExplanation: 'Sulfate salts' },
    { name: 'Silica Matrix', formula: 'SiO₂', percentage: 22, color: '#94a3b8', simpleExplanation: 'Bedrock' },
  ];

  const purity = enrichedSite?.purityScore ?? 78;
  const radiation = enrichedSite?.radiationLevelUsSv ?? 0.7;

  return (
    <div className="pointer-events-none flex flex-col gap-3 max-w-[270px] sm:max-w-[290px]">
      
      <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#161214]/60 p-4 backdrop-blur-xl shadow-2xl text-slate-100">
        <div className="grid grid-cols-2 divide-x divide-white/10">
          <div className="pr-3">
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-3xl font-bold tracking-tight text-white tabular-nums">
                {radiation}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                µSv
              </span>
            </div>
            <span className="block mt-1 font-sans text-xs text-slate-400">
              Radiation
            </span>
          </div>

          <div className="pl-3">
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-3xl font-bold tracking-tight text-white tabular-nums">
                {purity}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                %
              </span>
            </div>
            <span className="block mt-1 font-sans text-xs text-slate-400">
              Purity
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#161214]/60 p-4 backdrop-blur-xl shadow-2xl text-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-sans text-sm font-semibold text-white">View</h4>
          <span className="font-mono text-xs text-slate-500">···</span>
        </div>

        <div className="flex rounded-full bg-white/10 p-0.5 border border-white/10 text-xs font-sans mb-3">
          <button
            onClick={() => setViewMode('structure')}
            className={`flex-1 rounded-full py-1 text-center font-medium transition-colors cursor-pointer ${
              viewMode === 'structure' ? 'bg-[#251f22] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Structure
          </button>
          <button
            onClick={() => setViewMode('composition')}
            className={`flex-1 rounded-full py-1 text-center font-medium transition-colors cursor-pointer ${
              viewMode === 'composition' ? 'bg-[#251f22] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Composition
          </button>
        </div>
        <div className="relative h-20 w-full mb-2">
          <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {curve.points.map((val, i) => {
              const x = (i / (curve.points.length - 1)) * 180 + 10;
              const h = (val / 100) * 65;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={75}
                  x2={x}
                  y2={75 - h}
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  opacity={i === 6 ? 1 : 0.45}
                />
              );
            })}
            <circle cx="10" cy="72" r="3" fill="#ffffff" />
            <circle cx="150" cy="72" r="3" fill="#ffffff" />
          </svg>
        </div>

        <div className="grid grid-cols-3 text-center border-t border-white/10 pt-2 font-sans text-xs">
          <div>
            <span className="block text-[10px] text-slate-400">Min</span>
            <span className="font-semibold text-slate-200 tabular-nums">{curve.min} {curve.unit}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">Current</span>
            <span className="font-semibold text-white tabular-nums">{curve.current} {curve.unit}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">Max</span>
            <span className="font-semibold text-slate-200 tabular-nums">{curve.max} {curve.unit}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <span className="block font-sans text-xs font-semibold text-white mb-2">Mineral Ratio</span>
          
          <div className="relative flex items-center justify-center py-1">
            <svg viewBox="0 0 160 85" className="w-36 h-20">
              <path
                d="M 20 75 A 60 60 0 0 1 140 75"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 20 75 A 60 60 0 0 1 125 40"
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute bottom-1 text-center">
              <span className="font-sans text-sm font-bold text-white tabular-nums">
                {minerals[0]?.percentage || 78}%
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-[11px] font-sans">
            {minerals.slice(0, 2).map((m, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.formula}</span>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenReport}
          className="mt-4 w-full rounded-xl bg-white/15 hover:bg-white/25 border border-white/10 py-2.5 font-sans text-xs font-semibold text-white transition-all shadow-lg backdrop-blur-md cursor-pointer text-center"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};
