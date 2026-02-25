// ConnectingOverlay — Geeky loading animations for all panels
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

// ——— Reusable log-style connecting animation ———
interface LogEntry {
    text: string;
    delay: number;
}

export function ConnectingLog({ lines }: { lines: LogEntry[] }) {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        lines.forEach((line, i) => {
            timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay));
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="p-3 font-mono text-[10px] leading-[1.8] text-muted-foreground/60">
            {lines.slice(0, visibleCount).map((line, i) => (
                <div key={i} className={cn(
                    "transition-opacity duration-200",
                    line.text.includes('✓') || line.text.includes('OK') ? 'text-green-500/70' : '',
                )}>
                    {line.text}
                </div>
            ))}
            <span className="inline-block w-[5px] h-[12px] bg-muted-foreground/40 animate-pulse" />
        </div>
    );
}

// ——— SSH log animation for the terminal area ———
function buildLogLines(host: string, username: string) {
    const port = '22';
    return [
        { text: `$ ssh -v ${username}@${host} -p ${port}`, delay: 0, type: 'cmd' as const },
        { text: `OpenSSH_9.6p1, OpenSSL 3.2.1 30 Jan 2024`, delay: 300, type: 'dim' as const },
        { text: `debug1: Connecting to ${host} [${host}] port ${port}.`, delay: 600, type: 'info' as const },
        { text: `debug1: Connection established.`, delay: 1200, type: 'ok' as const },
        { text: `debug1: identity file /root/.ssh/id_ed25519 type 3`, delay: 1500, type: 'dim' as const },
        { text: `debug1: Local version string SSH-2.0-OpenSSH_9.6`, delay: 1700, type: 'dim' as const },
        { text: `debug1: Remote version string SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6`, delay: 2000, type: 'info' as const },
        { text: `debug1: SSH2_MSG_KEXINIT sent`, delay: 2300, type: 'dim' as const },
        { text: `debug1: SSH2_MSG_KEXINIT received`, delay: 2500, type: 'dim' as const },
        { text: `debug1: kex: algorithm: curve25519-sha256`, delay: 2700, type: 'info' as const },
        { text: `debug1: kex: host key algorithm: ssh-ed25519`, delay: 2900, type: 'dim' as const },
        { text: `debug1: SSH2_MSG_KEX_ECDH_REPLY received`, delay: 3200, type: 'info' as const },
        { text: `debug1: Host '${host}' is known and matches the ED25519 host key.`, delay: 3500, type: 'ok' as const },
        { text: `debug1: rekey out after 134217728 blocks`, delay: 3700, type: 'dim' as const },
        { text: `debug1: SSH2_MSG_NEWKEYS sent`, delay: 3900, type: 'dim' as const },
        { text: `debug1: Authentications that can continue: publickey,password`, delay: 4100, type: 'info' as const },
        { text: `debug1: Next authentication method: publickey`, delay: 4300, type: 'info' as const },
        { text: `debug1: Authentication succeeded (publickey).`, delay: 4600, type: 'ok' as const },
        { text: `debug1: channel 0: new [client-session]`, delay: 4900, type: 'info' as const },
        { text: `debug1: Requesting shell.`, delay: 5100, type: 'info' as const },
        { text: `debug1: Entering interactive session.`, delay: 5400, type: 'ok' as const },
    ];
}

export function TerminalConnecting({ host, username }: { host: string; username: string }) {
    const [visibleCount, setVisibleCount] = useState(0);
    const logLines = buildLogLines(host, username);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        logLines.forEach((_, i) => {
            timers.push(setTimeout(() => setVisibleCount(i + 1), logLines[i].delay));
        });
        return () => timers.forEach(clearTimeout);
    }, [host, username]);

    return (
        <div className="absolute inset-0 z-30 overflow-y-auto p-3 font-mono text-[11px] leading-[1.7] bg-[hsl(var(--background))]">
            {logLines.slice(0, visibleCount).map((line, i) => (
                <div
                    key={i}
                    className={cn(
                        line.type === 'cmd' && 'text-foreground font-semibold',
                        line.type === 'ok' && 'text-green-400',
                        line.type === 'info' && 'text-muted-foreground',
                        line.type === 'dim' && 'text-muted-foreground/40',
                    )}
                >
                    {line.text}
                </div>
            ))}
            <span className="inline-block w-[7px] h-[14px] bg-foreground/70 animate-pulse mt-0.5" />
        </div>
    );
}
