'use client';
import type { ResumeData } from '@portfolio/shared';
import type { CSSProperties } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { buildAtsBlocks } from './ats-template';
import { buildResumeBlocks } from './resume-template';

// useLayoutEffect on the client (re-paginate before paint), useEffect during SSR (print route).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const MM = 96 / 25.4; // px per mm @ 96dpi
const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const MARGIN_MM = 14;
const CONTENT_W_MM = PAGE_W_MM - 2 * MARGIN_MM; // 182
const CONTENT_H_PX = (PAGE_H_MM - 2 * MARGIN_MM) * MM; // ~1016px of usable height per page

/**
 * Renders the resume as discrete A4 pages. Blocks are measured once, then packed greedily —
 * a block that doesn't fit the remaining space moves *whole* to the next page (Word-style),
 * and `keepWithNext` headings follow their content. The same component drives the on-screen
 * preview (scaled sheets) and the print route (real page breaks) so they match exactly.
 */
export function PaginatedResume({
  data,
  scale = 1,
  forPrint = false,
}: {
  data: ResumeData;
  scale?: number;
  forPrint?: boolean;
}) {
  const ats = data.layout === 'ats';
  const blocks = ats ? buildAtsBlocks(data) : buildResumeBlocks(data);
  const rootClass = ats ? 'ats-root' : 'resume-root';
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[][] | null>(null);

  useIsomorphicLayoutEffect(() => {
    let cancelled = false;
    const paginate = () => {
      const container = measureRef.current;
      if (!container || cancelled) return;
      const els = Array.from(container.querySelectorAll<HTMLElement>('[data-block]'));
      if (els.length !== blocks.length) return;
      // Effective height of each block = distance to the next block's top (captures the
      // real laid-out gap, margin-collapsing included); last block uses the container height.
      const tops = els.map((el) => el.offsetTop);
      const total = container.scrollHeight;
      const heights = els.map((_, i) => (i < els.length - 1 ? tops[i + 1] : total) - tops[i]);

      const result: number[][] = [];
      let cur: number[] = [];
      let used = 0;
      for (let i = 0; i < blocks.length; i++) {
        const h = heights[i];
        if (used > 0 && used + h > CONTENT_H_PX) {
          // pull any trailing keep-with-next heading(s) down to the new page
          const carry: number[] = [];
          while (cur.length && blocks[cur[cur.length - 1]].keepWithNext) carry.unshift(cur.pop()!);
          result.push(cur);
          cur = carry;
          used = carry.reduce((s, idx) => s + heights[idx], 0);
        }
        cur.push(i);
        used += h;
      }
      if (cur.length) result.push(cur);
      setPages(result.length ? result : [blocks.map((_, i) => i)]);
    };

    const fonts = (document as unknown as { fonts?: { ready: Promise<unknown> } }).fonts;
    if (fonts?.ready) fonts.ready.then(paginate);
    paginate();
    return () => {
      cancelled = true;
    };
    // re-paginate whenever the resume content changes
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Signal the PDF renderer once pages are laid out.
  useEffect(() => {
    if (forPrint && pages) document.documentElement.setAttribute('data-paginated', '1');
  }, [forPrint, pages]);

  // Guard against a stale `pages` from the previous render (e.g. right after removing an item):
  // only trust it if it partitions exactly the current block indices, else show all on one page
  // until the layout effect re-paginates this same commit.
  const flat = pages?.flat() ?? [];
  const pagesValid =
    !!pages && flat.length === blocks.length && flat.every((i) => i >= 0 && i < blocks.length);
  const pageList = pagesValid ? pages! : [blocks.map((_, i) => i)];

  const pageStyle = (pageNum: number): CSSProperties => ({
    width: `${PAGE_W_MM}mm`,
    height: `${PAGE_H_MM}mm`,
    padding: `${MARGIN_MM}mm`,
    boxSizing: 'border-box',
    overflow: 'hidden',
    breakAfter: forPrint && pageNum < pageList.length - 1 ? 'page' : 'auto',
  });

  const renderPage = (idxs: number[], pageNum: number) => (
    <div className={rootClass} style={pageStyle(pageNum)}>
      {idxs.map((i) => (
        <div key={blocks[i].id}>{blocks[i].node}</div>
      ))}
    </div>
  );

  return (
    <>
      {/* hidden measurement pass at the page's content width */}
      {(!forPrint || !pages) && (
        <div aria-hidden style={{ position: 'absolute', left: -99999, top: 0, visibility: 'hidden' }}>
          <div ref={measureRef} className={rootClass} style={{ width: `${CONTENT_W_MM}mm` }}>
            {blocks.map((b) => (
              <div data-block key={b.id}>
                {b.node}
              </div>
            ))}
          </div>
        </div>
      )}

      {forPrint ? (
        <div>{pageList.map((idxs, p) => renderPage(idxs, p))}</div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {pageList.map((idxs, p) => (
            <div key={p} className="relative">
              <span className="absolute -top-5 right-0 text-[11px] font-medium text-neutral-400">
                Page {p + 1} / {pageList.length}
              </span>
              <div
                className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black/5"
                style={{ width: PAGE_W_MM * MM * scale, height: PAGE_H_MM * MM * scale }}
              >
                <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  {renderPage(idxs, p)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
