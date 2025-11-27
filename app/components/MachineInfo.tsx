'use client';

import { useState, useEffect, useRef } from 'react';
import SectionContainer from './SectionContainer';
import { useStatus } from '../context/StatusContext';

interface CoreInfo {
  id: number;
  usage: number;
  temperature: number;
}

interface CPUInfo {
  model: string;
  frequency: number; // MHz
  usage: number; // percentage
  temperature: number; // Celsius
  power: number; // Watts
  cores: CoreInfo[];
}

interface GPUInfo {
  usage: number; // percentage
  power: number; // Watts
}

interface BatteryInfo {
  level: number; // percentage
  timeRemaining?: string; // "00:13" format
}

interface LoadAverage {
  one: number;
  five: number;
  fifteen: number;
}

interface SystemInfo {
  username?: string;
  hostname?: string;
  os?: string;
  kernel?: string;
  uptime?: string;
  shell?: string;
  wm?: string;
  terminal?: string;
  cpu?: string | CPUInfo;
  gpu?: string | GPUInfo;
  memory?: string;
  memoryPercent?: number;
  battery?: BatteryInfo;
  systemPower?: number; // Watts
  loadAverage?: LoadAverage;
  fastfetch?: string;
  history?: {
    cpu: number[];
    gpu: number[];
    memory?: number[];
  };
  timestamp?: string | number;
  refreshRate?: number; // milliseconds
  error?: string;
}

