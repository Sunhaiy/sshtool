import { X, Plus, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';
import { SSHConnection } from '../shared/types';

export interface Session {
    uniqueId: string;
    connection: SSHConnection;
}

interface SessionTabsProps {
    sessions: Session[];
    activeId: string | null;
    onSwitch: (id: string) => void;
    onClose: (id: string, e: React.MouseEvent) => void;
    onNew: () => void;
}

export function SessionTabs({ sessions, activeId, onSwitch, onClose, onNew }: SessionTabsProps) {
    return (
        <div className="flex items-center h-10 bg-secondary/30 border-b border-border select-none">
            <div className="flex-1 flex overflow-x-auto no-scrollbar items-center">
                {sessions.map((session) => (
                    <div
                        key={session.uniqueId}
                        onClick={() => onSwitch(session.uniqueId)}
                        className={cn(
                            "group relative flex items-center h-10 px-3 min-w-[150px] max-w-[200px] border-r border-border/50 cursor-pointer transition-colors text-sm",
                            activeId === session.uniqueId
                                ? "bg-background font-medium text-primary border-t-2 border-t-primary"
                                : "hover:bg-background/50 text-muted-foreground border-t-2 border-t-transparent"
                        )}
                    >
                        <Terminal className="w-3.5 h-3.5 mr-2 opacity-70" />
                        <span className="truncate flex-1" title={session.connection.name}>
                            {session.connection.name}
                        </span>
                        <button
                            onClick={(e) => onClose(session.uniqueId, e)}
                            className={cn(
                                "ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 transition-all",
                                activeId === session.uniqueId && "opacity-100" // Always show close on active tab
                            )}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {/* New Tab Button */}
                <button
                    onClick={onNew}
                    className="flex items-center justify-center p-2 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors"
                    title="New Connection"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
