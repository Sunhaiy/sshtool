import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useState } from 'react';

interface Props {
    name: string;
    src: string; // data URL or remote URL
    onClose: () => void;
}

export function ImageViewer({ name, src, onClose }: Props) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    return (
        <div
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col animate-in fade-in"
            onClick={onClose}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 bg-black/40 text-white"
                onClick={e => e.stopPropagation()}
            >
                <span className="text-sm font-medium truncate max-w-xs">{name}</span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setScale(s => Math.max(0.1, s - 0.25))}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        title="缩小"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
                    <button
                        onClick={() => setScale(s => Math.min(5, s + 0.25))}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        title="放大"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setRotation(r => (r + 90) % 360)}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors ml-1"
                        title="旋转"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => { setScale(1); setRotation(0); }}
                        className="px-2 py-1 text-xs rounded hover:bg-white/10 transition-colors ml-1"
                    >
                        1:1
                    </button>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Image area */}
            <div
                className="flex-1 overflow-auto flex items-center justify-center p-4"
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={src}
                    alt={name}
                    style={{ transform: `scale(${scale}) rotate(${rotation}deg)`, transition: 'transform 0.2s ease' }}
                    className="max-w-none object-contain shadow-2xl rounded"
                    draggable={false}
                />
            </div>
        </div>
    );
}
