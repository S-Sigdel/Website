import SectionContainer from './SectionContainer';

export default function Honors() {
  const honors = [
    {
      title: "Hackathon Winner",
      event: "Example Hackathon 2024",
      description: "Won first place in the AI/ML category",
      date: "2024"
    },
    // Add more honors as needed
  ];

  return (
    <SectionContainer id="honors" title="Honors & Awards">
      <div className="space-y-4 font-mono">
        {honors.length > 0 ? (
          honors.map((honor, index) => (
            <div
              key={index}
              className="border border-surface0 bg-surface0/50 p-6 hover:border-green/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-text">
                  {honor.title}
                </h3>
                <span className="text-xs text-overlay0">
                  {honor.date}
                </span>
              </div>
              <p className="text-subtext0 text-sm mb-2">
                {honor.event}
              </p>
              <p className="text-subtext1 text-xs">
                {honor.description}
              </p>
            </div>
          ))
        ) : (
          <div className="border border-surface0 bg-surface0/50 p-6 text-center">
            <p className="text-subtext0 text-sm">
              <span className="text-mauve">[PLACEHOLDER]</span> Add your honors and awards here
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}



