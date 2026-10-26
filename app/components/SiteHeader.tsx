import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-6 text-sm">
      <Link href="/" className="font-medium text-fg hover:text-accent transition-colors">
        Sakshyam Sigdel
      </Link>
      <nav className="flex gap-5 text-muted">
        <Link href="/blog" className="hover:text-fg transition-colors">Writing</Link>
        <Link href="/#projects" className="hover:text-fg transition-colors">Projects</Link>
        <a href="/Resume.pdf" className="hover:text-fg transition-colors">Résumé</a>
      </nav>
    </header>
  );
}
