'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * ServiceIndex: the Services section.
 *
 * Five rows act as an index. Hovering or focusing a row springs one bar to it
 * and floats a preview card that follows the pointer. The card is positioned
 * and tilted from `requestAnimationFrame` writes to CSS custom properties, so
 * pointer movement never triggers a React render: only the row transition
 * renders, and only on selection change.
 *
 * Card physics, matching the source design:
 *   translateX = pointerX - cardWidth - GAP     the card sits left of the cursor
 *   rotateY     = (pointerX / viewportWidth - 0.5) * TILT_MAX
 *   rotateX     = -(pointerY / viewportHeight - 0.5) * TILT_MAX
 * with an exponential approach (LERP) so the card trails rather than snaps.
 *
 * Touch and narrow viewports get a disclosure panel under the row instead:
 * there is no pointer to follow and no room for a floating card.
 */

/** Peak tilt in degrees. The source design reaches about 12. */
const TILT_MAX = 12;
/** Distance between the cursor and the card's right edge. */
const GAP = 40;
/** Fraction of the remaining distance the card covers each frame. */
const LERP = 0.15;
/** Backstop so a frame is never fully skipped on a slow pointer. */
const MAX_STEP = 44;

type BarState = { y: number; h: number; visible: boolean };

export interface ServiceRow {
  id: string;
  n: string;
  title: string;
  left: string;
  right: string;
  body: string;
  deliverablesLabel: string;
  deliverables: string[];
  stackLabel: string;
  stack: string[];
}

/** Reads an element's height so a sticky column can centre itself inside it. */
function useElementHeight<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [height, setHeight] = useState(0);
  const sync = useCallback(() => setHeight(ref.current?.offsetHeight ?? 0), [ref]);

  useEffect(() => {
    sync();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', sync);
      return () => window.removeEventListener('resize', sync);
    }
    const observer = new ResizeObserver(sync);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, sync]);

  return height;
}

/** Does this device have a hover-capable pointer, and does it want motion? */
function usePointerMode() {
  const [mode, setMode] = useState<'pointer' | 'touch'>('touch');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const wide = window.matchMedia('(min-width: 1024px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

    const read = () => {
      setMode(hover.matches && wide.matches && !calm.matches ? 'pointer' : 'touch');
    };

    read();
    hover.addEventListener('change', read);
    wide.addEventListener('change', read);
    calm.addEventListener('change', read);
    return () => {
      hover.removeEventListener('change', read);
      wide.removeEventListener('change', read);
      calm.removeEventListener('change', read);
    };
  }, []);

  return mode;
}

interface SpecCardProps {
  row: ServiceRow;
  /** Re-keys the wipe animation so it replays on every row change. */
  rowId: string;
}

/**
 * The preview card. It carries the same fields the accordion used to, read from
 * the row's real capability group.
 */
