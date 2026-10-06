import React from 'react';
import { NasaMission, TelemetryData } from '../types';

interface BottomTelemetryStripProps {
  mission: NasaMission;
  telemetry: TelemetryData;
}

export const BottomTelemetryStrip: React.FC<BottomTelemetryStripProps> = ({
  mission,
  telemetry,
}) => {
  const isRover = mission.missionType === 'surface_rover';

  return (
    <div className="pointer-events-auto flex flex-col gap-2 max-w-xl text-slate-200">
      
      
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 backdrop-blur-md shadow-lg text-[10px] font-sans">
        
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="font-medium text-slate-300">Sensors Active</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Actuators</span>
          <div className="h-1.5 w-14 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-emerald-400 w-4/5 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Thermal</span>
          <div className="h-1.5 w-14 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-cyan-400 w-11/12 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Power</span>
          <div className="h-1.5 w-14 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-amber-400 w-3/4 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-slate-300 bg-black/40 px-3.5 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
        <div>
          <span className="text-[10px] uppercase text-slate-400 block">Distance</span>
          <span className="font-semibold text-white tabular-nums">
            {telemetry.distanceTraveledMeters.toFixed(1)} m
          </span>
        </div>

        <div className="h-5 w-px bg-white/10" />

        <div>
          <span className="text-[10px] uppercase text-slate-400 block">Atmosphere</span>
          <span className="font-semibold text-white tabular-nums">
            {isRover ? '6.5 mbar' : 'Vacuum'}
          </span>
        </div>

        <div className="h-5 w-px bg-white/10" />

        <div>
          <span className="text-[10px] uppercase text-slate-400 block">Earth Delay</span>
          <span className="font-semibold text-amber-300 tabular-nums">
            {isRover ? '4m 34s' : '48m 10s'}
          </span>
        </div>

        <div className="h-5 w-px bg-white/10" />

        <div>
          <span className="text-[10px] uppercase text-slate-400 block">Site Elevation</span>
          <span className="font-semibold text-cyan-300 tabular-nums">
            {telemetry.y > 0 ? `+${telemetry.y.toFixed(1)}m` : `${telemetry.y.toFixed(1)}m`}
          </span>
        </div>

        <div className="h-5 w-px bg-white/10" />

        <div className="font-mono text-[11px] text-slate-400">
          {mission.landingOrFlybyLocation.split('(')[1]?.replace(')', '') || '0.00° N, 0.00° E'}
        </div>
      </div>
    </div>
  );
};
