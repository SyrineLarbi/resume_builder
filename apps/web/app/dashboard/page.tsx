'use client';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

type Row = { id: string; name: string; updatedAt: string };

// Deterministic accent per card so the grid feels colorful but stable across renders.
const ACCENTS = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-cyan-500',
  'from-rose-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-purple-500',
];

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    api
      .listResumes()
      .then(setItems)
      .finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  const create = async () => {
    const { id } = await api.createResume();
    router.push(`/resume/${id}/edit`);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    await api.deleteResume(id);
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex-1">
      {/* Colorful header banner */}
      <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <FileText size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Your resumes</h1>
              <p className="text-sm text-white/80">Create, edit, and export — with a live preview.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-500">
            {loading ? 'Loading…' : `${items.length} resume${items.length === 1 ? '' : 's'}`}
          </span>
          <Button
            onClick={create}
            className="bg-indigo-600 shadow-sm shadow-indigo-200 hover:bg-indigo-500"
          >
            <Plus size={16} /> New resume
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-200/70" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <button
            onClick={create}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-indigo-200 bg-white/60 p-14 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/60"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Plus size={26} />
            </span>
            <span className="text-lg font-semibold text-neutral-800">Create your first resume</span>
            <span className="text-sm text-neutral-500">Start from a blank template and fill it in.</span>
          </button>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r, i) => (
              <li
                key={r.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <button
                  onClick={() => router.push(`/resume/${r.id}/edit`)}
                  className="flex w-full flex-col items-start gap-6 p-5 text-left"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} text-white shadow`}
                  >
                    <FileText size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-neutral-900">
                      {r.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-400">
                      Updated {new Date(r.updatedAt).toLocaleDateString()}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => remove(r.id)}
                  aria-label="Delete resume"
                  className="absolute top-3 right-3 rounded-md p-1.5 text-neutral-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
