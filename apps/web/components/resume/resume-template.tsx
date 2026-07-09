import type {
  EducationEntry,
  LanguageEntry,
  ResumeData,
  ResumeExperienceEntry,
  ResumeProjectEntry,
  SkillGroupEntry,
} from '@portfolio/shared';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import type { ComponentType, CSSProperties, ReactNode } from 'react';
import './resume-theme.css';

type IconType = ComponentType<{ size?: number; style?: CSSProperties }>;

// Brand marks (lucide v1 dropped brand icons) — inline SVG so they render in the PDF too.
export function GithubIcon({ size = 13, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style} aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
export function LinkedinIcon({ size = 13, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

const ensureUrl = (v: string) => (/^https?:\/\//i.test(v) ? v : `https://${v}`);

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      className="mt-5 mb-2 border-b pb-1 font-semibold tracking-wide uppercase"
      style={{
        color: 'var(--resume-accent)',
        borderColor: 'color-mix(in srgb, var(--resume-accent) 40%, transparent)',
        fontSize: '13pt',
      }}
    >
      {children}
    </h2>
  );
}

function Contact({ icon: Icon, text, href }: { icon: IconType; text: string; href?: string }) {
  const inner = (
    <>
      <Icon size={13} style={{ color: 'var(--resume-accent)' }} /> {text}
    </>
  );
  const className = 'flex items-center gap-2';
  const style = { color: 'var(--resume-ink)' };
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={className} style={style}>
      {inner}
    </a>
  ) : (
    <span className={className} style={style}>
      {inner}
    </span>
  );
}

function Header({ data }: { data: ResumeData }) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="flex-1">
        <h1 style={{ color: 'var(--resume-accent)', fontSize: '26pt', lineHeight: 1.1 }}>
          {data.fullName}
        </h1>
        {data.title && (
          <div
            style={{ fontStyle: 'italic', color: 'var(--resume-muted)', fontSize: '15pt', marginTop: '2pt' }}
          >
            {data.title}
          </div>
        )}
        {/* Single column: each item on its own line; optional links (website/github/linkedin)
            only appear when present, shown as a short clickable label instead of the raw URL. */}
        <div className="mt-3 flex flex-col gap-y-1" style={{ fontSize: '10pt' }}>
          {data.email && <Contact icon={Mail} text={data.email} href={`mailto:${data.email}`} />}
          {data.phone && (
            <Contact icon={Phone} text={data.phone} href={`tel:${data.phone.replace(/[^\d+]/g, '')}`} />
          )}
          {data.location && <Contact icon={MapPin} text={data.location} />}
          {data.linkedin && (
            <Contact icon={LinkedinIcon} text="LinkedIn" href={ensureUrl(data.linkedin)} />
          )}
          {data.website && (
            <Contact icon={Globe} text="Portfolio" href={ensureUrl(data.website)} />
          )}
          {data.github && <Contact icon={GithubIcon} text="GitHub" href={ensureUrl(data.github)} />}
        </div>
      </div>
      {data.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt=""
          className="rounded-full object-cover"
          style={{ width: '32mm', height: '32mm' }}
        />
      )}
    </header>
  );
}

// Title + meta line for an experience. A separate block from its bullets so the paginator
// can keep it with (only) its first bullet and let the rest flow to the next page.
function ExperienceHead({ e, first }: { e: ResumeExperienceEntry; first: boolean }) {
  const meta = [
    [e.company, e.companyNote].filter(Boolean).join(' '),
    [e.startDate, e.endDate ? e.endDate : 'Present'].filter(Boolean).join(' – '),
    e.location,
  ]
    .filter(Boolean)
    .join('  |  ');
  return (
    <div style={{ fontSize: '10.5pt', marginTop: first ? 0 : '12px' }}>
      <div style={{ fontWeight: 700 }}>{e.title}</div>
      {meta && <div style={{ fontStyle: 'italic', color: 'var(--resume-muted)' }}>{meta}</div>}
    </div>
  );
}

// One bullet as its own block — a long list breaks across pages instead of the whole
// entry jumping to the next page and leaving a gap.
function Bullet({ text, first }: { text: string; first: boolean }) {
  return (
    <ul className="list-disc pl-4" style={{ fontSize: '10.5pt', marginTop: first ? '4px' : '2px' }}>
      <li>{text}</li>
    </ul>
  );
}

// Single-column (ATS structure): one "Heading: item, item, …" line per group.
function SkillsLines({ skills }: { skills: SkillGroupEntry[] }) {
  return (
    <div style={{ fontSize: '10.5pt', lineHeight: 1.5 }}>
      {skills.map((g, i) => (
        <div key={i}>
          <span style={{ fontWeight: 700 }}>{g.heading}: </span>
          {g.items.join(', ')}
        </div>
      ))}
    </div>
  );
}

