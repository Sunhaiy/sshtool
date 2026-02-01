import { useState, useEffect } from 'react';
import { SSHConnection } from '../shared/types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Trash2, Play, Plus, Settings as SettingsIcon } from 'lucide-react';

interface ConnectionManagerProps {
  onConnect: (connection: SSHConnection) => void;
  onNavigate: (page: 'connections' | 'workspace' | 'settings') => void;
}

export function ConnectionManager({ onConnect, onNavigate }: ConnectionManagerProps) {
  const [connections, setConnections] = useState<SSHConnection[]>([]);
  const [editing, setEditing] = useState<Partial<SSHConnection> | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const stored = await window.electron.storeGet('connections');
    if (stored) setConnections(stored);
  };

  const saveConnection = async () => {
    if (!editing) return;
    
    const newConnection: SSHConnection = {
      id: editing.id || Date.now().toString(),
      name: editing.name || 'New Server',
      host: editing.host || '',
      port: editing.port || 22,
      username: editing.username || 'root',
      authType: editing.authType || 'password',
      password: editing.password || '',
      privateKeyPath: editing.privateKeyPath
    };

    const newConnections = editing.id 
      ? connections.map(c => c.id === editing.id ? newConnection : c)
      : [...connections, newConnection];

    setConnections(newConnections);
    await window.electron.storeSet('connections', newConnections);
    setEditing(null);
  };

  const deleteConnection = async (id: string) => {
    const newConnections = connections.filter(c => c.id !== id);
    setConnections(newConnections);
    await window.electron.storeSet('connections', newConnections);
  };

  return (
    <div className="flex h-full bg-background p-6 gap-6">
      {/* Sidebar List */}
      <Card className="w-1/3 min-w-[250px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Connections</CardTitle>
          <div className="flex gap-1">
             <Button size="icon" variant="ghost" onClick={() => onNavigate('settings')}>
                <SettingsIcon className="w-4 h-4" />
             </Button>
             <Button size="icon" variant="ghost" onClick={() => setEditing({})}>
                <Plus className="w-4 h-4" />
             </Button>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 pt-0 space-y-2">
            {connections.map(c => (
              <div 
                key={c.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                onClick={() => setEditing(c)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.username}@{c.host}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-100/10" 
                    onClick={(e) => { e.stopPropagation(); onConnect(c); }}>
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100/10"
                    onClick={(e) => { e.stopPropagation(); deleteConnection(c.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {connections.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                    No connections saved.
                </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Edit Form */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{editing?.id ? 'Edit Connection' : 'New Connection'}</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-4 max-w-md">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={editing.name || ''} 
                  onChange={e => setEditing(prev => prev ? ({...prev, name: e.target.value}) : null)} 
                  placeholder="Production Server"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 grid gap-2">
                  <label className="text-sm font-medium">Host</label>
                  <Input 
                    value={editing.host || ''} 
                    onChange={e => setEditing(prev => prev ? ({...prev, host: e.target.value}) : null)} 
                    placeholder="192.168.1.1"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Port</label>
                  <Input 
                    type="number"
                    value={editing.port || 22} 
                    onChange={e => setEditing(prev => prev ? ({...prev, port: parseInt(e.target.value) || 22}) : null)} 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Username</label>
                <Input 
                  value={editing.username || ''} 
                  onChange={e => setEditing(prev => prev ? ({...prev, username: e.target.value}) : null)} 
                  placeholder="root"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Password</label>
                <Input 
                  type="password"
                  value={editing.password || ''} 
                  onChange={e => setEditing(prev => prev ? ({...prev, password: e.target.value}) : null)} 
                  placeholder="••••••••"
                />
              </div>
              <div className="pt-4 flex gap-2">
                <Button onClick={saveConnection}>Save</Button>
                {editing.id && (
                    <Button variant="secondary" onClick={() => onConnect(editing as SSHConnection)}>
                        Connect Now
                    </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a connection to edit or create a new one.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
