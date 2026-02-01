# 全新项目重构计划 (Project Rebirth Plan)

应您的要求，我将**彻底清空现有项目**，从零开始搭建一个干净、稳健的 SSH 工具。我们将继续使用 **React + TypeScript** 技术栈，配合 **Vite** 和 **Electron**，确保构建配置从一开始就是正确的。

## 1. 清理与初始化 (Clean & Init)

*   **动作**: 删除当前目录下所有文件。
*   **脚手架**: 使用 Vite 生成标准的 React + TypeScript 项目结构。
*   **依赖安装**:
    *   **核心**: `electron`, `react`, `react-dom`
    *   **构建**: `vite`, `typescript`, `electron-builder`, `concurrently` (用于同时运行前端和后端)
    *   **功能**: `ssh2` (SSH核心), `@xterm/xterm` (终端), `lucide-react` (图标), `recharts` (图表), `clsx/tailwind-merge` (样式工具)。

## 2. 架构设计 (Architecture)

我们将采用标准的双进程架构，确保目录结构清晰：

```
/
├── electron/
│   ├── main.ts        # 主进程入口 (负责窗口管理、SSH连接)
│   ├── preload.ts     # 预加载脚本 (负责安全暴露 API)
│   └── ssh/           # SSH 业务逻辑模块 (连接、SFTP、监控)
├── src/               # 渲染进程 (React 前端)
│   ├── components/    # UI 组件 (FileBrowser, Terminal, Monitor)
│   ├── App.tsx        # 主界面布局
│   └── main.tsx       # 入口
├── dist/              # 前端构建产物
└── dist-electron/     # 后端构建产物
```

## 3. 核心修复策略 (Core Fix Strategy)

为了避免之前的 `window.electron is undefined` 错误，我们将采取以下措施：

1.  **统一构建流**: 配置 `vite.config.ts` 同时处理前端构建，并使用 `tsc` 独立处理 Electron 主进程构建，确保两者互不干扰但能协同工作。
2.  **类型安全**: 在 `src/vite-env.d.ts` 中显式声明 `window.electron` 接口，确保前端开发有完整的代码提示。
3.  **绝对路径加载**: 在 `main.ts` 中使用 `path.resolve` 动态计算 `preload.js` 的路径，确保在开发模式（内存/即时编译）和生产模式（打包后）下都能找到文件。

## 4. 实施步骤 (Implementation Steps)

1.  **初始化 (Init)**: 清空目录，创建 `package.json` 和基础文件结构。
2.  **配置 (Config)**: 编写 `vite.config.ts` 和 `tsconfig.json`，配置 Tailwind CSS。
3.  **基座 (Foundation)**: 编写最简 `main.ts` 和 `preload.ts`，启动应用并验证 IPC 通信是否成功（显示 "IPC Connected"）。
4.  **功能开发 (Features)**:
    *   **SSH**: 移植 `SSHManager` 逻辑，支持连接和终端流。
    *   **UI**: 实现三栏布局（文件-终端-监控）。
    *   **SFTP**: 实现文件列表、上传、下载。
    *   **Monitor**: 实现系统状态图表。

一旦您确认，我将立即开始执行**清理**和**初始化**工作。
