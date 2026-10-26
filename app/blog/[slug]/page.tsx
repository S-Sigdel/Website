import { getPostData, getSortedPostsData } from '../../../lib/blog';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import Link from 'next/link';
import Image from 'next/image';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = getPostData(slug);
  return {
    title: postData.title,
    description: postData.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = getPostData(slug);

  return (
    <>
      <SiteHeader />
      <main className="pt-8">
        <article>
          <header className="mb-10">
            <time className="font-mono text-sm text-muted">
              {new Date(postData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </time>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">
              {postData.title}
            </h1>
          </header>

          <div className="post prose max-w-none leading-relaxed">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                img: ({ src, alt }) => (
                  <span className="block my-8 relative w-full h-auto">
                    <Image
                      src={(src as string) || ''}
                      alt={alt || ''}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="rounded-lg border border-line w-full h-auto"
                    />
                  </span>
                )
              }}
            >
              {postData.content}
            </ReactMarkdown>
          </div>
        </article>

        <Link href="/blog" className="mt-12 inline-block text-sm text-muted hover:text-fg transition-colors">
          ← All writing
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
