import { useEffect, useState } from 'react';
import { RefreshCw, Play, Square, RotateCw, FileCode, Container, AlertCircle } from 'lucide-react';

interface Container {
    id: string;
    name: string;
    image: string;
    status: string;
    state: string; // 'running', 'exited', etc.
}

interface DockerManagerProps {
    connectionId: string;
}

export function DockerManager({ connectionId }: DockerManagerProps) {
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchContainers = async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await window.electron.getDockerContainers(connectionId);
            setContainers(list);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch containers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContainers();
        const interval = setInterval(fetchContainers, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [connectionId]);

    const handleAction = async (containerId: string, action: 'start' | 'stop' | 'restart') => {
        setActionLoading(containerId);
        try {
            await window.electron.dockerAction(connectionId, containerId, action);
            fetchContainers();
        } catch (err: any) {
            alert(`Failed to ${action} container: ` + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (state: string) => {
        if (state.toLowerCase().includes('running')) return 'bg-green-500';
        if (state.toLowerCase().includes('exited')) return 'bg-muted-foreground';
        return 'bg-yellow-500';
    };

    return (
        <div className="h-full flex flex-col bg-background text-foreground">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                    <Container className="w-4 h-4 text-blue-500" />
                    <span>Containers</span>
                    <span className="text-xs bg-secondary px-2 rounded-full">{containers.length}</span>
                </div>
                <button onClick={fetchContainers} className="p-1.5 hover:bg-secondary rounded transition-colors" title="Refresh">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {error && (
                    <div className="p-4 rounded bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {containers.length === 0 && !loading && !error && (
                    <div className="text-center text-muted-foreground text-sm py-8 opacity-70">
                        No containers found
                    </div>
                )}

                {containers.map(container => (
                    <div key={container.id} className="bg-card border border-border rounded-lg p-3 shadow-none hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0">
                                <div className="font-medium text-sm truncate flex items-center gap-2" title={container.name}>
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(container.status)}`} />
                                    {container.name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate opacity-80" title={container.image}>
                                    {container.image}
                                </div>
                            </div>
                            <div className="text-[10px] font-medium text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                {container.id.substring(0, 12)}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]" title={container.status}>
                                {container.status}
                            </span>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleAction(container.id, 'start')}
                                    disabled={!!actionLoading || container.status.toLowerCase().includes('running')}
                                    className="p-1.5 hover:bg-green-500/10 hover:text-green-500 rounded disabled:opacity-30 transition-colors"
                                    title="Start"
                                >
                                    <Play className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleAction(container.id, 'restart')}
                                    disabled={!!actionLoading}
                                    className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 rounded disabled:opacity-30 transition-colors"
                                    title="Restart"
                                >
                                    <RotateCw className={`w-3.5 h-3.5 ${actionLoading === container.id ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    onClick={() => handleAction(container.id, 'stop')}
                                    disabled={!!actionLoading || !container.status.toLowerCase().includes('running')}
                                    className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded disabled:opacity-30 transition-colors"
                                    title="Stop"
                                >
                                    <Square className="w-3.5 h-3.5 fill-current" />
                                </button>
                                {/* Logs future feature */}
                                {/* <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
                                <FileCode className="w-3.5 h-3.5" />
                            </button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
