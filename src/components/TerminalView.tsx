import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface TerminalViewProps {
  connectionId: string;
}

export function TerminalView({ connectionId }: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current || !connectionId) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
      }
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(containerRef.current);
    try {
      fitAddon.fit();
    } catch (e) {
      console.warn('Initial fit failed:', e);
    }
    termRef.current = term;

    term.onData(data => {
      window.electron.writeTerminal(connectionId, data);
    });

    const cleanup = window.electron.onTerminalData((_, { id, data }) => {
      if (id === connectionId) {
        term.write(data);
      }
    });

    const handleResize = () => {
      try {
        fitAddon.fit();
        if (term.cols > 0 && term.rows > 0) {
           window.electron.resizeTerminal(connectionId, term.cols, term.rows);
        }
      } catch (e) {
        console.warn('Resize fit failed:', e);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cleanup();
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [connectionId]);

  return <div ref={containerRef} className="h-full w-full bg-[#1e1e1e]" />;
}
