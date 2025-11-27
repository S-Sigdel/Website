'use client';

import { useState } from 'react';
import NavBar from './components/NavBar';
import VimTip from './components/VimTip';
import Status from './components/Status';
import Intro from './components/Intro';
import ProjectsCarousel from './components/ProjectsCarousel';
import Workflow from './components/Workflow';
import MachineInfo from './components/MachineInfo';
import InteractiveShell from './components/InteractiveShell';
import LoadingScreen from './components/LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to ensure DOM is ready for transition
    setTimeout(() => setShowContent(true), 50);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      <div 
        className={`min-h-screen bg-base text-text pb-16 relative selection:bg-green/30 transition-all duration-1000 ease-out transform ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <NavBar />
        <VimTip />
        
        <main className="flex flex-col gap-12">
          <Intro />
          <ProjectsCarousel />
          <InteractiveShell />
          <Workflow />
          <MachineInfo />
        </main>

        <Status />
      </div>
    </>
  );
}
