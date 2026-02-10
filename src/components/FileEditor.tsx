import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { X, Save, Loader2, FileCode } from 'lucide-react';
import { Button } from './ui/button';
import { useThemeStore } from '../store/themeStore';

interface FileEditorProps {
    fileName: string;
    filePath: string;
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    onClose: () => void;
}

export function FileEditor({ fileName, filePath, initialContent, onSave, onClose }: FileEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const { baseThemeId } = useThemeStore();

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setContent(value);
            setIsDirty(value !== initialContent);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(content);
            setIsDirty(false);
        } catch (error) {
            alert('Failed to save file: ' + error);
        } finally {
            setIsSaving(false);
        }
    };

    // Keyboard shortcut for Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [content]); // Re-bind when content changes to capture latest closure

    // Detect language from extension
    const getLanguage = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'js': return 'javascript';
            case 'ts': return 'typescript';
            case 'json': return 'json';
            case 'html': return 'html';
            case 'css': return 'css';
            case 'md': return 'markdown';
            case 'py': return 'python';
            case 'sh': return 'shell';
            case 'yml':
            case 'yaml': return 'yaml';
            case 'xml': return 'xml';
            case 'sql': return 'sql';
            case 'java': return 'java';
            case 'go': return 'go';
            case 'c':
            case 'cpp': return 'cpp';
            case 'conf':
            case 'nginx': return 'shell'; // often syntax highlights ok as shell
            default: return 'plaintext';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
                <div className="flex items-center gap-2 overflow-hidden">
                    <FileCode className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium flex items-center gap-2">
                            {fileName}
                            {isDirty && <span className="w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes" />}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[500px]">{filePath}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving || !isDirty} className="gap-2">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save (Ctrl+S)
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} disabled={isSaving}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 w-full h-full relative">
                <Editor
                    height="100%"
                    defaultLanguage={getLanguage(fileName)}
                    defaultValue={initialContent}
                    theme={baseThemeId === 'light' ? 'light' : 'vs-dark'} // Simple mapping
                    value={content}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        fontFamily: '"Fira Code", monospace',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
}
