'use client';

import { useState, useEffect, useRef } from 'react';
import { useVimNavigation } from '../hooks/useVimNavigation';

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useVimNavigation();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<{id: string, text: string}[]>([]);

  useEffect(() => {
    if (searchOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        // Remove highlights when search closes
        document.querySelectorAll('.search-highlight').forEach(el => {
          el.classList.remove('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10', 'transition-all', 'duration-300');
        });
    }
  }, [searchOpen]);

  // Search implementation with highlighting
  useEffect(() => {
      // Remove previous highlights
      document.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10', 'transition-all', 'duration-300');
      });

      if (!query) {
          setResults([]);
          return;
      }
      
      const queryLower = query.toLowerCase();
      const hits: {id: string, text: string, type: string}[] = [];
      
      // Search in sections
      const sections = document.querySelectorAll('section, [id]');
      sections.forEach(section => {
          const id = section.id;
          const textContent = section.textContent?.toLowerCase() || '';
          const title = section.querySelector('h1, h2, h3')?.textContent || '';
          
          // Check if query matches section content or title
          if (id && (textContent.includes(queryLower) || title.toLowerCase().includes(queryLower))) {
              // Special handling for resume search
              if (queryLower === 'resume' && (id === 'intro' || textContent.includes('resume') || title.toLowerCase().includes('resume'))) {
                  hits.push({
                      id: id,
                      text: title || id,
                      type: 'section'
                  });
                  
                  // Highlight the section
                  const sectionEl = document.getElementById(id);
                  if (sectionEl) {
                      sectionEl.classList.add('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10', 'transition-all', 'duration-300');
                      sectionEl.style.scrollMarginTop = '100px';
                  }
              } else if (queryLower !== 'resume') {
                  hits.push({
                      id: id,
                      text: title || id,
                      type: 'section'
                  });
                  
                  // Highlight the section
                  const sectionEl = document.getElementById(id);
                  if (sectionEl) {
                      sectionEl.classList.add('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10', 'transition-all', 'duration-300');
                      sectionEl.style.scrollMarginTop = '100px';
                  }
              }
          }
      });
      
      setResults(hits);
      
      // Auto-scroll to first result if available
      if (hits.length > 0) {
          const firstResult = document.getElementById(hits[0].id);
          if (firstResult) {
              setTimeout(() => {
                  firstResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
          }
      }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
          setSearchOpen(false);
          setQuery('');
      }
      if (e.key === 'Enter') {
          if (results.length > 0) {
              const el = document.getElementById(results[0].id);
              if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Ensure highlight is visible
                  el.classList.add('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10');
              }
              setSearchOpen(false);
              setQuery('');
          }
      }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-base border border-green p-4 shadow-2xl">
         <div className="flex items-center gap-2 text-xl font-mono mb-4">
             <span className="text-green">/</span>
             <input 
               ref={inputRef}
               type="text" 
               className="flex-1 bg-transparent border-none outline-none text-text placeholder-overlay0"
               placeholder="Search..."
               value={query}
               onChange={e => setQuery(e.target.value)}
               onKeyDown={handleKeyDown}
             />
         </div>
         
         {results.length > 0 && (
             <div className="border-t border-surface1 pt-2">
                 {results.map(res => (
                     <div key={res.id} className="font-mono text-subtext0 py-1 px-2 hover:bg-surface1 cursor-pointer"
                          onClick={() => {
                              const el = document.getElementById(res.id);
                              if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  // Ensure highlight is visible
                                  el.classList.add('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10');
                              }
                              setSearchOpen(false);
                              setQuery('');
                          }}>
                         Jump to: <span className="text-blue">#{res.text}</span>
                     </div>
                 ))}
             </div>
         )}
         
         <div className="text-xs text-overlay0 mt-4 flex justify-between font-mono">
             <span>ENTER to jump</span>
             <span>ESC to close</span>
         </div>
      </div>
    </div>
  );
}

