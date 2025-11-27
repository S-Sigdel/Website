'use client';

import SectionContainer from './SectionContainer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PROJECTS, DEVPOST_PROJECTS, Project } from '../data/projects';

export default function ProjectsCarousel() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDevpostModal, setShowDevpostModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardImageIndex, setCardImageIndex] = useState<{ [key: string | number]: number }>({});
  const [imageFade, setImageFade] = useState<{ [key: string]: boolean }>({});
  const [mounted, setMounted] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for custom open-project events
  useEffect(() => {
    const handleOpenProject = (e: CustomEvent<string>) => {
      const title = e.detail;
      
      // Check main projects
      const mainProject = PROJECTS.find(p => p.title.toLowerCase() === title.toLowerCase());
      if (mainProject) {
        if (mainProject.isDevpost) {
          setShowDevpostModal(true);
        } else {
          setSelectedProject(mainProject);
          setCurrentImageIndex(0);
        }
        return;
      }

      // Check devpost projects
      const devpostProject = DEVPOST_PROJECTS.find(p => p.title.toLowerCase() === title.toLowerCase());
      if (devpostProject) {
        setShowDevpostModal(true);
        // Optionally scroll to the specific project in the modal
        setTimeout(() => {
           // This is a bit hacky, but we can try to find the element in the modal
           const elements = document.querySelectorAll('h3');
           elements.forEach(el => {
             if (el.textContent?.includes(devpostProject.title)) {
               el.scrollIntoView({ behavior: 'smooth', block: 'center' });
               el.parentElement?.classList.add('ring-2', 'ring-yellow');
               setTimeout(() => el.parentElement?.classList.remove('ring-2', 'ring-yellow'), 2000);
             }
           });
        }, 100);
      }
    };

    window.addEventListener('open-project', handleOpenProject as EventListener);
    return () => window.removeEventListener('open-project', handleOpenProject as EventListener);
  }, []);

  // Initialize fade states
  useEffect(() => {
    const initialFade: { [key: string]: boolean } = {};
    PROJECTS.forEach((project, index) => {
      if (project.images.length > 1) {
        initialFade[`project-${index}`] = true;
      }
    });
    DEVPOST_PROJECTS.forEach((project, index) => {
      if (project.images.length > 1) {
        initialFade[`devpost-${index}`] = true;
      }
    });
    setImageFade(initialFade);
  }, []);

  // Auto-slideshow for project cards with staggered timing and fade transitions
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    PROJECTS.forEach((project, index) => {
      if (project.images.length > 1) {
        // Stagger each project's slideshow by index * 500ms
        const baseDelay = index * 500;
        const interval = setInterval(() => {
          const key = `project-${index}`;
          // Fade out
          setImageFade(prev => ({ ...prev, [key]: false }));
          setTimeout(() => {
            setCardImageIndex(prev => ({
              ...prev,
              [index]: ((prev[index] || 0) + 1) % project.images.length
            }));
            // Fade in
            setTimeout(() => {
              setImageFade(prev => ({ ...prev, [key]: true }));
            }, 50);
          }, 300);
        }, 3000 + baseDelay);
        intervals.push(interval);
      }
    });

    // Auto-slideshow for devpost projects in modal with staggered timing
    DEVPOST_PROJECTS.forEach((project, index) => {
      if (project.images.length > 1) {
        // Stagger each project's slideshow by index * 600ms
        const baseDelay = index * 600;
        const interval = setInterval(() => {
          const key = `devpost-${index}`;
          // Fade out
          setImageFade(prev => ({ ...prev, [key]: false }));
          setTimeout(() => {
            setCardImageIndex(prev => ({
              ...prev,
              [`devpost-${index}`]: ((prev[`devpost-${index}`] || 0) + 1) % project.images.length
            }));
            // Fade in
            setTimeout(() => {
              setImageFade(prev => ({ ...prev, [key]: true }));
            }, 50);
          }, 300);
        }, 3500 + baseDelay);
        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  const openModal = useCallback((project: Project) => {
    if (project.isDevpost) {
      setShowDevpostModal(true);
    } else if (project.images.length > 0) {
      setSelectedProject(project);
      setCurrentImageIndex(0);
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  }, []);

  const closeDevpostModal = useCallback(() => {
    setShowDevpostModal(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showDevpostModal || selectedProject) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      return () => {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
      };
    }
  }, [showDevpostModal, selectedProject]);

  const nextImage = useCallback(() => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  }, [selectedProject]);

  const prevImage = useCallback(() => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
  }, [selectedProject]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!selectedProject && !showDevpostModal) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        if (selectedProject) closeModal();
        if (showDevpostModal) closeDevpostModal();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'j') {
        if (modalScrollRef.current) {
          modalScrollRef.current.scrollBy({ top: 100, behavior: 'smooth' });
        }
      } else if (e.key === 'k') {
        if (modalScrollRef.current) {
          modalScrollRef.current.scrollBy({ top: -100, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, showDevpostModal, closeModal, closeDevpostModal, prevImage, nextImage]);

  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      'Arduino': 'text-blue',
      'C++': 'text-blue',
      'Python': 'text-yellow',
      'JavaScript': 'text-yellow',
      'TypeScript': 'text-blue',
      'Blockchain': 'text-peach',
      'AI/ML': 'text-mauve',
      'OpenCV': 'text-pink',
      'Circuitry': 'text-red',
      'Web3': 'text-teal',
      'Security': 'text-red',
      'Authentication': 'text-mauve',
      'Smart Contracts': 'text-peach',
      'Game Development': 'text-green',
      'Education': 'text-blue',
      'WebSockets': 'text-teal',
      'Real-time': 'text-green',
      'APIs': 'text-yellow',
      'Capital One API': 'text-red',
      'Next.js': 'text-green',
      'Gemini': 'text-mauve',
      'GPT': 'text-green',
      'Midnight Blockchain': 'text-peach',
      'OpenAI': 'text-green',
      'Heuristic ML': 'text-mauve',
      'Ethereum': 'text-blue',
      'Cloud Run': 'text-yellow',
      'Firebase': 'text-yellow',
      'Go': 'text-blue',
      'React': 'text-blue',
      'Tesseract': 'text-pink',
      'tldraw': 'text-teal'
    };
    return colors[lang] || 'text-subtext0';
  };

  return (
    <>
      <SectionContainer id="projects" title="Projects">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {PROJECTS.map((project, index) => {
            const currentCardImageIndex = cardImageIndex[index] || 0;
            const hasImages = project.images.length > 0;
            const displayImage = hasImages ? project.images[currentCardImageIndex] : null;

            return (
              <div
                key={index}
                className={`group border bg-surface0/50 overflow-hidden cursor-pointer transition-all rounded-xl ${
                  project.isDevpost
                    ? 'md:col-span-2 border-yellow/70 border-2 hover:border-yellow hover:shadow-lg hover:shadow-yellow/30 relative'
                    : 'border-surface0 hover:border-green/50 hover:shadow-lg hover:shadow-green/10'
                }`}
                style={project.isDevpost ? {
                  animation: 'borderGlow 2s ease-in-out infinite'
                } : undefined}
                onClick={() => openModal(project)}
              >
                {displayImage && (
                  <div className="relative w-full h-48 overflow-hidden bg-surface1">
                    <Image
                      src={displayImage}
                      alt={project.title}
                      fill
                      className={`object-cover group-hover:scale-105 transition-all duration-500 ${
                        imageFade[`project-${index}`] === false ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    {project.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                        {project.images.map((_, imgIndex) => (
                          <div
                            key={imgIndex}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              imgIndex === currentCardImageIndex ? 'bg-green' : 'bg-base/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-md ${project.isDevpost ? 'bg-yellow/10 text-yellow' : 'bg-green/10 text-green'}`}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                         </svg>
                       </div>
                       <h3 className="text-lg font-bold text-text group-hover:text-green transition-colors">
                         {project.title}
                       </h3>
                    </div>
                  </div>
                  {project.location && (
                    <div className="flex items-center gap-1 text-xs text-overlay0 mb-2 font-mono">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </div>
                  )}
                  <p className="text-subtext0 text-sm mb-4 line-clamp-3">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.languages.map((lang, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded bg-surface1/50 ${getLanguageColor(lang)}`}>
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-overlay0 mt-4 pt-4 border-t border-surface1">
                    {hasImages && (
                      <span className="text-green flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        View Gallery
                      </span>
                    )}
                    {project.isDevpost && (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow font-bold animate-pulse">💡</span>
                        <span className="text-yellow font-semibold">View Hackathon Portfolio →</span>
                      </div>
                    )}
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="group-hover:translate-x-1 transition-transform text-green flex items-center gap-1"
                      >
                        <span>Source</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>

      {/* Image Gallery Modal */}
      {mounted && selectedProject && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-base rounded-xl shadow-2xl overflow-hidden flex flex-col border border-surface1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface1 bg-surface0/50">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-green/10 rounded-lg text-green">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                     </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">{selectedProject.title}</h3>
                    {selectedProject.location && (
                      <p className="text-xs text-overlay0 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {selectedProject.location}
                      </p>
                    )}
                  </div>
               </div>
               <button
                  onClick={closeModal}
                  className="p-2 hover:bg-surface1 rounded-lg text-subtext0 hover:text-text transition-colors"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            {/* Content */}
            <div 
              ref={modalScrollRef}
              className="overflow-y-auto flex-1 p-0"
            >
               {selectedProject.images.length > 0 && (
                 <div className="relative w-full aspect-video bg-surface0 border-b border-surface1">
                    <Image
                      src={selectedProject.images[currentImageIndex]}
                      alt={selectedProject.title}
                      fill
                      className="object-contain"
                      priority
                    />
                    
                    {/* Navigation */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); prevImage(); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-base/80 hover:bg-base border border-surface1 rounded-full text-text hover:text-green transition-all shadow-lg backdrop-blur-sm"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); nextImage(); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-base/80 hover:bg-base border border-surface1 rounded-full text-text hover:text-green transition-all shadow-lg backdrop-blur-sm"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-base/80 px-4 py-2 rounded-full border border-surface1 backdrop-blur-sm">
                          {selectedProject.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-green w-6' : 'bg-overlay0/50 hover:bg-overlay0'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                 </div>
               )}
               
               <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-subtext0 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-text leading-relaxed">
                      {selectedProject.desc}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-subtext0 uppercase tracking-wider mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.languages.map((lang, i) => (
                        <span key={i} className={`text-sm px-3 py-1 rounded-md bg-surface1 ${getLanguageColor(lang)}`}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedProject.link && (
                    <div className="pt-4 border-t border-surface1">
                      <Link
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green text-base font-bold rounded-lg hover:bg-green/90 transition-colors"
                      >
                        <span>View Source Code</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Devpost Projects Modal */}
      {mounted && showDevpostModal && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8"
          onClick={closeDevpostModal}
        >
          <div
            className="relative w-full max-w-6xl max-h-[90vh] bg-base rounded-xl shadow-2xl overflow-hidden flex flex-col border border-surface1"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface1 bg-surface0/50">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow/10 rounded-lg text-yellow">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                     </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Devpost Portfolio</h3>
                    <p className="text-xs text-subtext0">Hackathon Projects & Wins</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <Link
                    href="https://devpost.com/S-Sigdel?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface1 hover:bg-surface2 rounded-lg text-sm transition-colors"
                 >
                    <span>View on Devpost</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                 </Link>
                 <button
                    onClick={closeDevpostModal}
                    className="p-2 hover:bg-surface1 rounded-lg text-subtext0 hover:text-text transition-colors"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
               </div>
            </div>

            <div 
              ref={modalScrollRef}
              className="overflow-y-auto flex-1 p-6 bg-base/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEVPOST_PROJECTS.map((project, index) => {
                  const currentCardImageIndex = cardImageIndex[`devpost-${index}`] || 0;
                  const hasImages = project.images.length > 0;
                  const displayImage = hasImages ? project.images[currentCardImageIndex] : null;

                  return (
                    <div
                      key={index}
                      className={`group border bg-surface0 rounded-xl overflow-hidden transition-all flex flex-col relative ${
                        project.isWinner 
                          ? 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)]' 
                          : 'border-surface0 hover:border-green/50 hover:shadow-lg'
                      }`}
                    >
                      {project.isWinner && (
                        <div className="absolute -top-2 -right-2 z-20 overflow-hidden w-24 h-24 pointer-events-none">
                          <div className="absolute top-[18px] right-[-28px] rotate-45 bg-[#FFD700] text-black font-bold py-1 w-32 text-center shadow-lg border-y-2 border-base text-xs">
                            WINNER
                          </div>
                        </div>
                      )}
                      {displayImage && (
                        <div className="relative w-full h-48 overflow-hidden bg-surface1">
                          <Image
                            src={displayImage}
                            alt={project.title}
                            fill
                            className={`object-cover transition-opacity duration-500 group-hover:scale-105 ${
                              imageFade[`devpost-${index}`] === false ? 'opacity-0' : 'opacity-100'
                            }`}
                          />
                          {project.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                              {project.images.map((_, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    imgIndex === currentCardImageIndex ? 'bg-green' : 'bg-base/80'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col relative">
                        
                        <div className="mb-3">
                          <div className="text-xs text-overlay0 font-mono mb-1 flex items-center gap-1">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                             </svg>
                             {project.location}
                          </div>
                          <h3 className="text-lg font-bold text-text group-hover:text-green transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        
                        <p className="text-subtext0 text-sm mb-4 flex-1 line-clamp-3">
                          {project.desc}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.languages.map((lang, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded bg-surface1/50 ${getLanguageColor(lang)}`}>
                              {lang}
                            </span>
                          ))}
                        </div>
                        
                        {project.link && (
                          <div className="pt-3 border-t border-surface1 mt-auto">
                            <Link
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green hover:underline flex items-center gap-1"
                            >
                              <span>View Project</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );

}
