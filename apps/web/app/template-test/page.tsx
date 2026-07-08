import type { ResumeData } from '@portfolio/shared';
import { ResumeTemplate } from '@/components/resume/resume-template';

// Phase 4 visual test data — mirrors the seeded resume (Syrine Larbi).
const sample: ResumeData = {
  id: 'preview',
  name: 'Main resume',
  layout: 'styled',
  education: [],
  fullName: 'Syrine Larbi',
  title: 'Full Stack Developer',
  email: 'syrinelarbi9@gmail.com',
  phone: '+216 24428833',
  location: 'Tunis, Tunisia',
  website: 'syrine-larbi.vercel.app',
  github: 'github.com/SyrineLarbi',
  linkedin: 'linkedin.com/in/syrine-larbi',
  summary:
    'Full Stack Developer with experience in building efficient, high-quality applications using ' +
    'Node.js, React.js, and SQL. Passionate about clean architecture, performance, and shipping ' +
    'features end to end.',
  experiences: [
    {
      title: 'Software Engineer | Full Stack Developer',
      company: 'Jumia Porto Tech Center',
      companyNote: '(Remote) (Central Team)',
      location: 'Tunis, Tunisia',
      startDate: '2024/01',
      endDate: '',
      bullets: [
        'Resolved live issues in the leave management system, optimizing queries to cut response time 40%.',
        'Built an employee acknowledgment app with dashboard, HR document uploads, and reporting.',
      ],
    },
  ],
  skills: [
    {
      heading: 'TECHNICAL SKILLS',
      items: [
        'Frontend : JavaScript | TypeScript | Angular | ReactJS',
        'Backend : Node.js | ExpressJS | NestJS | Python',
      ],
    },
    {
      heading: 'SOFT SKILLS',
      items: ['Management of time', 'Problem solving', 'Teamwork'],
    },
  ],
  projects: [
    {
      title: 'AI Image Generator Web Application (MERN Stack, OpenAI API)',
      bullets: ['Developed a full-stack app that generates images from text prompts via OpenAI.'],
      githubUrl: 'github.com/SyrineLarbi/ai-image-generator',
      demoUrl: 'ai-image-gen.vercel.app',
    },
  ],
  languages: [{ name: 'English' }, { name: 'French' }, { name: 'Arabic' }],
};

export default function TemplateTestPage() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', padding: '24px', background: '#e5e7eb' }}>
      <div style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
        <ResumeTemplate data={sample} />
      </div>
    </main>
  );
}
