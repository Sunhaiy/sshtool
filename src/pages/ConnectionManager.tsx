import { useState, useEffect } from 'react';
import { SSHConnection } from '../shared/types';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Trash2, Play, Plus, Settings as SettingsIcon, Edit2, Server, Terminal, Wifi, Zap, Globe, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Modal } from '../components/ui/modal';
import { ConnectionForm } from '../components/ConnectionForm';

interface ConnectionManagerProps {
  onConnect: (connection: SSHConnection) => void;
  onNavigate: (page: 'connections' | 'workspace' | 'settings') => void;
}

export function ConnectionManager({ onConnect, onNavigate }: ConnectionManagerProps) {
  const [connections, setConnections] = useState<SSHConnection[]>([]);
  const [editingConnection, setEditingConnection] = useState<Partial<SSHConnection> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      if (!(window as any).electron) {
        console.error('Electron API not found');
        return;
      }
      const stored = await (window as any).electron.storeGet('connections');
      if (stored) setConnections(stored);
    } catch (err) {
      console.error('Failed to load connections:', err);
    }
  };

  const handleSave = async (data: SSHConnection) => {
    const username = data.username || 'root';
    const name = data.name || (data.host ? `${username}@${data.host}` : 'New Server');
    const newConnection: SSHConnection = {
      ...data,
      id: data.id || Date.now().toString(),
      name,
      username,
    };
    const newConnections = data.id
      ? connections.map(c => c.id === data.id ? newConnection : c)
      : [...connections, newConnection];
    setConnections(newConnections);
    await (window as any).electron.storeSet('connections', newConnections);
    setIsModalOpen(false);
    setEditingConnection(null);
  };

  const deleteConnection = async (id: string) => {
    if (!confirm(t('common.delete') + '?')) return;
    const newConnections = connections.filter(c => c.id !== id);
    setConnections(newConnections);
    await (window as any).electron.storeSet('connections', newConnections);
  };

  const openNewConnection = () => {
    setEditingConnection({});
    setIsModalOpen(true);
  };

  const openEditConnection = (conn: SSHConnection) => {
    setEditingConnection(conn);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 px-10 pt-10 pb-8 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
              <Terminal className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">SSH Tool</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('connection.new')} · {connections.length} {connections.length === 1 ? 'server' : 'servers'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={openNewConnection}
              className="gap-2 rounded-xl h-10 px-5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              {t('connection.new')}
            </Button>
            <Button variant="outline" size="icon" onClick={() => onNavigate('settings')} className="rounded-xl h-10 w-10 border-border/50">
              <SettingsIcon className="w-[18px] h-[18px]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-10 pb-8 relative z-10">
        {connections.length === 0 ? (
          /* Empty state - premium feel */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-muted/80 to-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm">
                <Globe className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Get Started</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
              Add your first SSH connection to begin managing remote servers with a beautiful, modern interface.
            </p>
            <Button
              onClick={openNewConnection}
              className="gap-2 rounded-xl px-8 h-11 text-sm font-medium shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Add Your First Server
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {connections.map(c => (
              <div
                key={c.id}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onConnect(c)}
                className="group relative rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative p-5">
                  {/* Top row: icon + actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center">
                      <Server className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditConnection(c); }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteConnection(c.id); }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Server info */}
                  <h3 className="text-[15px] font-semibold truncate mb-1.5" title={c.name}>{c.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono truncate">{c.username}@{c.host}</span>
                    {c.port !== 22 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/50 font-mono">:{c.port}</span>
                    )}
                  </div>

                  {/* Connect hint */}
                  <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                      <Zap className="w-3 h-3" />
                      <span>Quick connect</span>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 text-muted-foreground/30 transition-all duration-200 ${hoveredId === c.id ? 'text-primary translate-x-0.5' : ''}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Minimal footer */}
      <div className="shrink-0 px-10 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground/40 relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            {connections.length} saved
          </span>
        </div>
        <span className="font-mono">v1.0.0</span>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingConnection?.id ? t('common.edit') : t('connection.new')}
      >
        <ConnectionForm
          initialData={editingConnection || {}}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
