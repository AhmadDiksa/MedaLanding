'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowDown } from 'lucide-react';
import {
  ARCHITECTURE_LAYERS,
  SECTION_HEIGHT,
  SLAB_GAP,
  SLAB_WIDTH,
  SYSTEM_FOOTER,
  type ArchitectureLayer,
  type LayerTone,
} from '@/lib/architecture';

/**
 * ArchitectureSection: a sticky stage holds one real 3D scene built from CSS
 * boxes, and scrolling moves a camera through a scripted storyboard. Empty
 * planes fly in as a dashboard, the dashboard drops into a monitor that
 * assembles around it, the whole rig turns to a three-quarter view, and the
 * layers underneath fan apart into the five parts of a system.
 *
 * The 3D is genuine: a `perspective` scene contains a `preserve-3d` world, the
 * monitor is made of six positioned faces plus a neck and a deck, and the five
 * slab planes share one transform driven by their index, so they cannot drift
 * out of alignment with each other.
 *
 * The scroll engine is the page's own scroll position, read inside a rAF and
 * written straight to CSS custom properties. Nothing is measured per frame, no
 * React state changes per frame, and the listener is attached only while the
 * section is on screen, so a 60fps scrub never re-renders the tree and never
 * forces layout.
 *
 * The scroll position is not hijacked: the listener only ever reads it.
 */

/**
 * Whether the reader has asked for reduced motion. An external-store
 * subscription rather than a snapshot, so toggling the OS setting while the
 * page is open swaps the animated composition for the static one without a
 * reload.
 */
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}

/** Writes one CSS custom property on a node, or leaves the DOM alone if unchanged. */
function setVar(node: HTMLElement, name: string, value: string) {
  if (node.style.getPropertyValue(name) !== value) {
    node.style.setProperty(name, value);
  }
}

