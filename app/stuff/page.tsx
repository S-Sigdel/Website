import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { READING, WATCHING } from '../data/site';

export const metadata = {
  title: 'Stuff',
  description: 'Things I read, watch, and like outside of work.',
};

export default function Stuff() {
  return (
    <>
      <SiteHeader />
      <main className="space-y-14 pt-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stuff</h1>
          <p className="mt-3 leading-relaxed text-muted">The non-work side: things I&apos;ve read and watched.</p>
        </div>

        {READING.length > 0 && (
          <section>
            <h2 className="mb-5 text-sm font-medium text-muted">Reading</h2>
            <ul className="space-y-4">
              {READING.map((item) => (
                <li key={item.title}>
                  <p className="text-[11px] uppercase tracking-wide text-muted">{item.kind}</p>
                  {item.href ? (
                    <a href={item.href} className="link font-medium">{item.title}</a>
                  ) : (
                    <p className="font-medium">{item.title}</p>
                  )}
                  <p className="text-sm italic text-muted">by {item.author}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {WATCHING.length > 0 && (
          <section>
            <h2 className="mb-5 text-sm font-medium text-muted">Watching</h2>
            <ul className="space-y-3">
              {WATCHING.map((item) => (
                <li key={item.title}>
                  <p className="text-[11px] uppercase tracking-wide text-muted">{item.kind}</p>
                  <p className="font-medium">{item.title}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
