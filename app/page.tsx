import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import PacFlap from './components/PacFlap';
import { getSortedPostsData } from '../lib/blog';
import { LINKS, PROJECTS, HACKATHONS, DEVPOST } from './data/site';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 text-sm font-medium text-muted">{children}</h2>;
}

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <>
      <SiteHeader />

      <main className="space-y-16 pt-8">
        <section className="space-y-5">
          <Image
            src="/hero.jpg"
            alt="Sakshyam Sigdel"
            width={72}
            height={72}
            sizes="72px"
            priority
            className="h-[72px] w-[72px] rounded-full object-cover object-top"
          />
          <h1 className="text-2xl font-semibold tracking-tight">Sakshyam Sigdel</h1>
          <p className="leading-relaxed">
            Student at the University of Southern Mississippi. I work on Linux, systems software, and
            embedded hardware, and I write about what I find along the way.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} className="link">
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Now</SectionTitle>
          <ul className="space-y-4 leading-relaxed">
            <li>
              Undergraduate researcher in agentic AI at USM with Dr. Rabab Abdelfattah, building the
              layer that lets smoke and fire detection models feed planning agents for autonomous UAV
              flight decisions.
            </li>
            <li>
              Got my first patch into{' '}
              <a href="https://gitlab.com/procps-ng/procps" className="link">procps-ng</a>,
              the package behind <code className="font-mono text-[0.9em]">ps</code>,{' '}
              <code className="font-mono text-[0.9em]">top</code> and{' '}
              <code className="font-mono text-[0.9em]">vmstat</code>.{' '}
              <Link href="/blog/vmstat-one-word-fix" className="link whitespace-nowrap">
                Write-up
              </Link>
            </li>
          </ul>
        </section>

        {posts.length > 0 && (
          <section>
            <SectionTitle>Writing</SectionTitle>
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.slug} className="flex flex-col gap-0.5 sm:flex-row sm:gap-6">
                  <time className="shrink-0 font-mono text-sm text-muted sm:w-28 sm:pt-px">{formatDate(post.date)}</time>
                  <Link href={`/blog/${post.slug}`} className="link">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="projects" className="scroll-mt-8">
          <SectionTitle>Projects</SectionTitle>
          <ul className="space-y-7">
            {PROJECTS.map((project) => (
              <li key={project.title}>
                <a href={project.href} className="group">
                  <h3 className="font-medium underline decoration-transparent underline-offset-[3px] group-hover:decoration-current transition-colors">
                    {project.title}
                  </h3>
                </a>
                <p className="mt-1 leading-relaxed text-muted">{project.desc}</p>
                <p className="mt-1.5 font-mono text-xs text-muted">
                  {project.stack}
                  {project.note && <span className="text-fg"> · {project.note}</span>}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>Hackathons</SectionTitle>
          <ul className="space-y-2">
            {HACKATHONS.map((hack) => (
              <li key={hack.title} className="flex items-baseline justify-between gap-4">
                <a href={hack.href} className="link">
                  {hack.title}
                  {hack.won && <span className="ml-2 text-xs text-muted">· won</span>}
                </a>
                <span className="text-sm text-muted">{hack.where}</span>
              </li>
            ))}
          </ul>
          <a href={DEVPOST} className="mt-4 inline-block text-sm text-muted hover:text-fg transition-colors">
            All on Devpost →
          </a>
        </section>
      </main>

      <SiteFooter />

      <section aria-label="Mini game" className="pb-16">
        <div className="pellets flex min-h-[75svh] items-center justify-center">
          <p className="bg-bg px-3 py-1 text-xs italic text-muted">this space intentionally left blank</p>
        </div>
        <PacFlap />
      </section>
    </>
  );
}
