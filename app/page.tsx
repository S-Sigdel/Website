import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import PacFlap from './components/PacFlap';
import { Ghost, Pac } from './components/Sprites';
import { getSortedPostsData } from '../lib/blog';
import { LINKS, EXPERIENCE, PROJECTS, HACKATHONS, DEVPOST } from './data/site';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-2 text-sm font-medium text-muted">
      {icon}
      {children}
    </h2>
  );
}

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <>
      <SiteHeader />

      <main className="space-y-16 pt-6">
        <section className="flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-8">
          <Image
            src="/avatar.jpg"
            alt="Sakshyam Sigdel wearing a sensor-wired hoodie at a hackathon"
            width={176}
            height={176}
            sizes="176px"
            priority
            className="h-40 w-40 shrink-0 -rotate-2 rounded-2xl object-cover shadow-[6px_6px_0_var(--pac)] transition-transform duration-300 hover:rotate-0 sm:h-44 sm:w-44"
          />
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              <span className="marker">Sakshyam Sigdel</span>
            </h1>
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
          </div>
        </section>

        <section>
          <SectionTitle icon={<Ghost className="text-pinky" />}>Now</SectionTitle>
          <p className="leading-relaxed">
            Got my first patch into{' '}
            <a href="https://gitlab.com/procps-ng/procps" className="link">procps-ng</a>,
            the package behind <code className="font-mono text-[0.9em]">ps</code>,{' '}
            <code className="font-mono text-[0.9em]">top</code> and{' '}
            <code className="font-mono text-[0.9em]">vmstat</code>. One word, almost four years old.{' '}
            <Link href="/blog/vmstat-one-word-fix" className="link whitespace-nowrap">
              Read the write-up
            </Link>
          </p>
        </section>

        <section>
          <SectionTitle icon={<Ghost className="text-blinky" />}>Experience</SectionTitle>
          <ul className="space-y-10">
            {EXPERIENCE.map((job) => (
              <li key={job.role}>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="font-medium">{job.role}</h3>
                  <span className="shrink-0 font-mono text-xs text-muted">{job.period}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted">
                  {job.org} · {job.where}
                  {job.note && <> · {job.note}</>}
                </p>
                <ul className="mt-3 space-y-2">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 leading-relaxed">
                      <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-blinky" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {posts.length > 0 && (
          <section>
            <SectionTitle icon={<Ghost className="text-inky" />}>Writing</SectionTitle>
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
          <SectionTitle icon={<Ghost className="text-clyde" />}>Projects</SectionTitle>
          <ul className="space-y-7">
            {PROJECTS.map((project) => (
              <li key={project.title}>
                <a href={project.href} className="group">
                  <h3 className="font-medium underline decoration-transparent underline-offset-[3px] transition-colors group-hover:text-clyde group-hover:decoration-current">
                    {project.title}
                  </h3>
                </a>
                <p className="mt-1 leading-relaxed text-muted">{project.desc}</p>
                <p className="mt-1.5 font-mono text-xs text-muted">
                  {project.stack}
                  {project.note && <span className="text-clyde"> · {project.note}</span>}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle icon={<Pac className="text-pac" />}>Hackathons</SectionTitle>
          <ul className="space-y-3">
            {HACKATHONS.map((hack) => (
              <li key={hack.title} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <a href={hack.href} className="link">{hack.title}</a>
                  {hack.prize && (
                    <span className="rounded bg-pac px-1.5 py-px text-[11px] font-medium text-black">
                      {hack.prize}
                    </span>
                  )}
                </span>
                <span className="text-sm text-muted sm:text-right">{hack.event}</span>
              </li>
            ))}
          </ul>
          <a href={DEVPOST} className="mt-5 inline-block text-sm text-muted hover:text-fg transition-colors">
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
