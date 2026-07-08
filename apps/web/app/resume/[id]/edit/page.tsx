'use client';
import type {
  EducationEntry,
  LanguageEntry,
  ResumeData,
  ResumeExperienceEntry,
  ResumeProjectEntry,
  SkillGroupEntry,
} from '@portfolio/shared';
import { ArrowLeft, ChevronDown, ChevronUp, Download, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';
import { PaginatedResume } from '@/components/resume/paginated-resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { useDebounced } from '@/lib/use-debounced';

// ---- Strip API rows (id/resumeId/sortOrder/…) down to the section DTO shapes ----
const pickExp = (e: ResumeExperienceEntry): ResumeExperienceEntry => ({
  title: e.title,
  company: e.company,
  companyNote: e.companyNote,
  location: e.location,
  startDate: e.startDate,
  endDate: e.endDate,
  bullets: e.bullets ?? [],
});
const pickSkill = (s: SkillGroupEntry): SkillGroupEntry => ({
  heading: s.heading,
  items: s.items ?? [],
});
const pickProject = (p: ResumeProjectEntry): ResumeProjectEntry => ({
  title: p.title,
  technologies: p.technologies,
  description: p.description,
  bullets: p.bullets ?? [],
  githubUrl: p.githubUrl,
  demoUrl: p.demoUrl,
});
const pickLang = (l: LanguageEntry): LanguageEntry => ({ name: l.name, level: l.level });
const pickEdu = (e: EducationEntry): EducationEntry => ({
  degree: e.degree,
  institution: e.institution,
  detail: e.detail,
  location: e.location,
  startDate: e.startDate,
  endDate: e.endDate,
});

export default function EditResume({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<ResumeData | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [pdfBusy, setPdfBusy] = useState(false);
  // The exact object loaded from the server; any edit replaces it with a new object,
  // so reference-equality tells us whether the debounced value is still untouched.
  const loadedSnapshot = useRef<ResumeData | null>(null);

  useEffect(() => {
    api.getResume(id).then((d) => {
      loadedSnapshot.current = d;
      setData(d);
    });
  }, [id]);

  // ---------- debounced autosave (PATCH header + PUT each section) ----------
  const debounced = useDebounced(data, 800);
  useEffect(() => {
    if (!debounced) return;
    if (debounced === loadedSnapshot.current) return; // untouched since load — nothing to save
    const d = debounced;
    setStatus('saving');
    (async () => {
      await api.updateResume(d.id, {
        name: d.name,
        layout: d.layout,
        fullName: d.fullName,
        title: d.title,
        photoUrl: d.photoUrl,
        email: d.email,
        phone: d.phone,
        location: d.location,
        website: d.website,
        github: d.github,
        linkedin: d.linkedin,
        summary: d.summary,
      });
      await Promise.all([
        api.setExperiences(d.id, d.experiences.map(pickExp)),
        api.setSkills(d.id, d.skills.map(pickSkill)),
        api.setProjects(d.id, d.projects.map(pickProject)),
        api.setLanguages(d.id, d.languages.map(pickLang)),
        api.setEducation(d.id, d.education.map(pickEdu)),
      ]);
      setStatus('saved');
    })().catch(() => setStatus('error'));
  }, [debounced]);

  // Warn if the user leaves mid-save so a fast close doesn't drop the last edit.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (status === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [status]);

  if (!data) return <div className="p-8 text-neutral-500">Loading…</div>;

  // ---------- header / profile ----------
  const set = (patch: Partial<ResumeData>) => setData((d) => ({ ...d!, ...patch }));

  // ---------- generic array helpers ----------
  type ArrKey = 'experiences' | 'skills' | 'projects' | 'languages' | 'education';
  function addItem<K extends ArrKey>(key: K, blank: ResumeData[K][number]) {
    setData((d) => ({ ...d!, [key]: [...d![key], blank] }));
  }
  function upItem<K extends ArrKey>(key: K, i: number, patch: Partial<ResumeData[K][number]>) {
    setData((d) => ({
      ...d!,
      [key]: d![key].map((it, j) => (j === i ? { ...it, ...patch } : it)),
    }));
  }
  function rmItem<K extends ArrKey>(key: K, i: number) {
    setData((d) => ({ ...d!, [key]: d![key].filter((_, j) => j !== i) }));
  }
  function moveItem<K extends ArrKey>(key: K, i: number, dir: -1 | 1) {
    setData((d) => {
      const a = [...d![key]];
      const j = i + dir;
      if (j < 0 || j >= a.length) return d!;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...d!, [key]: a };
    });
  }

  // ---------- photo (stored locally as a data URL) ----------
  function uploadPhoto(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // ---------- download PDF (post current data -> backend renders -> blob -> save) ----------
  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const blob = await api.renderPdf(data!);
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `${data!.name || 'resume'}.pdf`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      setStatus('error');
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="grid h-screen grid-cols-[minmax(420px,480px)_1fr]">
      <aside className="space-y-8 overflow-y-auto border-r border-neutral-200 bg-gradient-to-b from-indigo-50/60 via-white to-violet-50/40 p-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900">
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400" aria-live="polite">
              {status === 'saving' && 'Saving…'}
              {status === 'saved' && 'Saved ✓'}
              {status === 'error' && <span className="text-red-600">Save failed</span>}
            </span>
            <Button
              size="sm"
              onClick={downloadPdf}
              disabled={pdfBusy || status === 'saving'}
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              <Download size={14} /> {pdfBusy ? 'Preparing…' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* Layout switch */}
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/70 p-1 text-xs">
          <span className="px-1.5 font-medium text-neutral-500">Layout</span>
          {(['styled', 'ats'] as const).map((lyt) => (
            <button
              key={lyt}
              type="button"
              onClick={() => set({ layout: lyt })}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                data.layout === lyt
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {lyt === 'styled' ? 'Styled' : 'ATS-plain'}
            </button>
          ))}
          <span className="ml-1 text-neutral-400">
            {data.layout === 'ats' ? 'single-column, no photo/icons' : 'designed (photo, color)'}
          </span>
        </div>

        {/* Header / Profile */}
        <Section title="Profile">
          <Field label="Resume name">
            <Input value={data.name ?? ''} onChange={(e) => set({ name: e.target.value })} />
          </Field>
          <Photo data={data} set={set} upload={uploadPhoto} />
          <Field label="Full name">
            <Input value={data.fullName} onChange={(e) => set({ fullName: e.target.value })} />
          </Field>
          <Field label="Title">
            <Input value={data.title} onChange={(e) => set({ title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <Input value={data.email} onChange={(e) => set({ email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={data.phone ?? ''} onChange={(e) => set({ phone: e.target.value })} />
            </Field>
            <Field label="Location">
              <Input value={data.location ?? ''} onChange={(e) => set({ location: e.target.value })} />
            </Field>
            <Field label="Website">
              <Input value={data.website ?? ''} onChange={(e) => set({ website: e.target.value })} />
            </Field>
            <Field label="GitHub">
              <Input value={data.github ?? ''} onChange={(e) => set({ github: e.target.value })} />
            </Field>
            <Field label="LinkedIn">
              <Input value={data.linkedin ?? ''} onChange={(e) => set({ linkedin: e.target.value })} />
            </Field>
          </div>
          <Field label="Summary">
            <Textarea value={data.summary ?? ''} onChange={(e) => set({ summary: e.target.value })} />
          </Field>
        </Section>

        {/* Experiences */}
        <Section
          title="Professional Experience"
          onAdd={() => addItem('experiences', { title: '', bullets: [] })}
        >
          {data.experiences.map((e, i) => (
            <ItemCard
              key={i}
              onUp={() => moveItem('experiences', i, -1)}
              onDown={() => moveItem('experiences', i, 1)}
              onRemove={() => rmItem('experiences', i)}
            >
              <Field label="Title">
                <Input value={e.title} onChange={(ev) => upItem('experiences', i, { title: ev.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Company">
                  <Input value={e.company ?? ''} onChange={(ev) => upItem('experiences', i, { company: ev.target.value })} />
                </Field>
                <Field label="Company note">
                  <Input value={e.companyNote ?? ''} onChange={(ev) => upItem('experiences', i, { companyNote: ev.target.value })} />
                </Field>
                <Field label="Location">
                  <Input value={e.location ?? ''} onChange={(ev) => upItem('experiences', i, { location: ev.target.value })} />
                </Field>
                <Field label="Start (YYYY/MM)">
                  <Input value={e.startDate ?? ''} onChange={(ev) => upItem('experiences', i, { startDate: ev.target.value })} />
                </Field>
                <Field label="End (blank = Present)">
                  <Input value={e.endDate ?? ''} onChange={(ev) => upItem('experiences', i, { endDate: ev.target.value })} />
                </Field>
              </div>
              <Bullets
                value={e.bullets}
                onChange={(bullets) => upItem('experiences', i, { bullets })}
              />
            </ItemCard>
          ))}
        </Section>

        {/* Skills */}
        <Section title="Skills" onAdd={() => addItem('skills', { heading: '', items: [] })}>
          {data.skills.map((s, i) => (
            <ItemCard
              key={i}
              onUp={() => moveItem('skills', i, -1)}
              onDown={() => moveItem('skills', i, 1)}
              onRemove={() => rmItem('skills', i)}
            >
              <Field label="Heading">
                <Input value={s.heading} onChange={(ev) => upItem('skills', i, { heading: ev.target.value })} />
              </Field>
              <Bullets
                label="Items"
                value={s.items}
                onChange={(items) => upItem('skills', i, { items })}
              />
            </ItemCard>
          ))}
        </Section>

        {/* Projects */}
        <Section title="Projects" onAdd={() => addItem('projects', { title: '', bullets: [] })}>
          {data.projects.map((p, i) => (
            <ItemCard
              key={i}
              onUp={() => moveItem('projects', i, -1)}
              onDown={() => moveItem('projects', i, 1)}
              onRemove={() => rmItem('projects', i)}
            >
              <Field label="Title">
                <Input value={p.title} onChange={(ev) => upItem('projects', i, { title: ev.target.value })} />
              </Field>
              <Field label="Technologies">
                <Input value={p.technologies ?? ''} onChange={(ev) => upItem('projects', i, { technologies: ev.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="GitHub URL">
                  <Input value={p.githubUrl ?? ''} onChange={(ev) => upItem('projects', i, { githubUrl: ev.target.value })} />
                </Field>
                <Field label="Demo URL">
                  <Input value={p.demoUrl ?? ''} onChange={(ev) => upItem('projects', i, { demoUrl: ev.target.value })} />
                </Field>
              </div>
              <Field label="Description">
                <Textarea value={p.description ?? ''} onChange={(ev) => upItem('projects', i, { description: ev.target.value })} />
              </Field>
              <Bullets value={p.bullets} onChange={(bullets) => upItem('projects', i, { bullets })} />
            </ItemCard>
          ))}
        </Section>

        {/* Languages */}
        <Section title="Languages" onAdd={() => addItem('languages', { name: '' })}>
          {data.languages.map((l, i) => (
            <ItemCard
              key={i}
              onUp={() => moveItem('languages', i, -1)}
              onDown={() => moveItem('languages', i, 1)}
              onRemove={() => rmItem('languages', i)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name">
                  <Input value={l.name} onChange={(ev) => upItem('languages', i, { name: ev.target.value })} />
                </Field>
                <Field label="Level">
                  <Input value={l.level ?? ''} onChange={(ev) => upItem('languages', i, { level: ev.target.value })} />
                </Field>
              </div>
            </ItemCard>
          ))}
        </Section>

        {/* Education */}
        <Section title="Education" onAdd={() => addItem('education', { degree: '' })}>
          {data.education.map((e, i) => (
            <ItemCard
              key={i}
              onUp={() => moveItem('education', i, -1)}
              onDown={() => moveItem('education', i, 1)}
              onRemove={() => rmItem('education', i)}
            >
              <Field label="Degree / Diploma">
                <Input value={e.degree} onChange={(ev) => upItem('education', i, { degree: ev.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Institution">
                  <Input value={e.institution ?? ''} onChange={(ev) => upItem('education', i, { institution: ev.target.value })} />
                </Field>
                <Field label="Location">
                  <Input value={e.location ?? ''} onChange={(ev) => upItem('education', i, { location: ev.target.value })} />
                </Field>
                <Field label="Start (YYYY/MM)">
                  <Input value={e.startDate ?? ''} onChange={(ev) => upItem('education', i, { startDate: ev.target.value })} />
                </Field>
                <Field label="End (YYYY/MM)">
                  <Input value={e.endDate ?? ''} onChange={(ev) => upItem('education', i, { endDate: ev.target.value })} />
                </Field>
              </div>
              <Field label="Detail">
                <Input value={e.detail ?? ''} onChange={(ev) => upItem('education', i, { detail: ev.target.value })} />
              </Field>
            </ItemCard>
          ))}
        </Section>
      </aside>

      <main className="overflow-y-auto bg-neutral-200 p-8">
        <PreviewPane data={data} />
      </main>
    </div>
  );
}

// Scale the A4 page sheets to fit the preview pane width; pagination lives in PaginatedResume.
const A4_W_PX = 210 * (96 / 25.4); // 210mm @ 96dpi ≈ 794
function PreviewPane({ data }: { data: ResumeData }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, wrap.clientWidth / A4_W_PX));
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="mx-auto max-w-[794px]">
      <PaginatedResume data={data} scale={scale} />
    </div>
  );
}

// ---------------- small presentational helpers ----------------
function Section({
  title,
  children,
  onAdd,
}: {
  title: string;
  children?: React.ReactNode;
  onAdd?: () => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
        <h2 className="text-sm font-semibold tracking-wide text-neutral-700 uppercase">{title}</h2>
        {onAdd && (
          <Button variant="ghost" size="sm" onClick={onAdd} className="text-neutral-500">
            <Plus size={14} /> Add
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ItemCard({
  children,
  onUp,
  onDown,
  onRemove,
}: {
  children: React.ReactNode;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative space-y-3 rounded-xl border border-sky-200/70 bg-gradient-to-br from-sky-100/70 to-blue-50/50 p-4 pt-9 shadow-sm ring-1 ring-sky-300/40 backdrop-blur-md">
      <div className="absolute top-2 right-2 flex gap-1">
        <Button variant="ghost" size="icon" onClick={onUp} aria-label="Move up">
          <ChevronUp size={14} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDown} aria-label="Move down">
          <ChevronDown size={14} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove" className="hover:text-red-600">
          <Trash2 size={14} />
        </Button>
      </div>
      {children}
    </div>
  );
}

function Bullets({
  value,
  onChange,
  label = 'Bullets',
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {value.map((b, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={b}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label="Remove line"
              className="shrink-0 hover:text-red-600"
            >
              <X size={14} />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...value, ''])}>
          <Plus size={14} /> Add line
        </Button>
      </div>
    </div>
  );
}

function Photo({
  data,
  set,
  upload,
}: {
  data: ResumeData;
  set: (patch: Partial<ResumeData>) => void;
  upload: (file: File) => Promise<string>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Field label="Header photo">
      <div className="flex items-center gap-3">
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-xs text-neutral-400">
            none
          </div>
        )}
        <label className="cursor-pointer text-sm text-neutral-700 underline">
          {busy ? 'Uploading…' : data.photoUrl ? 'Replace' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                const url = await upload(file);
                set({ photoUrl: url });
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        {data.photoUrl && (
          <button
            type="button"
            className="text-sm text-red-600 underline"
            onClick={() => set({ photoUrl: undefined })}
          >
            Remove
          </button>
        )}
      </div>
    </Field>
  );
}
