'use client';

import SectionContainer from './SectionContainer';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import MiniGame from './MiniGame';

export default function Intro() {
  const [copied, setCopied] = useState(false);
  const command = "wget https://sakshyamsigdel.com.np/Resume.pdf";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const HeroImage = ({ className }: { className?: string }) => (
    <div className={`relative group ${className}`}>
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
  );

  return (
    <SectionContainer id="intro">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Intro Content */}
        <div className="font-mono space-y-6">
          <div className="text-overlay0 h-24">
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

          {/* Mobile Hero Image (Visible only on small screens) */}
          <HeroImage className="lg:hidden" />

          {/* Social Links */}
          <div className="flex gap-4 items-center pt-2">
            <a 
              href="https://github.com/s-sigdel" 
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
              href="https://www.linkedin.com/in/sakshyam-sigdel-74b8a6232/" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-surface0 border border-surface1 rounded-lg hover:border-green/50 transition-all"
            >
              <svg className="w-5 h-5 text-text group-hover:text-green transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.063 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-text text-sm group-hover:text-green transition-colors">LinkedIn</span>
            </a>
          </div>

          {/* Mini Game */}
          <MiniGame />
        </div>

        {/* Right: Hero Image and Resume */}
        <div className="font-mono space-y-6 lg:pt-24">
          {/* Desktop Hero Image (Hidden on small screens) */}
          <HeroImage className="hidden lg:block" />

          {/* Resume Section */}
          <div className="space-y-3">
            <div className="text-overlay0 text-sm flex justify-between items-end">
              <p>// Resume Download</p>
            </div>

            {/* Command Box */}
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

            {/* Small Tip-style Download Button */}
            <div className="flex justify-end">
               <a 
                 href="/Resume.pdf" 
                 download="Resume.pdf"
                 className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface0 border border-surface1 rounded-full text-xs text-subtext0 hover:text-text hover:border-green hover:bg-green/10 transition-all"
               >
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 <span>Download PDF</span>
               </a>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
