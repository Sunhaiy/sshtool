import { useEffect, useState } from 'react';
import { SystemStats, CpuCore } from '../shared/types';
import { 
  LineChart, Line, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Monitor, Cpu, HardDrive, Network, Clock, Activity, Server 
} from 'lucide-react';
import clsx from 'clsx';

interface SystemMonitorProps {
  connectionId: string;
}

const COLORS = ['#10b981', '#374151']; // Green, Gray-700

export function SystemMonitor({ connectionId }: SystemMonitorProps) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [netHistory, setNetHistory] = useState<{ time: number; up: number; down: number }[]>([]);

  useEffect(() => {
    window.electron.startMonitoring(connectionId);
    
    const cleanup = window.electron.onStatsUpdate((_, { id, stats }) => {
      if (id === connectionId) {
        setStats(stats);
        setNetHistory(prev => {
            const next = [...prev, { 
                time: Date.now(), 
                up: stats.network.upSpeed / 1024, // KB/s
                down: stats.network.downSpeed / 1024 // KB/s
            }];
            return next.slice(-30);
        });
      }
    });

    return () => {
      cleanup();
      window.electron.stopMonitoring(connectionId);
    };
  }, [connectionId]);

  if (!stats) {
      return (
          <div className="h-full bg-background text-muted-foreground flex items-center justify-center text-sm">
              Connecting to system monitor...
          </div>
      );
  }

  const memData = [
      { name: 'Used', value: stats.memory.used },
      { name: 'Free', value: stats.memory.free + stats.memory.cached + stats.memory.buffers }
  ];

  return (
    <div className="h-full bg-background text-foreground p-3 overflow-y-auto space-y-3 font-sans border-l border-border">
      
      {/* System Info Header */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
              <Monitor className="w-5 h-5 text-primary" />
              <span className="font-bold text-card-foreground text-sm">System Overview</span>
              <span className="bg-secondary text-[10px] px-2 py-0.5 rounded-full text-secondary-foreground ml-auto border border-border">
                  {stats.os.distro}
              </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                  <span className="text-muted-foreground block">Uptime</span>
                  <span className="text-card-foreground font-mono">{stats.os.uptime}</span>
              </div>
              <div className="space-y-1 text-right">
                  <span className="text-muted-foreground block">Load Average</span>
                  <span className="text-card-foreground font-mono">{stats.cpu.totalUsage}%</span>
              </div>
          </div>
      </div>

      {/* CPU Section */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-blue-500" />
              <div className="flex-1 min-w-0">
                  <div className="font-bold text-card-foreground text-sm flex justify-between items-center">
                      <span>CPU</span>
                      <span className="text-primary text-xs font-mono">{stats.cpu.totalUsage}%</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5" title={stats.cpu.model}>
                      {stats.cpu.model}
                      {stats.cpu.speed && <span className="ml-1 text-muted-foreground opacity-70">@ {stats.cpu.speed}</span>}
                  </div>
              </div>
          </div>
          
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${stats.cpu.totalUsage}%` }} 
              />
          </div>

          <div className="grid grid-cols-4 gap-1.5">
              {stats.cpu.cores.slice(0, 16).map(core => (
                  <div key={core.id} className="h-8 bg-secondary rounded relative overflow-hidden group" title={`Core ${core.id + 1}: ${core.usage}%`}>
                      <div 
                         className={clsx(
                             "absolute bottom-0 left-0 w-full transition-all duration-500 opacity-50",
                             core.usage > 80 ? "bg-destructive" : core.usage > 50 ? "bg-yellow-500" : "bg-blue-500"
                         )}
                         style={{ height: `${core.usage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-muted-foreground font-mono z-10">
                          {core.usage}%
                      </span>
                  </div>
              ))}
          </div>
          {stats.cpu.cores.length > 16 && (
              <div className="text-center text-[10px] text-muted-foreground mt-2">
                  + {stats.cpu.cores.length - 16} more cores
              </div>
          )}
      </div>

      {/* Memory Section */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-card-foreground text-sm">Memory</span>
              </div>
              <span className="bg-secondary text-[10px] px-2 py-0.5 rounded-full text-secondary-foreground border border-border">
                  {stats.memory.total} GB
              </span>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          <span className="text-muted-foreground">Used</span>
                      </div>
                      <span className="text-card-foreground font-mono">{stats.memory.used} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-muted-foreground">Cached</span>
                      </div>
                      <span className="text-card-foreground font-mono">{stats.memory.cached} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                          <span className="text-muted-foreground">Free</span>
                      </div>
                      <span className="text-card-foreground font-mono">{stats.memory.free} GB</span>
                  </div>
              </div>
              <div className="w-20 h-20 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={[
                                { name: 'Used', value: stats.memory.used, fill: '#a855f7' }, // purple-500
                                { name: 'Cached', value: stats.memory.cached, fill: '#3b82f6' }, // blue-500
                                { name: 'Free', value: stats.memory.free + stats.memory.buffers, fill: 'hsl(var(--secondary))' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={35}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                     {Math.round((stats.memory.used / stats.memory.total) * 100)}%
                 </div>
              </div>
          </div>
      </div>

      {/* Network Section */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
              <Network className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-card-foreground text-sm">Network</span>
          </div>
          <div className="h-20 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netHistory}>
                      <defs>
                          <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="down" 
                        stroke="#6366f1" // indigo-500
                        fillOpacity={1} 
                        fill="url(#netGradient)" 
                        strokeWidth={2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="up" 
                        stroke="#10b981" // green-500
                        fill="none" 
                        strokeWidth={2} 
                        strokeDasharray="3 3"
                      />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary p-2 rounded border border-border">
                  <div className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider mb-0.5">Upload</div>
                  <div className="text-primary font-mono text-sm">{(stats.network.upSpeed / 1024).toFixed(1)} KB/s</div>
                  <div className="text-muted-foreground opacity-70 text-[9px] mt-0.5">Total: {(stats.network.totalTx / 1024 / 1024).toFixed(1)} MB</div>
              </div>
              <div className="bg-secondary p-2 rounded border border-border">
                  <div className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider mb-0.5">Download</div>
                  <div className="text-indigo-400 font-mono text-sm">{(stats.network.downSpeed / 1024).toFixed(1)} KB/s</div>
                  <div className="text-muted-foreground opacity-70 text-[9px] mt-0.5">Total: {(stats.network.totalRx / 1024 / 1024).toFixed(1)} MB</div>
              </div>
          </div>
      </div>

      {/* Disk Section */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-card-foreground text-sm">Disks</span>
          </div>
          
          <div className="space-y-4">
            {stats.disks.map((disk, idx) => (
                <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-card-foreground font-medium truncate max-w-[120px]" title={disk.mount}>{disk.mount}</span>
                            <span className="text-muted-foreground text-[10px] truncate max-w-[80px]" title={disk.filesystem}>{disk.filesystem}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">{disk.used}G</span>
                            <span className="text-muted-foreground opacity-50">/</span>
                            <span className="text-muted-foreground">{disk.size}G</span>
                        </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
                        <div 
                            className={clsx(
                                "h-full transition-all duration-500 rounded-full",
                                disk.usePercent > 90 ? "bg-destructive" : disk.usePercent > 70 ? "bg-orange-500" : "bg-primary"
                            )}
                            style={{ width: `${disk.usePercent}%` }}
                        />
                    </div>
                    <div className="flex justify-end">
                        <span className="text-[10px] text-muted-foreground">{disk.usePercent}% Used</span>
                    </div>
                </div>
            ))}
          </div>
      </div>

    </div>
  );
}
