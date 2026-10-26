import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import PacFlap from './components/PacFlap';
import { Ghost, Pac } from './components/Sprites';
import { getSortedPostsData } from '../lib/blog';
import { LINKS, EXPERIENCE, PROJECTS, HACKATHONS, DEVPOST, type Project } from './data/site';

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

function Snippet({ lines }: { lines: string[] }) {
  return (
    <pre className="flex h-full items-center overflow-x-auto bg-[#161616] px-4 py-5 font-mono text-[12px] leading-relaxed text-[#d4d4d4]">
      <code>
        {lines.map((line) => (
          <span
            key={line}
            className={`block ${line.startsWith('-') ? 'text-[#ff7b7b]' : line.startsWith('+') ? 'text-[#7ee2a8]' : ''}`}
          >
            {line}
          </span>
        ))}
      </code>
    </pre>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-xl border border-line transition hover:border-muted">
      <a href={project.href} className="relative block aspect-[16/9] overflow-hidden border-b border-line bg-[#161616]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 336px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          project.snippet && <Snippet lines={project.snippet} />
        )}
      </a>
      <div className="flex flex-1 flex-col p-4">
        <a href={project.href}>
          <h3 className="font-medium underline decoration-transparent underline-offset-[3px] transition-colors group-hover:decoration-current">{project.title}</h3>
        </a>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{project.desc}</p>
        <p className="mt-3 font-mono text-xs text-muted">
          {project.stack}
          {project.note && <span className="text-fg"> · {project.note}</span>}
          {project.writeup && (
            <>
              {' · '}
              <Link href={project.writeup} className="link">write-up</Link>
            </>
          )}
        </p>
      </div>
    </li>
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
            className="h-40 w-40 shrink-0 rounded-2xl object-cover sm:h-44 sm:w-44"
          />
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              Sakshyam Sigdel
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
          <SectionTitle icon={<Ghost />}>Experience</SectionTitle>
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
                      <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
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
            <SectionTitle icon={<Ghost />}>Writing</SectionTitle>
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
          <SectionTitle icon={<Ghost />}>Projects</SectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle icon={<Pac />}>Hackathons</SectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2">
            {HACKATHONS.filter((hack) => hack.prize).map((hack) => (
              <li key={hack.title} className="group overflow-hidden rounded-xl border border-line transition hover:border-muted">
                <a href={hack.href} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-[#161616]">
                    {hack.image && (
                      <Image
                        src={hack.image}
                        alt={hack.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 336px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                    <span className="absolute left-3 top-3 rounded-md bg-pac px-2 py-0.5 text-xs font-semibold text-black shadow-sm">
                      Winner · {hack.prize}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{hack.title}</h3>
                    <p className="mt-0.5 font-mono text-xs text-muted">{hack.event}</p>
                    {hack.desc && <p className="mt-2 text-sm leading-relaxed text-muted">{hack.desc}</p>}
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <h3 className="mb-3 mt-8 text-sm text-muted">Also built</h3>
          <ul className="space-y-2">
            {HACKATHONS.filter((hack) => !hack.prize).map((hack) => (
              <li key={hack.title} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <a href={hack.href} className="link">{hack.title}</a>
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
