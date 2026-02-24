import { X, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { SSHConnection } from '../shared/types';

export interface Session {
    uniqueId: string;
    connection: SSHConnection;
}

interface SessionTabsProps {
    sessions: { uniqueId: string; connection: SSHConnection; status: 'connected' | 'disconnected' }[];
    activeId: string | null;
    onSwitch: (id: string) => void;
    onClose: (id: string, e: React.MouseEvent) => void;
    onNew: () => void;
    onCloseAll: () => void;
}

export function SessionTabs({ sessions, activeId, onSwitch, onClose, onNew, onCloseAll }: SessionTabsProps) {
    return (
        <div className="flex items-center h-9 bg-background/50 border-b border-border/50 select-none px-1">
            {/* Tabs */}
            <div className="flex-1 flex overflow-x-auto no-scrollbar items-center gap-0.5">
                {sessions.map((session) => (
                    <div
                        key={session.uniqueId}
                        onClick={() => onSwitch(session.uniqueId)}
                        className={cn(
                            "group relative flex items-center h-7 px-3 min-w-[120px] max-w-[180px] rounded-md cursor-pointer transition-all duration-150 text-xs",
                            activeId === session.uniqueId
                                ? "bg-accent text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                            session.status === 'disconnected' && "opacity-50"
                        )}
                    >
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full mr-2 shrink-0",
                            session.status === 'connected' ? "bg-emerald-500" : "bg-red-400/80"
                        )} />
                        <span className="truncate flex-1" title={session.connection.name}>
                            {session.connection.name}
                        </span>
                        <button
                            onClick={(e) => onClose(session.uniqueId, e)}
                            className={cn(
                                "ml-1.5 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all",
                                activeId === session.uniqueId && "opacity-60"
                            )}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-0.5 ml-1 shrink-0">
                <button
                    onClick={onNew}
                    className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                    title="New Connection"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
                {sessions.length > 1 && (
                    <button
                        onClick={onCloseAll}
                        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Close All Sessions"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
