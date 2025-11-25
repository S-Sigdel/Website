interface SectionContainerProps {
  children: React.ReactNode;
  id?: string;
  title?: string;
}

export default function SectionContainer({ children, id, title }: SectionContainerProps) {
  return (
    <section id={id} className="py-8 sm:py-12 lg:py-16 border-b border-surface0 last:border-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {title && (
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-green">
              <span className="text-overlay0">##</span> {title}
            </h2>
            <div className="h-px flex-1 bg-surface0" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
