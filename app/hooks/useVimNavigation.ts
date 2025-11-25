'use client';

import { useEffect, useState, useRef } from 'react';

export function useVimNavigation() {
  const [searchOpen, setSearchOpen] = useState(false);
  // Ref to track 'g' key sequence
  const lastKeyTime = useRef<number>(0);
  const lastKey = useRef<string>('');
  // Refs for continuous scrolling
  const isScrolling = useRef<boolean>(false);
  const scrollDirection = useRef<'down' | 'up' | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const pixelsPerSecond = 800;
    const pixelsPerFrame = pixelsPerSecond / 60; // ~13.3 pixels per frame at 60fps

    const performScroll = () => {
      if (!isScrolling.current) return;

      const scrollAmount = scrollDirection.current === 'down' ? pixelsPerFrame : -pixelsPerFrame;
      window.scrollBy({ top: scrollAmount, behavior: 'auto' });
      animationFrameId.current = requestAnimationFrame(performScroll);
    };

    const startScrolling = (direction: 'down' | 'up') => {
      if (isScrolling.current && scrollDirection.current === direction) return;
      
      stopScrolling();
      scrollDirection.current = direction;
      isScrolling.current = true;
      animationFrameId.current = requestAnimationFrame(performScroll);
    };

    const stopScrolling = () => {
      isScrolling.current = false;
      scrollDirection.current = null;
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if active element is an input or textarea
      const active = document.activeElement;
      if (
        active?.tagName === 'INPUT' || 
        active?.tagName === 'TEXTAREA' || 
        active?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const now = Date.now();
      
      // Navigation keys
      switch (e.key) {
        case 'j':
          e.preventDefault();
          e.stopPropagation();
          if (!e.repeat) startScrolling('down');
          break;
        case 'k':
          e.preventDefault();
          e.stopPropagation();
          if (!e.repeat) startScrolling('up');
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
      if (e.key === 'j' || e.key === 'k') {
        stopScrolling();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopScrolling();
    };
  }, []);

  return { searchOpen, setSearchOpen };
}
