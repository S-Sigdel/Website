'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVimNavigation } from '../hooks/useVimNavigation';
import { PROJECTS, DEVPOST_PROJECTS } from '../data/projects';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
}

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useVimNavigation();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<{id: string, text: string, type: string, element?: HTMLElement, projectTitle?: string, slug?: string}[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch blog posts on mount
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogPosts(data))
      .catch(err => console.error('Failed to fetch blogs:', err));
  }, []);

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
          setSelectedIndex(0);
          return;
      }
      
      const queryLower = query.toLowerCase();
      const hits: {id: string, text: string, type: string, element?: HTMLElement, projectTitle?: string, slug?: string}[] = [];
      
      // 1. Search in Projects Data
      const allProjects = [...PROJECTS, ...DEVPOST_PROJECTS];
      allProjects.forEach(project => {
        if (project.title.toLowerCase().includes(queryLower) || project.desc.toLowerCase().includes(queryLower)) {
           hits.push({
             id: 'projects', // Will jump to projects section
             text: project.title,
             type: 'project',
             projectTitle: project.title
           });
        }
      });

      // 2. Search in Blog Posts
      blogPosts.forEach(post => {
        if (post.title.toLowerCase().includes(queryLower) || post.excerpt.toLowerCase().includes(queryLower) || post.content.toLowerCase().includes(queryLower)) {
          hits.push({
            id: `blog-${post.slug}`,
            text: post.title,
            type: 'blog',
            slug: post.slug
          });
        }
      });

      // 3. Search in DOM content (Sections)
      const sections = document.querySelectorAll('section, [id]');
      sections.forEach(section => {
          const id = section.id;
          if (!id) return;

          // Find specific text nodes containing the query
          const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, null);
          let node;
          while (node = walker.nextNode()) {
             if (node.textContent?.toLowerCase().includes(queryLower)) {
                const parent = node.parentElement;
                if (parent && parent.offsetParent !== null) { // Check if visible
                   // Avoid duplicates if we already added this section via title match
                   // But here we want specific element highlighting
                   
                   // Check if this is already covered by a project match (to avoid double hits for project cards)
                   const isProjectCard = parent.closest('.group'); // Assuming project cards have group class
                   if (isProjectCard) continue; 

                   hits.push({
                       id: id,
                       text: parent.textContent?.substring(0, 30) + '...',
                       type: 'text',
                       element: parent
                   });
                }
             }
          }
      });
      
      setResults(hits);
      setSelectedIndex(0);
      
      // Highlight first result
      if (hits.length > 0) {
          highlightResult(hits[0]);
      }
  }, [query, blogPosts]);

  const highlightResult = (result: typeof results[0]) => {
      // Remove old highlights
      document.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10', 'transition-all', 'duration-300');
      });

      if (result.element) {
          result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          result.element.classList.add('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10', 'transition-all', 'duration-300');
      } else if (result.id && result.type !== 'blog') {
          const el = document.getElementById(result.id);
          if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // If it's a project match, we might want to highlight the projects section
              if (result.type !== 'project') {
                 el.classList.add('search-highlight', 'ring-2', 'ring-yellow', 'ring-opacity-50', 'bg-yellow/10', 'transition-all', 'duration-300');
              }
          }
      }
  };

  const handleNext = () => {
      if (results.length === 0) return;
      const nextIndex = (selectedIndex + 1) % results.length;
      setSelectedIndex(nextIndex);
      highlightResult(results[nextIndex]);
  };

  const handlePrev = () => {
      if (results.length === 0) return;
      const prevIndex = (selectedIndex - 1 + results.length) % results.length;
      setSelectedIndex(prevIndex);
      highlightResult(results[prevIndex]);
  };

  const handleSelect = (result: typeof results[0]) => {
      if (result.type === 'project' && result.projectTitle) {
          // Dispatch event to open project
          const event = new CustomEvent('open-project', { detail: result.projectTitle });
          window.dispatchEvent(event);
          setSearchOpen(false);
          setQuery('');
      } else if (result.type === 'blog' && result.slug) {
          router.push(`/blog/${result.slug}`);
          setSearchOpen(false);
          setQuery('');
      } else {
          highlightResult(result);
          setSearchOpen(false);
          setQuery('');
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
          setSearchOpen(false);
          setQuery('');
      }
      if (e.key === 'Enter') {
          if (results.length > 0) {
              handleSelect(results[selectedIndex]);
          }
      }
      if (e.key === 'n' && e.ctrlKey) { // Ctrl+n for next, or just n if not focused? 
          // Vim style 'n' usually works in normal mode. Here we are in insert mode (input focused).
          // So maybe we use ArrowDown/Up or Tab
          e.preventDefault();
          handleNext();
      }
      if (e.key === 'ArrowDown') {
          e.preventDefault();
          handleNext();
      }
      if (e.key === 'ArrowUp') {
          e.preventDefault();
          handlePrev();
      }
  };

  // Global listener for 'n' when search is open but maybe input not focused? 
  // Actually input is always focused. Let's stick to Enter/Arrows for navigation in the list.
  // But user asked for "n = next searching thing".
  // If the user types "n", it goes into the query. 
  // Unless they mean AFTER searching and closing? 
  // "currently when searching inside the site... have n = next searching thing"
  // Usually in Vim, you search with /, type query, Enter. Then n goes to next.
  // So I should implement global 'n' handler in useVimNavigation or here.
  
  // Let's add a global listener for 'n' that works when search is CLOSED but we have a last query.
  // But for now, let's make it work inside the overlay with Ctrl+n or just n if query is empty? No.
  // Let's assume they mean standard Vim behavior: / -> query -> Enter -> (overlay closes) -> n (next match).
  
  // To support that, we need to persist the last query and results in a context or global state.
  // For now, let's just implement it inside the search overlay for navigation if they use a modifier, 
  // OR implement the Vim behavior.
  
  // Implementing Vim behavior:
  // 1. When Enter is pressed, save the query/results globally (or in a ref in a parent).
  // 2. Listen for 'n' in global scope.
  
  // Since I can't easily change the global architecture in one go, I'll add a "Next" button hint 
  // and maybe support Ctrl+N inside the input. 
  // AND I will add a global listener in this component that listens for 'n' when search is NOT open.
  
  useEffect(() => {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
          if (!searchOpen && e.key === 'n' && results.length > 0) {
              // Go to next result
              const nextIndex = (selectedIndex + 1) % results.length;
              setSelectedIndex(nextIndex);
              const res = results[nextIndex];
              
              if (res.type === 'project' && res.projectTitle) {
                  // For projects, we might just scroll to it or open it?
                  // Vim 'n' usually just jumps.
                  const el = document.getElementById('projects');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else if (res.type === 'blog' && res.slug) {
                  router.push(`/blog/${res.slug}`);
              } else {
                  highlightResult(res);
              }
          }
      };
      
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [searchOpen, results, selectedIndex, router]);


  if (!searchOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
      onClick={() => setSearchOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-base border border-green p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
             <div className="border-t border-surface1 pt-2 max-h-[60vh] overflow-y-auto">
                 {results.map((res, idx) => (
                     <div key={idx} 
                          className={`font-mono text-subtext0 py-2 px-3 cursor-pointer flex justify-between items-center ${
                              idx === selectedIndex ? 'bg-surface1 text-text' : 'hover:bg-surface1'
                          }`}
                          onClick={() => handleSelect(res)}>
                         <div className="flex items-center gap-3 overflow-hidden">
                             {res.type === 'project' ? (
                               <svg className="w-4 h-4 text-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                               </svg>
                             ) : res.type === 'blog' ? (
                               <svg className="w-4 h-4 text-mauve flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                               </svg>
                             ) : (
                               <svg className="w-4 h-4 text-subtext0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                               </svg>
                             )}
                             <span className="truncate">
                                 {res.type === 'project' ? res.projectTitle : res.text}
                             </span>
                         </div>
                         {idx === selectedIndex && <span className="text-green text-xs">⏎</span>}
                     </div>
                 ))}
             </div>
         )}
         
         <div className="text-xs text-overlay0 mt-4 hidden sm:flex justify-between font-mono">
             <span>ENTER to jump</span>
             <span>↑/↓ to navigate</span>
             <span>ESC to close</span>
         </div>
      </div>
    </div>
  );
}

