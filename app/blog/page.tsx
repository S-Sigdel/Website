import Link from 'next/link';
import { getSortedPostsData } from '../../lib/blog';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'Writing',
  description: 'Notes on Linux, systems software, and things I have built.',
};

export default function BlogIndex() {
  const allPostsData = getSortedPostsData();

  return (
    <>
      <SiteHeader />
      <main className="pt-8">
        <h1 className="mb-10 text-2xl font-semibold tracking-tight">Writing</h1>

        {allPostsData.length === 0 ? (
          <p className="text-muted">Nothing here yet.</p>
        ) : (
          <ul className="space-y-8">
            {allPostsData.map(({ slug, date, title, excerpt }) => (
              <li key={slug}>
                <Link href={`/blog/${slug}`} className="group block">
                  <time className="font-mono text-sm text-muted">
                    {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                  </time>
                  <h2 className="mt-1 text-lg font-medium underline decoration-transparent underline-offset-[3px] group-hover:decoration-current transition-colors">{title}</h2>
                  {excerpt && <p className="mt-1 leading-relaxed text-muted">{excerpt}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
