import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Award,
  Check,
  Sparkles,
  BookOpen,
  Clock,
  Compass,
  Sun,
  Shield,
  Disc,
  Eye,
  Footprints,
  Flag,
  Rocket,
  Play,
  Heart,
} from 'lucide-react';
import { BotMission } from '../types';
import { ReadAloudButton } from './ReadAloudButton';
import { playChimeSound, triggerCelebrationConfetti } from '../utils/speechAudio';

interface BotDetailPanelProps {
  bot: BotMission | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlockBadge: (badgeId: string) => void;
  isBadgeAlreadyUnlocked: boolean;
  onEnterSimulation: (bot: BotMission) => void;
}

export const BotDetailPanel: React.FC<BotDetailPanelProps> = ({
  bot,
  isOpen,
  onClose,
  onUnlockBadge,
  isBadgeAlreadyUnlocked,
  onEnterSimulation,
}) => {
  const [badgeJustUnlocked, setBadgeJustUnlocked] = useState(false);
  const [showTwinStory, setShowTwinStory] = useState(false);

  useEffect(() => {
    if (isOpen && bot) {
      if (!isBadgeAlreadyUnlocked) {
        onUnlockBadge(bot.badge.id);
        setBadgeJustUnlocked(true);
        playChimeSound('badge');
        triggerCelebrationConfetti();
      }
    } else {
      setBadgeJustUnlocked(false);
      setShowTwinStory(false);
    }
  }, [isOpen, bot, isBadgeAlreadyUnlocked, onUnlockBadge]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!bot) return null;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="h-5 w-5" />;
      case 'Compass':
        return <Compass className="h-5 w-5" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'Flag':
        return <Flag className="h-5 w-5" />;
      case 'Sun':
        return <Sun className="h-5 w-5" />;
      case 'Rocket':
        return <Rocket className="h-5 w-5" />;
      case 'Shield':
        return <Shield className="h-5 w-5" />;
      case 'Disc':
        return <Disc className="h-5 w-5" />;
      case 'Eye':
        return <Eye className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const isMars = bot.frontierId === 'mars';
  const isMoon = bot.frontierId === 'moon';
  const isDeep = bot.frontierId === 'deep';

  const overviewSpeechText = `${bot.name}. Launched in ${bot.launchYear} by ${bot.operator}. ${bot.teaser}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Slide-up Container with Framer Motion */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl sm:rounded-3xl border-2 border-white/15 bg-[#0e111a] p-6 shadow-2xl sm:p-8"
            style={{
              boxShadow: isMars
                ? '0 0 60px -10px rgba(193, 68, 14, 0.45)'
                : isMoon
                ? '0 0 60px -10px rgba(154, 160, 166, 0.35)'
                : '0 0 60px -10px rgba(79, 70, 229, 0.45)',
            }}
          >
            {/* Top Bar inside panel */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 font-sans text-xs text-[#9aa0a6]">
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-bold uppercase tracking-wider text-amber-300">
                    {bot.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Launched {bot.launchYear}</span>
                  <span aria-hidden="true">·</span>
                  <span>{bot.operator}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-3xl font-normal text-[#ece7dc] sm:text-4xl">
                    {bot.name}
                  </h2>
                  <ReadAloudButton text={overviewSpeechText} label="Listen to Intro" size="sm" />
                </div>
                <p className="mt-1 font-sans text-xs font-semibold text-emerald-400">{bot.status} · {bot.location}</p>
              </div>

              <button
                onClick={onClose}
                className="rounded-2xl border border-white/10 p-2.5 text-[#9aa0a6] transition-colors hover:border-white/30 hover:bg-white/10 hover:text-[#ece7dc] cursor-pointer"
                aria-label="Close detail panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Unlockable Badge Banner */}
            <div
              className={`mt-6 flex flex-col items-start gap-4 rounded-2xl border-2 p-4 sm:flex-row sm:items-center sm:justify-between transition-all ${
                isMars
                  ? 'border-[#c1440e]/50 bg-gradient-to-r from-[#c1440e]/20 to-[#ff8a65]/10 text-[#ff8a65]'
                  : isMoon
                  ? 'border-cyan-400/40 bg-gradient-to-r from-cyan-950/40 to-slate-900/40 text-cyan-200'
                  : 'border-indigo-500/50 bg-gradient-to-r from-indigo-950/40 to-purple-950/30 text-indigo-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 shadow-lg ${
                    badgeJustUnlocked ? 'animate-bounce ring-4 ring-amber-400/50' : ''
                  } ${
                    isMars
                      ? 'border-[#c1440e] bg-[#c1440e]/30 text-[#ff8a65]'
                      : isMoon
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                      : 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {getBadgeIcon(bot.badge.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-amber-300">
                      {badgeJustUnlocked ? '🎉 New Discovery Badge Unlocked!' : '⭐ Badge in Your Collection'}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                      <Check className="h-3 w-3" /> Collected
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#ece7dc]">
                    {bot.badge.title}
                  </h3>
                  <p className="text-xs text-[#ece7dc]/80">{bot.badge.summary}</p>
                </div>
              </div>

              {/* Enter Simulation Button */}
              <button
                onClick={() => {
                  onClose();
                  onEnterSimulation(bot);
                }}
                className="flex items-center gap-2.5 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-sans text-sm font-bold text-white shadow-xl transition-transform hover:scale-105 hover:from-amber-400 hover:to-orange-400 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Test-Drive in 3D!</span>
              </button>
            </div>

            {/* Section 1: "What it found" (The Science / Discovery, factual) */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <h3 className="font-sans text-sm uppercase tracking-wider text-amber-300 font-bold">
                    What It Found
                  </h3>
                </div>
                <ReadAloudButton text={bot.whatItFound} label="Listen to Discoveries" size="sm" />
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                <p className="text-base leading-relaxed text-[#ece7dc]/95">
                  {bot.whatItFound}
                </p>
              </div>
            </div>

            {/* Section 2: "What happened to it" (Its Fate) */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-sans text-sm uppercase tracking-wider text-cyan-300 font-bold">
                    What Happened To It
                  </h3>
                </div>
                <ReadAloudButton text={bot.whatHappened} label="Listen to Story" size="sm" />
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                <p className="text-base leading-relaxed text-[#ece7dc]/95">
                  {bot.whatHappened}
                </p>

                {/* Robot diary voice */}
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-amber-300">
                      Robot's Own Voice
                    </span>
                    <ReadAloudButton text={bot.diaryVoice} label="Listen to Robot" size="sm" />
                  </div>
                  <p className="mt-2 font-serif text-lg italic text-[#ece7dc]">
                    "{bot.diaryVoice}"
                  </p>
                </div>

                {/* Historical Note for Opportunity */}
                {bot.quoteNote && (
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-bold uppercase tracking-wider mr-1 text-amber-300">
                      Special Note:
                    </span>
                    {bot.quoteNote}
                  </div>
                )}
              </div>
            </div>

            {/* Twin Sister Story (Spirit & Opportunity) */}
            {bot.twinStory && (
              <div className="mt-8 rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-950/30 to-amber-950/20 p-5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#ece7dc]">
                        {bot.twinStory.name}
                      </h4>
                      <p className="font-sans text-xs text-orange-300 font-semibold">
                        {bot.twinStory.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ReadAloudButton text={bot.twinStory.voice} label="Listen to Spirit" size="sm" />
                    <button
                      onClick={() => setShowTwinStory(!showTwinStory)}
                      className="rounded-xl border border-orange-400/40 bg-orange-500/20 px-3 py-1 font-sans text-xs font-bold text-orange-200 hover:bg-orange-500/30 cursor-pointer"
                    >
                      {showTwinStory ? 'Hide Story' : "Read Spirit's Story"}
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="font-serif text-base italic leading-relaxed text-[#ece7dc]">
                    "{bot.twinStory.voice}"
                  </p>
                  {showTwinStory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-3 border-t border-orange-500/20 text-xs text-[#ece7dc]/90 space-y-2"
                    >
                      <p>
                        <strong className="text-orange-300">Discovery: </strong>
                        {bot.twinStory.discovery}
                      </p>
                      <p>
                        <strong className="text-orange-300">Mission: </strong>
                        {bot.twinStory.fate}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Mission Telemetry Metrics */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="font-sans text-xs uppercase tracking-wider text-[#9aa0a6] font-bold mb-3">
                Mission Explorer Stats
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {bot.metrics.map((metric, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <span className="block font-sans text-xs text-[#9aa0a6]">
                      {metric.label}
                    </span>
                    <span className="block font-sans text-base font-bold tabular-nums text-amber-300 mt-0.5">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="text-xs font-sans text-[#9aa0a6]">
                ✨ {bot.simulationPOIs.length} Real Scientific Landmarks available in 3D simulator
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-sans text-xs font-bold text-[#ece7dc] hover:bg-white/15 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onEnterSimulation(bot);
                  }}
                  className="flex items-center gap-2 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 font-sans text-xs font-bold text-white shadow-lg hover:from-amber-400 hover:to-orange-400 cursor-pointer transition-transform hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Enter 3D Simulator</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
