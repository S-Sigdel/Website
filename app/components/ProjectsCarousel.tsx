'use client';

import SectionContainer from './SectionContainer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

interface Project {
  title: string;
  desc: string;
  languages: string[];
  color: string;
  link: string;
  images: string[];
  location?: string;
  isDevpost?: boolean;
}

interface DevpostProject {
  title: string;
  desc: string;
  languages: string[];
  link?: string;
  location: string;
  images: string[];
  isWinner?: boolean;
}

const PROJECTS: Project[] = [
    {
      title: "SenseNav",
      desc: "Spatial audio navigation system combining LiDAR obstacle detection with 360° spatial audio feedback. Built with Arduino and custom circuitry for real-time processing. Features binaural panning, distance-based audio cues, and obstacle prioritization for enhanced accessibility.",
      languages: ["Arduino", "C++", "Circuitry"],
      color: "text-blue",
      link: "https://github.com/S-Sigdel/SenseNav",
      images: ["/senseNav.jpeg", "/sensenavmidas.jpeg"],
      location: "MIT, Cambridge"
    },
    {
      title: "Hand Tracking for Bionic Arm",
      desc: "Computer vision system for controlling a bionic arm using hand tracking. Python-based OpenCV processing with Arduino servo control for real-time gesture recognition and prosthetic manipulation.",
      languages: ["Python", "Arduino", "OpenCV"],
      color: "text-pink",
      link: "https://github.com/S-Sigdel/handTrackingForBionicArm",
      images: ["/handTracking.png", "/realtimeHandTracking.png", "/3dprintedmodel.png"]
    },
    {
      title: "Devpost Portfolio",
      desc: "Collection of hackathon projects showcasing full-stack development, AI/ML integration, and innovative solutions across multiple domains.",
      languages: ["Python", "JavaScript", "TypeScript", "Blockchain"],
      color: "text-peach",
      link: "https://devpost.com/S-Sigdel?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav",
      images: [],
      isDevpost: true
    }
];

const DEVPOST_PROJECTS: DevpostProject[] = [
    {
      title: "Richie Rich",
      desc: "AI-powered financial assistant that helps you spend smarter and grow wealth effortlessly. Combines transaction data, receipts, and AI insights to find better deals, save more, and invest the difference in stocks.",
      languages: ["Capital One API", "Next.js", "TypeScript", "Gemini", "GPT", "Python"],
      link: "https://devpost.com/software/richie-rich",
      location: "Princeton University, Princeton",
      images: ["/richierichdashboard.jpg", "/richierichsavingopportunities.jpg"]
    },
    {
      title: "NightSeeker",
      desc: "Identity verification system that proves your skills, not your identity. Secure authentication platform for developers and professionals.",
      languages: ["Midnight Blockchain", "Next.js", "OpenAI"],
      link: "https://devpost.com/software/nightseeker",
      location: "Online",
      images: ["/nightseekerEndorsement.jpg", "/midnightHackathon.png"]
    },
    {
      title: "Acroswe",
      desc: "AI neural networks predict home prices; buy via blockchain NFT/crypto. Secure, instant ownership with smart contracts. Real estate investment made accessible through technology.",
      languages: ["Heuristic ML", "Ethereum", "Web3", "React"],
      location: "Princeton University, Princeton",
      images: ["/acroswefrontend.jpg", "/heuristicfunctionacroswe.png"],
      isWinner: true
    },
    {
      title: "Ripple",
      desc: "Learning gamified. Interactive educational platform that makes learning engaging through game mechanics and real-time feedback.",
      languages: ["Cloud Run", "Firebase", "Go", "Next.js", "React", "Tesseract"],
      link: "https://devpost.com/software/ripple",
      location: "University of Miami, Miami",
      images: ["/ripplegamedemo.png", "/RippleWorkflow.jpg"]
    },
    {
      title: "noBrainstorm",
      desc: "The only whiteboard you need. Collaborative whiteboard platform for teams to brainstorm, plan, and create together in real-time.",
      languages: ["Next.js", "OpenAI", "tldraw", "TypeScript"],
      location: "Davidson College, Davidson",
      images: ["/approachComparisionNobrainstorm.png", "/nobrainstormgraph.png"],
      isWinner: true
    }
];

