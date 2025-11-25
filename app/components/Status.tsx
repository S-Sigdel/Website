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
    <div className="fixed bottom-0 left-0 w-full bg-mantle text-text font-mono text-xs border-t border-surface0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex">
          <div className={`${getModeColor()} px-3 py-1 font-bold uppercase transition-colors duration-200`}>
            {status.mode}
          </div>
          <div className="bg-surface1 px-3 py-1 flex items-center gap-2 text-subtext1">
            <span>main*</span>
          </div>
          <div className="px-3 py-1 text-subtext0 flex items-center gap-2">
            <span>{status.filename}</span>
            {status.isModified && <span className="text-overlay1">[+]</span>}
          </div>
        </div>

        <div className="flex">
          <div className="px-3 py-1 text-subtext0">
            {status.encoding}
          </div>
          <div className="px-3 py-1 text-subtext0">
            {status.fileType}
          </div>
          <div className="bg-surface1 text-text px-3 py-1 font-bold">
            {status.percentage}
          </div>
          <div className={`${getModeColor()} px-3 py-1 font-bold transition-colors duration-200`}>
            {status.statusMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
