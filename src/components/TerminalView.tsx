import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore } from '../store/settingsStore';
import { TerminalContextMenu } from './TerminalContextMenu';
import { AIPopover } from './AIPopover';
import '@xterm/xterm/css/xterm.css';

interface TerminalViewProps {
  connectionId: string;
}

export function TerminalView({ connectionId }: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const { terminalTheme } = useThemeStore();
  const {
    terminalFontFamily,
    fontSize,
    lineHeight,
    letterSpacing,
    cursorStyle,
    cursorBlink,
    aiEnabled
  } = useSettingsStore();
  const {
    rendererType,
    scrollback,
    brightBold,
    bellStyle
  } = useSettingsStore();

  // Context Menu State
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectionText, setSelectionText] = useState('');
  const [hasSelection, setHasSelection] = useState(false);

  // AI Popover State
  const [aiPopover, setAiPopover] = useState<{ x: number; y: number; text: string; type: 'explain' | 'fix' } | null>(null);

  // Effect to handle initialization
  useEffect(() => {
    if (!containerRef.current || !connectionId) return;

    let cleanupFn: (() => void) | undefined;

    const initTerminal = async () => {
      // Use current values from store for initialization
      const settings = useSettingsStore.getState();
      const currentTerminalTheme = useThemeStore.getState().terminalTheme;

      const term = new Terminal({
        cursorBlink: settings.cursorBlink,
        cursorStyle: settings.cursorStyle,
        fontSize: settings.fontSize,
        fontFamily: settings.terminalFontFamily,
        letterSpacing: settings.letterSpacing,
        lineHeight: settings.lineHeight,
        scrollback: settings.scrollback,
        drawBoldTextInBrightColors: settings.brightBold,
        // @ts-ignore
        bellStyle: settings.bellStyle,
        allowProposedApi: true,
        allowTransparency: true,
        theme: {
          ...(currentTerminalTheme || {}),
          background: 'transparent',
        }
      });

      termRef.current = term; // Set ref immediately

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      // Open terminal
      term.open(containerRef.current!);

      // Load WebGL if enabled
      if (rendererType === 'webgl') {
        try {
          const { WebglAddon } = await import('@xterm/addon-webgl');
          const webglAddon = new WebglAddon();
          webglAddon.onContextLoss(() => {
            webglAddon.dispose();
          });
          term.loadAddon(webglAddon);
          console.log('WebGL renderer enabled');
        } catch (e) {
          console.warn('Failed to load WebGL addon:', e);
        }
      }

      try {
        fitAddon.fit();
      } catch (e) {
        console.warn('Initial fit failed:', e);
      }
      term.focus();

      term.onData(data => {
        (window as any).electron.writeTerminal(connectionId, data);
      });

      const cleanup = (window as any).electron.onTerminalData((_: any, { id, data }: { id: string, data: string }) => {
        if (id === connectionId) {
          term.write(data);
        }
      });

      const handleResize = () => {
        if (!containerRef.current) return;
        try {
          fitAddon.fit();
          if (term.cols > 0 && term.rows > 0) {
            (window as any).electron.resizeTerminal(connectionId, term.cols, term.rows);
          }
        } catch (e) {
          console.warn('Resize fit failed:', e);
        }
      };

      const handleNativeContextMenu = (e: MouseEvent) => {
        if (containerRef.current?.contains(e.target as Node)) {
          e.preventDefault();
          e.stopImmediatePropagation();

          const selection = term.getSelection();
          setSelectionText(selection || '');
          setHasSelection(!!selection && selection.length > 0);
          setMenuPos({ x: e.clientX, y: e.clientY });
        }
      };
      window.addEventListener('contextmenu', handleNativeContextMenu, true);

      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current!);

      return () => {
        window.removeEventListener('contextmenu', handleNativeContextMenu, true);
        try {
          cleanup();
        } catch (e) { }
        resizeObserver.disconnect();
        try {
          if (term && !term.element?.parentElement) {
            // already detached
          } else if (term) {
            term.dispose();
          }
        } catch (e) { }
        termRef.current = null;
      };
    };

    // We need to manage cleanup manually since initTerminal is async
    let isMounted = true;

    initTerminal().then(fn => {
      if (isMounted) {
        cleanupFn = fn;
      } else {
        // If unmounted before init finished, run cleanup immediately
        fn();
      }
    });

    return () => {
      isMounted = false;
      if (cleanupFn) cleanupFn();
    };
  }, [connectionId, rendererType]);

  // Effect to handle dynamic updates (font, theme, etc.)
  useEffect(() => {
    if (!termRef.current) return;

    // Theme
    if (terminalTheme) {
      termRef.current.options.theme = {
        ...terminalTheme,
        background: 'transparent'
      };
    }

    // Settings
    termRef.current.options.fontFamily = terminalFontFamily;
    termRef.current.options.fontSize = fontSize;
    termRef.current.options.lineHeight = lineHeight;
    termRef.current.options.letterSpacing = letterSpacing;
    termRef.current.options.cursorStyle = cursorStyle;
    termRef.current.options.cursorBlink = cursorBlink;
    termRef.current.options.scrollback = scrollback;
    termRef.current.options.drawBoldTextInBrightColors = brightBold;
    // @ts-ignore
    termRef.current.options.bellStyle = bellStyle;

    // Trigger fit
    // @ts-ignore
    try { termRef.current?._addonManager?.addons?.forEach(addon => { if (addon.constructor.name === 'FitAddon') addon.fit(); }); } catch (e) { }
  }, [terminalTheme, terminalFontFamily, fontSize, lineHeight, letterSpacing, cursorStyle, cursorBlink, scrollback, brightBold, bellStyle]);

  const handleCopy = () => {
    console.log('handleCopy called, selection:', selectionText);
    if (selectionText) {
      (window as any).electron.clipboardWriteText(selectionText);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await (window as any).electron.clipboardReadText();
      if (text) {
        (window as any).electron.writeTerminal(connectionId, text);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleExplain = () => {
    if (selectionText && menuPos) {
      setAiPopover({
        x: menuPos.x,
        y: menuPos.y,
        text: selectionText,
        type: 'explain'
      });
    }
  };

  const handleFix = () => {
    if (selectionText && menuPos) {
      setAiPopover({
        x: menuPos.x,
        y: menuPos.y,
        text: selectionText,
        type: 'fix'
      });
    }
  };

  return (
    <div
      className="h-full w-full relative"
      onMouseDown={() => {
        // Ensure terminal gets focus when clicking anywhere in its container
        termRef.current?.focus();
      }}
    >
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ background: 'transparent' }}
      />

      {menuPos && (
        <TerminalContextMenu
          x={menuPos.x}
          y={menuPos.y}
          hasSelection={hasSelection}
          aiEnabled={aiEnabled}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onExplain={handleExplain}
          onFix={handleFix}
          onClose={() => setMenuPos(null)}
        />
      )}

      {aiPopover && (
        <AIPopover
          x={aiPopover.x}
          y={aiPopover.y}
          text={aiPopover.text}
          type={aiPopover.type}
          onClose={() => setAiPopover(null)}
          onApplyFix={(cmd) => {
            (window as any).electron?.writeTerminal(connectionId, cmd);
          }}
        />
      )}
    </div>
  );
}