// Title + technologies + links + description for a project (bullets are separate blocks).
function ProjectHead({ p, first }: { p: ResumeProjectEntry; first: boolean }) {
  return (
    <div style={{ fontSize: '10.5pt', marginTop: first ? 0 : '12px' }}>
      <div style={{ fontWeight: 700 }}>{p.title}</div>
      {p.technologies && <div style={{ fontStyle: 'italic' }}>Technologies : {p.technologies}</div>}
      {(p.githubUrl || p.demoUrl) && (
        <div style={{ fontSize: '9.5pt' }}>
          {p.githubUrl && (
            <a href={ensureUrl(p.githubUrl)} style={{ color: 'var(--resume-accent)' }}>
              GitHub
            </a>
          )}
          {p.githubUrl && p.demoUrl && <span style={{ color: 'var(--resume-muted)' }}> · </span>}
          {p.demoUrl && (
            <a href={ensureUrl(p.demoUrl)} style={{ color: 'var(--resume-accent)' }}>
              Live Demo
            </a>
          )}
        </div>
      )}
      {p.description && <p>{p.description}</p>}
    </div>
  );
}

// Single-column (ATS structure): "Degree — Institution  |  dates", then detail.
function EducationItem({ e }: { e: EducationEntry }) {
  const head = [e.degree, e.institution].filter(Boolean).join(' — ');
  const dates = [e.startDate, e.endDate].filter(Boolean).join(' – ');
  return (
    <div className="mb-3" style={{ fontSize: '10.5pt' }}>
      <div>
        <span style={{ fontWeight: 700 }}>{head}</span>
        {dates ? `  |  ${dates}` : ''}
      </div>
      {e.detail && <div style={{ color: 'var(--resume-muted)' }}>{e.detail}</div>}
    </div>
  );
}

// Single-column (ATS structure): one line, pipe-separated.
function LanguagesLine({ languages }: { languages: LanguageEntry[] }) {
  return (
    <p style={{ fontSize: '10.5pt' }}>
      {languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join('  |  ')}
    </p>
  );
}

// An atomic, never-split unit of the resume. `keepWithNext` headings move to the next page
// rather than being left orphaned at the bottom.
export type ResumeBlock = { id: string; keepWithNext?: boolean; node: ReactNode };

export function buildResumeBlocks(data: ResumeData): ResumeBlock[] {
  const blocks: ResumeBlock[] = [{ id: 'header', node: <Header data={data} /> }];

  // Same section order/structure as the ATS layout, rendered with the styled skin.
  if (data.summary) {
    blocks.push({ id: 'sum-h', keepWithNext: true, node: <SectionHeading>Summary</SectionHeading> });
    blocks.push({
      id: 'summary',
      node: <p style={{ fontSize: '10.5pt', lineHeight: 1.45 }}>{data.summary}</p>,
    });
  }
  if (data.skills.length > 0) {
    blocks.push({
      id: 'skills-h',
      keepWithNext: true,
      node: <SectionHeading>Technical Skills</SectionHeading>,
    });
    blocks.push({ id: 'skills', node: <SkillsLines skills={data.skills} /> });
  }
  if (data.experiences.length > 0) {
    blocks.push({
      id: 'exp-h',
      keepWithNext: true,
      node: <SectionHeading>Professional Experience</SectionHeading>,
    });
    data.experiences.forEach((e, i) => {
      blocks.push({
        id: `exp-${i}-h`,
        keepWithNext: e.bullets.length > 0,
        node: <ExperienceHead e={e} first={i === 0} />,
      });
      e.bullets.forEach((b, j) =>
        blocks.push({ id: `exp-${i}-b${j}`, node: <Bullet text={b} first={j === 0} /> }),
      );
    });
  }
  if (data.projects.length > 0) {
    blocks.push({ id: 'proj-h', keepWithNext: true, node: <SectionHeading>Projects</SectionHeading> });
    data.projects.forEach((p, i) => {
      blocks.push({
        id: `proj-${i}-h`,
        keepWithNext: p.bullets.length > 0,
        node: <ProjectHead p={p} first={i === 0} />,
      });
      p.bullets.forEach((b, j) =>
        blocks.push({ id: `proj-${i}-b${j}`, node: <Bullet text={b} first={j === 0} /> }),
      );
    });
  }
  if (data.education.length > 0) {
    blocks.push({ id: 'edu-h', keepWithNext: true, node: <SectionHeading>Education</SectionHeading> });
    data.education.forEach((e, i) => blocks.push({ id: `edu-${i}`, node: <EducationItem e={e} /> }));
  }
  if (data.languages.length > 0) {
    blocks.push({ id: 'lang-h', keepWithNext: true, node: <SectionHeading>Languages</SectionHeading> });
    blocks.push({ id: 'lang', node: <LanguagesLine languages={data.languages} /> });
  }
  return blocks;
}

// Single self-contained A4 cream canvas (used by the standalone template-test page).
export function ResumeTemplate({ data }: { data: ResumeData }) {
  return (
    <div
      className="resume-root"
      style={{ width: '210mm', minHeight: '297mm', padding: '14mm', boxSizing: 'border-box' }}
    >
      {buildResumeBlocks(data).map((b) => (
        <div key={b.id}>{b.node}</div>
      ))}
    </div>
  );
}
