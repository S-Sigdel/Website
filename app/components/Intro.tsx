'use client';

import SectionContainer from './SectionContainer';
import { useState } from 'react';
import Image from 'next/image';

export default function Intro() {
  const [copied, setCopied] = useState(false);
  const command = "wget https://sigdel.tech/resume.pdf";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Hex dump effect data
  const hexData = [
    { offset: "00000000", hex: "25 50 44 46 2d 31 2e 37  0a 25 d0 d4 c5 d8 0a 34", ascii: "%PDF-1.7..%....4" },
    { offset: "00000010", hex: "30 20 30 20 6f 62 6a 0a  3c 3c 2f 4c 65 6e 67 74", ascii: "0 0 obj.<<.Lengt" },
    { offset: "00000020", hex: "68 20 32 33 34 20 2f 46  69 6c 74 65 72 20 2f 46", ascii: "h 234 /Filter /F" },
    { offset: "00000030", hex: "6c 61 74 65 44 65 63 6f  64 65 3e 3e 0a 73 74 72", ascii: "lateDecode>>.str" },
    { offset: "00000040", hex: "65 61 6d 0a 78 9c 8d 91  4d 6e 83 30 10 85 f7 7e", ascii: "eam.x...Mn.0...~" },
  ];

  return (
    <SectionContainer id="intro">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Intro Content */}
        <div className="font-mono space-y-6">
          <div className="text-overlay0">
            <p>/**</p>
            <p> * @author Sakshyam Sigdel</p>
            <p> * @description Low-level enthusiast, hardware tinkerer.</p>
            <p> */</p>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-text tracking-tight">
            Hello, I&apos;m <span className="text-mauve">Sakshyam Sigdel</span>
          </h1>
          
          <div className="max-w-2xl text-subtext1 leading-relaxed">
            <p className="mb-4">
              <span className="text-mauve">constexpr</span> <span className="text-blue">std::string_view</span> <span className="text-yellow">bio</span> <span className="text-text">{'{'}</span> <span className="text-green">&quot;Not your average React developer. I dive deep into the stack, from silicon to software. C++ is my bread and butter.&quot;</span> <span className="text-text">{'}'}</span>;
            </p>
            <p>
               I specialize in embedded systems, low-level optimization, and building things that run close to the metal. 
               If it has a processor, I can probably program it.
            </p>
          </div>

          {/* Social Links - Moved to left side */}
          <div className="flex gap-4 items-center pt-2">
            <a 
              href="https://github.com/yourusername" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-surface0 border border-surface1 rounded-lg hover:border-green/50 transition-all"
            >
              <svg className="w-5 h-5 text-text group-hover:text-green transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-text text-sm group-hover:text-green transition-colors">GitHub</span>
            </a>
            
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-surface0 border border-surface1 rounded-lg hover:border-green/50 transition-all"
            >
              <svg className="w-5 h-5 text-text group-hover:text-green transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-text text-sm group-hover:text-green transition-colors">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right: Hero Image and Resume */}
        <div className="font-mono space-y-6">
          {/* Hero Image - Smaller size */}
          <div className="relative group">
            <div className="relative w-3/4 mx-auto aspect-square rounded-lg overflow-hidden border border-surface0 bg-surface0/50">
              <Image
                src="/hero.jpg"
                alt="Sakshyam Sigdel"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute bottom-2 left-2 font-mono text-xs text-text bg-surface0/90 px-2 py-1 rounded border border-surface1 backdrop-blur-sm">
                <span className="text-green">$</span> whoami
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="space-y-4">
            <div className="text-overlay0 text-sm">
              <p>// Resume Download</p>
            </div>

            {/* Copy Command Block */}
            <div className="relative group">
              <div className="flex items-center justify-between bg-surface0 border border-surface1 rounded-lg p-4 font-mono text-sm hover:border-green/50 transition-colors shadow-lg">
                <div className="flex items-center gap-3 overflow-x-auto">
                  <span className="text-mauve select-none">$</span>
                  <span className="text-text">{command}</span>
                </div>
                
                <button 
                  onClick={handleCopy}
                  className="ml-4 p-2 hover:bg-surface1 rounded-md transition-colors text-overlay1 hover:text-green flex-shrink-0"
                  title="Copy command"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Hex Dump Visual */}
            <div className="bg-base border border-surface0 p-4 rounded font-mono text-xs overflow-hidden relative opacity-80 hover:opacity-100 transition-opacity">
               <div className="absolute top-0 right-0 bg-surface0 text-overlay1 px-2 py-1 text-[10px] uppercase">
                 resume.pdf - hexview
               </div>
               {hexData.map((row) => (
                 <div key={row.offset} className="flex gap-4 hover:bg-surface0/30">
                   <span className="text-overlay1 select-none">{row.offset}</span>
                   <span className="text-mauve">{row.hex}</span>
                   <span className="text-green border-l border-surface1 pl-4 select-none opacity-50">{row.ascii}</span>
                 </div>
               ))}
               <div className="text-overlay1 mt-1 select-none">....... (45KB total)</div>
            </div>

            {/* Download Button */}
            <div className="flex justify-start">
              <a 
                href="https://sigdel.tech/resume.pdf" 
                download="resume.pdf"
                className="group relative px-6 py-3 bg-surface0 overflow-hidden rounded-sm border border-surface1 hover:border-green transition-all"
              >
                <div className="absolute inset-0 w-0 bg-green/10 transition-all duration-[250ms] ease-out group-hover:w-full" />
                <span className="relative text-text font-mono font-bold flex items-center gap-2">
                   <span className="text-green group-hover:text-text transition-colors">[</span>
                   download resume
                   <span className="text-green group-hover:text-text transition-colors">]</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
