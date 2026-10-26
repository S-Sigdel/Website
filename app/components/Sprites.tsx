// Tiny Pac-Man sprites used as section markers. Colored via `className` (text-*).

export function Ghost({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden className={`h-3.5 w-3.5 ${className}`}>
      <path fill="currentColor" d="M1 13V6.5a6 6 0 0 1 12 0V13l-2-1.6L9 13l-2-1.6L5 13l-2-1.6z" />
      <circle cx="5" cy="6.2" r="1.6" fill="var(--bg)" />
      <circle cx="9.4" cy="6.2" r="1.6" fill="var(--bg)" />
      <circle cx="5.5" cy="6.4" r="0.7" fill="currentColor" />
      <circle cx="9.9" cy="6.4" r="0.7" fill="currentColor" />
    </svg>
  );
}

export function Pac({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden className={`h-3.5 w-3.5 ${className}`}>
      <path fill="currentColor" d="M7 7 12.2 3.6A6 6 0 1 0 12.2 10.4Z" />
    </svg>
  );
}
