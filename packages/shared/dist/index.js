"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeData = exports.EducationEntry = exports.LanguageEntry = exports.ResumeProjectEntry = exports.SkillGroupEntry = exports.ResumeExperienceEntry = exports.BulletList = void 0;
const zod_1 = require("zod");
// ---------- Resume builder ----------
exports.BulletList = zod_1.z.array(zod_1.z.string()).default([]);
exports.ResumeExperienceEntry = zod_1.z.object({
    title: zod_1.z.string(),
    company: zod_1.z.string().optional(),
    companyNote: zod_1.z.string().optional(), // e.g. "(Remote) (Central Team)"
    location: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(), // "2024/01"
    endDate: zod_1.z.string().optional(), // "" => render "Present"
    bullets: exports.BulletList,
});
exports.SkillGroupEntry = zod_1.z.object({
    heading: zod_1.z.string(), // "TECHNICAL SKILLS" | "SOFT SKILLS"
    items: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.ResumeProjectEntry = zod_1.z.object({
    title: zod_1.z.string(),
    technologies: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    bullets: exports.BulletList,
    githubUrl: zod_1.z.string().optional(),
    demoUrl: zod_1.z.string().optional(),
});
exports.LanguageEntry = zod_1.z.object({
    name: zod_1.z.string(),
    level: zod_1.z.string().optional(),
});
exports.EducationEntry = zod_1.z.object({
    degree: zod_1.z.string(), // "Full Stack Developer Diploma"
    institution: zod_1.z.string().optional(), // "3W Academy"
    detail: zod_1.z.string().optional(), // "MEAN & MERN stack development"
    location: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(), // "2022/04"
    endDate: zod_1.z.string().optional(), // "2023/04"
});
// The whole resume — the single contract for API, editor state, template, print route.
exports.ResumeData = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().default('Untitled resume'), // dashboard label
    layout: zod_1.z.enum(['styled', 'ats']).default('styled'), // designed vs ATS-plain
    fullName: zod_1.z.string().default(''),
    title: zod_1.z.string().default(''),
    photoUrl: zod_1.z.string().optional(),
    email: zod_1.z.string().default(''),
    phone: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    github: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
    experiences: zod_1.z.array(exports.ResumeExperienceEntry).default([]),
    skills: zod_1.z.array(exports.SkillGroupEntry).default([]),
    projects: zod_1.z.array(exports.ResumeProjectEntry).default([]),
    languages: zod_1.z.array(exports.LanguageEntry).default([]),
    education: zod_1.z.array(exports.EducationEntry).default([]),
});
