import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCOVERIES, Discovery } from '../data/discoveries';
import { DiscoveryCard } from './DiscoveryCard';

interface DiscoveryJournalProps {
  discoveredIds: string[];
  onClose: () => void;
}

export const DiscoveryJournal: React.FC<DiscoveryJournalProps> = ({
  discoveredIds,
  onClose,
}) => {
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);

  const foundCount = discoveredIds.length;
  const totalCount = DISCOVERIES.length;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#3D1206]/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="relative w-full max-w-3xl max-h-[88vh] bg-[#5E200C] border-2 border-amber-300/50 rounded-3xl p-6 shadow-2xl text-[#FFF8EB] flex flex-col gap-4 overflow-hidden"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
           
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/25 pb-4 shrink-0">
              <div>
                <h2 className="text-2xl font-bold font-['Fraunces'] text-[#FFF8EB]">
                  Mars Field Journal
                </h2>
                <p className="text-xs sm:text-sm text-amber-100 mt-0.5 font-['Plus_Jakarta_Sans']">
                  {foundCount} found · {totalCount - foundCount} still hidden on the red plains
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#7A2A10] hover:bg-[#943414] text-[#FFF8EB] text-sm font-semibold transition-colors cursor-pointer"
                  aria-label="Close field journal"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-2">
              {DISCOVERIES.map((item) => {
                const isFound = discoveredIds.includes(item.id);

                if (isFound) {
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDiscovery(item)}
                      className="cursor-pointer bg-[#501B0C] border border-[#F2D9A4]/30 hover:border-[#F2D9A4]/60 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-colors group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                            {item.badge === 'Real NASA discovery' ? 'NASA' : 'Sim'}
                          </span>
                          <span className="text-sm">✨</span>
                        </div>
                        <h3 className="font-bold text-base text-[#EFE7D8] font-['Fraunces'] line-clamp-1 group-hover:text-amber-200 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#F2D9A4]/85 mt-1 line-clamp-2">
                          {item.kidsText}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#F2D9A4]/15 flex items-center justify-between text-[11px] text-[#F2D9A4]/70 font-medium">
                        <span>Tap to see!</span>
                        {item.sketchfab && <span className="text-amber-300">3D 🪐</span>}
                      </div>
                    </motion.div>
                  );
                }

               
                return (
                  <div
                    key={item.id}
                    className="bg-[#2B0D05]/80 border border-dashed border-[#F2D9A4]/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center select-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1C0803] flex items-center justify-center text-xl text-[#F2D9A4]/35 font-bold mb-2">
                      ?
                    </div>
                    <span className="font-semibold text-sm text-[#F2D9A4]/50">
                      Uncharted Mystery
                    </span>
                    <span className="text-[11px] text-[#F2D9A4]/40 mt-1">
                      Search during missions to discover
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

     
      {selectedDiscovery && (
        <DiscoveryCard
          discovery={selectedDiscovery}
          onClose={() => setSelectedDiscovery(null)}
        />
      )}
    </>
  );
};
