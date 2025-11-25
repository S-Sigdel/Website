'use client';

import { useState, useEffect } from 'react';

export default function VimTip() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show notification on every page load
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="hidden md:block fixed top-20 right-4 z-50 bg-surface0/95 border border-surface1 rounded-lg shadow-lg p-3 font-mono text-xs text-subtext0 max-w-xs backdrop-blur-sm animate-pop">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-mauve">💡</span>
            <span className="text-text font-semibold">Navigation (Vim-inspired)</span>
          </div>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-surface1 rounded text-green text-[9px] font-mono">j</kbd>
              <kbd className="px-1.5 py-0.5 bg-surface1 rounded text-green text-[9px] font-mono">k</kbd>
              <span className="text-overlay0">scroll</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-surface1 rounded text-green text-[9px] font-mono">gg</kbd>
              <span className="text-overlay0">top</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-surface1 rounded text-green text-[9px] font-mono">G</kbd>
              <span className="text-overlay0">bottom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-surface1 rounded text-green text-[9px] font-mono">/</kbd>
              <span className="text-overlay0">search</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-overlay0 hover:text-text transition-colors p-1 flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

