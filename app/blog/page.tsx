import Link from 'next/link';
import { getSortedPostsData } from '../../lib/blog';
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'Blog | S-Sigdel',
  description: 'Thoughts, tutorials, and updates.',
};

export default function BlogIndex() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-base text-text font-mono selection:bg-surface2 selection:text-text">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="mb-12 border-b border-surface0 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue mb-4">~/blog</h1>
          <p className="text-subtext0">
            My personal thoughts, insights and updates.
          </p>
        </div>

        <div className="space-y-6">
          {allPostsData.length === 0 ? (
            <div className="p-6 border border-surface0 rounded-lg bg-mantle text-center text-subtext0">
              No posts found. Check back later!
            </div>
          ) : (
            allPostsData.map(({ slug, date, title, excerpt, tags }) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="block group"
              >
                <article className="p-6 border border-surface0 rounded-lg bg-mantle hover:border-blue transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h2 className="text-xl font-bold text-text group-hover:text-blue transition-colors">
                      {title}
                    </h2>
                    <time className="text-sm text-subtext0 whitespace-nowrap">
                      {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  <p className="text-subtext0 mb-4 line-clamp-2">
                    {excerpt}
                  </p>

                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded bg-surface0 text-blue">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
