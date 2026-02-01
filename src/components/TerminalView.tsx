import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useThemeStore } from '../store/themeStore';
import '@xterm/xterm/css/xterm.css';

interface TerminalViewProps {
  connectionId: string;
}

export function TerminalView({ connectionId }: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!termRef.current) return;
    
    // Update terminal theme when app theme changes
    termRef.current.options.theme = {
      ...theme.terminal,
      selection: theme.terminal.selectionBackground
    };
    termRef.current.options.fontFamily = theme.fontFamily;
  }, [theme]);

  useEffect(() => {
    if (!containerRef.current || !connectionId) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: theme.fontFamily,
      theme: {
        ...theme.terminal,
        selection: theme.terminal.selectionBackground
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
  }, [connectionId]); // Removed 'theme' from dependency array to prevent re-creation

  return <div ref={containerRef} className="h-full w-full" style={{ background: theme.terminal.background }} />;
}
