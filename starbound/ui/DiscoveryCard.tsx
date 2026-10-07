import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Discovery } from '../data/discoveries';
import { SketchfabViewer } from './SketchfabViewer';

interface DiscoveryCardProps {
  discovery: Discovery;
  onClose: () => void;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ discovery, onClose }) => {
  const [show3dModal, setShow3dModal] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const photos = discovery.photos && discovery.photos.length > 0 ? discovery.photos : [];
  // Show the first photo that has not failed to load; if all fail, show the text fallback for the first.
  const firstOk = photos.findIndex((_, i) => !imgErrors[i]);
  const activePhotoIdx = firstOk === -1 ? 0 : firstOk;
  const currentPhoto = photos[activePhotoIdx] || photos[0];

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-40 block overflow-y-auto overscroll-contain p-4 bg-[#3D1206]/75 backdrop-blur-sm"
          style={{ WebkitOverflowScrolling: 'touch' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div className="min-h-full w-full flex items-center justify-center py-4">
            <motion.div
              className={`relative w-full max-w-lg bg-[#68230D] border-2 border-amber-300/55 rounded-3xl p-5 sm:p-6 shadow-2xl text-[#FFF8EB] flex flex-col gap-4`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
           
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider bg-amber-400 text-black shadow-sm flex items-center gap-1.5 animate-pulse">
                    <span>✨</span>
                    <span>DISCOVERY FOUND!</span>
                  </span>
                  <span
                    className={`hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      discovery.badge === 'Real NASA discovery'
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                        : 'bg-orange-500/20 text-orange-200 border border-orange-400/40'
                    }`}
                  >
                    {discovery.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-[#622110] hover:bg-[#852C16] text-[#F2D9A4] flex items-center justify-center font-bold text-base transition-colors focus-visible:outline-2 focus-visible:outline-[#EFE7D8] cursor-pointer"
                    aria-label="Close discovery"
                  >
                    ✕
                  </button>
                </div>
              </div>

             
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-['Fraunces'] text-[#EFE7D8]">
                  {discovery.title}
                </h2>
              </div>

             
              {currentPhoto && (
                <div className="w-full rounded-2xl border-2 border-amber-200/40 bg-[#2B0D05] overflow-hidden flex flex-col">
                  <div className="relative w-full h-48 sm:h-60 bg-[#1B0703] flex items-center justify-center overflow-hidden">
                    {!imgErrors[activePhotoIdx] ? (
                      <img
                        src={currentPhoto.url}
                        alt={currentPhoto.caption}
                        onError={() =>
                          setImgErrors((prev) => ({ ...prev, [activePhotoIdx]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#451608] to-[#260B04]">
                        <span className="text-3xl mb-1">📸</span>
                        <p className="text-sm font-bold text-amber-200">{discovery.title}</p>
                        <p className="text-xs text-amber-100/80 mt-1 max-w-md">
                          {currentPhoto.caption}
                        </p>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-amber-300/40 text-[11px] font-bold text-amber-200">
                      📸 {currentPhoto.credit}
                    </span>
                  </div>
                </div>
              )}

              
              <div className="bg-[#4D1909]/90 border border-amber-300/40 rounded-2xl p-4">
                  <p className="text-lg sm:text-xl font-bold text-[#FFF8EB] leading-relaxed font-['Plus_Jakarta_Sans']">
                    {discovery.kidsText}
                  </p>
                </div>

              
              {discovery.sketchfab && (
                <button
                  onClick={() => setShow3dModal(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C44810] to-[#E05C1C] hover:brightness-110 text-white font-bold text-base shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🪐</span> Inspect 3D Model on Sketchfab
                </button>
              )}

             
              <button
                onClick={onClose}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:brightness-110 text-white font-extrabold text-base shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
              >
                <span>✨</span>
                <span>Got It! Keep Driving!</span>
                <span>📖</span>
              </button>

             
              <div className="pt-2 border-t border-amber-200/25 flex items-center justify-between text-xs sm:text-sm text-amber-100">
                <span>Source: {discovery.source}</span>
                <span className="text-xs text-amber-200 font-mono">NASA JPL</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

     
      {show3dModal && discovery.sketchfab && (
        <SketchfabViewer
          config={discovery.sketchfab}
          onClose={() => setShow3dModal(false)}
        />
      )}
    </>
  );
};
