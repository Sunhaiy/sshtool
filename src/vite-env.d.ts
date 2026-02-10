/// <reference types="vite/client" />
import { SSHConnection, FileEntry, SystemStats } from './shared/types';

declare global {
  interface Window {
    electron: {
      getVersion: () => Promise<string>;

      connectSSH: (connection: SSHConnection) => Promise<{ success: boolean; error?: string }>;
      onTerminalData: (callback: (event: any, payload: { id: string, data: string }) => void) => () => void;
      writeTerminal: (id: string, data: string) => void;
      resizeTerminal: (id: string, cols: number, rows: number) => void;

      sftpList: (id: string, path: string) => Promise<FileEntry[]>;
      sftpUpload: (id: string, localPath: string, remotePath: string) => Promise<void>;
      sftpDownload: (id: string, remotePath: string, localPath: string) => Promise<void>;
      sftpDelete: (id: string, path: string) => Promise<void>;
      sftpMkdir: (id: string, path: string) => Promise<void>;
      sftpRename: (id: string, oldPath: string, newPath: string) => Promise<void>;
      sftpReadFile: (id: string, path: string) => Promise<string>;
      sftpWriteFile: (id: string, path: string, content: string) => Promise<void>;
      getPwd: (id: string) => Promise<string>;

      openDialog: () => Promise<string | undefined>;
      saveDialog: (defaultName: string) => Promise<string | undefined>;

      startMonitoring: (id: string) => void;
      stopMonitoring: (id: string) => void;
      onStatsUpdate: (callback: (event: any, payload: { id: string, stats: SystemStats }) => void) => () => void;

      getProcesses: (id: string) => Promise<any[]>;
      killProcess: (id: string, pid: number) => Promise<void>;

      getDockerContainers: (id: string) => Promise<any[]>;
      dockerAction: (id: string, containerId: string, action: 'start' | 'stop' | 'restart') => Promise<void>;



      onSSHStatus: (callback: (event: any, payload: { id: string, status: string }) => void) => () => void;

      minimize: () => void;
      maximize: () => void;
      close: () => void;

      storeGet: (key: string) => Promise<any>;
      storeSet: (key: string, value: any) => Promise<void>;
      storeDelete: (key: string) => Promise<void>;
    }
  }
}
