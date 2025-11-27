'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [activeLine, setActiveLine] = useState(-1);
  const [statusMsg, setStatusMsg] = useState("loading symbols...");
  const [regs, setRegs] = useState({
    rax: "0x00000000",
    rbx: "0x00000000",
    rcx: "0x00000000",
    rip: "0x00401000",
    rsp: "0x7ffffff0"
  });

  useEffect(() => {
    const sequence = [
      { line: 0, msg: "running...", regs: { rip: "0x00401000", rax: "0x00000000" } },
      { line: 1, msg: "running...", regs: { rip: "0x00401001", rsp: "0x7fffffe0" } }, // push rbp
      { line: 2, msg: "running...", regs: { rip: "0x00401004", rbx: "0x7fffffe0" } }, // mov rbp, rsp
      { line: 3, msg: "running...", regs: { rip: "0x00401007", rcx: "0x00000001" } }, // mov edi, 1
      { line: 4, msg: "resolving address...", regs: { rip: "0x0040100c", rax: "0x00402000" } }, // lea rsi
      { line: 5, msg: "calling function...", regs: { rip: "0x00401013" } }, // call
      { line: 5, msg: "launching portfolio.tsx...", regs: { rip: "0x00401050" } }, // inside call
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < sequence.length) {
        const s = sequence[step];
        setActiveLine(s.line);
        setStatusMsg(s.msg);
        setRegs(prev => ({ ...prev, ...s.regs }));
        step++;
      } else {
        clearInterval(interval);
        // Trigger completion
        onComplete();
      }
    }, 500); // Speed of simulation

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-base flex items-center justify-center p-4 transition-opacity duration-500">
      <div className="w-full max-w-2xl">
        {/* GDB Debugger Visual */}
        <div className="border-2 border-mauve rounded bg-base overflow-hidden font-mono text-xs select-none shadow-[0_0_50px_rgba(203,166,247,0.25)]">
            {/* Hyprland-style Title Bar */}
            <div className="bg-mauve/10 border-b border-mauve/20 p-2 flex items-center justify-between px-4">
              <div className="text-mauve font-bold text-sm">~ [DEBUG] ./portfolio</div>
              <div className="text-overlay1 text-xs">gdb-multiarch</div>
            </div>
            
            {/* Debugger Content */}
            <div className="p-6 grid grid-cols-5 gap-6">
               {/* Registers Column */}
               <div className="col-span-2 space-y-2 border-r border-surface1 pr-4">
                  <div className="text-mauve font-bold mb-3 text-xs">REGISTERS</div>
                  <div className="flex justify-between group"><span className="text-blue">RAX</span> <span className="text-subtext0 transition-colors">{regs.rax}</span></div>
                  <div className="flex justify-between group"><span className="text-blue">RBX</span> <span className="text-subtext0 transition-colors">{regs.rbx}</span></div>
                  <div className="flex justify-between group"><span className="text-blue">RCX</span> <span className="text-subtext0 transition-colors">{regs.rcx}</span></div>
                  <div className="flex justify-between group"><span className="text-blue">RIP</span> <span className="text-green font-bold transition-colors">{regs.rip}</span></div>
                  <div className="flex justify-between group"><span className="text-blue">RSP</span> <span className="text-subtext0 transition-colors">{regs.rsp}</span></div>
               </div>

               {/* Disassembly Column */}
               <div className="col-span-3 space-y-2">
                  <div className="text-mauve font-bold mb-3 text-xs">DISASSEMBLY</div>
                  {[
                    { addr: "0x401000", code: "_start:" },
                    { addr: "0x401000", code: "push   rbp" },
                    { addr: "0x401001", code: "mov    rbp,rsp" },
                    { addr: "0x401004", code: "mov    edi,0x1" },
                    { addr: "0x401009", code: "lea    rsi,[rip+0x200]" },
                    { addr: "0x401010", code: "call   0x401050 <init>" },
                    { addr: "0x401015", code: "xor    eax,eax" },
                  ].map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-4 px-2 py-0.5 rounded transition-colors ${
                        activeLine === idx ? 'bg-surface1 text-green font-bold' : 'text-overlay1'
                      }`}
                    >
                      <span className={activeLine === idx ? 'text-green' : 'text-subtext1'}>{line.addr}</span>
                      <span>{line.code}</span>
                      {activeLine === idx && <span className="text-overlay0 ml-auto">&lt;--</span>}
                    </div>
                  ))}
               </div>
            </div>
            
            {/* Status Bar */}
            <div className="bg-surface0/50 border-t border-surface1 p-2 px-4 text-xs text-overlay1 flex justify-between">
               <span className="text-green">{statusMsg}</span>
               <span>(gdb)</span>
            </div>
          </div>
      </div>
    </div>
  );
}
