import NavBar from './components/NavBar';
import VimTip from './components/VimTip';
import Status from './components/Status';
import Intro from './components/Intro';
import ProjectsCarousel from './components/ProjectsCarousel';
import Honors from './components/Honors';
import Workflow from './components/Workflow';
import MachineInfo from './components/MachineInfo';
import InteractiveShell from './components/InteractiveShell';

export default function Home() {
  return (
    <div className="min-h-screen bg-base text-text pb-16 relative selection:bg-green/30">
      <NavBar />
      <VimTip />
      
      <main className="flex flex-col gap-12">
        <Intro />
        <ProjectsCarousel />
        <Honors />
        <InteractiveShell />
        <Workflow />
        <MachineInfo />
      </main>

      <Status />
    </div>
  );
}
