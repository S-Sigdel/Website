interface SectionContainerProps {
  children: React.ReactNode;
  id?: string;
  title?: string;
}

export default function SectionContainer({ children, id, title }: SectionContainerProps) {
  return (
    <section id={id} className="py-8 sm:py-12 lg:py-16 border-b border-surface0 last:border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {title && (
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2 bg-surface1 rounded-lg">
              <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-text">
              {title}
            </h2>
            <div className="h-px flex-1 bg-surface0" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
