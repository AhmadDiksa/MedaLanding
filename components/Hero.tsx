'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { CLIENT_LOGOS } from '@/lib/data';
import Marquee from '@/components/primitives/Marquee';

const AUDIENCES = ['business', 'startup', 'teams', 'company'] as const;
const ROTATE_MS = 2600;

/** Max px a phone drifts toward the pointer. Kept small: this is a nudge, not a chase. */
const MAGNET_PULL = 18;

export default function Hero() {
  const [audience, setAudience] = React.useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  // Cycle the headline's last word. Skipped entirely under reduced motion,
  // where AUDIENCES[0] simply stays on screen.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setAudience((prev) => (prev + 1) % AUDIENCES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  /**
   * Magnetic drift: each phone leans a few px toward the pointer, with z-20
   * ShiftGenius leading and z-10 Waras trailing so the pair separates slightly
   * as it moves and reads as depth rather than one flat sheet.
   *
   * Written straight to CSS custom properties on the elements instead of React
   * state: pointermove fires ~60-120x/sec and a re-render per frame would
   * re-run the grid for a purely visual nudge.
   *
   * Disabled on coarse pointers (no hover) and under reduced motion. Both
   * checks are live listeners, so a window narrowed past the breakpoint or a
   * flipped OS setting takes effect without a reload.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const waras = stage.querySelector<HTMLElement>('[data-magnet="far"]');
    const shift = stage.querySelector<HTMLElement>('[data-magnet="near"]');
    if (!waras || !shift) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    // Peak drift is sampled across the phone pair itself, so the effect feels
    // equally strong at any viewport size rather than scaling with distance.
    const apply = () => {
      frame = 0;
      const box = stage.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const dx = (x - cx) / (box.width / 2 || 1);
      const dy = (y - cy) / (box.height / 2 || 1);
      waras.style.setProperty('--mx', `${dx * MAGNET_PULL * 0.55}px`);
      waras.style.setProperty('--my', `${dy * MAGNET_PULL * 0.55}px`);
      shift.style.setProperty('--mx', `${dx * MAGNET_PULL}px`);
      shift.style.setProperty('--my', `${dy * MAGNET_PULL}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (!fine.matches) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const el of [waras, shift]) {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      }
    };

    const sync = () => {
      if (!fine.matches || reduced.matches) reset();
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', reset);
    fine.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    sync();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', reset);
      fine.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden border-b border-line bg-page pt-2 sm:pt-4 md:pt-5 lg:pt-6 pb-0 md:pb-0">
      <div className="wrap relative z-20 flex flex-1 flex-col md:justify-center">
        <div className="grid gap-3 md:grid-cols-2 md:items-center md:gap-12">
          
          {/* LEFT: Text Content */}
          <div className="pt-2 pb-2 md:pt-0 md:pb-0">
            <h1
              className="hero-rise text-[2.5rem] font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.75rem]"
              style={{ '--hero-i': 0 } as React.CSSProperties}
            >
              <span className="block">Custom Software</span>
              <span className="block">
                that <em className="not-italic text-accent">fits</em> your
              </span>
              <span className="mt-1 flex items-center gap-3">
                <ArrowRight
                  className="h-6 w-6 shrink-0 text-accent sm:h-7 sm:w-7 lg:h-9 lg:w-9"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="grid leading-none">
                  {AUDIENCES.map((word, index) => (
                    <span
                      key={word}
                      aria-hidden={index !== audience}
                      className={`col-start-1 row-start-1 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                        index === audience ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p
              className="hero-rise mt-4 max-w-[36ch] text-base leading-relaxed text-ink-soft md:mt-5 md:text-lg"
              style={{ '--hero-i': 1 } as React.CSSProperties}
            >
              We make complicated things simple, then build the system around you. Web,
              mobile, data and infrastructure from one team.
            </p>

            <div
              className="hero-rise mt-6 flex flex-wrap items-center gap-3 md:mt-9"
              style={{ '--hero-i': 2 } as React.CSSProperties}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-hover"
              >
                Start a project
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center rounded-xl border border-line-strong bg-surface-2 px-5 py-3 text-sm font-semibold text-ink transition-colors duration-150 hover:border-ink"
              >
                See our work
              </a>
            </div>
          </div>

          {/* RIGHT: Two phones, side by side */}
          <div 
            className="hero-rise relative flex items-center justify-center md:justify-start md:pl-4 lg:pl-0"
            style={{ '--hero-i': 4 } as React.CSSProperties}
          >
            <div
              ref={stageRef}
              className="relative -ml-6 mr-6 mb-0 flex w-[calc(100%+3rem)] items-end justify-center md:mx-0 md:my-0 md:w-full md:justify-start"
            >

              {/* Waras Phone - tilted left, pivot at its base.
                  The magnet translate has to live in the same `transform` as the
                  tilt: Tailwind's `rotate-*` compiles to the standalone `rotate`
                  property, so a `translate` from a keyframe or utility would
                  override it and snap the phone upright. Keeping both here, and
                  animating them, means they compose instead of fighting. */}
              <div className="relative z-10 w-[44%] max-w-[230px] shrink-0 origin-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)] sm:w-[280px] sm:max-w-none md:w-[260px] lg:w-[360px] xl:w-[420px]">
                <div
                  data-magnet="far"
                  data-phone
                  data-tilt="-5"
                  className="phone-magnet -rotate-[4deg] sm:-rotate-[5deg]"
                >
                  <img 
                    src="/images/waras.png" 
                    alt="Waras App" 
                    className="w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
              </div>

              {/* ShiftGen Phone - offset down, spaced from Waras.
                  The negative margin sets how much the two phones overlap, so
                  lowering it opens the gap. Each value is capped by the column:
                  at md and lg the pair is already close to the column width, so
                  those breakpoints get the least separation and are left alone
                  where there is no room. `flex-start` means any excess spills
                  right, so the pair must stay inside the column at every width. */}
              <div className="relative z-20 -ml-[80px] w-[44%] max-w-[230px] shrink-0 drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] sm:-ml-[100px] sm:w-[280px] sm:max-w-none md:w-[260px] md:-ml-[220px] lg:w-[360px] lg:-ml-[280px] xl:-ml-[288px] xl:w-[420px]">
                <div data-magnet="near" data-phone data-tilt="0" className="phone-magnet">
                  <img 
                    src="/images/shiftgen.png" 
                    alt="ShiftGenius App" 
                    className="w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed trust strip: outside the grid so it spans the page, and
          after the flex-1 column so `mt-auto` settles it on the hero's bottom
          edge, keeping it visible on first paint at every viewport height. */}
      <div className="mt-auto border-t border-line md:pt-10">
        <Marquee label={'Working with\nteams at'} fullBleed />
      </div>
    </section>
  );
}
