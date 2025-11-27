'use client';

import { useStatus } from '../context/StatusContext';

export default function Status() {
  const { status } = useStatus();

  // Determine colors based on mode
  const getModeColor = () => {
    switch (status.mode) {
      case 'INSERT': return 'bg-blue text-base';
      case 'VISUAL': return 'bg-yellow text-base';
      default: return 'bg-green text-base';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-mantle text-text font-mono text-xs border-t border-surface0 z-50 overflow-hidden">
      <div className="flex justify-between items-center min-w-0">
        <div className="flex items-center min-w-0 flex-shrink-0">
          <div className={`${getModeColor()} px-2 sm:px-3 py-1 font-bold uppercase transition-colors duration-200 whitespace-nowrap`}>
            {status.mode}
          </div>
          <div className="bg-surface1 px-2 sm:px-3 py-1 flex items-center gap-2 text-subtext1 whitespace-nowrap">
            <span>main*</span>
          </div>
          <div className="px-2 sm:px-3 py-1 text-subtext0 flex items-center gap-2 min-w-0">
            <span className="truncate max-w-[100px] sm:max-w-none">{status.filename}</span>
            {status.isModified && <span className="text-overlay1 flex-shrink-0">[+]</span>}
          </div>
        </div>

        <div className="flex items-center flex-shrink-0">
          <div className="px-2 sm:px-3 py-1 text-subtext0 whitespace-nowrap hidden sm:block">
            {status.encoding}
          </div>
          <div className="px-2 sm:px-3 py-1 text-subtext0 whitespace-nowrap hidden md:block">
            {status.fileType}
          </div>
          <div className={`${getModeColor()} px-2 sm:px-3 py-1 font-bold transition-colors duration-200 whitespace-nowrap`}>
            {status.statusMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
