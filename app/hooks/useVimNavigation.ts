'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearch } from '../context/SearchContext';

export function useVimNavigation() {
  const { searchOpen, setSearchOpen } = useSearch();
  const lastKeyTime = useRef<number>(0);
  const lastKey = useRef<string>('');
  
  // Scroll loop state
  const scrollSpeed = useRef(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const SCROLL_VELOCITY = 12; // Pixels per frame (approx 720px/sec) - Reduced speed

    const updateScroll = () => {
      if (scrollSpeed.current !== 0) {
        // behavior: 'instant' is crucial here to prevent jitter 
        // by overriding the global scroll-behavior: smooth CSS
        window.scrollBy({ top: scrollSpeed.current, behavior: 'instant' });
        animationFrame.current = requestAnimationFrame(updateScroll);
      } else {
        animationFrame.current = null;
      }
    };

    const startScroll = (velocity: number) => {
      scrollSpeed.current = velocity;
      if (!animationFrame.current) {
        updateScroll();
      }
    };

    const stopScroll = () => {
      scrollSpeed.current = 0;
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't scroll if modal is open
      if (document.body.classList.contains('modal-open')) {
        return;
      }

      const active = document.activeElement;
      if (
        active?.tagName === 'INPUT' || 
        active?.tagName === 'TEXTAREA' || 
        active?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const now = Date.now();

      switch (e.key) {
        case 'j':
          startScroll(SCROLL_VELOCITY);
          break;
        case 'k':
          startScroll(-SCROLL_VELOCITY);
          break;
        case 'G':
            if (e.shiftKey) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
            break;
        case 'g':
            if (lastKey.current === 'g' && (now - lastKeyTime.current) < 500) {
                 window.scrollTo({ top: 0, behavior: 'smooth' });
                 lastKey.current = '';
            } else {
                lastKey.current = 'g';
                lastKeyTime.current = now;
            }
            break;
        case '/':
          e.preventDefault();
          setSearchOpen(true);
          break;
        default:
          lastKey.current = '';
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'j' && scrollSpeed.current > 0) {
        stopScroll();
      }
      if (e.key === 'k' && scrollSpeed.current < 0) {
        stopScroll();
      }
    };

    const handleOpenSearch = () => {
      setSearchOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // window.addEventListener('open-search', handleOpenSearch); // No longer needed
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // window.removeEventListener('open-search', handleOpenSearch);
      stopScroll();
    };
  }, [setSearchOpen]); // Added setSearchOpen dependency

  return { searchOpen, setSearchOpen };
}
