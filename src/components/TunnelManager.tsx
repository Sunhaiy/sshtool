import { useEffect, useState } from 'react';
import { RefreshCw, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

interface Tunnel {
    id: string;
    type: 'L' | 'R';
    config: {
        srcAddr: string;
        srcPort: number;
        dstAddr: string;
        dstPort: number;
    };
}

interface TunnelManagerProps {
    connectionId: string;
}

export function TunnelManager({ connectionId }: TunnelManagerProps) {
    const [tunnels, setTunnels] = useState<Tunnel[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    // Form State
    const [type, setType] = useState<'L' | 'R'>('L');
    const [srcPort, setSrcPort] = useState('');
    const [dstCommon, setDstCommon] = useState(''); // "addr:port"
    const [dstAddr, setDstAddr] = useState('127.0.0.1'); // Default for destination
    const [dstPort, setDstPort] = useState('');

    const fetchTunnels = async () => {
        setLoading(true);
        try {
            const list = await window.electron.getTunnels(connectionId);
            setTunnels(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTunnels();
        const interval = setInterval(fetchTunnels, 5000);
        return () => clearInterval(interval);
    }, [connectionId]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!srcPort || !dstPort) return;

        try {
            await window.electron.addTunnel(connectionId, type, {
                srcAddr: type === 'L' ? '127.0.0.1' : '0.0.0.0', // Default bind addresses
                srcPort: parseInt(srcPort),
                dstAddr: dstAddr,
                dstPort: parseInt(dstPort)
            });
            setShowAdd(false);
            setSrcPort('');
            setDstPort('');
            fetchTunnels();
        } catch (err: any) {
            alert('Failed to add tunnel: ' + err.message);
        }
    };

    const handleRemove = async (tunnelId: string) => {
        try {
            await window.electron.removeTunnel(connectionId, tunnelId);
            fetchTunnels();
        } catch (err: any) {
            alert('Failed to remove tunnel: ' + err.message);
        }
    };

    return (
        <div className="h-full flex flex-col bg-background text-foreground">
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                    <ArrowRight className="w-4 h-4 text-orange-500" />
                    <span>Tunnels</span>
                    <span className="text-xs bg-secondary px-2 rounded-full">{tunnels.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className={`p-1.5 rounded transition-colors ${showAdd ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                        title="Add Tunnel"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={fetchTunnels} className="p-1.5 hover:bg-secondary rounded transition-colors" title="Refresh">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showAdd && (
                <div className="p-3 border-b border-border bg-secondary/20">
                    <form onSubmit={handleAdd} className="space-y-3">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setType('L')}
                                className={`flex-1 py-1 text-xs rounded border ${type === 'L' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground'}`}
                            >
                                <span className="font-bold mr-1">L</span> Local
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('R')}
                                className={`flex-1 py-1 text-xs rounded border ${type === 'R' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground'}`}
                            >
                                <span className="font-bold mr-1">R</span> Remote
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-1">
                                <label>{type === 'L' ? 'Local Port' : 'Remote Port'}</label>
                                <input
                                    type="number"
                                    className="w-full bg-background border border-border rounded px-2 py-1"
                                    placeholder="8080"
                                    value={srcPort}
                                    onChange={e => setSrcPort(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label>Target Address</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-border rounded px-2 py-1"
                                    placeholder="127.0.0.1"
                                    value={dstAddr}
                                    onChange={e => setDstAddr(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1 col-span-2">
                                <label>Target Port</label>
                                <input
                                    type="number"
                                    className="w-full bg-background border border-border rounded px-2 py-1"
                                    placeholder="80"
                                    value={dstPort}
                                    onChange={e => setDstPort(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-[10px] text-muted-foreground">
                            {type === 'L' ? (
                                <div className="flex items-center gap-1">
                                    <span>Local :{srcPort || '...'}</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span>Remote {dstAddr}:{dstPort || '...'}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <span>Remote :{srcPort || '...'}</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span>Local {dstAddr}:{dstPort || '...'}</span>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="w-full bg-primary text-primary-foreground py-1 rounded text-xs font-medium">
                            Start Tunnel
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {tunnels.map(t => (
                    <div key={t.id} className="bg-card border border-border rounded p-2 text-xs flex items-center justify-between group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={`font-bold font-mono px-1.5 py-0.5 rounded ${t.type === 'L' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'}`}>
                                {t.type}
                            </span>
                            <div className="flex flex-col">
                                <span className="font-medium">:{t.config.srcPort}</span>
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3" /> {t.config.dstAddr}:{t.config.dstPort}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemove(t.id)}
                            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                {tunnels.length === 0 && !showAdd && (
                    <div className="text-center text-muted-foreground text-sm py-8 opacity-70">
                        No active tunnels
                    </div>
                )}
            </div>
        </div>
    );
}
