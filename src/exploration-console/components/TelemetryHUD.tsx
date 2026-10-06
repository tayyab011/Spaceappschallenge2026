import React from 'react';
import { NasaMission, ScienceSite, TelemetryData } from '../types';
//made with google ai studio
interface TelemetryHUDProps {
  mission: NasaMission;
  telemetry: TelemetryData;
  activeSite: ScienceSite | null;
  onOpenLab: (site: ScienceSite) => void;
  onToggleBriefing: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  mission,
  telemetry,
  activeSite,
  onOpenLab,
  onToggleBriefing,
  isMuted,
  onToggleMute,
}) => {
  const isRover = mission.missionType === 'surface_rover';

  // Distance to nearest or active site
  const targetSite = activeSite || mission.sites[0];
  const distToTarget = targetSite
    ? Math.round(Math.hypot(telemetry.x - targetSite.coordinates[0], telemetry.z - targetSite.coordinates[2]))
    : 0;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-5 text-slate-100">
      
      {/* Top Telemetry Strip */}
      <div className="flex flex-wrap items-start justify-between gap-3 pointer-events-auto">
        {/* Mission Status Badge */}
        <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-[#070a13]/90 px-4 py-2.5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
              {mission.agency}
            </span>
          </div>
          <span className="font-sans text-base font-bold text-white tracking-tight">
            {mission.name} <span className="font-mono font-normal text-xs text-slate-400">({mission.targetDestination})</span>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {mission.landingOrFlybyLocation}
          </span>
        </div>

        {/* Center: terrain label. The terrain is procedural, so it is labelled as illustrative, not as MOLA/LOLA data. */}
        <div className="hidden lg:flex items-center gap-2.5 rounded-xl border border-cyan-500/30 bg-[#070d18]/90 px-3.5 py-2 font-mono text-xs text-cyan-200 backdrop-blur-md shadow-xl">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span>
            ILLUSTRATIVE TERRAIN · PROCEDURAL, NOT SURVEY DATA
          </span>
          <span className="text-[10px] text-cyan-400/70 border-l border-cyan-500/30 pl-2">
            Z: {telemetry.y > 0 ? `+${telemetry.y.toFixed(1)}m` : `${telemetry.y.toFixed(1)}m`} ELEV
          </span>
        </div>

        {/* Quick Actions & Sound Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="rounded-lg border border-slate-700 bg-[#070a13]/90 px-3 py-1.5 font-mono text-xs text-slate-300 backdrop-blur-md hover:border-slate-500 hover:text-white cursor-pointer"
            title="Toggle telemetry audio"
          >
            {isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}
          </button>
          <button
            onClick={onToggleBriefing}
            className="rounded-lg border border-slate-700 bg-[#070a13]/90 px-3 py-1.5 font-mono text-xs text-slate-300 backdrop-blur-md hover:border-cyan-400 hover:text-white cursor-pointer"
          >
            MISSION DOSSIER
          </button>
        </div>
      </div>

      {/* Proximity Science Action Banner when near a site */}
      {targetSite && distToTarget < 14 && (
        <div className="pointer-events-auto self-center flex flex-col items-center gap-2 rounded-xl border border-amber-500/80 bg-[#16120e]/95 p-4 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200 max-w-lg text-center">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>INVESTIGATION SITE IN RANGE · {distToTarget}m</span>
          </div>
          <h3 className="font-sans text-lg font-bold text-white">
            {targetSite.name}
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            {targetSite.geologicFeature}
          </p>
          <button
            onClick={() => onOpenLab(targetSite)}
            className="mt-1 flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 font-mono text-xs font-bold text-slate-950 uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
          >
            DEPLOY INSTRUMENT & EXECUTE TEST
          </button>
        </div>
      )}

      {/* Bottom Telemetry Dashboard (Tabular & Inclinometer) */}
      <div className="pointer-events-auto self-center lg:self-end flex flex-wrap items-end gap-3 sm:gap-4 rounded-xl border border-slate-800 bg-[#070a13]/95 p-3 sm:p-3.5 backdrop-blur-md shadow-2xl font-mono text-xs">
        
        {/* Coordinates */}
        <div>
          <span className="block text-[10px] uppercase text-slate-500">Coordinates</span>
          <span className="font-semibold text-slate-200 tabular-nums">
            X: {telemetry.x.toFixed(1)} Z: {telemetry.z.toFixed(1)}
          </span>
        </div>

        <div className="h-7 w-px bg-slate-800 hidden sm:block" />

        {/* Speed */}
        <div>
          <span className="block text-[10px] uppercase text-slate-500">Velocity</span>
          <span className="font-semibold text-emerald-400 tabular-nums">
            {telemetry.speed.toFixed(1)} {isRover ? 'km/h' : 'km/s'}
          </span>
        </div>

        <div className="h-7 w-px bg-slate-800 hidden sm:block" />

        {/* Heading */}
        <div>
          <span className="block text-[10px] uppercase text-slate-500">Azimuth</span>
          <span className="font-semibold text-cyan-300 tabular-nums">
            {telemetry.headingDeg}°{' '}
            {telemetry.headingDeg > 315 || telemetry.headingDeg <= 45
              ? 'N'
              : telemetry.headingDeg <= 135
              ? 'E'
              : telemetry.headingDeg <= 225
              ? 'S'
              : 'W'}
          </span>
        </div>

        {isRover && (
          <>
            <div className="h-7 w-px bg-slate-800 hidden sm:block" />
            {/* Inclinometer Pitch & Roll */}
            <div>
              <span className="block text-[10px] uppercase text-slate-500">Pitch / Roll</span>
              <span
                className={`font-semibold tabular-nums ${
                  telemetry.inclineStatus === 'critical_tilt'
                    ? 'text-rose-400 animate-pulse'
                    : telemetry.inclineStatus === 'steep_warning'
                    ? 'text-amber-400'
                    : 'text-slate-200'
                }`}
              >
                {telemetry.pitchDeg}° / {telemetry.rollDeg}°
              </span>
            </div>

            <div className="h-7 w-px bg-slate-800 hidden sm:block" />
            {/* Slope Grade */}
            <div>
              <span className="block text-[10px] uppercase text-slate-500">Slope Grade</span>
              <span className="font-semibold text-slate-200 tabular-nums">
                {telemetry.slopeGradePercent > 0 ? `+${telemetry.slopeGradePercent}%` : `${telemetry.slopeGradePercent}%`}
              </span>
            </div>
          </>
        )}

        <div className="h-7 w-px bg-slate-800 hidden sm:block" />

        {/* Power Bus */}
        <div>
          <span className="block text-[10px] uppercase text-slate-500">Power System</span>
          <span className="font-semibold text-amber-300 tabular-nums">
            {telemetry.powerWatts} W
          </span>
        </div>

        <div className="h-7 w-px bg-slate-800 hidden sm:block" />

        {/* Odometer */}
        <div>
          <span className="block text-[10px] uppercase text-slate-500">Traverse</span>
          <span className="font-semibold text-slate-200 tabular-nums">
            {telemetry.distanceTraveledMeters.toFixed(1)} m
          </span>
        </div>
      </div>
    </div>
  );
};
