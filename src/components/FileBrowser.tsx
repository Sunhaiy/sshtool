import { useEffect, useState } from 'react';
import { FileEntry } from '../shared/types';
import { 
  Folder, File, RefreshCw, Upload, FolderPlus, 
  ArrowUp, Download, Trash2, Edit2, MoreVertical 
} from 'lucide-react';

interface FileBrowserProps {
  connectionId: string;
}

interface ContextMenu {
  x: number;
  y: number;
  file: FileEntry;
}

export function FileBrowser({ connectionId }: FileBrowserProps) {
  const [currentPath, setCurrentPath] = useState('.');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const loadFiles = async (path: string) => {
    setLoading(true);
    try {
      // First get absolute path if we are at .
      if (path === '.') {
          const pwd = await window.electron.getPwd(connectionId);
          path = pwd;
      }
      
      const list = await window.electron.sftpList(connectionId, path);
      setFiles(Array.isArray(list) ? list : []);
      setCurrentPath(path);
    } catch (err) {
      console.error(err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles('.');
    
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [connectionId]);

  const handleNavigate = (entry: FileEntry) => {
    if (entry.type === 'd') {
      const newPath = currentPath === '/' ? `/${entry.name}` : `${currentPath}/${entry.name}`;
      loadFiles(newPath);
    }
  };

  const handleUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/');
    parts.pop();
    const newPath = parts.length === 1 ? '/' : parts.join('/') || '/';
    loadFiles(newPath);
  };

  const handleUpload = async () => {
    const localPath = await window.electron.openDialog();
    if (localPath) {
        setLoading(true);
        try {
            const filename = localPath.split(/[\\/]/).pop();
            const remotePath = currentPath === '/' ? `/${filename}` : `${currentPath}/${filename}`;
            await window.electron.sftpUpload(connectionId, localPath, remotePath);
            loadFiles(currentPath);
        } catch (e) {
            alert('Upload failed: ' + e);
        } finally {
            setLoading(false);
        }
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:');
    if (name) {
        setLoading(true);
        try {
            // Fix: mkdir usually requires full path. currentPath is absolute.
            const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
            await window.electron.sftpMkdir(connectionId, newPath);
            loadFiles(currentPath);
        } catch (e) {
            alert('Create folder failed: ' + e);
        } finally {
            setLoading(false);
        }
    }
  };

  const handleDelete = async (file: FileEntry) => {
      if (confirm(`Delete ${file.name}?`)) {
          setLoading(true);
          try {
            const path = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
            await window.electron.sftpDelete(connectionId, path);
            loadFiles(currentPath);
          } catch (e) {
              alert('Delete failed: ' + e);
          } finally {
              setLoading(false);
          }
      }
  };

  const handleDownload = async (file: FileEntry) => {
      const localPath = await window.electron.saveDialog(file.name);
      if (localPath) {
          setLoading(true);
          try {
              const remotePath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
              await window.electron.sftpDownload(connectionId, remotePath, localPath);
              alert('Download complete');
          } catch (e) {
              alert('Download failed: ' + e);
          } finally {
              setLoading(false);
          }
      }
  };

  const handleRename = async (file: FileEntry) => {
      const newName = prompt('New name:', file.name);
      if (newName && newName !== file.name) {
          setLoading(true);
          try {
              const oldPath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
              const newPath = currentPath === '/' ? `/${newName}` : `${currentPath}/${newName}`;
              await window.electron.sftpRename(connectionId, oldPath, newPath);
              loadFiles(currentPath);
          } catch (e) {
              alert('Rename failed: ' + e);
          } finally {
              setLoading(false);
          }
      }
  };

  const onContextMenu = (e: React.MouseEvent, file: FileEntry) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border text-foreground">
      {/* Toolbar */}
      <div className="p-2 border-b border-border flex items-center gap-1 bg-card">
        <button onClick={handleUp} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="Up">
            <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex-1 mx-2 bg-background border border-border rounded px-2 py-1 text-xs font-mono truncate text-foreground">
            {currentPath}
        </div>
        <button onClick={() => loadFiles(currentPath)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button onClick={handleCreateFolder} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="New Folder">
          <FolderPlus className="w-4 h-4" />
        </button>
        <button onClick={handleUpload} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="Upload">
          <Upload className="w-4 h-4" />
        </button>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="flex flex-col">
            {files.map((file, i) => (
            <div 
                key={i}
                className="flex items-center gap-2 px-3 py-2 hover:bg-secondary cursor-pointer text-sm group transition-colors"
                onDoubleClick={() => file.type === 'd' && handleNavigate(file)}
                onContextMenu={(e) => onContextMenu(e, file)}
            >
                {file.type === 'd' ? 
                    <Folder className="w-4 h-4 text-blue-400 shrink-0" /> : 
                    <File className="w-4 h-4 text-muted-foreground shrink-0" />
                }
                <span className="truncate flex-1 text-foreground">{file.name}</span>
                <span className="text-xs text-muted-foreground w-16 text-right tabular-nums">
                    {file.type === '-' ? (file.size < 1024 ? `${file.size} B` : `${(file.size/1024).toFixed(1)} KB`) : ''}
                </span>
            </div>
            ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
          <div 
            className="fixed bg-popover border border-border shadow-xl rounded py-1 z-50 w-40 text-popover-foreground"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
              <div className="px-3 py-1 text-xs text-muted-foreground border-b border-border mb-1 truncate">
                  {contextMenu.file.name}
              </div>
              <button onClick={() => handleDownload(contextMenu.file)} className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 text-sm">
                  <Download className="w-3 h-3" /> Download
              </button>
              <button onClick={() => handleRename(contextMenu.file)} className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 text-sm">
                  <Edit2 className="w-3 h-3" /> Rename
              </button>
              <button onClick={() => handleDelete(contextMenu.file)} className="w-full text-left px-3 py-1.5 hover:bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
                  <Trash2 className="w-3 h-3" /> Delete
              </button>
          </div>
      )}
    </div>
  );
}
