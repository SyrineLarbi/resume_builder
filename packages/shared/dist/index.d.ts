import { z } from 'zod';
export declare const BulletList: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
export declare const ResumeExperienceEntry: z.ZodObject<{
    title: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    companyNote: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    bullets: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    bullets: string[];
    company?: string | undefined;
    companyNote?: string | undefined;
    location?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    title: string;
    company?: string | undefined;
    companyNote?: string | undefined;
    location?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    bullets?: string[] | undefined;
}>;
export type ResumeExperienceEntry = z.infer<typeof ResumeExperienceEntry>;
export declare const SkillGroupEntry: z.ZodObject<{
    heading: z.ZodString;
    items: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    heading: string;
    items: string[];
}, {
    heading: string;
    items?: string[] | undefined;
}>;
export type SkillGroupEntry = z.infer<typeof SkillGroupEntry>;
export declare const ResumeProjectEntry: z.ZodObject<{
    title: z.ZodString;
    technologies: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    bullets: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    githubUrl: z.ZodOptional<z.ZodString>;
    demoUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    bullets: string[];
    technologies?: string | undefined;
    description?: string | undefined;
    githubUrl?: string | undefined;
    demoUrl?: string | undefined;
}, {
    title: string;
    bullets?: string[] | undefined;
    technologies?: string | undefined;
    description?: string | undefined;
    githubUrl?: string | undefined;
    demoUrl?: string | undefined;
}>;
export type ResumeProjectEntry = z.infer<typeof ResumeProjectEntry>;
export declare const LanguageEntry: z.ZodObject<{
    name: z.ZodString;
    level: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    level?: string | undefined;
}, {
    name: string;
    level?: string | undefined;
}>;
export type LanguageEntry = z.infer<typeof LanguageEntry>;
export declare const EducationEntry: z.ZodObject<{
    degree: z.ZodString;
    institution: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    degree: string;
    location?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    institution?: string | undefined;
    detail?: string | undefined;
}, {
    degree: string;
    location?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    institution?: string | undefined;
    detail?: string | undefined;
}>;
export type EducationEntry = z.infer<typeof EducationEntry>;
export declare const ResumeData: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodDefault<z.ZodString>;
    layout: z.ZodDefault<z.ZodEnum<["styled", "ats"]>>;
    fullName: z.ZodDefault<z.ZodString>;
    title: z.ZodDefault<z.ZodString>;
    photoUrl: z.ZodOptional<z.ZodString>;
    email: z.ZodDefault<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    github: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    experiences: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        company: z.ZodOptional<z.ZodString>;
        companyNote: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        bullets: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        bullets: string[];
        company?: string | undefined;
        companyNote?: string | undefined;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        title: string;
        company?: string | undefined;
        companyNote?: string | undefined;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        bullets?: string[] | undefined;
    }>, "many">>;
    skills: z.ZodDefault<z.ZodArray<z.ZodObject<{
        heading: z.ZodString;
        items: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        heading: string;
        items: string[];
    }, {
        heading: string;
        items?: string[] | undefined;
    }>, "many">>;
    projects: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        technologies: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        bullets: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        githubUrl: z.ZodOptional<z.ZodString>;
        demoUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        bullets: string[];
        technologies?: string | undefined;
        description?: string | undefined;
        githubUrl?: string | undefined;
        demoUrl?: string | undefined;
    }, {
        title: string;
        bullets?: string[] | undefined;
        technologies?: string | undefined;
        description?: string | undefined;
        githubUrl?: string | undefined;
        demoUrl?: string | undefined;
    }>, "many">>;
    languages: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        level: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        level?: string | undefined;
    }, {
        name: string;
        level?: string | undefined;
    }>, "many">>;
    education: z.ZodDefault<z.ZodArray<z.ZodObject<{
        degree: z.ZodString;
        institution: z.ZodOptional<z.ZodString>;
        detail: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        degree: string;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        institution?: string | undefined;
        detail?: string | undefined;
    }, {
        degree: string;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        institution?: string | undefined;
        detail?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    name: string;
    id: string;
    layout: "styled" | "ats";
    fullName: string;
    email: string;
    experiences: {
        title: string;
        bullets: string[];
        company?: string | undefined;
        companyNote?: string | undefined;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }[];
    skills: {
        heading: string;
        items: string[];
    }[];
    projects: {
        title: string;
        bullets: string[];
        technologies?: string | undefined;
        description?: string | undefined;
        githubUrl?: string | undefined;
        demoUrl?: string | undefined;
    }[];
    languages: {
        name: string;
        level?: string | undefined;
    }[];
    education: {
        degree: string;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        institution?: string | undefined;
        detail?: string | undefined;
    }[];
    location?: string | undefined;
    photoUrl?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    github?: string | undefined;
    linkedin?: string | undefined;
    summary?: string | undefined;
}, {
    id: string;
    title?: string | undefined;
    location?: string | undefined;
    name?: string | undefined;
    layout?: "styled" | "ats" | undefined;
    fullName?: string | undefined;
    photoUrl?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    github?: string | undefined;
    linkedin?: string | undefined;
    summary?: string | undefined;
    experiences?: {
        title: string;
        company?: string | undefined;
        companyNote?: string | undefined;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        bullets?: string[] | undefined;
    }[] | undefined;
    skills?: {
        heading: string;
        items?: string[] | undefined;
    }[] | undefined;
    projects?: {
        title: string;
        bullets?: string[] | undefined;
        technologies?: string | undefined;
        description?: string | undefined;
        githubUrl?: string | undefined;
        demoUrl?: string | undefined;
    }[] | undefined;
    languages?: {
        name: string;
        level?: string | undefined;
    }[] | undefined;
    education?: {
        degree: string;
        location?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        institution?: string | undefined;
        detail?: string | undefined;
    }[] | undefined;
}>;
export type ResumeData = z.infer<typeof ResumeData>;
