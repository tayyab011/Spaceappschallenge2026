import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SketchfabEmbedConfig } from '../data/discoveries';

interface SketchfabViewerProps {
  config: SketchfabEmbedConfig;
  onClose: () => void;
}

export const SketchfabViewer: React.FC<SketchfabViewerProps> = ({ config, onClose }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  const extraIframeProps: Record<string, string | boolean> = {
    'xr-spatial-tracking': 'true',
    'execution-while-out-of-viewport': 'true',
    'execution-while-not-rendered': 'true',
    'web-share': 'true',
    mozallowfullscreen: 'true',
    webkitallowfullscreen: 'true',
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="relative w-full max-w-3xl bg-[#3E1408] border border-[#F2D9A4]/30 rounded-2xl p-5 shadow-2xl text-[#EFE7D8] flex flex-col gap-3"
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
        >
      
          <div className="flex items-center justify-between border-b border-[#F2D9A4]/20 pb-3">
            <div>
              <h3 className="text-xl font-bold font-['Fraunces'] text-[#EFE7D8]">
                {config.modelTitle}
              </h3>
              {config.note && (
                <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                  ⚠️ {config.note}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#5C2010] hover:bg-[#7D2C17] text-[#F2D9A4] text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#EFE7D8]"
              aria-label="Close 3D viewer"
            >
              ✕ Close
            </button>
          </div>

        
        
          <div className="relative w-full aspect-video bg-[#1F0803] rounded-xl overflow-hidden border border-[#F2D9A4]/15">
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-[#F2D9A4]/80 text-sm">
                <div className="w-8 h-8 border-3 border-[#C44810] border-t-transparent rounded-full animate-spin" />
                <span>Loading 3D model from Sketchfab...</span>
              </div>
            )}

            {hasError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[#F2D9A4] gap-2">
                <span className="text-3xl">📡</span>
                <p className="font-semibold text-base">Could not connect to Sketchfab</p>
                <p className="text-xs text-[#F2D9A4]/70 max-w-md">
                  Check your internet connection or view the model directly on Sketchfab below!
                </p>
                <a
                  href={config.modelPage}
                  target="_blank"
                  rel="nofollow noopener"
                  className="mt-2 inline-block px-4 py-2 bg-[#C44810] hover:bg-[#D85316] rounded-xl text-white font-medium text-xs transition-colors"
                >
                  Open on Sketchfab ↗
                </a>
              </div>
            ) : (
              <iframe
                title={config.modelTitle}
                src={config.src}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                {...extraIframeProps}
              />
            )}
          </div>

       
          <div className="text-xs text-[#F2D9A4]/80 flex flex-wrap items-center gap-1.5 pt-1">
            <span>3D Model:</span>
            <a
              href={config.modelPage}
              target="_blank"
              rel="nofollow noopener"
              className="text-[#F2D9A4] underline font-medium hover:text-white"
            >
              {config.modelTitle}
            </a>
            <span>by</span>
            <a
              href={config.authorPage}
              target="_blank"
              rel="nofollow noopener"
              className="text-[#F2D9A4] underline font-medium hover:text-white"
            >
              {config.authorName}
            </a>
            <span>on</span>
            <a
              href="https://sketchfab.com"
              target="_blank"
              rel="nofollow noopener"
              className="text-[#F2D9A4] underline font-medium hover:text-white"
            >
              Sketchfab
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
