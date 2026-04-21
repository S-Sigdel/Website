import SectionContainer from './SectionContainer';

const research = [
  {
    role: "Undergraduate Researcher — Agentic AI Systems",
    period: "Jan. 2026 – Present",
    institution: "University of Southern Mississippi",
    pi: "PI: Dr. Rabab Abdelfattah",
    location: "Hattiesburg, MS",
    bullets: [
      "Developing a Python-based agent orchestration layer to coordinate vision models (smoke/fire detection) with planning agents for autonomous UAV flight decisions.",
      "Designed a replayable logging pipeline for agent decision traces to enable reproducible evaluation and debugging of multi-agent workflows.",
    ],
    tags: ["Python", "Agentic AI", "UAV", "Computer Vision"],
  },
];

export default function Research() {
  return (
    <SectionContainer id="research" title="Research">
      <div className="space-y-4 font-mono">
        {research.map((entry, i) => (
          <div
            key={i}
            className="border border-surface0 bg-surface0/50 p-6 rounded-xl hover:border-green/40 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
              <h3 className="text-base font-bold text-text">{entry.role}</h3>
              <span className="text-xs text-overlay0 shrink-0">{entry.period}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-subtext0 mb-4">
              <span className="text-green">{entry.institution}</span>
              <span className="text-overlay1">·</span>
              <span>{entry.pi}</span>
              <span className="text-overlay1">·</span>
              <span>{entry.location}</span>
            </div>

            <ul className="space-y-2 mb-4">
              {entry.bullets.map((b, j) => (
                <li key={j} className="flex gap-2 text-sm text-subtext1">
                  <span className="text-green mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1">
              {entry.tags.map((tag, j) => (
                <span key={j} className="text-xs px-2 py-0.5 rounded bg-surface1/60 text-mauve">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
