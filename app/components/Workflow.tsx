import SectionContainer from './SectionContainer';
import Image from 'next/image';

export default function Workflow() {
  const tools = [
    { name: "OS", value: "Arch Linux", color: "text-blue" },
    { name: "Shell", value: "Zsh + Oh My Zsh", color: "text-yellow" },
    { name: "Editor", value: "Neovim (Lua config)", color: "text-green" },
    { name: "Multiplexer", value: "Tmux", color: "text-green" },
    { name: "Font", value: "JetBrains Mono Nerd Font", color: "text-mauve" },
    { name: "WM", value: "Hyprland", color: "text-sky" },
  ];

  return (
    <SectionContainer id="workflow" title="Workflow">
      <div className="font-mono grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface0/50 p-6 border border-surface0">
          <h3 className="text-subtext0 mb-4 border-b border-surface1 pb-2">
             ~/.config/
          </h3>
          <ul className="space-y-2 text-sm">
             {tools.map((tool) => (
               <li key={tool.name} className="flex justify-between">
                 <span className="text-overlay1">{tool.name}:</span>
                 <span className={tool.color}>{tool.value}</span>
               </li>
             ))}
          </ul>
        </div>

        <div className="relative group overflow-hidden rounded-lg border border-surface0 bg-surface0/50">
          <div className="relative w-full h-full min-h-[300px]">
            <Image
              src="/workspace.jpg"
              alt="Coding workspace - coding on the floor"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="font-mono text-xs text-text bg-surface0/90 px-3 py-2 rounded border border-surface1 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green">$</span>
                  <span className="text-subtext0">cat workspace.txt</span>
                </div>
                <p className="text-subtext1 text-[10px] leading-relaxed">
                  This is how I actually code. No fancy desk needed—just a laptop, 
                  the floor, and pure focus. Sometimes the best code comes from the most 
                  unconventional setups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
