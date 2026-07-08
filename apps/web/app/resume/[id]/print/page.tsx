'use client';
import type { ResumeData } from '@portfolio/shared';
import { useState } from 'react';
import { PaginatedResume } from '@/components/resume/paginated-resume';

// The PDF renderer (Playwright) injects the resume as window.__RESUME__ before this
// page's scripts run, then captures the printed output — no server-side data fetch.
export default function Print() {
  const [data] = useState<ResumeData | null>(() =>
    typeof window === 'undefined'
      ? null
      : ((window as unknown as { __RESUME__?: ResumeData }).__RESUME__ ?? null),
  );

  if (!data) return <div>Missing resume data.</div>;
  const pageBg = data.layout === 'ats' ? '#ffffff' : '#fdfcf7';

  return (
    <>
      {/* Page background fills every printed sheet (propagated to the page box); 0 body margin
          so the A4 sheets map 1:1 to PDF pages — each sheet supplies its own 14mm padding. */}
      <style>{`html,body{margin:0;padding:0;background:${pageBg};}`}</style>
      <PaginatedResume data={data} forPrint />
    </>
  );
}
