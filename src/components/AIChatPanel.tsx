// AIChatPanel - Agent mode chat interface
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Bot, User, Send, Loader2, Sparkles, ChevronDown, ChevronRight, Terminal, Square, Zap, Shield, ShieldCheck, Check, X } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useSettingsStore } from '../store/settingsStore';
import { cn } from '../lib/utils';

export interface AgentMessage {
    id: string;
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: number;
    toolCall?: {
        name: string;
        command: string;
        status: 'pending' | 'executed';
    };
    isStreaming?: boolean;
}

interface AIChatPanelProps {
    connectionId: string;
    messages: AgentMessage[];
    onMessagesChange: (messages: AgentMessage[]) => void;
    onExecuteCommand: (command: string) => void;
    className?: string;
}

export function AIChatPanel({ connectionId, messages, onMessagesChange, onExecuteCommand, className }: AIChatPanelProps) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [pendingCommands, setPendingCommands] = useState<{ cmd: string; msgId: string }[]>([]);
    const [showModeMenu, setShowModeMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { aiSendShortcut, agentControlMode, setAgentControlMode, agentWhitelist } = useSettingsStore();

    // Rolling buffer of recent terminal output (last 100 lines), stripped of ANSI codes
    const terminalBufferRef = useRef<string[]>([]);

    // Subscribe to terminal data for this connection and maintain the buffer
    useEffect(() => {
        const eWindow = window as any;
        if (!eWindow.electron?.onTerminalData) return;

        const stripAnsi = (str: string) =>
            // Remove ANSI escape sequences (colors, cursor movements, etc.)
            str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');

        const cleanup = eWindow.electron.onTerminalData(
            (_: any, { id, data }: { id: string; data: string }) => {
                if (id !== connectionId) return;
                const clean = stripAnsi(data);
                // Split incoming data into lines and add to buffer
                const incoming = clean.split(/\r?\n/);
                terminalBufferRef.current = [
                    ...terminalBufferRef.current,
                    ...incoming,
                ].filter(l => l.trim()).slice(-100); // keep last 100 non-empty lines
            }
        );
        return cleanup;
    }, [connectionId]);

    /** Get recent terminal output as a context string for the AI */
    const getTerminalContext = () => {
        const lines = terminalBufferRef.current;
        if (lines.length === 0) return '';
        // Send last 80 lines to avoid huge token usage
        const recent = lines.slice(-80).join('\n');
        return `\n\n---\n[当前终端最近输出]\n\`\`\`\n${recent}\n\`\`\`\n请根据以上终端输出来了解服务器当前状态并回答用户的问题。`;
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const extractCommands = (text: string): string[] => {
        const regex = /```(?:bash|sh|shell|zsh)?\n([\s\S]*?)```/g;
        const commands: string[] = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            const cmd = match[1].trim();
            if (cmd) commands.push(cmd);
        }
        return commands;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        if (!aiService.isConfigured()) {
            const errorMsg: AgentMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: '⚠️ 请先在设置中配置 AI API Key',
                timestamp: Date.now(),
            };
            onMessagesChange([...messages, errorMsg]);
            return;
        }

        const userMsg: AgentMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: Date.now(),
        };

        const updatedMessages = [...messages, userMsg];
        onMessagesChange(updatedMessages);
        setInput('');
        setIsLoading(true);

        const assistantId = (Date.now() + 1).toString();
        const assistantMsg: AgentMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
            isStreaming: true,
        };

        const withAssistant = [...updatedMessages, assistantMsg];
        onMessagesChange(withAssistant);

        try {
            // Build messages for AI
            const systemPrompt = (await import('../shared/aiTypes')).AI_SYSTEM_PROMPTS.agent;
            const terminalContext = getTerminalContext();
            const chatMessages = [
                { role: 'system' as const, content: systemPrompt + terminalContext },
                ...updatedMessages.map(m => ({
                    role: m.role === 'tool' ? 'assistant' as const : m.role as 'user' | 'assistant',
                    content: m.content,
                })),
            ];

            let fullContent = '';
            const stream = aiService.streamComplete({ messages: chatMessages, temperature: 0.7 });

            for await (const chunk of stream) {
                fullContent += chunk;
                const streamingMessages = withAssistant.map(m =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                );
                onMessagesChange(streamingMessages);
            }

            // Finalize message
            const commands = extractCommands(fullContent);
            const finalMessages = withAssistant.map(m =>
                m.id === assistantId
                    ? { ...m, content: fullContent, isStreaming: false }
                    : m
            );

            // Handle commands based on agent control mode
            if (commands.length > 0) {
                if (agentControlMode === 'auto') {
                    // Auto mode: execute all commands immediately
                    const toolMessages: AgentMessage[] = commands.map((cmd, i) => ({
                        id: `${assistantId}-tool-${i}`,
                        role: 'tool' as const,
                        content: `执行命令: ${cmd}`,
                        timestamp: Date.now(),
                        toolCall: { name: 'execute_command', command: cmd, status: 'executed' as const },
                    }));
                    onMessagesChange([...finalMessages, ...toolMessages]);
                    for (const cmd of commands) {
                        onExecuteCommand(cmd + '\n');
                        await new Promise(r => setTimeout(r, 300));
                    }
                } else if (agentControlMode === 'whitelist') {
                    // Whitelist mode: auto-execute whitelisted, queue others for approval
                    const autoExec: string[] = [];
                    const needApproval: string[] = [];
                    for (const cmd of commands) {
                        const firstWord = cmd.trim().split(/\s+/)[0];
                        if (agentWhitelist.some(w => firstWord === w)) {
                            autoExec.push(cmd);
                        } else {
                            needApproval.push(cmd);
                        }
                    }
                    const toolMessages: AgentMessage[] = autoExec.map((cmd, i) => ({
                        id: `${assistantId}-tool-${i}`,
                        role: 'tool' as const,
                        content: `执行命令: ${cmd}`,
                        timestamp: Date.now(),
                        toolCall: { name: 'execute_command', command: cmd, status: 'executed' as const },
                    }));
                    const pendingToolMessages: AgentMessage[] = needApproval.map((cmd, i) => ({
                        id: `${assistantId}-pending-${i}`,
                        role: 'tool' as const,
                        content: `等待批准: ${cmd}`,
                        timestamp: Date.now(),
                        toolCall: { name: 'execute_command', command: cmd, status: 'pending' as const },
                    }));
                    onMessagesChange([...finalMessages, ...toolMessages, ...pendingToolMessages]);
                    for (const cmd of autoExec) {
                        onExecuteCommand(cmd + '\n');
                        await new Promise(r => setTimeout(r, 300));
                    }
                    if (needApproval.length > 0) {
                        setPendingCommands(needApproval.map((cmd, i) => ({ cmd, msgId: `${assistantId}-pending-${i}` })));
                    }
                } else {
                    // Approval mode: all commands need approval
                    const pendingToolMessages: AgentMessage[] = commands.map((cmd, i) => ({
                        id: `${assistantId}-pending-${i}`,
                        role: 'tool' as const,
                        content: `等待批准: ${cmd}`,
                        timestamp: Date.now(),
                        toolCall: { name: 'execute_command', command: cmd, status: 'pending' as const },
                    }));
                    onMessagesChange([...finalMessages, ...pendingToolMessages]);
                    setPendingCommands(commands.map((cmd, i) => ({ cmd, msgId: `${assistantId}-pending-${i}` })));
                }
            } else {
                onMessagesChange(finalMessages);
            }
        } catch (err: any) {
            const errorMessages = withAssistant.map(m =>
                m.id === assistantId
                    ? { ...m, content: `❌ 错误: ${err.message}`, isStreaming: false }
                    : m
            );
            onMessagesChange(errorMessages);
        } finally {
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        const isSendTriggered = aiSendShortcut === 'ctrlEnter'
            ? (e.key === 'Enter' && e.ctrlKey)
            : (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey);

        if (isSendTriggered) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleStop = () => {
        abortController?.abort();
        setIsLoading(false);
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/60 gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-primary/60" />
                        </div>
                        <p className="text-sm">输入指令，AI 将自动操作服务器</p>
                        <div className="flex flex-wrap gap-2 mt-2 max-w-sm justify-center">
                            {['查看磁盘空间', '列出运行中的服务', '查看系统负载'].map(hint => (
                                <button
                                    key={hint}
                                    onClick={() => setInput(hint)}
                                    className="px-3 py-1.5 rounded-full text-xs bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                                >
                                    {hint}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {isLoading && messages[messages.length - 1]?.content === '' && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm px-4">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span>思考中...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Pending approval bar */}
            {pendingCommands.length > 0 && (
                <div className="border-t border-border px-3 py-2 bg-yellow-500/5">
                    <div className="text-[11px] font-medium text-yellow-600 dark:text-yellow-400 mb-1.5">⏳ {pendingCommands.length} 个命令等待批准</div>
                    <div className="space-y-1">
                        {pendingCommands.map(({ cmd, msgId }, idx) => (
                            <div key={msgId} className="flex items-center gap-2 text-xs">
                                <code className="flex-1 bg-secondary/60 px-2 py-1 rounded font-mono text-[11px] truncate">{cmd}</code>
                                <button
                                    onClick={() => {
                                        onExecuteCommand(cmd + '\n');
                                        // Update message status
                                        const updatedMsgs = messages.map(m =>
                                            m.id === msgId ? { ...m, content: `执行命令: ${cmd}`, toolCall: { ...m.toolCall!, status: 'executed' as const } } : m
                                        );
                                        onMessagesChange(updatedMsgs);
                                        setPendingCommands(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="p-1 rounded bg-green-500/20 text-green-600 hover:bg-green-500/30 transition-colors"
                                    title="批准执行"
                                >
                                    <Check className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => {
                                        const updatedMsgs = messages.map(m =>
                                            m.id === msgId ? { ...m, content: `已拒绝: ${cmd}`, toolCall: { ...m.toolCall!, status: 'executed' as const } } : m
                                        );
                                        onMessagesChange(updatedMsgs);
                                        setPendingCommands(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="p-1 rounded bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-colors"
                                    title="拒绝"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {pendingCommands.length > 1 && (
                            <div className="flex gap-1.5 mt-1">
                                <button
                                    onClick={() => {
                                        for (const { cmd } of pendingCommands) {
                                            onExecuteCommand(cmd + '\n');
                                        }
                                        const updatedMsgs = messages.map(m => {
                                            const pc = pendingCommands.find(p => p.msgId === m.id);
                                            return pc ? { ...m, content: `执行命令: ${pc.cmd}`, toolCall: { ...m.toolCall!, status: 'executed' as const } } : m;
                                        });
                                        onMessagesChange(updatedMsgs);
                                        setPendingCommands([]);
                                    }}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 hover:bg-green-500/30 transition-colors"
                                >
                                    全部批准
                                </button>
                                <button
                                    onClick={() => {
                                        const updatedMsgs = messages.map(m => {
                                            const pc = pendingCommands.find(p => p.msgId === m.id);
                                            return pc ? { ...m, content: `已拒绝: ${pc.cmd}`, toolCall: { ...m.toolCall!, status: 'executed' as const } } : m;
                                        });
                                        onMessagesChange(updatedMsgs);
                                        setPendingCommands([]);
                                    }}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-colors"
                                >
                                    全部拒绝
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border p-3 bg-background/50">
                {/* Mode selector bar */}
                <div className="flex items-center gap-2 mb-2 relative">
                    <button
                        onClick={() => setShowModeMenu(!showModeMenu)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium bg-secondary/50 hover:bg-secondary/80 text-muted-foreground transition-colors border border-border/40"
                    >
                        {agentControlMode === 'auto' && <><Zap className="w-3 h-3 text-green-500" />完全 AI 控制</>}
                        {agentControlMode === 'approval' && <><Shield className="w-3 h-3 text-yellow-500" />批准模式</>}
                        {agentControlMode === 'whitelist' && <><ShieldCheck className="w-3 h-3 text-blue-500" />白名单模式</>}
                        <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {showModeMenu && (
                        <div className="absolute bottom-full left-0 mb-1 bg-popover border border-border rounded-lg shadow-lg py-1 z-50 min-w-[200px]">
                            {[
                                { id: 'auto' as const, icon: <Zap className="w-3.5 h-3.5 text-green-500" />, label: '完全 AI 控制', desc: '所有命令自动执行' },
                                { id: 'approval' as const, icon: <Shield className="w-3.5 h-3.5 text-yellow-500" />, label: '批准模式', desc: '每条命令需要手动批准' },
                                { id: 'whitelist' as const, icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />, label: '白名单模式', desc: '白名单内命令自动执行' },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => { setAgentControlMode(opt.id); setShowModeMenu(false); }}
                                    className={cn(
                                        "w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-accent transition-colors",
                                        agentControlMode === opt.id && "bg-accent/50"
                                    )}
                                >
                                    {opt.icon}
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium">{opt.label}</span>
                                        <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                                    </div>
                                    {agentControlMode === opt.id && <Check className="w-3 h-3 text-primary ml-auto mt-0.5" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="告诉 AI 你想做什么..."
                        rows={1}
                        className="w-full resize-none bg-secondary/40 rounded-xl px-4 py-2.5 pr-12 text-sm outline-none border border-border/50 focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                        disabled={isLoading}
                    />
                    {isLoading ? (
                        <button
                            onClick={handleStop}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                            title="停止生成"
                        >
                            <Square className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors",
                                input.trim()
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-secondary/60 text-muted-foreground cursor-not-allowed"
                            )}
                            title={aiSendShortcut === 'ctrlEnter' ? '发送 (Ctrl+Enter)' : '发送 (Enter)'}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="text-[10px] text-muted-foreground/50 mt-1.5 px-1">
                    {aiSendShortcut === 'ctrlEnter' ? 'Ctrl+Enter 发送 · Shift+Enter 换行' : 'Enter 发送 · Shift+Enter 换行'}
                </div>
            </div>
        </div>
    );
}

// Message Bubble Component
function MessageBubble({ message }: { message: AgentMessage }) {
    const [expanded, setExpanded] = useState(true);

    if (message.role === 'tool') {
        return (
            <div className="px-2">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                    {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <Terminal className="w-3 h-3 text-primary" />
                    <span className="font-mono">{message.toolCall?.command}</span>
                    <span className="ml-auto text-[10px] text-green-500">✓ 已执行</span>
                </button>
            </div>
        );
    }

    const isUser = message.role === 'user';

    return (
        <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
            {/* Avatar */}
            <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                isUser ? "bg-primary/20" : "bg-secondary"
            )}>
                {isUser ? (
                    <User className="w-3.5 h-3.5 text-primary" />
                ) : (
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                )}
            </div>

            {/* Content */}
            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                isUser
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-secondary/60 text-foreground rounded-tl-md"
            )}>
                {message.isStreaming && !message.content && (
                    <div className="flex gap-1 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}
                <MessageContent content={message.content} isUser={isUser} />
            </div>
        </div>
    );
}

// Simple markdown-ish content renderer
function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
    if (!content) return null;

    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="space-y-2">
            {parts.map((part, i) => {
                if (part.startsWith('```')) {
                    const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
                    if (match) {
                        const lang = match[1] || 'bash';
                        const code = match[2].trim();
                        return (
                            <div key={i} className="rounded-lg overflow-hidden my-2">
                                <div className="flex items-center justify-between px-3 py-1 bg-black/20 text-[10px] text-muted-foreground">
                                    <span>{lang}</span>
                                </div>
                                <pre className="px-3 py-2 bg-black/30 text-xs font-mono overflow-x-auto">
                                    <code>{code}</code>
                                </pre>
                            </div>
                        );
                    }
                }

                // Render inline text with basic formatting
                return (
                    <span key={i} className="whitespace-pre-wrap break-words">
                        {part.split('\n').map((line, j) => (
                            <span key={j}>
                                {j > 0 && <br />}
                                {renderInlineMarkdown(line)}
                            </span>
                        ))}
                    </span>
                );
            })}
        </div>
    );
}

function renderInlineMarkdown(text: string) {
    // Bold
    const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        // Inline code
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, j) => {
            if (cp.startsWith('`') && cp.endsWith('`')) {
                return (
                    <code key={`${i}-${j}`} className="px-1 py-0.5 rounded bg-black/20 text-[12px] font-mono">
                        {cp.slice(1, -1)}
                    </code>
                );
            }
            return <span key={`${i}-${j}`}>{cp}</span>;
        });
    });
}