/** Maps [from, to] onto 0..1, clamped at both ends. */
function range(p: number, from: number, to: number) {
  const t = (p - from) / (to - from);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** Smoothstep. The storyboard's beats ease in and out instead of snapping. */
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** `range` with smoothstep easing folded in, which is how every beat is timed. */
function seg(p: number, from: number, to: number) {
  return smooth(range(p, from, to));
}

/**
 * How quickly the drawn value chases the scroll position, per frame. This is
 * the reference demo's own damping: the rig keeps moving for a moment after
 * the wheel stops, instead of tracking the scrollbar exactly.
 */
const EASE = 0.07;

/**
 * The storyboard, as progress points, taken verbatim from the reference demo.
 * Every beat is expressed as a window over the section's own scroll range, so
 * the whole thing is reversible by construction: scrubbing back up runs each
 * `seg` in reverse and lands on the same values.
 *
 * `l1` is the monitor's screen, which also has to open before the four slabs
 * beneath it can be seen, so its window starts with the tilt rather than after
 * it.
 */
const BEAT = {
  /** Empty planes fly together into a dashboard. */
  ui: { from: 0, to: 0.2 },
  /** The monitor hardware builds itself around the finished dashboard. */
  mon: { from: 0.2, to: 0.34 },
  /** The whole rig turns to the exploded three-quarter view. */
  tilt: { from: 0.34, to: 0.44 },
  /** Layer n opens. Windows are 0.07 long and start 0.09 apart. */
  l1: { from: 0.44, to: 0.51 },
  l2: { from: 0.53, to: 0.6 },
  l3: { from: 0.62, to: 0.69 },
  l4: { from: 0.71, to: 0.78 },
  l5: { from: 0.8, to: 0.87 },
  /** The finished rig takes the accent. */
  fin: { from: 0.88, to: 1 },
} as const;

/** The four beats named in the legend, with the progress each one ends at. */
const PHASES = [
  { label: 'Assembling the interface', end: BEAT.mon.from },
  { label: 'Docking into the monitor', end: BEAT.tilt.from },
  { label: 'Separating the layers', end: BEAT.l5.to },
  { label: 'Complete architecture', end: 1 },
] as const;

/**
 * Board chrome, drawn inside the monitor's screen once the dashboard lands:
 * a fake window header, three headline figures and a twelve-week chart. It is
 * the same board the flying tiles assemble into, at a size that reads from
 * across the room, and it is hidden from assistive technology twice over —
 * here and by the `aria-hidden` scene around it.
 */
const CHART_BARS = [38, 52, 44, 61, 49, 57, 46, 68, 59, 74, 66, 88];

const KPI = [
  { value: '128', label: 'orders today', delay: '1' },
  { value: '94%', label: 'on time', delay: '1.5' },
  { value: '$42k', label: 'settled', delay: '2' },
] as const;

/** Three hairline marks stand in for a window chrome; no literal traffic lights. */
const CHROME_MARKS = [0, 1, 2] as const;

/** Layer tone. Lime marks the presentation layer; the rest step down through ink. */
const TONE_FILL: Record<LayerTone, string> = {
  accent: '#c9f24d',
  ink: 'rgba(28,27,24,0.42)',
  mute: 'rgba(28,27,24,0.2)',
};

/**
 * The monitor, as hardware rather than a picture: a lid with a front, a back
 * and four edge faces, a neck, and a deck. Each face is a separate element
 * because a CSS border cannot have depth — the 18px the lid is thick has to
 * come from a rotated slab, and that is what makes the rig turn convincingly
 * when the world tilts.
 *
 * Every piece carries `arch-hw`, whose opacity is the monitor's own progress,
 * so the hardware builds itself out of nothing without a second timeline.
 */
function MonitorHardware() {
  return (
    <>
      <div className="arch-lid">
        <div className="arch-hw arch-lid-front" />
        <div className="arch-hw arch-lid-back" />
        <i className="arch-hw arch-edge arch-edge-l" />
        <i className="arch-hw arch-edge arch-edge-r" />
        <i className="arch-hw arch-edge arch-edge-t" />
        <i className="arch-hw arch-edge arch-edge-b" />
      </div>

      <div className="arch-neck">
        <i className="arch-hw arch-neck-front" />
        <i className="arch-hw arch-neck-l" />
        <i className="arch-hw arch-neck-r" />
      </div>

      <div className="arch-deck">
        <div className="arch-hw arch-deck-top" />
        <div className="arch-hw arch-deck-bot" />
        <i className="arch-hw arch-deck-front" />
        <i className="arch-hw arch-deck-l" />
        <i className="arch-hw arch-deck-r" />
      </div>
    </>
  );
}

/**
 * The dashboard, drawn inside the monitor's screen: window chrome, three
 * headline figures and a chart. Each piece has its own `--d` delay, so the
 * board fills in a beat behind the surface it sits on rather than appearing
 * whole.
 */
function BoardChrome() {
  return (
    <div className="arch-inner arch-board">
      <div className="arch-piece arch-chrome" style={{ '--d': '0' } as React.CSSProperties}>
        <span className="arch-marks">
          {CHROME_MARKS.map((mark) => (
            <i key={mark} />
          ))}
        </span>
        <span className="arch-url">app.meda.technology · operations</span>
        <span className="arch-live">
          <i />
          LIVE
        </span>
      </div>

      <div className="arch-board-main">
        <div className="arch-kpis">
          {KPI.map((item) => (
            <div
              key={item.value}
              className="arch-piece arch-kpi"
              style={{ '--d': item.delay } as React.CSSProperties}
            >
              <b>{item.value}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="arch-piece arch-chart" style={{ '--d': '3' } as React.CSSProperties}>
          {CHART_BARS.map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * One slab of the stack, and its label.
 *
 * The slab draws the layer's own chips while the stack is closed, so every
 * plane reads as a different part of the same system instead of a copy of the
 * one in front of it; the monitor's own slab instead carries the board.
 *
 * The label is a lime speech bubble billboarded to face the reader: it
 * counter-rotates by the world's tilt, so it stays upright and legible at every
 * angle, and it is pinned to its slab by a leader line and a dot. Labels and
 * dots fade in only after their layer is more than half open, and fade out
 * again the moment the next layer starts opening, which keeps at most two on
 * screen and stops them overlapping.
 *
 * `--i` is the slab's index and `--l` its own progress; those two plus
 * `--nx`, the next layer's progress, are the only per-slab values, and all of
 * them are written from the scroll loop.
 */
function Slab({ layer, position }: { layer: ArchitectureLayer; position: number }) {
  return (
    <div
      data-plane
      className="arch-plane"
      style={{ '--i': position + 1 } as React.CSSProperties}
    >
      <div className="arch-glass" />
      <div className="arch-inner arch-wire">
        {layer.chips.map((chip, index) => (
          <span
            key={chip}
            className={index === layer.hot ? 'arch-chip arch-chip-hot' : 'arch-chip'}
          >
            {chip}
          </span>
        ))}
      </div>

      <i data-pin className="arch-pin" />

      <div data-label className="arch-label">
        <span className="arch-label-name">
          <span className="arch-badge">{layer.n}</span>
          <span className="arch-label-long">{layer.name}</span>
          <span className="arch-label-short">{layer.short}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * The scene, in the section's own palette. Nothing here reaches outside
 * `.arch-scope`: the page keeps its vermilion accent and stone neutrals, and
 * this section brings its own warm white, lime highlight and hardware greys.
 *
 * The geometry is all derived from three numbers — slab width, slab gap and
 * deck depth — so the whole rig rescales from the responsive overrides at the
 * bottom without any element being measured in JavaScript.
 */
const SCOPE = `
.arch-scope {
  --arch-page: #f7f7f5;
  --arch-ink: #1c1b18;
  --arch-muted: rgba(28, 27, 24, 0.62);
  --arch-line: rgba(28, 27, 24, 0.09);
  --arch-lime: #c9f24d;
  --arch-lime-soft: #dbe98a;
  --arch-lime-ink: #3f6b00;
  background-color: var(--arch-page);
  color: var(--arch-ink);
  color-scheme: light;
  background-image:
    radial-gradient(110% 70% at 12% -8%, rgba(201, 242, 77, 0.18), transparent 60%),
    radial-gradient(90% 70% at 92% 6%, rgba(255, 255, 255, 0.92), transparent 62%),
    linear-gradient(180deg, #ffffff 0%, #f7f7f5 44%, #f1f1ee 100%);
}

/* The rig. Every distance below is either a literal in one unit or derived
   from the three that describe it: slab width, slab gap, deck depth. */
.arch-root {
  --pw: ${SLAB_WIDTH};
  --gap: ${SLAB_GAP};
  --k: 0.74;
  --cy: 52%;
  --cx: 0px;
  --lh: 30px;
  --dz: calc(var(--gap) * -1);
  --front: calc(var(--gap) * 0.8);
  --deck-d: calc(var(--pw) * 0.28);
  --dx: 0px;
  --tilt-y-target: -48deg;
}

.arch-stage {
  --ui: 0;
  --mon: 0;
  --tilt: 0;
  --l1: 0;
  --l2: 0;
  --l3: 0;
  --l4: 0;
  --l5: 0;
  --fin: 0;
  --sum: calc(var(--l2) + var(--l3) + var(--l4) + var(--l5));
  --cam-x: calc(var(--sum) * var(--gap) * var(--k) * -0.5 + var(--cx));
  /* A shallow tip only. The board carries a chrome strip, a KPI row and a
     labelled chart, and a steep rotateX foreshortens it enough that the top
     row runs out of the glass. */
  --tilt-x: calc(var(--mon) * -4deg);
  --tilt-y: calc(var(--tilt) * var(--tilt-y-target) + (1 - var(--tilt)) * var(--mon) * -8deg);
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  background-color: var(--arch-page);
  background-image:
    radial-gradient(55% 45% at 30% 62%, rgba(201, 242, 77, 0.16), transparent 70%),
    radial-gradient(rgba(28, 27, 24, 0.07) 1px, transparent 1.2px);
  background-size: auto, 24px 24px;
}

.arch-scene {
  position: absolute;
  inset: 0;
  perspective: 2200px;
  perspective-origin: 50% var(--cy);
}

/* A zero-size anchor at the camera's origin. Everything is positioned relative
   to it, which is what keeps the composition centred as the world slides. The
   camera tips back as the monitor assembles, then swings to a three-quarter
   view as the layers separate, so the slabs are seen edge-on rather than flat. */
.arch-world {
  position: absolute;
  left: 50%;
  top: var(--cy);
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform: translate(var(--cam-x), 0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  will-change: transform;
}

/* One rule for all five slabs: they differ only by index and by their own
   progress. The 4l(1-l) term is a bulge that peaks halfway through the travel,
   so the slabs fan past each other on the way out and settle back into a
   straight stack at rest. */
.arch-plane {
  position: absolute;
  width: var(--pw);
  height: calc(var(--pw) * 0.625);
  left: calc(var(--pw) / -2);
  top: calc(var(--pw) * -0.3125);
  transform-style: preserve-3d;
  /* Slabs separate along depth alone; the world's rotateY turns that depth
     into the horizontal fan the reader sees. The 4l(1-l) term is a bulge that
     peaks halfway through the travel, so a slab swings forward on its way out
     and settles back into the stack. */
  transform: translate3d(
    calc((var(--i) - 1) * var(--l, 0) * var(--dx, 0px)),
    0,
    calc((var(--i) - 1) * var(--dz) + 4 * var(--l, 0) * (1 - var(--l, 0)) * ((var(--i) - 1) * var(--gap) + var(--front)))
  );
}

/* The monitor's own slab is the world; it never travels. Its tilt is the
   world's tilt, so the picture it holds ends up flat-on to the reader. */
.arch-plane-1 {
  transform: none;
}

.arch-glass {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.55));
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    0 0 0 1px rgba(28, 27, 24, 0.08),
    0 1px 2px rgba(28, 27, 24, 0.05),
    0 28px 56px -28px rgba(28, 27, 24, 0.38),
    inset 0 1px 0 #fff;
}

/* The accent ring that marks the finished composition. */
.arch-glass::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 18px;
  border: 1px solid rgba(201, 242, 77, 0.75);
  box-shadow: 0 0 28px -4px rgba(201, 242, 77, 0.5);
  opacity: var(--fin);
}

/* Slabs behind the monitor are seen through the rig, so they read as thin glass
   sheets rather than solid panels. */
.arch-plane:not(.arch-plane-1) .arch-glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.06) 55%, rgba(255, 255, 255, 0.24));
  box-shadow:
    0 0 0 1px rgba(28, 27, 24, 0.12),
    0 26px 40px -28px rgba(28, 27, 24, 0.3);
}

.arch-plane-1 .arch-glass {
  background: #fff;
  opacity: calc(0.35 + 0.65 * var(--mon));
}

/* The board is assembled by the ui beat, which finishes before the lid closes,
   so it is already lit when the lid opens over it. Gating it on the layer beat
   as well would leave a full viewport of scroll with a shut, empty monitor. */
.arch-plane-1 .arch-board {
  opacity: var(--ui);
}

.arch-inner {
  position: absolute;
  inset: 0;
  padding: 5%;
  display: grid;
  gap: 3.5%;
}

/* Slabs behind the monitor fade in with their own progress. */
.arch-plane:not(.arch-plane-1) .arch-glass,
.arch-plane:not(.arch-plane-1) .arch-inner {
  opacity: clamp(0, calc(var(--l) * 5), 1);
}

/* The monitor, as slabs. .arch-lid is the lid face itself; the four edges are
   rotated around its perimeter to give it thickness. */
.arch-hw {
  opacity: var(--mon);
}

.arch-lid {
  position: absolute;
  inset: -7px;
  transform-style: preserve-3d;
  /* The world carries the tilt; the lid must not apply it a second time or the
     bezel tips away from the screen it is meant to frame. */
  transform: translateZ(-1px);
}

.arch-lid-front,
.arch-lid-back {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 1px solid rgba(28, 27, 24, 0.08);
}

.arch-lid-front {
  background: linear-gradient(160deg, #4a4640, #23211e);
}

.arch-lid-back {
  transform: translateZ(-18px);
  background: linear-gradient(145deg, #efeeea, #cdccc6);
  border-color: rgba(28, 27, 24, 0.22);
}

.arch-edge {
  position: absolute;
  background: linear-gradient(90deg, #b3b1aa, #efeeea, #b3b1aa);
}

.arch-edge-l,
.arch-edge-r {
  top: 0;
  width: 18px;
  height: 100%;
  transform-origin: 0 50%;
  transform: rotateY(90deg);
}

.arch-edge-l { left: 0; }
.arch-edge-r { left: 100%; }

.arch-edge-t,
.arch-edge-b {
  left: 0;
  width: 100%;
  height: 18px;
  transform-origin: 50% 0;
  transform: rotateX(-90deg);
}

.arch-edge-t { top: 0; }
.arch-edge-b { top: 100%; }

.arch-neck {
  position: absolute;
  left: calc(50% - var(--pw) * 0.06);
  top: calc(100% + 4px);
  width: calc(var(--pw) * 0.12);
  height: calc(var(--pw) * 0.2);
  transform-style: preserve-3d;
  transform: translateZ(-9px);
}

.arch-neck-front {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #c8c6c0, #f4f3f0, #c8c6c0);
}

.arch-neck-l,
.arch-neck-r {
  position: absolute;
  top: 0;
  width: 12px;
  height: 100%;
  transform-origin: 0 50%;
  transform: rotateY(90deg);
  background: linear-gradient(90deg, #b3b1aa, #e2e1dc);
}

.arch-neck-l { left: 0; }
.arch-neck-r { left: 100%; }

.arch-deck {
  position: absolute;
  left: calc(50% - var(--pw) * 0.19);
  top: calc(100% + var(--pw) * 0.2);
  width: calc(var(--pw) * 0.38);
  height: 0;
  transform-style: preserve-3d;
  transform: translateZ(calc(var(--deck-d) * -0.5 - 9px));
}

.arch-deck-top,
.arch-deck-bot {
  position: absolute;
  left: 0;
  width: 100%;
  height: var(--deck-d);
  transform-origin: 0 0;
  transform: rotateX(90deg);
  border-radius: 18px;
}

.arch-deck-top {
  top: 0;
  background: linear-gradient(180deg, #f4f3f0, #e2e1dc);
  border: 1px solid rgba(28, 27, 24, 0.22);
}

.arch-deck-bot {
  top: 10px;
  background: #a09e98;
}

.arch-deck-front {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 10px;
  border-radius: 0 0 8px 8px;
  background: linear-gradient(#d7d5d0, #aeaca6);
  transform: translateZ(var(--deck-d));
}

.arch-deck-l,
.arch-deck-r {
  position: absolute;
  top: 0;
  width: var(--deck-d);
  height: 10px;
  transform-origin: 0 0;
  transform: rotateY(-90deg);
  background: linear-gradient(90deg, #b3b1aa, #e2e1dc);
}

.arch-deck-l { left: 0; }
.arch-deck-r { left: 100%; }

/* The board inside the screen. */
.arch-board {
  grid-template-rows: auto 1fr;
}

.arch-piece {
  --u: clamp(0, calc(var(--ui) * 8 - var(--d, 0)), 1);
  opacity: var(--u);
  transform: translateY(calc((1 - var(--u)) * 22px));
}

.arch-chrome {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 2px 10px;
  border-bottom: 1px solid var(--arch-line);
}

.arch-marks {
  display: flex;
  gap: 6px;
}

.arch-marks i {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(28, 27, 24, 0.14);
}

.arch-url {
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(28, 27, 24, 0.05);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--arch-muted);
}

.arch-live {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--arch-muted);
}

.arch-live i {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--arch-lime);
}

.arch-board-main {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 4%;
  min-width: 0;
}

.arch-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4%;
}

.arch-kpi {
  padding: 8px 10px;
  display: grid;
  gap: 3px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--arch-line);
  border-radius: 14px;
  box-shadow: 0 6px 14px -10px rgba(28, 27, 24, 0.3);
}

.arch-kpi b {
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: clamp(0.7rem, 1.2vw, 1rem);
}

.arch-kpi span {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(28, 27, 24, 0.45);
}

.arch-chart {
  display: flex;
  align-items: flex-end;
  gap: 6%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--arch-line);
  border-radius: 14px;
  box-shadow: 0 6px 14px -10px rgba(28, 27, 24, 0.3);
}

.arch-chart span {
  flex: 1;
  background: rgba(28, 27, 24, 0.14);
  border-radius: 7px 7px 3px 3px;
}

.arch-chart span:nth-child(4) {
  background: linear-gradient(var(--arch-lime-soft), var(--arch-lime));
  box-shadow: 0 0 16px -2px rgba(201, 242, 77, 0.7);
}

/* Chips: what a layer shows while the stack is closed. */
.arch-wire {
  grid-template-columns: repeat(3, 1fr);
  align-content: center;
}

.arch-chip {
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: -0.01em;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(28, 27, 24, 0.12);
  box-shadow: 0 4px 10px -8px rgba(28, 27, 24, 0.4);
  padding: 8px 6px;
  font-size: clamp(0.5rem, 0.9vw, 0.75rem);
  text-align: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--arch-muted);
}

.arch-chip-hot {
  background: linear-gradient(180deg, #e8faa0, var(--arch-lime));
  border-color: rgba(63, 107, 0, 0.35);
  color: var(--arch-lime-ink);
  box-shadow: 0 0 18px -4px rgba(201, 242, 77, 0.65);
}

/* Labels: a speech bubble billboarded to the reader, pinned to its slab. The
   anchor is a fraction of the slab's width so the bubble sits inboard of the
   fan's right edge, which is what keeps the outermost layer on screen.
   The bubble is pushed back out of its slab's depth before it is placed, so it
   is laid out at the projection of the slab's own plane rather than inside the
   foreshortening. Without that the far slabs, whose boxes are shorter and
   higher than the near ones, would stagger the labels along with them. */
.arch-label {
  position: absolute;
  left: calc(100% - var(--pw) * 0.34);
  bottom: calc(100% + var(--lh));
  translate: 0 0 calc(-1 * ((var(--i) - 1) * var(--dz) + 4 * var(--l, 0) * (1 - var(--l, 0)) * ((var(--i) - 1) * var(--gap) + var(--front))));
  white-space: nowrap;
  opacity: calc(clamp(0, calc((var(--l, 0) - 0.5) * 3), 1) * (1 - clamp(0, calc(var(--nx, 1) * 5), 1)));
  transform-origin: 0 100%;
  transform: rotateY(calc(-1 * var(--tilt-y, 0deg))) rotateX(calc(-1 * var(--tilt-x, 0deg)));
  padding: 0.42rem 0.85rem 0.42rem 0.45rem;
  border-radius: 999px;
  background: var(--arch-lime);
  color: var(--arch-lime-ink);
  font-size: 0.8rem;
  box-shadow: 0 14px 26px -14px rgba(63, 107, 0, 0.55);
}

.arch-label::after {
  content: "";
  position: absolute;
  left: 18px;
  top: 100%;
  border: 7px solid transparent;
  border-top-color: var(--arch-lime);
  border-bottom: 0;
}

.arch-label::before {
  content: "";
  position: absolute;
  left: 24px;
  top: calc(100% + 6px);
  height: calc(var(--lh) + var(--pw) * 0.06 - 6px);
  border-left: 1.5px solid var(--arch-lime-ink);
}

.arch-pin {
  position: absolute;
  left: calc(100% - var(--pw) * 0.34 + 17px);
  top: calc(var(--pw) * 0.06 - 7px);
  translate: 0 0 calc(-1 * ((var(--i) - 1) * var(--dz) + 4 * var(--l, 0) * (1 - var(--l, 0)) * ((var(--i) - 1) * var(--gap) + var(--front))));
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--arch-lime-ink);
  box-shadow: 0 0 0 4px rgba(201, 242, 77, 0.35);
  opacity: calc(clamp(0, calc((var(--l, 0) - 0.5) * 3), 1) * (1 - clamp(0, calc(var(--nx, 1) * 5), 1)));
}

.arch-label-name {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  font-weight: 600;
  letter-spacing: -0.015em;
  font-size: 0.82rem;
}

.arch-badge {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  background: var(--arch-lime-ink);
  color: #eef9c8;
  font-size: 0.72rem;
  font-weight: 700;
}

/* The full layer name is the label everywhere the fan is wide enough to hold
   it; the short form takes over in the narrow breakpoint below. */
.arch-label-short {
  display: none;
}

/* The copy column rides above the scene, so the scene needs no z-index of its
   own and the section keeps one stacking context. */
.arch-desc {
  box-sizing: border-box;
  min-height: 100svh;
  padding-top: 22svh;
  padding-bottom: 14svh;
  pointer-events: none;
}

.arch-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Below lg the five slabs no longer fit side by side at full size, so the
   fan narrows; the section is also taller on the smallest screens, because the
   same beats have to cover more travel. */
@media (max-width: 1023px) {
  .arch-scope {
    --pw: 38vw;
    --gap: 13vw;
  }
}

@media (max-width: 700px) {
  .arch-scope {
    --pw: 50vw;
    --gap: 11vw;
    --k: 0.64;
    --tilt-y-target: -40deg;
    --cy: 50%;
    --lh: 22px;
    --front: 34px;
  }
  .arch-label {
    padding: 0.2rem 0.42rem 0.2rem 0.24rem;
    font-size: 0.56rem;
    letter-spacing: -0.01em;
    /* Keeps the bubble a hair clear of the viewport edge when its slab is the
       rightmost one in the fan. */
    left: calc(100% - 3px);
  }
  .arch-label-name {
    font-size: 0.6rem;
    gap: 0.26rem;
  }
  .arch-label-long {
    display: none;
  }
  .arch-label-short {
    display: inline;
  }
  .arch-badge {
    width: 0.95rem;
    height: 0.95rem;
    font-size: 0.5rem;
  }
  /* Three chips do not fit across a phone-sized slab without truncating. */
  .arch-wire .arch-chip:nth-child(n + 4) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .arch-root {
    height: auto;
  }
  .arch-stage {
    position: relative;
    height: max(100svh, 680px);
    --nx: 0;
    --ui: 1;
    --mon: 1;
    --tilt: 1;
    --l1: 1;
    --l2: 1;
    --l3: 1;
    --l4: 1;
    --l5: 1;
    --fin: 1;
  }
  .arch-label,
  .arch-pin {
    opacity: 1 !important;
  }
}
`;

/**
 * Reduced motion: no scene, no scroll maths, no monitor. The same five layers
 * render as cards with their names, bodies and chips, so a reader who never
 * sees an animation still gets the architecture and the sentence that explains
 * it. The section also collapses from a long scroll track to its own height,
 * because there is nothing left to scrub.
 */
function StaticComposition() {
  return (
    <section
      id="system"
      aria-labelledby="system-title-static"
      className="arch-scope relative border-t border-line py-20 md:py-28"
    >
      <style>{SCOPE}</style>
      <div className="wrap">
        <header className="max-w-[62ch]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgba(28,27,24,0.5)]">
            05 / How we build
          </p>
          <h2
            id="system-title-static"
            className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
          >
            One system, five layers that have to fit.
          </h2>
          <p className="prose-body mt-4 text-[15px] text-[rgba(28,27,24,0.62)] md:text-base">
            Every system we build is these five layers, from the interface the
            reader touches down to the infrastructure that serves it.
          </p>
        </header>

        <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <li key={layer.id}>
              <div
                className="h-full rounded-2xl border border-[rgba(28,27,24,0.1)] p-4 backdrop-blur-[10px]"
                style={{ background: 'rgba(255,255,255,0.72)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[rgba(28,27,24,0.45)]">
                    Layer {layer.n}
                  </p>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: TONE_FILL[layer.tone] }}
                  />
                </div>
                <h3 className="mt-2 text-[15px] font-bold leading-snug tracking-tight text-[#1c1b18]">
                  {layer.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[rgba(28,27,24,0.62)]">
                  {layer.body}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {layer.chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-[rgba(28,27,24,0.14)] px-2 py-0.5 font-mono text-[10px] text-[rgba(28,27,24,0.6)]"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-[rgba(28,27,24,0.58)]">
          A request travels from the presentation layer down to the
          infrastructure that serves it; data travels back up the same path.
        </p>
      </div>
    </section>
  );
}

export default function ArchitectureSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<{ index: number; label: string }>({
    index: 0,
    label: PHASES[0].label,
  });

  useEffect(() => {
    if (reduce) return;
    const root = sectionRef.current;
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!root || !stage || !world) return;
    const planes = Array.from(stage.querySelectorAll<HTMLElement>('[data-plane]'));
    const slabs = planes.slice(1);
    const labels = Array.from(stage.querySelectorAll<HTMLElement>('[data-label]'));
    const pins = Array.from(stage.querySelectorAll<HTMLElement>('[data-pin]'));
    if (!planes.length || !slabs.length) return;

    const paint = (p: number) => {
      const ui = seg(p, BEAT.ui.from, BEAT.ui.to);
      const mon = seg(p, BEAT.mon.from, BEAT.mon.to);
      const tilt = seg(p, BEAT.tilt.from, BEAT.tilt.to);
      const fin = seg(p, BEAT.fin.from, BEAT.fin.to);
      const opens = [
        seg(p, BEAT.l1.from, BEAT.l1.to),
        seg(p, BEAT.l2.from, BEAT.l2.to),
        seg(p, BEAT.l3.from, BEAT.l3.to),
        seg(p, BEAT.l4.from, BEAT.l4.to),
        seg(p, BEAT.l5.from, BEAT.l5.to),
      ];

      setVar(stage, '--ui', ui.toFixed(4));
      setVar(stage, '--mon', mon.toFixed(4));
      setVar(stage, '--tilt', tilt.toFixed(4));
      setVar(stage, '--fin', fin.toFixed(4));
      opens.forEach((open, index) => {
        setVar(stage, `--l${index + 1}`, open.toFixed(4));
      });

      // The monitor and the board assemble with different beats, so the tiles
      // finish arriving as the hardware closes around them.
      //
      // Labels are queried in DOM order, which puts the monitor's own label
      // first, so slab `index` owns label `index + 1`. Writing by slab index
      // instead would leave the monitor's label driving the wrong layer's
      // cross-fade and let two bubbles show at once.
      slabs.forEach((slab, index) => {
        setVar(slab, '--l', opens[index + 1].toFixed(4));
        // The next layer's progress drives this label out of the way.
        const next = opens[index + 2] ?? 0;
        const label = labels[index + 1];
        const pin = pins[index + 1];
        if (label) setVar(label, '--nx', next.toFixed(4));
        if (pin) setVar(pin, '--nx', next.toFixed(4));
      });

      const planeOne = planes[0];
      if (planeOne) {
        setVar(planeOne, '--l', opens[0].toFixed(4));
        const label = labels[0];
        const pin = pins[0];
        if (label) setVar(label, '--nx', opens[1].toFixed(4));
        if (pin) setVar(pin, '--nx', opens[1].toFixed(4));
      }
    };

    /**
     * The live-region text follows the settled value rather than the raw
     * scroll position, so a reader hears the beat the rig has actually reached
     * and not every beat the wheel passed through on the way.
     */
    const setPhaseFor = (value: number) => {
      const found = PHASES.findIndex((item) => value <= item.end);
      const next = found === -1 ? PHASES.length - 1 : found;
      setPhase((current) =>
        current.index === next ? current : { index: next, label: PHASES[next].label },
      );
    };

    let frame = 0;
    let settled = false;
    /** The eased value the composition is actually drawn at. */
    let drawn: number | null = null;
    /** The value the scroll position is asking for. */
    let target = 0;

    const tick = () => {
      frame = 0;
      const total = root.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      target = range(-root.getBoundingClientRect().top / total, 0, 1);
      if (drawn === null) drawn = target;
      // Ease-out toward the scroll position, so the rig settles rather than
      // snapping when the wheel stops.
      drawn += (target - drawn) * EASE;
      if (Math.abs(target - drawn) < 0.0004) drawn = target;
      paint(drawn);
      if (drawn !== target) {
        frame = window.requestAnimationFrame(tick);
      } else if (!settled) {
        settled = true;
        setPhaseFor(target);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    // The listener is attached only while the section is within a viewport of
    // the reader, so the rest of the page scrolls without running this loop.
    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) attach();
              else detach();
              schedule();
            },
            { rootMargin: '20% 0px' },
          );
    observer?.observe(root);
    schedule();

    return () => {
      observer?.disconnect();
      detach();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduce]);

  if (reduce) {
    return <StaticComposition />;
  }

  return (
    <section
      id="system"
      ref={sectionRef}
      aria-labelledby="system-title"
      className="arch-root arch-scope relative border-t border-line"
      style={{ height: SECTION_HEIGHT }}
    >
      <style>{SCOPE}</style>

      <div ref={stageRef} className="arch-stage">
        {/* The scene. Hidden from assistive technology: it is the animation, not
            the content. The same five layers are listed in real text below, and
            the section heading and copy sit above the scene at all times. */}
        <div aria-hidden="true" className="arch-scene">
          <div ref={worldRef} className="arch-world">
            <div data-plane className="arch-plane arch-plane-1" style={{ '--i': 1 } as React.CSSProperties}>
              <MonitorHardware />
              <div className="arch-glass" />
              <BoardChrome />

              <i data-pin className="arch-pin" />

              <div data-label className="arch-label">
                <span className="arch-label-name">
                  <span className="arch-badge">{ARCHITECTURE_LAYERS[0].n}</span>
                  <span className="arch-label-long">{ARCHITECTURE_LAYERS[0].name}</span>
                  <span className="arch-label-short">{ARCHITECTURE_LAYERS[0].short}</span>
                </span>
              </div>
            </div>

            {ARCHITECTURE_LAYERS.slice(1).map((layer, index) => (
              <Slab key={layer.id} layer={layer} position={index + 1} />
            ))}
          </div>
        </div>

        <ol className="arch-sr">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <li key={layer.id}>
              {layer.name}: {layer.body}
            </li>
          ))}
        </ol>
      </div>

      {/* The copy column sits after the sticky stage, not inside it: it is a
          full viewport tall, and a sticky element taller than the viewport
          cannot stay pinned, so nesting it would scroll the scene away. */}
      <div className="arch-desc wrap relative">
        <header className="max-w-[62ch]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgba(28,27,24,0.5)]">
            05 / How we build
          </p>
          <h2
            id="system-title"
            className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
          >
            One system, five layers that have to fit.
          </h2>
          <p className="prose-body mt-4 text-[15px] text-[rgba(28,27,24,0.62)] md:text-base">
            Scrolling this section takes an interface apart: it assembles, drops
            into a monitor, then separates into the layers we design, build and
            run for you.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[rgba(28,27,24,0.42)]">
            <span aria-hidden="true" className="h-px w-6 bg-[rgba(28,27,24,0.25)]" />
            Keep scrolling
            <ArrowDown aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
          </p>
        </header>

        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-[rgba(28,27,24,0.1)] pt-4">
          {PHASES.map((item, index) => (
            <p
              key={item.label}
              className="font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300"
              style={{
                color: index === phase.index ? '#3f6b00' : 'rgba(28,27,24,0.4)',
                fontWeight: index === phase.index ? 600 : 400,
              }}
            >
              {item.label}
            </p>
          ))}
        </div>

        <p aria-live="polite" className="arch-sr">
          {phase.label}
        </p>
      </div>

      <div className="arch-note pointer-events-none absolute bottom-6 left-1/2 w-full -translate-x-1/2 px-6 text-center sm:bottom-8">
        <p className="text-[15px] font-semibold tracking-tight text-[#1c1b18]">
          {SYSTEM_FOOTER.title}
        </p>
        <p className="mt-1 text-[13px] text-[rgba(28,27,24,0.6)]">{SYSTEM_FOOTER.body}</p>
      </div>
    </section>
  );
}
