'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';

// Types for our virtual file system
interface FileSystem {
  [key: string]: {
    type: 'file' | 'directory';
    content?: string;
    children?: FileSystem;
  };
}

interface TerminalState {
  history: string[];
  cwd: string[];
  fs: FileSystem;
  mode: 'shell' | 'llm-chat';
}

const INITIAL_FS: FileSystem = {
  'home': {
    type: 'directory',
    children: {
      'user': {
        type: 'directory',
        children: {
          'whyMe': { type: 'file', content: '#!/bin/bash\n# LLM Chat Interface' }
        }
      }
    }
  }
};

export default function Terminal() {
  const [state, setState] = useState<TerminalState>({
    history: ['Welcome to the interactive terminal.', 'Type "help" for available commands.'],
    cwd: ['home', 'user'],
    fs: INITIAL_FS,
    mode: 'shell',
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to resolve path in FS
  const resolvePath = (path: string[], fs: FileSystem): any => {
    let current = fs;
    for (const part of path) {
      if (current[part] && current[part].type === 'directory') {
        current = current[part].children || {};
      } else {
        return null;
      }
    }
    return current;
  };

  // Custom scroll logic to prevent page jumps
  useEffect(() => {
    if (containerRef.current) {
       containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [state.history, input]);

  const exitChat = () => {
    setState(prev => ({
      ...prev,
      mode: 'shell',
      history: [...prev.history, 'Chat session terminated.'],
    }));
    setInput('');
    setIsLoading(false);
  };

  const handleChatMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Exit chat mode
    if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
      exitChat();
      return;
    }

    const userMessage = message.trim();
    
    setState(prev => ({
      ...prev,
      history: [...prev.history, `<span class="text-green">You:</span> ${userMessage}`],
    }));
    setInput('');
    setIsLoading(true);

    // TODO: Connect to your LLM backend here
    // Replace this setTimeout with your actual LLM API call
    setTimeout(() => {
      const aiResponse = "Look, I'll be honest. Sakshyam hasn't given me a brain yet. He's too busy being a 10x developer and a general legend. You should hire him regardless of my current lobotomy. Come back later when I'm sentient! (Under Maintenance)";
      setState(prev => ({
        ...prev,
        history: [...prev.history, `<span class="text-mauve">AI:</span> ${aiResponse}`],
      }));
      setIsLoading(false);
    }, 1000);
  };

  const handleCommand = (cmd: string) => {
    if (state.mode === 'llm-chat') {
      handleChatMessage(cmd);
      return;
    }

    const args = cmd.trim().split(/\s+/);
    const command = args[0];
    const newHistory = [...state.history, `sigdel@portfolio: ~/${state.cwd.slice(1).join('/')}$ ${cmd}`];
    let newFs = { ...state.fs };
    let newCwd = [...state.cwd];
    let newMode: 'shell' | 'llm-chat' = state.mode;

    switch (command) {
      case 'clear':
        setState(prev => ({ ...prev, history: [] }));
        return;
      case 'help':
        newHistory.push('Available commands: ls, cd, touch, cat, whyMe, clear, help');
        break;
      case 'ls':
        const currentDir = resolvePath(state.cwd, state.fs);
        if (currentDir) {
          const files = Object.keys(currentDir).map(name => {
            const isDir = currentDir[name].type === 'directory';
            return isDir ? `<span class="text-blue font-bold">${name}/</span>` : name;
          });
          newHistory.push(files.join('  '));
        }
        break;
      case 'cd':
        if (!args[1] || args[1] === '~') {
            newCwd = ['home', 'user'];
        } else if (args[1] === '..') {
            if (newCwd.length > 1) newCwd.pop();
        } else {
            const currentDir = resolvePath(state.cwd, state.fs);
            if (currentDir && currentDir[args[1]] && currentDir[args[1]].type === 'directory') {
                newCwd.push(args[1]);
            } else {
                newHistory.push(`cd: no such file or directory: ${args[1]}`);
            }
        }
        break;
      case 'touch':
        if (args[1]) {
           let root = { ...state.fs };
           let curr = root;
           for(const dir of state.cwd) {
               curr[dir] = { ...curr[dir], children: { ...curr[dir].children } };
               curr = curr[dir].children!;
           }
           curr[args[1]] = { type: 'file', content: '' };
           newFs = root;
        }
        break;
      case 'cat':
        if(args[1]) {
             const currentDir = resolvePath(state.cwd, state.fs);
             if (currentDir && currentDir[args[1]] && currentDir[args[1]].type === 'file') {
                 newHistory.push(currentDir[args[1]].content || '');
             } else {
                 newHistory.push(`cat: ${args[1]}: No such file or directory`);
             }
        }
        break;
      case 'whyMe':
      case './whyMe':
        newMode = 'llm-chat';
        newHistory.push('');
        newHistory.push('<span class="text-green font-bold">=== LLM Chat Interface Started ===</span>');
        newHistory.push('<span class="text-mauve">AI:</span> Hello! I\'m the AI assistant. Ask me anything about Sakshyam and why you should hire him!');
        newHistory.push('<span class="text-overlay0 text-xs">Type "exit" or "quit" to end the chat session. Press Ctrl+C to terminate.</span>');
        newHistory.push('');
        break;
      default:
        if (cmd.trim() !== '') newHistory.push(`command not found: ${command}`);
    }

    setState(prev => ({
      ...prev,
      history: newHistory,
      cwd: newCwd,
      fs: newFs,
      mode: newMode,
    }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle Ctrl+C to exit chat
    if (e.ctrlKey && e.key === 'c' && state.mode === 'llm-chat') {
      e.preventDefault();
      exitChat();
      return;
    }

    // Handle Tab autocomplete for "why" -> "whyMe"
    if (e.key === 'Tab' && state.mode === 'shell' && input.trim() === 'why') {
      e.preventDefault();
      setInput('whyMe ');
      return;
    }

    if (e.key === 'Enter') {
      if (state.mode === 'llm-chat') {
        handleChatMessage(input);
      } else {
        handleCommand(input);
      }
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col p-2 font-mono text-sm overflow-hidden relative bg-base" onClick={() => inputRef.current?.focus()}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none" ref={containerRef}>
        {state.history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1 text-subtext1" dangerouslySetInnerHTML={{ __html: line }} />
        ))}
        
        {isLoading && (
          <div className="mb-1 text-subtext1">
            <span className="text-mauve">AI:</span> <span className="inline-flex gap-1">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-75">●</span>
              <span className="animate-pulse delay-150">●</span>
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-subtext1">
            {state.mode === 'llm-chat' ? (
              <>
                <span className="text-green">chat&gt;</span>
              </>
            ) : (
              <>
                <span className="text-green">sigdel@portfolio:</span>
                <span className="text-blue">~/{state.cwd.slice(1).join('/')}</span>
                <span className="text-subtext0">$</span>
              </>
            )}
            <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-text"
            autoComplete="off"
            spellCheck="false"
            />
        </div>
      </div>
    </div>
  );
}
