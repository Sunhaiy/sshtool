import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script loading...');

contextBridge.exposeInMainWorld('electron', {
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  connectSSH: (connection: any) => ipcRenderer.invoke('ssh-connect', connection),
  onTerminalData: (callback: (event: any, payload: { id: string, data: string }) => void) => {
    const subscription = (event: any, payload: any) => callback(event, payload);
    ipcRenderer.on('terminal-data', subscription);
    return () => ipcRenderer.removeListener('terminal-data', subscription);
  },
  writeTerminal: (id: string, data: string) => ipcRenderer.send('term-write', { id, data }),
  resizeTerminal: (id: string, cols: number, rows: number) => ipcRenderer.send('term-resize', { id, cols, rows }),
  
  sftpList: (id: string, path: string) => ipcRenderer.invoke('sftp-list', { id, path }),
  sftpUpload: (id: string, localPath: string, remotePath: string) => ipcRenderer.invoke('sftp-upload', { id, localPath, remotePath }),
  sftpDownload: (id: string, remotePath: string, localPath: string) => ipcRenderer.invoke('sftp-download', { id, remotePath, localPath }),
  sftpDelete: (id: string, path: string) => ipcRenderer.invoke('sftp-delete', { id, path }),
  sftpMkdir: (id: string, path: string) => ipcRenderer.invoke('sftp-mkdir', { id, path }),
  sftpRename: (id: string, oldPath: string, newPath: string) => ipcRenderer.invoke('sftp-rename', { id, oldPath, newPath }),
  getPwd: (id: string) => ipcRenderer.invoke('get-pwd', id),

  openDialog: () => ipcRenderer.invoke('dialog-open'),
  saveDialog: (defaultName: string) => ipcRenderer.invoke('dialog-save', defaultName),
  
  startMonitoring: (id: string) => ipcRenderer.send('start-monitoring', id),
  stopMonitoring: (id: string) => ipcRenderer.send('stop-monitoring', id),
  onStatsUpdate: (callback: (event: any, payload: { id: string, stats: any }) => void) => {
    const subscription = (event: any, payload: any) => callback(event, payload);
    ipcRenderer.on('stats-update', subscription);
    return () => ipcRenderer.removeListener('stats-update', subscription);
  },

  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // Store
  storeGet: (key: string) => ipcRenderer.invoke('store-get', key),
  storeSet: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
  storeDelete: (key: string) => ipcRenderer.invoke('store-delete', key),
});

console.log('Preload script loaded');
