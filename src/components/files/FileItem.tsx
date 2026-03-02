import { memo } from 'react';
import { FileEntry } from '../../shared/types';
import { getFileKind, formatSize } from './utils/fileUtils';
import { format } from 'date-fns';
import {
    Folder, File, Image, FileCode, FileX2, ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
    file: FileEntry;
    isCompact: boolean;
    onClick: (file: FileEntry) => void;
    onDoubleClick: (file: FileEntry) => void;
    onContextMenu: (e: React.MouseEvent, file: FileEntry) => void;
}

function getIcon(file: FileEntry) {
    const kind = getFileKind(file.name, file.type);
    const cls = 'w-4 h-4 shrink-0';
    switch (kind) {
        case 'folder': return <Folder className={cn(cls, 'text-blue-400 fill-blue-400/20')} />;
        case 'image': return <Image className={cn(cls, 'text-purple-400')} />;
        case 'text': return <FileCode className={cn(cls, 'text-emerald-400/80')} />;
        case 'binary': return <FileX2 className={cn(cls, 'text-muted-foreground/40')} />;
        default: return <File className={cn(cls, 'text-muted-foreground/60')} />;
    }
}

export const FileItem = memo(function FileItem({ file, isCompact, onClick, onDoubleClick, onContextMenu }: Props) {
    return (
        <div
            className="flex items-center px-3 py-1.5 cursor-pointer text-xs group transition-all border-b border-transparent hover:bg-accent/50 hover:border-border/20 select-none"
            onClick={() => onClick(file)}
            onDoubleClick={() => onDoubleClick(file)}
            onContextMenu={e => onContextMenu(e, file)}
        >
            {/* Icon */}
            <div className="w-6 flex justify-center shrink-0">{getIcon(file)}</div>

            {/* Name */}
            <div className="flex-1 min-w-0 flex items-center gap-1 pl-1">
                <span className="truncate text-foreground/90 font-medium group-hover:text-foreground">
                    {file.name}
                </span>
                {file.type === 'd' && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            {/* Date */}
            {!isCompact && (
                <div className="w-28 shrink-0 text-right text-muted-foreground/50 font-mono text-[10px] tabular-nums">
                    {file.date ? format(new Date(file.date), 'MM-dd HH:mm') : '—'}
                </div>
            )}

            {/* Size */}
            {!isCompact && (
                <div className="w-16 shrink-0 text-right text-muted-foreground/50 font-mono text-[10px] tabular-nums">
                    {file.type === 'd' ? '—' : formatSize(file.size)}
                </div>
            )}
        </div>
    );
});