function SpecCard({ row, rowId }: SpecCardProps) {
  let slot = 1;
  const nextSlot = () => slot++;

  return (
    <div
      key={rowId}
      className="spec-in flex h-full flex-col p-5 text-ink"
      style={{ background: 'var(--surface)', borderRadius: 16 }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
          {row.n}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          In scope
        </p>
      </div>

      <p
        className="spec-row mt-3 text-base font-bold leading-snug tracking-tight text-ink"
        style={{ '--i': nextSlot() } as React.CSSProperties}
      >
        {row.title}
      </p>

      <p
        className="spec-row mt-2 text-[13px] leading-relaxed text-ink-soft"
        style={{ '--i': nextSlot() } as React.CSSProperties}
      >
        {row.body}
      </p>

      <div
        className="spec-row mt-auto border-t border-line pt-4"
        style={{ '--i': nextSlot() } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
          {row.deliverablesLabel}
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {row.deliverables.slice(0, 2).map((item) => (
            <li key={item} className="flex gap-2 text-[13px] leading-snug text-ink-soft">
              <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="spec-row mt-4 border-t border-line pt-3.5"
        style={{ '--i': nextSlot() } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
          {row.stackLabel}
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {row.stack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[10px] text-ink-soft"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface ServiceIndexProps {
  services: ServiceRow[];
}

export default function ServiceIndex({ services }: ServiceIndexProps) {
  const [active, setActive] = useState(0);
  const [bar, setBar] = useState<BarState>({ y: 0, h: 0, visible: false });

  const shellRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rowsRef = useRef<Array<HTMLLIElement | null>>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const goalRef = useRef({ x: -1, y: -1 });
  const posRef = useRef({ x: -1, y: -1 });
  const mode = usePointerMode();

  const columnsHeight = useElementHeight(columnsRef);
  const panelHeight = useElementHeight(panelRef);
  const activeRow = services[active] ?? services[0];

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /**
   * Drives the floating card. Reads pointer position from refs, writes CSS
   * variables on the card node, and parks itself when the goal is reached, so
   * a resting pointer costs nothing.
   */
  useEffect(() => {
    if (mode !== 'pointer') return;

    let raf = 0;

    const frame = () => {
      const node = cardRef.current;
      if (!node) {
        raf = window.requestAnimationFrame(frame);
        return;
      }

      const goal = goalRef.current;

      if (goal.x < 0) {
        posRef.current = { x: -1, y: -1 };
        node.style.opacity = '0';
        raf = window.requestAnimationFrame(frame);
        return;
      }

      // Seed from the goal on the first frame after arriving, so the card does
      // not fly in from the corner. Read back from the ref, never a stale copy.
      if (posRef.current.x < 0) posRef.current = { x: goal.x, y: goal.y };
      const dx = goal.x - posRef.current.x;
      const dy = goal.y - posRef.current.y;
      const step = Math.min(LERP, MAX_STEP / Math.max(1, Math.hypot(dx, dy)));
      const nx = posRef.current.x + dx * step;
      const ny = posRef.current.y + dy * step;
      posRef.current = { x: nx, y: ny };

      const rect = node.getBoundingClientRect();
      const baseX = Math.min(
        Math.max(12, nx),
        window.innerWidth - rect.width - 12
      );
      const baseY = Math.min(
        Math.max(12, ny),
        Math.max(12, window.innerHeight - rect.height - 12)
      );

      const tiltY = (baseX / window.innerWidth - 0.5) * TILT_MAX;
      const tiltX = -(baseY / window.innerHeight - 0.5) * TILT_MAX;

      node.style.opacity = '1';
      node.style.transform = `translate3d(${baseX}px, ${baseY}px, 0) perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

      if (Math.hypot(goal.x - posRef.current.x, goal.y - posRef.current.y) < 0.5) {
        raf = window.requestAnimationFrame(frame);
        return;
      }
      raf = window.requestAnimationFrame(frame);
    };

    raf = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(raf);
  }, [mode]);

  /** Tracks pointer position over the whole section, in viewport coordinates. */
  useEffect(() => {
    if (mode !== 'pointer') return;
    const shell = shellRef.current;
    if (!shell) return;

    const onMove = (event: PointerEvent) => {
      const node = cardRef.current;
      if (!node) return;
      const width = node.getBoundingClientRect().width;
      goalRef.current = {
        x: event.clientX - width - GAP,
        y: event.clientY - node.getBoundingClientRect().height / 2,
      };
    };

    const onLeave = () => {
      goalRef.current = { x: -1, y: -1 };
    };

    shell.addEventListener('pointermove', onMove);
    shell.addEventListener('pointerleave', onLeave);
    return () => {
      shell.removeEventListener('pointermove', onMove);
      shell.removeEventListener('pointerleave', onLeave);
    };
  }, [mode]);

  /**
   * Pins the bar to the active row and clamps it to the safe area above the
   * section heading, so a bottom row never parks it behind the sticky navbar.
   */
  useEffect(() => {
    const syncBar = () => {
      const row = rowsRef.current[activeRef.current];
      if (!row) return;
      const rowTop = row.offsetTop;
      const rowHeight = row.offsetHeight;
      const clampedTop = Math.min(rowTop, Math.max(0, rowTop + rowHeight - 520));
      setBar({
        y: clampedTop,
        h: Math.max(0, rowTop - clampedTop) + rowHeight,
        visible: true,
      });
    };

    syncBar();
    const frame = window.requestAnimationFrame(syncBar);

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', syncBar);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('resize', syncBar);
      };
    }

    const observer = new ResizeObserver(syncBar);
    if (listRef.current) observer.observe(listRef.current);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active, services]);

  const isPointerMode = mode === 'pointer';

  return (
    <div ref={shellRef} className="relative">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className={isPointerMode ? 'lg:col-span-12' : 'lg:col-span-7'}>
          <ul ref={listRef} className="relative border-t border-line">
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 rounded-2xl bg-ink transition-[top,height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                bar.visible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ top: `${bar.y}px`, height: `${bar.h}px` }}
            />

            {services.map((service, index) => {
              const isActive = index === active;
              const panelId = `spec-${service.id}`;

              return (
                <li
                  key={service.id}
                  ref={(node) => {
                    rowsRef.current[index] = node;
                  }}
                  className="relative border-b border-line"
                >
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={isPointerMode ? undefined : panelId}
                    onPointerEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className="flex min-h-[84px] w-full flex-col justify-center gap-1.5 px-4 py-4 text-left focus-visible:outline-none md:flex-row md:items-center md:gap-6 md:px-6"
                  >
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-500 md:w-44 md:shrink-0 ${
                        isActive ? 'text-accent-ink' : 'text-ink-faint'
                      }`}
                    >
                      {service.n}
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-8">
                      <span
                        className={`text-xl font-bold leading-snug tracking-tight transition-colors duration-500 sm:text-2xl ${
                          isActive ? 'text-accent-ink' : 'text-ink'
                        }`}
                      >
                        {service.title}
                      </span>
                      <span
                        className={`font-mono text-[11px] transition-colors duration-500 ${
                          isActive ? 'text-accent-ink/70' : 'text-ink-mute'
                        }`}
                      >
                        {service.right}
                      </span>
                    </span>
                  </button>

                  {/* Touch and narrow viewports only. */}
                  <div
                    id={panelId}
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:hidden ${
                      isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mx-4 mb-6 overflow-hidden rounded-2xl border border-line bg-surface-2 md:mx-6">
                        <SpecCard row={service} rowId={service.id} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Static column, shown when there is no pointer to follow the card. */}
        {!isPointerMode ? (
          <div
            ref={columnsRef}
            className="hidden lg:col-span-5 lg:block"
            style={{ minHeight: columnsHeight ? undefined : 520 }}
          >
            <div
              ref={panelRef}
              className="sticky top-24"
              style={
                columnsHeight && panelHeight
                  ? { minHeight: Math.max(0, columnsHeight - panelHeight) }
                  : undefined
              }
            >
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
                <SpecCard row={activeRow} rowId={activeRow.id} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        Not sure which layer you need?{' '}
        <a
          href="#contact"
          className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Tell us the problem
        </a>{' '}
        and we will map the system.
      </p>

      {isPointerMode ? (
        <div
          ref={cardRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[260px] opacity-0 transition-opacity duration-300 lg:block xl:w-[300px]"
          style={{ height: 340, willChange: 'transform' }}
        >
          <div className="h-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_32px_64px_-24px_rgba(0,0,0,0.45)]">
            <SpecCard row={activeRow} rowId={activeRow.id} />
          </div>
          <p className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
            {activeRow.left}
            <ArrowRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          </p>
        </div>
      ) : null}
    </div>
  );
}
