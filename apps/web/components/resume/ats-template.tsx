import type { ResumeData } from '@portfolio/shared';
import type { ResumeBlock } from './resume-template';

// ATS-plain: single column, no photo, no icons, black-on-white, standard headings,
// plain-text-parseable. Font family/color come from the `.ats-root` wrapper (Arial).

function AtsHeading({ children }: { children: string }) {
  return (
    <h2
      style={{
        fontSize: '11.5pt',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderBottom: '1px solid #333',
        paddingBottom: '2pt',
        marginTop: '14pt',
        marginBottom: '6pt',
      }}
    >
      {children}
    </h2>
  );
}

const url = (v: string) => (/^https?:\/\//i.test(v) ? v : `https://${v}`);

function AtsHeader({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location].filter(Boolean).join('  |  ');
  const links: string[] = [];
  if (data.website) links.push(`Portfolio: ${data.website}`);
  if (data.github) links.push(`GitHub: ${data.github}`);
  if (data.linkedin) links.push(`LinkedIn: ${data.linkedin}`);
  return (
    <header style={{ marginBottom: '4pt' }}>
      <div style={{ fontSize: '20pt', fontWeight: 700, letterSpacing: '0.02em' }}>
        {data.fullName}
      </div>
      {data.title && <div style={{ fontSize: '11.5pt', marginTop: '1pt' }}>{data.title}</div>}
      {contact && <div style={{ fontSize: '10pt', marginTop: '5pt' }}>{contact}</div>}
      {links.length > 0 && (
        <div style={{ fontSize: '10pt', marginTop: '2pt' }}>
          {links.map((l, i) => (
            <span key={i}>
              {i > 0 && '  |  '}
              {l.includes(': ') ? (
                <>
                  {l.slice(0, l.indexOf(': ') + 2)}
                  <a href={url(l.slice(l.indexOf(': ') + 2))} style={{ color: 'inherit' }}>
                    {l.slice(l.indexOf(': ') + 2)}
                  </a>
                </>
              ) : (
                l
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

// One bullet as its own block so a long list flows across a page boundary instead of
// pushing the whole entry to the next page.
const bulletBlock = (b: string, first: boolean) => (
  <ul style={{ listStyle: 'disc', paddingLeft: '16pt', margin: 0, marginTop: first ? '2pt' : '1pt' }}>
    <li>{b}</li>
  </ul>
);

export function buildAtsBlocks(data: ResumeData): ResumeBlock[] {
  const blocks: ResumeBlock[] = [{ id: 'ats-header', node: <AtsHeader data={data} /> }];
  const body = { fontSize: '10.5pt', lineHeight: 1.4 } as const;

  if (data.summary) {
    blocks.push({ id: 'sum-h', keepWithNext: true, node: <AtsHeading>Summary</AtsHeading> });
    blocks.push({ id: 'sum', node: <p style={body}>{data.summary}</p> });
  }

  if (data.skills.length > 0) {
    blocks.push({ id: 'sk-h', keepWithNext: true, node: <AtsHeading>Technical Skills</AtsHeading> });
    blocks.push({
      id: 'sk',
      node: (
        <div style={body}>
          {data.skills.map((g, i) => (
            <div key={i} style={{ marginBottom: '2pt' }}>
              <span style={{ fontWeight: 700 }}>{g.heading}: </span>
              {g.items.join(', ')}
            </div>
          ))}
        </div>
      ),
    });
  }

  if (data.experiences.length > 0) {
    blocks.push({
      id: 'exp-h',
      keepWithNext: true,
      node: <AtsHeading>Professional Experience</AtsHeading>,
    });
    data.experiences.forEach((e, i) => {
      const meta = [
        [e.company, e.companyNote].filter(Boolean).join(' '),
        [e.startDate, e.endDate ? e.endDate : 'Present'].filter(Boolean).join(' – '),
        e.location,
      ]
        .filter(Boolean)
        .join('  |  ');
      blocks.push({
        id: `exp-${i}`,
        keepWithNext: e.bullets.length > 0,
        node: (
          <div style={{ ...body, marginTop: i ? '6pt' : 0 }}>
            <div style={{ fontWeight: 700 }}>{e.title}</div>
            {meta && <div>{meta}</div>}
          </div>
        ),
      });
      e.bullets.forEach((b, j) =>
        blocks.push({ id: `exp-${i}-b${j}`, node: bulletBlock(b, j === 0) }),
      );
    });
  }

  if (data.projects.length > 0) {
    blocks.push({ id: 'pr-h', keepWithNext: true, node: <AtsHeading>Projects</AtsHeading> });
    data.projects.forEach((p, i) => {
      blocks.push({
        id: `pr-${i}`,
        keepWithNext: p.bullets.length > 0,
        node: (
          <div style={{ ...body, marginTop: i ? '6pt' : 0 }}>
            <div style={{ fontWeight: 700 }}>
              {p.title}
              {p.technologies ? ` — ${p.technologies}` : ''}
            </div>
            {(p.githubUrl || p.demoUrl) && (
              <div>
                {p.githubUrl && (
                  <>
                    GitHub:{' '}
                    <a href={url(p.githubUrl)} style={{ color: 'inherit' }}>
                      {p.githubUrl}
                    </a>
                  </>
                )}
                {p.githubUrl && p.demoUrl && '   |   '}
                {p.demoUrl && (
                  <>
                    Demo:{' '}
                    <a href={url(p.demoUrl)} style={{ color: 'inherit' }}>
                      {p.demoUrl}
                    </a>
                  </>
                )}
              </div>
            )}
            {p.description && <div>{p.description}</div>}
          </div>
        ),
      });
      p.bullets.forEach((b, j) =>
        blocks.push({ id: `pr-${i}-b${j}`, node: bulletBlock(b, j === 0) }),
      );
    });
  }

  if (data.education.length > 0) {
    blocks.push({ id: 'ed-h', keepWithNext: true, node: <AtsHeading>Education</AtsHeading> });
    data.education.forEach((e, i) => {
      const head = [e.degree, e.institution].filter(Boolean).join(' — ');
      const dates = [e.startDate, e.endDate].filter(Boolean).join(' – ');
      blocks.push({
        id: `ed-${i}`,
        node: (
          <div style={{ ...body, marginTop: i ? '4pt' : 0 }}>
            <div>
              <span style={{ fontWeight: 700 }}>{head}</span>
              {dates ? `  |  ${dates}` : ''}
            </div>
            {e.detail && <div>{e.detail}</div>}
          </div>
        ),
      });
    });
  }

  if (data.languages.length > 0) {
    blocks.push({ id: 'la-h', keepWithNext: true, node: <AtsHeading>Languages</AtsHeading> });
    blocks.push({
      id: 'la',
      node: (
        <p style={body}>
          {data.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join('  |  ')}
        </p>
      ),
    });
  }

  return blocks;
}