export default function MachineInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<{ cpu: number[]; gpu: number[]; memory: number[] }>({ cpu: [], gpu: [], memory: [] });
  const { setStatus } = useStatus();

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('/api/system-status', {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch system status');
      }
      
      const data = await response.json();
      if (data.error) {
        setError(data.message || 'System monitor unavailable');
        setIsLoading(false);
        return;
      }
      
      // Update history if provided
      if (data.history) {
        historyRef.current = {
          cpu: data.history.cpu || [],
          gpu: data.history.gpu || [],
          memory: data.history.memory || []
        };
      } else if (typeof data.cpu === 'object' && data.cpu?.usage !== undefined) {
        // Build history from current data if not provided
        historyRef.current.cpu.push(data.cpu.usage);
        historyRef.current.gpu.push(typeof data.gpu === 'object' ? data.gpu?.usage || 0 : 0);
        historyRef.current.memory.push(data.memoryPercent || 0);
        
        // Keep only last 60 data points
        if (historyRef.current.cpu.length > 60) {
          historyRef.current.cpu.shift();
          historyRef.current.gpu.shift();
          historyRef.current.memory.shift();
        }
      }
      
      setSystemInfo(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system status');
      console.error('Error fetching system info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchSystemInfo();
    
    // Then fetch every 5 seconds to save resources
    const interval = setInterval(fetchSystemInfo, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper to get usage color
  const getUsageColor = (usage: number) => {
    if (usage < 30) return 'text-green';
    if (usage < 60) return 'text-yellow';
    if (usage < 80) return 'text-peach';
    return 'text-red';
  };

  // Helper to get bar color
  const getBarColor = (usage: number, index: number, total: number) => {
    // Calculate the threshold for this specific block
    // Each block represents (100 / total) percent
    // Block i covers range [i * step, (i+1) * step]
    const step = 100 / total;
    const blockStart = index * step;
    
    if (usage > blockStart) {
      if (usage < 30) return 'bg-green';
      if (usage < 60) return 'bg-yellow';
      if (usage < 80) return 'bg-peach';
      return 'bg-red';
    }
    return 'bg-surface1';
  };

  // Check if we have detailed btop-like data
  const hasDetailedData = typeof systemInfo.cpu === 'object' && systemInfo.cpu !== null && 'usage' in systemInfo.cpu;
  
  // Fallback values if data is not available
  const username = systemInfo.username || 'thinking';
  const hostname = systemInfo.hostname || 'macbookpro';
  const os = systemInfo.os || 'Arch Linux x86_64';
  const kernel = systemInfo.kernel || 'Linux 6.17.8-arch1-1';
  const uptime = systemInfo.uptime || 'Loading...';
  const shell = systemInfo.shell || 'zsh 5.9';
  const wm = systemInfo.wm || 'Hyprland';
  const terminal = systemInfo.terminal || 'ghostty';
  const cpuString = typeof systemInfo.cpu === 'string' ? systemInfo.cpu : systemInfo.cpu?.model || '11th Gen Intel(R) Core(TM) i5-1135G7';
  const gpuString = typeof systemInfo.gpu === 'string' ? systemInfo.gpu : 'Intel Iris Xe Graphics';
  const memory = systemInfo.memory || 'Loading...';
  
  const cpuInfo = typeof systemInfo.cpu === 'object' ? systemInfo.cpu : null;
  const gpuInfo = typeof systemInfo.gpu === 'object' ? systemInfo.gpu : null;
  const history = systemInfo.history || historyRef.current;
  
  const getTimestampSeconds = (ts: string | number) => {
    if (typeof ts === 'string') {
      return new Date(ts).getTime() / 1000;
    }
    return ts;
  };

  const timestampSecs = systemInfo.timestamp ? getTimestampSeconds(systemInfo.timestamp) : null;

  const lastUpdated = timestampSecs
    ? new Date(timestampSecs * 1000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  // Check if system is offline (no update in last 60 seconds)
  const isOffline = timestampSecs
    ? (Date.now() / 1000 - timestampSecs) > 60 
    : true;

  // Update global status bar
  useEffect(() => {
    setStatus({ 
      statusMessage: isOffline ? 'OFFLINE' : 'ONLINE',
      mode: isOffline ? 'OFFLINE' : 'NORMAL'
    });
  }, [isOffline, setStatus]);

  return (
    <SectionContainer id="machine" title="Machine Info">
      <div className="font-mono text-sm bg-mantle p-4 md:p-6 border border-surface0 rounded-lg overflow-x-auto">
        {error && (
          <div className="mb-4 p-3 bg-red/20 border border-red/50 rounded text-red text-xs">
            ⚠️ {error} - Make sure the C++ monitor is running on port 8080
          </div>
        )}
        
        {isOffline && !error && (
           <div className="mb-4 p-3 bg-yellow/20 border border-yellow/50 rounded text-yellow text-xs flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow"></span>
             </span>
             System Offline - Showing last known state
           </div>
        )}
        
        {hasDetailedData ? (
          // Btop-like detailed view
          <div className={`space-y-4 ${isOffline ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 text-xs border-b border-surface0 pb-2">
              <div className="flex gap-2 md:gap-4 flex-wrap">
                <span className="text-blue">cpu</span>
                <a 
                  href="https://github.com/s-sigdel/dotfiles"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-subtext0 hover:text-text cursor-pointer transition-colors"
                >
                  config
                </a>
                <span className="text-red">preset*</span>
              </div>
              <div className="text-subtext0 hidden md:block">
                {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs w-full md:w-auto">
                {systemInfo.battery && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-yellow whitespace-nowrap">BAT ▼ {systemInfo.battery.level}%</span>
                    <div className="w-12 sm:w-16 h-2 bg-surface1 rounded overflow-hidden flex-shrink-0">
                      <div 
                        className="h-full bg-yellow transition-all"
                        style={{ width: `${systemInfo.battery.level}%` }}
                      />
                    </div>
                    {systemInfo.battery.timeRemaining && (
                      <span className="text-subtext0 whitespace-nowrap">{systemInfo.battery.timeRemaining}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {systemInfo.systemPower !== undefined && (
                    <span className="text-blue whitespace-nowrap">{systemInfo.systemPower.toFixed(2)}W</span>
                  )}
                  {lastUpdated && (
                    <span className={`whitespace-nowrap text-[10px] sm:text-xs ${isOffline ? 'text-red font-bold' : 'text-subtext0'}`}>
                        {isOffline ? `OFFLINE (Last: ${lastUpdated})` : `Last update: ${lastUpdated}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left: Historical Graphs */}
              <div className="lg:col-span-1 space-y-2">
                {/* CPU History Graph */}
                <div className="bg-base p-2 rounded border border-surface0">
                  <div className="text-xs text-subtext0 mb-1">CPU</div>
                  <div className="flex items-end gap-0.5 h-16">
                    {history.cpu.slice(-30).map((value, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t transition-all ${
                          value < 30 ? 'bg-green' : value < 60 ? 'bg-yellow' : value < 80 ? 'bg-peach' : 'bg-red'
                        }`}
                        style={{ height: `${Math.min(value, 100)}%` }}
                        title={`${value.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* GPU History Graph */}
                <div className="bg-base p-2 rounded border border-surface0">
                  <div className="text-xs text-subtext0 mb-1">GPU</div>
                  <div className="flex items-end gap-0.5 h-16">
                    {history.gpu.slice(-30).map((value, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t transition-all ${
                          value < 30 ? 'bg-green' : value < 60 ? 'bg-yellow' : value < 80 ? 'bg-peach' : 'bg-red'
                        }`}
                        style={{ height: `${Math.min(value, 100)}%` }}
                        title={`${value.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                </div>

                {/* Memory History Graph */}
                <div className="bg-base p-2 rounded border border-surface0">
                  <div className="text-xs text-subtext0 mb-1">MEM</div>
                  <div className="flex items-end gap-0.5 h-16">
                    {(history.memory || []).slice(-30).map((value, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t transition-all ${
                          value < 30 ? 'bg-green' : value < 60 ? 'bg-yellow' : value < 80 ? 'bg-peach' : 'bg-red'
                        }`}
                        style={{ height: `${Math.min(value, 100)}%` }}
                        title={`${value.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Detailed Stats */}
              <div className="lg:col-span-2 space-y-4">
                {/* CPU Section */}
                {cpuInfo && (
                  <div className="bg-base p-4 rounded border border-surface0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm font-bold text-text">{cpuInfo.model}</div>
                        <div className="text-xs text-subtext0">{cpuInfo.frequency} MHz</div>
                      </div>
                    </div>
                    
                    {/* Overall CPU Usage Bar */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-blue font-bold">CPU</span>
                        <div className="flex-1 flex gap-0.5">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-3 rounded transition-all ${
                                getBarColor(cpuInfo.usage, i, 20)
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-bold ${getUsageColor(cpuInfo.usage)}`}>
                          {cpuInfo.usage.toFixed(0)}%
                        </span>
                        <span className="text-xs text-text">{cpuInfo.temperature.toFixed(0)}°C</span>
                        {cpuInfo.power > 0 && <span className="text-xs text-blue">{cpuInfo.power.toFixed(2)}W</span>}
                      </div>
                    </div>

                    {/* Individual Cores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {cpuInfo.cores.map((core) => (
                        <div key={core.id} className="text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-subtext0">C{core.id}</span>
                            <div className="flex-1 flex gap-0.5">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-2 rounded transition-all ${
                                    getBarColor(core.usage, i, 10)
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`font-bold ${getUsageColor(core.usage)}`}>
                              {core.usage.toFixed(0)}%
                            </span>
                            <span className="text-blue">{core.temperature.toFixed(0)}°C</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load Average */}
                    {systemInfo.loadAverage && (
                      <div className="text-xs text-text">
                        Load avg: {systemInfo.loadAverage.one.toFixed(2)} {systemInfo.loadAverage.five.toFixed(2)} {systemInfo.loadAverage.fifteen.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}

                {/* GPU Section */}
                {gpuInfo && (
                  <div className="bg-base p-4 rounded border border-surface0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue font-bold">GPU</span>
                      <div className="flex-1 flex gap-0.5">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-3 rounded transition-all ${
                              getBarColor(gpuInfo.usage, i, 20)
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-bold ${getUsageColor(gpuInfo.usage)}`}>
                        {gpuInfo.usage.toFixed(0)}%
                      </span>
                      {gpuInfo.power > 0 && <span className="text-xs text-blue">{gpuInfo.power.toFixed(2)}W</span>}
                    </div>
                  </div>
                )}

                {/* Memory Section */}
                {systemInfo.memoryPercent !== undefined && (
                  <div className="bg-base p-4 rounded border border-surface0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-blue font-bold">MEM</span>
                      <div className="flex-1 flex gap-0.5">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-3 rounded transition-all ${
                              getBarColor(systemInfo.memoryPercent || 0, i, 20)
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-bold ${getUsageColor(systemInfo.memoryPercent)}`}>
                        {systemInfo.memoryPercent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-subtext0 text-right">
                      {systemInfo.memory}
                    </div>
                  </div>
                )}

                {/* System Info */}
                <div className="bg-base p-4 rounded border border-surface0 text-xs space-y-1">
                  <div className="flex gap-4">
                    <span className="text-blue font-bold w-20">OS</span>
                    <span className="text-text">{os}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-blue font-bold w-20">Kernel</span>
                    <span className="text-text">{kernel}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-blue font-bold w-20">Uptime</span>
                    <span className="text-text">{uptime}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-blue font-bold w-20">Memory</span>
                    <span className="text-text">{memory}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback simple view
          <div className={`flex flex-col md:flex-row gap-8 ${isOffline ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <div className="text-blue whitespace-pre hidden md:block select-none font-bold">
              {`                   - \`
                  .o+ \`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/ \`
         ./ooosssso++osssssso+ \`
        .oossssso-\`\`\`\`/ossssss+ \`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:- \`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \`/`}
            </div>
            <div className="space-y-1 text-subtext0">
              <div className="flex gap-2 mb-2">
                <span className="text-blue font-bold">
                  {username}@{hostname}
                  {isLoading && <span className="text-overlay0 ml-2">(updating...)</span>}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">OS</span>
                <span className="text-text">{os}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">Host</span>
                <span className="text-text">{hostname}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">Kernel</span>
                <span className="text-text">{kernel}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">Uptime</span>
                <span className="text-text">{uptime}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">Shell</span>
                <span className="text-text">{shell}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">WM</span>
                <span className="text-text">{wm}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">Terminal</span>
                <span className="text-text">{terminal}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">CPU</span>
                <span className="text-text">{cpuString}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">GPU</span>
                <span className="text-text">{gpuString}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-blue font-bold w-24">Memory</span>
                <span className="text-text">{memory}</span>
              </div>
              {lastUpdated && (
                <div className="flex gap-4">
                  <span className="text-blue font-bold w-24">Updated</span>
                  <span className={`text-text ${isOffline ? 'text-red font-bold' : ''}`}>
                      {lastUpdated} {isOffline ? '(OFFLINE)' : ''}
                  </span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <div className="w-3 h-3 rounded-full bg-base border border-surface0"></div>
                <div className="w-3 h-3 rounded-full bg-red"></div>
                <div className="w-3 h-3 rounded-full bg-green"></div>
                <div className="w-3 h-3 rounded-full bg-yellow"></div>
                <div className="w-3 h-3 rounded-full bg-blue"></div>
                <div className="w-3 h-3 rounded-full bg-mauve"></div>
                <div className="w-3 h-3 rounded-full bg-teal"></div>
                <div className="w-3 h-3 rounded-full bg-text"></div>
              </div>
            </div>
          </div>
        )}
        {/* Fastfetch Output */}
        {systemInfo.fastfetch && (
          <div className="mt-4 pt-4 border-t border-surface0">
            <div className="text-xs text-subtext0 mb-2 font-bold">TERMINAL OUTPUT</div>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-base p-6 rounded border border-surface0">
              {/* ASCII Art Logo */}
              <div className="text-blue font-bold whitespace-pre text-xs md:text-sm leading-tight select-none">
{`       /\\
      /  \\
     /\\   \\
    /      \\
   /   ,,   \\
  /   |  |  -\\
 /_-''    ''-_\\
      btw`}
              </div>
              
              {/* Clean Info List */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">OS</span>
                  <span className="text-text">{os}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">Host</span>
                  <span className="text-text">{hostname}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">Kernel</span>
                  <span className="text-text">{kernel}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">Uptime</span>
                  <span className="text-text">{uptime}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">Shell</span>
                  <span className="text-text">{shell}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">WM</span>
                  <span className="text-text">{wm}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">Terminal</span>
                  <span className="text-text">{terminal}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">CPU</span>
                  <span className="text-text truncate max-w-[200px]" title={cpuString}>{cpuString}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">GPU</span>
                  <span className="text-text truncate max-w-[200px]" title={gpuString}>{gpuString}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue font-bold min-w-[80px]">Memory</span>
                  <span className="text-text">{memory}</span>
                </div>
                
                {/* Color Palette */}
                <div className="col-span-1 md:col-span-2 mt-4 flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-base border border-surface0"></div>
                  <div className="w-4 h-4 rounded-full bg-red"></div>
                  <div className="w-4 h-4 rounded-full bg-green"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow"></div>
                  <div className="w-4 h-4 rounded-full bg-blue"></div>
                  <div className="w-4 h-4 rounded-full bg-mauve"></div>
                  <div className="w-4 h-4 rounded-full bg-teal"></div>
                  <div className="w-4 h-4 rounded-full bg-text"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
