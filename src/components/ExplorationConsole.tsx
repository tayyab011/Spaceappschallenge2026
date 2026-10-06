
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { NASA_MISSIONS } from '../exploration-console/data/nasaMissions';
import { NasaMission, ScienceSite, TelemetryData } from '../exploration-console/types';
import { getEnrichedSiteData } from '../exploration-console/data/siteCosmoData';
import { GlossaryTerm } from '../exploration-console/data/scientificGlossary';
import { CosmoHeader } from '../exploration-console/components/CosmoHeader';
import { LeftExpeditionCards } from '../exploration-console/components/LeftExpeditionCards';
import { RightExpeditionCards } from '../exploration-console/components/RightExpeditionCards';
import { CenterTargetReticle } from '../exploration-console/components/CenterTargetReticle';
import { ScientificSimulation3D, SimulationHandle } from '../exploration-console/components/ScientificSimulation3D';
import { ScienceReportModal } from '../exploration-console/components/ScienceReportModal';
import { GlossaryModal } from '../exploration-console/components/GlossaryModal';
import { soundFx } from '../exploration-console/utils/audio';

interface ExplorationConsoleProps {

  onExit?: () => void;
}

export const ExplorationConsole: React.FC<ExplorationConsoleProps> = ({ onExit }) => {
  const simRef = useRef<SimulationHandle>(null);

 
  const [currentMission, setCurrentMission] = useState<NasaMission>(NASA_MISSIONS[4]);
  const [activeSite, setActiveSite] = useState<ScienceSite | null>(null);
  const [targetAutonavSite, setTargetAutonavSite] = useState<ScienceSite | null>(null);
  const [isDriving, setIsDriving] = useState<boolean>(false);

  const [hasReachedDestination, setHasReachedDestination] = useState<boolean>(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(false);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);

  const [showDiscoveryModal, setShowDiscoveryModal] = useState<boolean>(false);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [, setTelemetry] = useState<TelemetryData>({
    x: 0,
    y: 0,
    z: 0,
    speed: 0,
    headingDeg: 0,
    pitchDeg: 0,
    rollDeg: 0,
    distanceTraveledMeters: 0,
    powerWatts: currentMission.specs.powerOutputWatts,
    slopeGradePercent: 0,
    inclineStatus: 'nominal',
    tractionSlip: 0,
  });

  const selectedSite = activeSite || currentMission.sites[0];
  const enrichedSite = selectedSite ? getEnrichedSiteData(selectedSite) : null;

  useEffect(() => {
    const accentColor = selectedSite?.beaconColor || '#f59e0b';
    document.documentElement.style.setProperty('--site-accent', accentColor);
    document.documentElement.style.setProperty('--site-accent-glow', `${accentColor}55`);
  }, [selectedSite]);

  const handleSelectMission = useCallback((mission: NasaMission) => {
    setCurrentMission(mission);
    setActiveSite(null);
    setTargetAutonavSite(null);
    setIsDriving(false);
    setHasReachedDestination(false);
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
    soundFx.playChirp();
  }, []);

  const handleToggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  }, [isMuted]);

  const handleSelectTargetSite = useCallback((site: ScienceSite) => {
    setActiveSite(site);
    setHasReachedDestination(false);
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
    soundFx.playChirp();
  }, []);

  const handleDriveToSite = useCallback(() => {
    if (selectedSite) {
      setTargetAutonavSite(selectedSite);
      setIsDriving(true);
      setHasReachedDestination(false);
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
      soundFx.playChirp();
    }
  }, [selectedSite]);

  const handleMoveToNextSite = useCallback((nextSite: ScienceSite) => {
    setActiveSite(nextSite);
    setTargetAutonavSite(nextSite);
    setIsDriving(true);
    setHasReachedDestination(false);
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
    soundFx.playChirp();
  }, []);

  const handleTargetReached = useCallback(() => {
    setTargetAutonavSite(null);
    setIsDriving(false);
    setHasReachedDestination(true);
    setLeftPanelOpen(true);
    setRightPanelOpen(true);
    soundFx.playDiscoveryChime();
  }, []);

  const handleBack = useCallback(() => {
    soundFx.playChirp();
    onExit?.();
  }, [onExit]);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#07090e] text-[#e2e8f0] font-sans select-none">
      <CosmoHeader
        currentMission={currentMission}
        onSelectMission={handleSelectMission}
        onBack={handleBack}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      <main className="relative flex-1 w-full overflow-hidden">
        <ScientificSimulation3D
          ref={simRef}
          mission={currentMission}
          activeSite={activeSite}
          targetAutonavSite={targetAutonavSite}
          cameraMode="first_person"
          onSelectSite={(site) => {
            handleSelectTargetSite(site);
          }}
          onClearAutonav={handleTargetReached}
          onTelemetryUpdate={setTelemetry}
        />

        <CenterTargetReticle
          currentSite={selectedSite}
          missionName={currentMission.name}
          sites={currentMission.sites}
          onSelectSite={handleSelectTargetSite}
          onDriveToSite={handleDriveToSite}
          onMoveToNextSite={handleMoveToNextSite}
          isDriving={isDriving}
          hasReachedDestination={hasReachedDestination}
        />

        {leftPanelOpen ? (
          <div className="absolute top-3 left-3 sm:left-4 z-20 animate-in fade-in slide-in-from-left duration-200">
            <LeftExpeditionCards
              mission={currentMission}
              activeSite={selectedSite}
              enrichedSite={enrichedSite}
              hasReachedDestination={hasReachedDestination}
              onDriveToSite={handleDriveToSite}
              onClose={() => setLeftPanelOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="absolute top-3 left-3 sm:left-4 z-20 flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#161218]/90 hover:bg-[#161218] px-3 py-1.5 font-sans text-xs font-bold text-amber-300 hover:text-white backdrop-blur-xl shadow-xl transition-all cursor-pointer"
            title="Open Discovery Panel"
          >
            <span>❯</span>
            <span>{hasReachedDestination ? 'Discoveries' : 'Instruments Stowed'}</span>
          </button>
        )}

        {rightPanelOpen ? (
          <div className="absolute top-3 right-3 sm:right-4 z-20 animate-in fade-in slide-in-from-right duration-200">
            <RightExpeditionCards
              mission={currentMission}
              activeSite={selectedSite}
              enrichedSite={enrichedSite}
              hasReachedDestination={hasReachedDestination}
              onOpenDiscoveryModal={() => setShowDiscoveryModal(true)}
              onOpenGlossary={(term) => setActiveGlossaryTerm(term)}
              onDriveToSite={handleDriveToSite}
              onClose={() => setRightPanelOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setRightPanelOpen(true)}
            className="absolute top-3 right-3 sm:right-4 z-20 flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#161218]/90 hover:bg-[#161218] px-3 py-1.5 font-sans text-xs font-bold text-purple-300 hover:text-white backdrop-blur-xl shadow-xl transition-all cursor-pointer"
            title="Open Scientific Determination Panel"
          >
            <span>{hasReachedDestination ? 'Determination' : 'Sensors Standby'}</span>
            <span>❮</span>
          </button>
        )}
      </main>

      {showDiscoveryModal && selectedSite && (
        <ScienceReportModal
          mission={currentMission}
          site={selectedSite}
          enrichedSite={enrichedSite}
          onClose={() => setShowDiscoveryModal(false)}
        />
      )}

      {activeGlossaryTerm && (
        <GlossaryModal term={activeGlossaryTerm} onClose={() => setActiveGlossaryTerm(null)} />
      )}
    </div>
  );
};

export default ExplorationConsole;