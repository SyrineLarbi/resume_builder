import type {
  EducationEntry,
  LanguageEntry,
  ResumeExperienceEntry,
  ResumeProjectEntry,
  SkillGroupEntry,
} from '@portfolio/shared';
import { ResumeData } from '@portfolio/shared';

// Resumes are stored locally in the browser (this laptop) — no backend database.
// The backend is only used to render the PDF from the data we send it.
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const STORE_KEY = 'resumes';

type Stored = ResumeData & { updatedAt: string };

function readAll(): Record<string, Stored> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as Record<string, Stored>;
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, Stored>) {
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
}

function get(id: string): Stored {
  const found = readAll()[id];
  if (!found) throw new Error(`Resume ${id} not found`);
  return found;
}

// Persist a mutated resume and stamp it as freshly updated.
function save(next: Stored) {
  const all = readAll();
  all[next.id] = { ...next, updatedAt: new Date().toISOString() };
  writeAll(all);
}

export const api = {
  listResumes: async () => {
    const all = readAll();
    return Object.values(all)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .map((r) => ({ id: r.id, name: r.name, updatedAt: r.updatedAt }));
  },

  createResume: async (name?: string) => {
    const id = crypto.randomUUID();
    // ResumeData.parse fills every field with its schema default.
    const blank = ResumeData.parse({ id, ...(name ? { name } : {}) });
    save({ ...blank, updatedAt: new Date().toISOString() });
    return { id };
  },

  getResume: async (id: string): Promise<ResumeData> => get(id),

  updateResume: async (id: string, patch: Partial<ResumeData>) => {
    save({ ...get(id), ...patch });
  },

  deleteResume: async (id: string) => {
    const all = readAll();
    delete all[id];
    writeAll(all);
  },

  setExperiences: async (id: string, items: ResumeExperienceEntry[]) => {
    save({ ...get(id), experiences: items });
  },
  setSkills: async (id: string, items: SkillGroupEntry[]) => {
    save({ ...get(id), skills: items });
  },
  setProjects: async (id: string, items: ResumeProjectEntry[]) => {
    save({ ...get(id), projects: items });
  },
  setLanguages: async (id: string, items: LanguageEntry[]) => {
    save({ ...get(id), languages: items });
  },
  setEducation: async (id: string, items: EducationEntry[]) => {
    save({ ...get(id), education: items });
  },

  // Send the current resume to the backend, which renders the PDF (Playwright) and
  // streams it back. No data is persisted server-side.
  renderPdf: async (data: ResumeData): Promise<Blob> => {
    const res = await fetch(`${BASE}/resume/pdf`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error(`pdf ${res.status}`);
    return res.blob();
  },
};
