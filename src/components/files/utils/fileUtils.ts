// File utility functions — pure, no React, no side effects

export function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function joinPath(base: string, name: string): string {
    if (base === '/') return `/${name}`;
    return `${base}/${name}`;
}

export function parentPath(path: string): string {
    if (path === '/') return '/';
    const parts = path.split('/');
    parts.pop();
    return parts.length <= 1 ? '/' : parts.join('/');
}

const IMAGE_EXTS = new Set([
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif',
]);

const TEXT_EXTS = new Set([
    'txt', 'md', 'json', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf',
    'sh', 'bash', 'zsh', 'fish', 'ps1',
    'js', 'ts', 'jsx', 'tsx', 'vue', 'svelte',
    'py', 'rb', 'php', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'cs',
    'html', 'htm', 'css', 'scss', 'sass', 'less',
    'xml', 'svg', 'env', 'log', 'csv', 'sql',
    'dockerfile', 'makefile', 'gitignore', 'htaccess',
]);

const BINARY_EXTS = new Set([
    'zip', 'tar', 'gz', 'bz2', 'xz', '7z', 'rar',
    'exe', 'bin', 'so', 'dll', 'dylib',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'mp3', 'mp4', 'mkv', 'avi', 'mov', 'flac', 'ogg',
    'ttf', 'otf', 'woff', 'woff2',
    'ico', 'icns',
]);

export function getExtension(name: string): string {
    const parts = name.toLowerCase().split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
}

export function isImageFile(name: string): boolean {
    return IMAGE_EXTS.has(getExtension(name));
}

export function isTextFile(name: string): boolean {
    const ext = getExtension(name);
    if (!ext) return true; // extensionless files often are text (Makefile etc)
    return TEXT_EXTS.has(ext);
}

export function isBinaryFile(name: string): boolean {
    return BINARY_EXTS.has(getExtension(name));
}

export type FileKind = 'folder' | 'image' | 'text' | 'binary' | 'unknown';

export function getFileKind(name: string, type: string): FileKind {
    if (type === 'd') return 'folder';
    if (isImageFile(name)) return 'image';
    if (isTextFile(name)) return 'text';
    if (isBinaryFile(name)) return 'binary';
    return 'unknown';
}
