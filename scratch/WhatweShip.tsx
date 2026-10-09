import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * ServiceIndex — Framer/standalone variant of the Services section.
 *
 * The production React port lives in components/primitives/ServiceIndex.tsx.
 * This file is the self-contained version: no Framer API, no `CodekilnKit`
 * import, no runtime font or stylesheet injection, and no `addPropertyControls`
 * block, so it compiles as an ordinary module and can be dropped into any
 * React tree.
 *
 * <ServicesIndex rows={MEDA_ROWS} />
 *
 * MEDA_ROWS mirrors lib/serviceRows.ts, which is what the live site renders.
 * Keep the two in step: titles, order and stack lines are user-approved copy.
 */

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export type Row = {
  /** Mono eyebrow: the offering line. */
  n: string;
  title: string;
  left: string;
  right: string;
  /** The spec panel's fields, rendered from the same capability record. */
  body: string;
  deliverablesLabel: string;
  deliverables: string[];
  stackLabel: string;
  stack: string[];
  link: string;
};

/**
 * Meda's five offering lines, in the order a system gets built. Names,
 * deliverables and stack lines come from lib/data.ts. Nothing here is invented:
 * the `left` / `right` slots are the index-row secondary lines, drawn from real
 * scope and stack, never from fabricated durations or SLAs.
 */
export const MEDA_ROWS: Row[] = [
  {
    n: '01 / Strategy',
    title: 'Product strategy',
    left: 'Requirements · Design & scope',
    right: 'Requirements · Design & scope',
    body: 'The requirements and design-and-scope stages, where we map users, workflows and priorities before any code is written.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'Requirements document and prioritised scope',
      'User and workflow maps',
      'Clickable mockups and a PRD',
    ],
    stackLabel: 'Covers',
    stack: ['Requirements', 'Design & scope', 'Handover'],
    link: '#contact',
  },
  {
    n: '02 / Web platforms',
    title: 'Web platforms',
    left: 'Web apps and dashboards',
    right: 'Next.js · TypeScript',
    body: 'Web apps, dashboards and internal tools that feel considered, fast and unmistakably yours.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'Business web apps and internal tools',
      'Customer portals and company websites',
      'Dashboards and reporting interfaces',
    ],
    stackLabel: 'Stack',
    stack: ['Next.js', 'TypeScript'],
    link: '#contact',
  },
  {
    n: '03 / Mobile apps',
    title: 'Mobile apps',
    left: 'Android and iOS from one codebase',
    right: 'Flutter',
    body: 'Android and iOS apps built from a single Flutter codebase, so both platforms ship together.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'Android and iOS apps from one Flutter codebase',
      'Offline-friendly field and ops apps',
      'Store submission and release setup',
    ],
    stackLabel: 'Stack',
    stack: ['Flutter'],
    link: '#contact',
  },
  {
    n: '04 / AI features',
    title: 'AI features',
    left: 'APIs, integrations and workflow rules',
    right: 'Go · C# · TypeScript',
    body: 'The backend surface any model-backed feature needs: services, integrations and permission models that keep generated output inside the rules of your system.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'REST APIs and third-party integrations',
      'Users, roles and permission models',
      'Workflows, billing and notification systems',
    ],
    stackLabel: 'Stack',
    stack: ['Go', 'C#', 'TypeScript'],
    link: '#contact',
  },
  {
    n: '05 / Cloud & DevOps',
    title: 'Cloud & DevOps',
    left: 'Environments, deploys and monitoring',
    right: 'Cloud · CI/CD',
    body: 'Cloud-ready environments, deployment and monitoring designed for resilience, so releases are routine rather than an event.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'Separate dev, staging and production setup',
      'Automated deployment pipelines',
      'Monitoring, alerting and scheduled backups',
    ],
    stackLabel: 'Stack',
    stack: ['Cloud', 'CI/CD'],
    link: '#contact',
  },
];

const PAPER = '#f8f8f7';
const PAPER_DARK = '#1a1916';
const INK = '#1c1b18';
const INK_DARK = '#edede9';
const ACCENT = '#d42903';
const ACCENT_DARK = '#ff613d';
const LINE = '#e2e0d8';
const LINE_DARK = '#37352f';
const MUTE = '#6f6a60';
const MUTE_DARK = '#a8a29a';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SANS =
  '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

