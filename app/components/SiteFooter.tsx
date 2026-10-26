import { LINKS } from '../data/site';

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line py-8 text-sm text-muted">
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-fg transition-colors">
            {link.label}
          </a>
        ))}
        <a href="https://github.com/S-Sigdel/dotfiles" className="hover:text-fg transition-colors">
          Dotfiles
        </a>
      </div>
      <p className="mt-4">© {new Date().getFullYear()} Sakshyam Sigdel</p>
    </footer>
  );
}
