import SectionContainer from './SectionContainer';
import Terminal from './Terminal';

export default function InteractiveShell() {
  return (
    <SectionContainer id="shell" title="Interactive Shell">
      <div className="w-full h-96 bg-base border border-surface0 rounded-lg flex flex-col font-mono text-sm shadow-2xl overflow-hidden relative">
        <div className="bg-mantle px-4 py-2 border-b border-surface0 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red"></div>
            <div className="w-3 h-3 rounded-full bg-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-green"></div>
          </div>
          <div className="ml-4 text-overlay1 text-xs flex-1 text-center">
            sigdel@portfolio: ~/terminal
          </div>
        </div>
        
        <div className="flex-1 relative bg-base overflow-hidden">
            <Terminal />
        </div>
      </div>
      <div className="text-center mt-2 text-xs text-overlay0">
        * Run &apos;whyMe&apos; to start the LLM chat interface
      </div>
    </SectionContainer>
  );
}
