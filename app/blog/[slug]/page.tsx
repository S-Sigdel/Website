import { getPostData, getSortedPostsData } from '../../../lib/blog';
import NavBar from '../../components/NavBar';
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
    title: `${postData.title} | S-Sigdel`,
    description: postData.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = getPostData(slug);

  return (
    <div className="min-h-screen bg-base text-text font-mono selection:bg-surface2 selection:text-text">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Link href="/blog" className="inline-flex items-center text-subtext0 hover:text-blue mb-8 transition-colors">
          ← cd ..
        </Link>
        
        <article>
          <header className="mb-8 border-b border-surface0 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue mb-4">
              {postData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-subtext0">
              <time>
                {new Date(postData.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {postData.tags && postData.tags.map(tag => (
                <span key={tag} className="text-blue">#{tag}</span>
              ))}
            </div>
          </header>

          <div className="prose prose-invert prose-blue max-w-none prose-pre:bg-mantle prose-pre:border prose-pre:border-surface0">
            <ReactMarkdown 
              rehypePlugins={[rehypeHighlight]}
              components={{
                img: ({node, ...props}) => (
                  <span className="block my-8 relative w-full h-auto">
                    <Image
                      src={(props.src as string) || ''}
                      alt={props.alt || ''}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="rounded-lg border border-surface0 w-full h-auto"
                    />
                  </span>
                )
              }}
            >
              {postData.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
