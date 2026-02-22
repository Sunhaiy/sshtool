// TerminalPortal - A special wrapper that renders TerminalView ONCE
// and shares it between Normal and Agent mode layouts via DOM-level repositioning.
//
// Approach:
// - The actual xterm terminal div lives in a single stable React tree position
// - A placeholder div in each layout uses a ResizeObserver to track its position
// - We use CSS translate to move the overlay terminal to match the placeholder rect
// - This avoids React re-mounting (which would reset the terminal connection)

import { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { TerminalView } from './TerminalView';
import { ErrorBoundary } from './ErrorBoundary';

interface TerminalPortalProps {
    connectionId: string;
}

// The portal overlay — renders the actual xterm terminal, positioned over any placeholder
export function TerminalPortalOverlay({ connectionId }: TerminalPortalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={overlayRef}
            data-terminal-portal={connectionId}
            className="absolute inset-0 z-20 overflow-hidden"
            style={{ pointerEvents: 'auto' }}
        >
            <ErrorBoundary name="Terminal">
                <TerminalView connectionId={connectionId} />
            </ErrorBoundary>
        </div>
    );
}

// Hook to reposition the portal overlay to match a placeholder element
export function useTerminalPortal(connectionId: string) {
    const placeholderRef = useRef<HTMLDivElement>(null);

    // Update the portal overlay position whenever placeholder moves/resizes
    useLayoutEffect(() => {
        const placeholder = placeholderRef.current;
        if (!placeholder) return;

        const updatePosition = () => {
            const overlay = document.querySelector(
                `[data-terminal-portal="${connectionId}"]`
            ) as HTMLElement | null;
            if (!overlay || !placeholder) return;

            const rect = placeholder.getBoundingClientRect();
            const parentRect = overlay.offsetParent?.getBoundingClientRect() || { top: 0, left: 0 };

            overlay.style.position = 'fixed';
            overlay.style.top = rect.top + 'px';
            overlay.style.left = rect.left + 'px';
            overlay.style.width = rect.width + 'px';
            overlay.style.height = rect.height + 'px';
            overlay.style.zIndex = '50';
        };

        updatePosition();

        const observer = new ResizeObserver(updatePosition);
        observer.observe(placeholder);

        // Also update on scroll, window resize
        window.addEventListener('resize', updatePosition);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updatePosition);
        };
    }, [connectionId]);

    // Placeholder div that marks where the terminal should appear
    const TerminalPlaceholder = useCallback(() => (
        <div ref={placeholderRef} className="h-full w-full bg-transparent" />
    ), []);

    return { TerminalPlaceholder };
}
