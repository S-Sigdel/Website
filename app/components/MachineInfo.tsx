import SectionContainer from './SectionContainer';

export default function MachineInfo() {
  return (
    <SectionContainer id="machine" title="Machine Info">
      <div className="font-mono text-sm bg-mantle p-6 border border-surface0 rounded-lg overflow-x-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="text-blue whitespace-pre hidden md:block select-none font-bold">
            {`                   - \`
                  .o+ \`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/ \`
         ./ooosssso++osssssso+ \`
        .oossssso-\`\`\`\`/ossssss+ \`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:- \`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \`/`}
          </div>
          <div className="space-y-1 text-subtext0">
            <div className="flex gap-2 mb-2">
              <span className="text-blue font-bold">thinking@macbookpro</span>
            </div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">OS</span> <span className="text-text">Arch Linux x86_64</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">Host</span> <span className="text-text">ThinkPad T14 Gen 2i</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">Kernel</span> <span className="text-text">Linux 6.17.8-arch1-1</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">Uptime</span> <span className="text-text">4 hours, 30 mins</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">Shell</span> <span className="text-text">zsh 5.9</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">WM</span> <span className="text-text">Hyprland</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">Terminal</span> <span className="text-text">ghostty</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">CPU</span> <span className="text-text">11th Gen Intel(R) Core(TM) i5-1135G7</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">GPU</span> <span className="text-text">Intel Iris Xe Graphics</span></div>
            <div className="flex gap-4"><span className="text-blue font-bold w-24">Memory</span> <span className="text-text">6.22 GiB / 15.34 GiB (41%)</span></div>

            <div className="flex gap-2 mt-4">
              <div className="w-3 h-3 rounded-full bg-base border border-surface0"></div>
              <div className="w-3 h-3 rounded-full bg-red"></div>
              <div className="w-3 h-3 rounded-full bg-green"></div>
              <div className="w-3 h-3 rounded-full bg-yellow"></div>
              <div className="w-3 h-3 rounded-full bg-blue"></div>
              <div className="w-3 h-3 rounded-full bg-mauve"></div>
              <div className="w-3 h-3 rounded-full bg-teal"></div>
              <div className="w-3 h-3 rounded-full bg-text"></div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