export default function ProjectsCarousel() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDevpostModal, setShowDevpostModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardImageIndex, setCardImageIndex] = useState<{ [key: string | number]: number }>({});
  const [imageFade, setImageFade] = useState<{ [key: string]: boolean }>({});

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
    if (showDevpostModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showDevpostModal]);

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

  // Fixed useEffect with stable dependencies
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, closeModal, prevImage, nextImage]);

  // Handle Escape key for Devpost modal
  useEffect(() => {
    if (!showDevpostModal) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDevpostModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDevpostModal, closeDevpostModal]);

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
                className={`group border bg-surface0/50 overflow-hidden cursor-pointer transition-all ${
                  project.isDevpost
                    ? 'md:col-span-2 border-yellow/70 border-2 hover:border-yellow hover:shadow-lg hover:shadow-yellow/30 relative'
                    : 'border-surface0 hover:border-green/50'
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
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {project.images.map((_, imgIndex) => (
                          <div
                            key={imgIndex}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              imgIndex === currentCardImageIndex ? 'bg-green' : 'bg-overlay0/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-text group-hover:text-green transition-colors">
                      ./{project.title}
                    </h3>
                  </div>
                  {project.location && (
                    <div className="text-xs text-overlay0 mb-2 font-mono">
                      📍 {project.location}
                    </div>
                  )}
                  <p className="text-subtext0 text-sm mb-4">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.languages.map((lang, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded bg-surface1/50 ${getLanguageColor(lang)}`}>
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-overlay0">
                    {hasImages && (
                      <span className="text-green">Click to view gallery</span>
                    )}
                    {project.isDevpost && (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow font-bold animate-pulse">💡</span>
                        <span className="text-yellow font-semibold">Click for more hackathon projects & info →</span>
                      </div>
                    )}
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="group-hover:translate-x-1 transition-transform text-green"
                    >
                      view_source &gt;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>

      {/* Image Gallery Modal */}
      {selectedProject && selectedProject.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-surface0/90 hover:bg-surface0 border border-surface1 rounded text-text hover:text-green transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative w-full h-[70vh] bg-surface0 rounded-lg overflow-hidden border border-surface1">
              <Image
                src={selectedProject.images[currentImageIndex]}
                alt={selectedProject.title}
                fill
                className="object-contain"
                priority
              />

              {/* Navigation Arrows */}
              {selectedProject.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-surface0/90 hover:bg-surface0 border border-surface1 rounded text-text hover:text-green transition-colors"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-surface0/90 hover:bg-surface0 border border-surface1 rounded text-text hover:text-green transition-colors"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {selectedProject.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-surface0/90 px-4 py-2 rounded-full border border-surface1">
                  {selectedProject.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-green w-6' : 'bg-overlay0/50 hover:bg-overlay0'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {selectedProject.images.length > 1 && (
                <div className="absolute top-4 left-4 bg-surface0/90 px-3 py-1 rounded border border-surface1 text-xs text-subtext0 font-mono">
                  {currentImageIndex + 1} / {selectedProject.images.length}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="mt-4 p-4 bg-surface0/50 rounded-lg border border-surface1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-text">
                  ./{selectedProject.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.languages.slice(0, 3).map((lang, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded bg-surface1 ${getLanguageColor(lang)}`}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-subtext0 text-sm mb-3">
                {selectedProject.desc}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedProject.languages.map((lang, i) => (
                  <span key={i} className={`text-xs px-2 py-1 rounded bg-surface1/50 ${getLanguageColor(lang)}`}>
                    {lang}
                  </span>
                ))}
              </div>
              <Link
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green hover:underline"
              >
                view_source &gt;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Devpost Projects Modal */}
      {showDevpostModal && (
        <div
          className="fixed inset-0 z-50 bg-base/95 backdrop-blur-sm overflow-y-auto overscroll-contain"
          onClick={closeDevpostModal}
          onTouchMove={(e) => {
            // Prevent background scroll on mobile
            const target = e.target as HTMLElement;
            const modalContent = target.closest('[data-modal-content]');
            if (!modalContent) {
              e.preventDefault();
            }
          }}
        >
          {/* Fixed Close Button */}
          <button
            onClick={closeDevpostModal}
            className="fixed top-4 right-4 z-50 p-2 bg-surface0/90 hover:bg-surface0 border border-surface1 rounded text-text hover:text-green transition-colors shadow-lg"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            data-modal-content
            className="relative max-w-6xl w-full mx-auto px-4 py-8 min-h-screen"
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => {
              // Allow scrolling within modal content
              e.stopPropagation();
            }}
          >

            {/* Header */}
            <div className="mb-6 p-6 bg-surface0/50 rounded-lg border border-surface1">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-text">
                  ./Devpost Portfolio
                </h2>
                <Link
                  href="https://devpost.com/S-Sigdel?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green hover:underline"
                >
                  view_source &gt;
                </Link>
              </div>
              <p className="text-subtext0 text-sm">
                Collection of hackathon projects showcasing full-stack development, AI/ML integration, and innovative solutions.
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
              {DEVPOST_PROJECTS.map((project, index) => {
                const currentCardImageIndex = cardImageIndex[`devpost-${index}`] || 0;
                const hasImages = project.images.length > 0;
                const displayImage = hasImages ? project.images[currentCardImageIndex] : null;

                return (
                  <div
                    key={index}
                    className="border border-surface0 bg-surface0/50 hover:border-green/50 transition-colors overflow-hidden"
                  >
                    {displayImage && (
                      <div className="relative w-full h-48 overflow-hidden bg-surface1">
                        <Image
                          src={displayImage}
                          alt={project.title}
                          fill
                          className={`object-cover transition-opacity duration-500 ${
                            imageFade[`devpost-${index}`] === false ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                        {project.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            {project.images.map((_, imgIndex) => (
                              <div
                                key={imgIndex}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  imgIndex === currentCardImageIndex ? 'bg-green' : 'bg-overlay0/50'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6 relative">
                      {project.isWinner && (
                        <div className="absolute -top-2 right-4 z-10">
                          <div className="relative bg-yellow text-base px-4 py-1 text-xs font-bold shadow-lg" style={{
                            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)'
                          }}>
                            🏆 Winner
                            <div className="absolute right-0 top-0 w-0 h-0 border-l-[10px] border-l-yellow border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent" style={{
                              transform: 'translateX(100%)'
                            }}></div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs text-overlay0 font-mono flex-1 text-right">
                          {project.location}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-text mb-2">
                        ./{project.title}
                      </h3>
                      <p className="text-subtext0 text-sm mb-4">
                        {project.desc}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.languages.map((lang, i) => (
                          <span key={i} className={`text-xs px-2 py-1 rounded bg-surface1/50 ${getLanguageColor(lang)}`}>
                            {lang}
                          </span>
                        ))}
                      </div>
                      {project.link && (
                        <Link
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green hover:underline"
                        >
                          view_source &gt;
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
