import { z } from 'zod';

// ---------- Resume builder ----------
export const BulletList = z.array(z.string()).default([]);

export const ResumeExperienceEntry = z.object({
  title: z.string(),
  company: z.string().optional(),
  companyNote: z.string().optional(), // e.g. "(Remote) (Central Team)"
  location: z.string().optional(),
  startDate: z.string().optional(), // "2024/01"
  endDate: z.string().optional(), // "" => render "Present"
  bullets: BulletList,
});
export type ResumeExperienceEntry = z.infer<typeof ResumeExperienceEntry>;

export const SkillGroupEntry = z.object({
  heading: z.string(), // "TECHNICAL SKILLS" | "SOFT SKILLS"
  items: z.array(z.string()).default([]),
});
export type SkillGroupEntry = z.infer<typeof SkillGroupEntry>;

export const ResumeProjectEntry = z.object({
  title: z.string(),
  technologies: z.string().optional(),
  description: z.string().optional(),
  bullets: BulletList,
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
});
export type ResumeProjectEntry = z.infer<typeof ResumeProjectEntry>;

export const LanguageEntry = z.object({
  name: z.string(),
  level: z.string().optional(),
});
export type LanguageEntry = z.infer<typeof LanguageEntry>;

export const EducationEntry = z.object({
  degree: z.string(), // "Full Stack Developer Diploma"
  institution: z.string().optional(), // "3W Academy"
  detail: z.string().optional(), // "MEAN & MERN stack development"
  location: z.string().optional(),
  startDate: z.string().optional(), // "2022/04"
  endDate: z.string().optional(), // "2023/04"
});
export type EducationEntry = z.infer<typeof EducationEntry>;

// The whole resume — the single contract for API, editor state, template, print route.
export const ResumeData = z.object({
  id: z.string(),
  name: z.string().default('Untitled resume'), // dashboard label
  layout: z.enum(['styled', 'ats']).default('styled'), // designed vs ATS-plain
  fullName: z.string().default(''),
  title: z.string().default(''),
  photoUrl: z.string().optional(),
  email: z.string().default(''),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  summary: z.string().optional(),
  experiences: z.array(ResumeExperienceEntry).default([]),
  skills: z.array(SkillGroupEntry).default([]),
  projects: z.array(ResumeProjectEntry).default([]),
  languages: z.array(LanguageEntry).default([]),
  education: z.array(EducationEntry).default([]),
});
export type ResumeData = z.infer<typeof ResumeData>;
