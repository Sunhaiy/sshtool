import { useState, useEffect } from 'react';
import { TerminalView } from './components/TerminalView';
import { FileBrowser } from './components/FileBrowser';
import { SystemMonitor } from './components/SystemMonitor';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TitleBar } from './components/TitleBar';
import { ConnectionManager } from './pages/ConnectionManager';
import { Settings } from './pages/Settings';
import { SSHConnection } from './shared/types';
import { Button } from './components/ui/button';
import { Home } from 'lucide-react';
import { useThemeStore } from './store/themeStore';

function App() {
  const [page, setPage] = useState<'connections' | 'workspace' | 'settings'>('connections');
  const [activeConnection, setActiveConnection] = useState<SSHConnection | null>(null);
  const initTheme = useThemeStore(state => state.initTheme);

  // Load theme on startup
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const handleConnect = async (connection: SSHConnection) => {
    const result = await window.electron.connectSSH(connection);
    if (result.success) {
      setActiveConnection(connection);
      setPage('workspace');
    } else {
      alert('Connection failed: ' + result.error);
    }
  };

  const handleDisconnect = () => {
    setActiveConnection(null);
    setPage('connections');
    // Logic to disconnect SSH if needed via IPC
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden border border-border">
      <TitleBar />
      
      <div className="flex-1 overflow-hidden relative">
        {page === 'connections' && (
          <ConnectionManager 
            onConnect={handleConnect} 
            onNavigate={setPage} 
          />
        )}

        {page === 'settings' && (
          <Settings onBack={() => setPage(activeConnection ? 'workspace' : 'connections')} />
        )}

        {page === 'workspace' && activeConnection && (
          <div className="flex h-full w-full">
            {/* Sidebar / FileBrowser */}
            <div className="w-64 border-r border-border bg-card flex flex-col">
               <div className="p-2 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold px-2 truncate">{activeConnection.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDisconnect} title="Disconnect">
                    <Home className="w-3 h-3" />
                  </Button>
               </div>
               <div className="flex-1 min-h-0">
                  <ErrorBoundary name="FileBrowser">
                    <FileBrowser connectionId={activeConnection.id} />
                  </ErrorBoundary>
               </div>
            </div>

            {/* Main Terminal */}
            <div className="flex-1 min-w-0 bg-black">
              <ErrorBoundary name="Terminal">
                <TerminalView connectionId={activeConnection.id} />
              </ErrorBoundary>
            </div>

            {/* Right Monitor */}
            <div className="w-80 border-l border-border bg-card">
              <ErrorBoundary name="SystemMonitor">
                <SystemMonitor connectionId={activeConnection.id} />
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
