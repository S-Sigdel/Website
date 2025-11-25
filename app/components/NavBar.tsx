'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { name: '~/intro', href: '#intro' },
    { name: '~/projects', href: '#projects' },
    { name: '~/workflow', href: '#workflow' },
    { name: '~/machine', href: '#machine' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface0 bg-base/90 backdrop-blur-sm text-green font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Username */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-subtext0 text-xs sm:text-sm">sigdel@portfolio:~$</span>
          <span className="animate-pulse text-text hidden sm:inline">_</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 lg:gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="hover:text-teal hover:underline decoration-teal/50 underline-offset-4 transition-all text-xs lg:text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right: Version + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <div className="text-subtext0 text-xs hidden sm:block">
            v1.0.0
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-surface0 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface0 bg-base/95 backdrop-blur-sm">
          <div className="flex flex-col px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="hover:text-teal hover:bg-surface0/50 px-3 py-2 rounded transition-all text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