/** Peak tilt in degrees, matching components/primitives/ServiceIndex.tsx. */
const TILT_MAX = 12;
/** Distance between the cursor and the card's right edge. */
const GAP = 40;
/** Fraction of the remaining distance the card covers each frame. */
const LERP = 0.15;
/** Backstop so a frame is never fully skipped on a slow pointer. */
const MAX_STEP = 44;

/** Reads the explicit theme class, falling back to the OS preference. */
function useTheme() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const explicit = root.classList.contains('dark')
        ? 'dark'
        : root.classList.contains('light')
          ? 'light'
          : null;
      if (explicit) return setMode(explicit);
      setMode(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      );
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', read);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', read);
    };
  }, []);

  const dark = mode === 'dark';
  return {
    dark,
    paper: dark ? PAPER_DARK : PAPER,
    ink: dark ? INK_DARK : INK,
    accent: dark ? ACCENT_DARK : ACCENT,
    line: dark ? LINE_DARK : LINE,
    mute: dark ? MUTE_DARK : MUTE,
  };
}

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

function Spec({ row, dark }: { row: Row; dark: boolean }) {
  const { paper, ink, accent, line, mute } = {
    paper: dark ? PAPER_DARK : PAPER,
    ink: dark ? INK_DARK : INK,
    accent: dark ? ACCENT_DARK : ACCENT,
    line: dark ? LINE_DARK : LINE,
    mute: dark ? MUTE_DARK : MUTE,
  };
  let slot = 1;
  const nextSlot = () => slot++;

  const block = (extra: React.CSSProperties): React.CSSProperties => ({
    animation: `spec-reveal .5s ${EASE} both`,
    animationDelay: `${nextSlot() * 55 + 60}ms`,
    ...extra,
  });

  return (
    <div
      style={{
        background: paper,
        border: `1px solid ${line}`,
        borderRadius: 16,
        padding: 26,
        color: ink,
      }}
    >
      <div key={row.n} className="spec-in">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 16,
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: mute }}>{row.n}</span>
          <span style={{ color: accent }}>In scope</span>
        </div>

        <p
          style={block({
            margin: '16px 0 0',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.35,
            letterSpacing: '-.01em',
          })}
        >
          {row.title}
        </p>

        <p
          style={block({
            margin: '12px 0 0',
            fontFamily: SANS,
            fontSize: 14,
            lineHeight: 1.65,
            color: mute,
          })}
        >
          {row.body}
        </p>

        <div style={block({ marginTop: 24, borderTop: `1px solid ${line}`, paddingTop: 20 })}>
          <p
            style={{
              margin: 0,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: mute,
            }}
          >
            {row.deliverablesLabel}
          </p>
          <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
            {row.deliverables.map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  gap: 10,
                  fontFamily: SANS,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: mute,
                  marginTop: 8,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ width: 12, height: 1, background: accent, marginTop: 9, flex: '0 0 auto' }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={block({ marginTop: 24, borderTop: `1px solid ${line}`, paddingTop: 20 })}>
          <p
            style={{
              margin: 0,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: mute,
            }}
          >
            {row.stackLabel}
          </p>
          <ul
            style={{
              margin: '12px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {row.stack.map((tech) => (
              <li
                key={tech}
                style={{
                  border: `1px solid ${line}`,
                  borderRadius: 99,
                  padding: '4px 12px',
                  fontFamily: MONO,
                  fontSize: 11,
                  color: mute,
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ServicesIndex({
  rows = MEDA_ROWS,
  kicker = 'Services',
  title = 'One team for every layer',
  lead = 'From the interface people use to the servers that keep it running, we design and build the whole system. No hand-offs between vendors.',
  footnote = 'Not sure which layer you need? Tell us the problem and we will map the system.',
}: {
  rows?: Row[];
  kicker?: string;
  title?: string;
  lead?: string;
  footnote?: string;
}) {
  const { dark, paper, ink, accent, line } = useTheme();
  const [active, setActive] = useState(0);

  const shellRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rowsRef = useRef<Array<HTMLLIElement | null>>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const goalRef = useRef({ x: -1, y: -1 });
  const posRef = useRef({ x: -1, y: -1 });
  const [pointer, setPointer] = useState(false);

  const activeRow = rows[active] ?? rows[0];

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /** Pointer capability is a media query, never a geolocation guess. */
  useEffect(() => {
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const wide = window.matchMedia('(min-width: 1024px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () =>
      setPointer(hover.matches && wide.matches && !calm.matches);
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

  /**
   * Drives the floating card. Position and tilt live in refs and are written
   * straight to the node's transform, so pointer movement never renders React.
   */
  useEffect(() => {
    if (!pointer) return;

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

      if (posRef.current.x < 0) posRef.current = { x: goal.x, y: goal.y };
      const dx = goal.x - posRef.current.x;
      const dy = goal.y - posRef.current.y;
      const step = Math.min(LERP, MAX_STEP / Math.max(1, Math.hypot(dx, dy)));
      const nx = posRef.current.x + dx * step;
      const ny = posRef.current.y + dy * step;
      posRef.current = { x: nx, y: ny };

      const rect = node.getBoundingClientRect();
      const baseX = Math.min(Math.max(12, nx), window.innerWidth - rect.width - 12);
      const baseY = Math.min(
        Math.max(12, ny),
        Math.max(12, window.innerHeight - rect.height - 12)
      );
      const tiltY = (baseX / window.innerWidth - 0.5) * TILT_MAX;
      const tiltX = -(baseY / window.innerHeight - 0.5) * TILT_MAX;

      node.style.opacity = '1';
      node.style.transform = `translate3d(${baseX}px, ${baseY}px, 0) perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      raf = window.requestAnimationFrame(frame);
    };

    raf = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(raf);
  }, [pointer]);

  useEffect(() => {
    if (!pointer) return;
    const shell = shellRef.current;
    if (!shell) return;

    const onMove = (event: PointerEvent) => {
      const node = cardRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      goalRef.current = {
        x: event.clientX - rect.width - GAP,
        y: event.clientY - rect.height / 2,
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
  }, [pointer]);

  /** The ink bar spans the active row and everything above it. */
  useEffect(() => {
    const sync = () => {
      const row = rowsRef.current[activeRef.current];
      if (!row) return;
      row.style.setProperty('--bar-h', `${row.offsetTop + row.offsetHeight}px`);
    };
    sync();
    const raf = window.requestAnimationFrame(sync);
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', sync);
      return () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener('resize', sync);
      };
    }
    const observer = new ResizeObserver(sync);
    if (listRef.current) observer.observe(listRef.current);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [active, rows]);

  return (
    <div ref={shellRef} className="si-shell">
      <style>{`
        .si-shell { position: relative; }
        .si-grid { display: grid; grid-template-columns: 1fr; gap: 32px; align-items: start; }
        @media (min-width: 64rem) { .si-grid { grid-template-columns: repeat(12, 1fr); gap: 40px; } }
        .si-list { position: relative; margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--si-line); }
        .si-bar {
          position: absolute; inset-inline: 0; top: 0; border-radius: 16px;
          background: var(--si-ink); pointer-events: none;
          height: var(--bar-h, 0px);
          transition: height .5s ${EASE}, opacity .5s ${EASE};
        }
        .si-row { position: relative; border-bottom: 1px solid var(--si-line); }
        .si-btn {
          display: flex; width: 100%; min-height: 84px; flex-direction: column;
          justify-content: center; gap: 6px; padding: 16px; text-align: left;
          background: none; border: 0; cursor: pointer; font: inherit;
        }
        @media (min-width: 48rem) {
          .si-btn { flex-direction: row; align-items: center; gap: 24px; padding-inline: 24px; }
        }
        .si-n {
          font-family: ${MONO}; font-size: 11px; text-transform: uppercase;
          letter-spacing: .16em; transition: color .5s ${EASE};
        }
        @media (min-width: 48rem) { .si-n { width: 176px; flex: 0 0 auto; } }
        .si-title {
          font-family: ${SANS}; font-size: 1.25rem; font-weight: 700;
          line-height: 1.35; letter-spacing: -.01em; transition: color .5s ${EASE};
        }
        @media (min-width: 40rem) { .si-title { font-size: 1.5rem; } }
        .si-right {
          font-family: ${MONO}; font-size: 11px; transition: color .5s ${EASE};
        }
        .si-row[data-active='true'] .si-n,
        .si-row[data-active='true'] .si-title { color: var(--si-accent-ink, ${ink}); }
        .si-row[data-active='true'] .si-right { color: var(--si-accent-ink-mute, ${ink}); }
        .si-row[data-active='false'] .si-n { color: ${MUTE}; }
        .si-row[data-active='false'] .si-title { color: var(--si-ink); }
        .si-row[data-active='false'] .si-right { color: ${MUTE}; }
        .si-columns { display: none; }
        @media (min-width: 64rem) { .si-columns { display: block; grid-column: span 5; } }
        .si-columns-inner { position: sticky; top: 6rem; }
        .si-collapse {
          display: grid; overflow: hidden;
          transition: grid-template-rows .5s ${EASE};
        }
        @media (min-width: 64rem) { .si-collapse { display: none; } }
        .si-card {
          position: fixed; left: 0; top: 0; z-index: 30; width: 260px;
          pointer-events: none; opacity: 0; transition: opacity .3s ${EASE};
        }
        @media (min-width: 80rem) { .si-card { width: 300px; } }
        .si-card-frame {
          overflow: hidden; border-radius: 16px; border: 1px solid var(--si-line);
          background: var(--si-paper);
          box-shadow: 0 32px 64px -24px rgb(0 0 0 / .45);
        }
        .si-foot { margin-top: 32px; font-family: ${SANS}; font-size: 14px; color: ${MUTE}; }
        .si-foot a { color: var(--si-accent); font-weight: 600; }
        @keyframes spec-reveal { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .si-bar, .si-collapse, .si-card, .si-n, .si-title, .si-right { transition: none; }
          .spec-row, .spec-in { animation: none !important; }
        }
      `}</style>

      <div
        ref={shellRef}
        style={
          {
            '--si-line': line,
            '--si-ink': ink,
            '--si-paper': paper,
            '--si-accent': accent,
          } as React.CSSProperties
        }
      >
        <div className="si-grid">
          <div style={{ gridColumn: pointer ? 'span 12' : undefined }}>
            <ul ref={listRef} className="si-list">
              <div className="si-bar" aria-hidden="true" />

              {rows.map((row, index) => {
                const isActive = index === active;
                const panelId = `si-spec-${index}`;
                return (
                  <li
                    key={row.n}
                    ref={(node) => {
                      rowsRef.current[index] = node;
                    }}
                    className="si-row"
                    data-active={isActive}
                  >
                    <button
                      type="button"
                      className="si-btn"
                      aria-expanded={isActive}
                      aria-controls={pointer ? undefined : panelId}
                      onPointerEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setActive(index)}
                    >
                      <span className="si-n">{row.n}</span>
                      <span
                        style={{
                          display: 'flex',
                          minWidth: 0,
                          flex: 1,
                          flexDirection: 'column',
                          gap: 4,
                        }}
                      >
                        <span className="si-title">{row.title}</span>
                        <span className="si-right">{row.right}</span>
                      </span>
                    </button>

                    {!pointer ? (
                      <div
                        id={panelId}
                        className="si-collapse"
                        style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 16px 24px' }}>
                            <Spec row={row} dark={dark} />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {!pointer ? (
            <div className="si-columns">
              <div className="si-columns-inner">
                <Spec row={activeRow} dark={dark} />
              </div>
            </div>
          ) : null}
        </div>

        <p className="si-foot">
          {footnote}{' '}
          <a href="#contact">Tell us the problem</a>
        </p>

        {pointer ? (
          <div ref={cardRef} className="si-card" aria-hidden="true" style={{ height: 340 }}>
            <div className="si-card-frame">
              <Spec row={activeRow} dark={dark} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ServicesIndex;
