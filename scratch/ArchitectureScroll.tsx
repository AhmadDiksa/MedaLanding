"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./ArchitectureScroll.module.css";

const LAYERS = [
  { title: "Frontend / Presentation", desc: "Interfaces, design system and client-side state." },
  { title: "API Layer", desc: "Typed endpoints, authentication and validation." },
  { title: "Application / Business Logic", desc: "Domain rules, workflows and background jobs." },
  { title: "Database", desc: "Schema, migrations, indexing and backups." },
  { title: "Infrastructure / Deployment", desc: "CI/CD, containers, monitoring and scaling." },
] as const;

const WIRES: Record<number, [string, string, string]> = {
  2: ["GET /orders", "POST /orders", "Auth"],
  3: ["Rules", "Workflows", "Jobs"],
  4: ["customers", "orders", "invoices"],
  5: ["CI/CD", "Containers", "Monitoring"],
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const seg = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t); // smoothstep: deterministic + reversible
};

/** Scroll progress (0–1) → CSS variables. A: ui · B: mon · C: tilt (turn sideways) + l1..l5 (one by one) · D: fin */
function timeline(p: number): Record<string, number> {
  const layer = (n: number) => seg(p, 0.44 + (n - 1) * 0.09, 0.51 + (n - 1) * 0.09);
  return {
    ui: seg(p, 0, 0.2),
    mon: seg(p, 0.2, 0.34),
    tilt: seg(p, 0.34, 0.44),
    l1: layer(1),
    l2: layer(2),
    l3: layer(3),
    l4: layer(4),
    l5: layer(5),
    fin: seg(p, 0.88, 1),
  };
}

const v = (o: Record<string, string | number>) => o as CSSProperties;

export default function ArchitectureScroll() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // CSS shows the static end state

    const last: Record<string, string> = {};
    let raf = 0;
    let target = 0;
    let cur: number | null = null; // eased progress: the animation trails the scroll for a slower, smoother feel

    const apply = (p: number) => {
      const vars = timeline(p);
      for (const k in vars) {
        const val = vars[k].toFixed(3);
        if (last[k] !== val) {
          last[k] = val;
          stage.style.setProperty(`--${k}`, val); // no React state per frame
        }
      }
    };
    const tick = () => {
      raf = 0;
      const total = root.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      target = clamp(-root.getBoundingClientRect().top / total);
      if (cur === null) cur = target;
      cur += (target - cur) * 0.07;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      apply(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) attach();
        else detach();
        schedule();
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(root);
    schedule();

    return () => {
      io.disconnect();
      detach();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.root} aria-labelledby="mif-arch-title">
      <div ref={stageRef} className={styles.stage}>
        <header className={styles.head}>
          <h2 id="mif-arch-title" className={styles.title}>
            One interface on top. Five layers underneath.
          </h2>
          <p className={styles.lede}>
            Every Make It Fit product is built as a clear stack, so each layer can be shaped around how your business works.
          </p>
        </header>

        {/* Visual scene (decorative). Real text lives in the .sr list below. */}
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.world}>
            {[5, 4, 3, 2].map((n) => (
              <Plane key={n} i={n} l={`var(--l${n})`}>
                <div className={`${styles.inner} ${n === 4 ? styles.stackRows : styles.wire}`}>
                  {WIRES[n].map((c, k) => (
                    <span key={c} className={`${styles.chip} ${k === 1 ? styles.hot : ""}`}>{c}</span>
                  ))}
                </div>
              </Plane>
            ))}

            {/* Layer 1: monitor (real 3D slabs) + dashboard screen */}
            <Plane i={1} className={styles.plane1} shell={<MonitorShell />}>
              <div className={`${styles.inner} ${styles.dash}`}>
                <div className={`${styles.piece} ${styles.side}`} style={v({ "--d": 0 })}>
                  <i /><i /><i /><i />
                </div>
                <div className={styles.main}>
                  <div className={styles.kpis}>
                    {["128", "94%", "$42k"].map((k, n) => (
                      <div key={k} className={`${styles.piece} ${styles.kpi}`} style={v({ "--d": 1 + n * 0.5 })}>
                        <b>{k}</b><i />
                      </div>
                    ))}
                  </div>
                  <div className={`${styles.piece} ${styles.chart}`} style={v({ "--d": 3 })}>
                    {[40, 62, 50, 80, 58, 72].map((h, n) => (
                      <span key={n} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className={`${styles.piece} ${styles.row}`} style={v({ "--d": 4 })}>
                    <i /><i />
                  </div>
                </div>
              </div>
            </Plane>
          </div>
        </div>

        <ol className={styles.sr}>
          {LAYERS.map((l) => (
            <li key={l.title}>{l.title}: {l.desc}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MonitorShell() {
  const s = styles;
  return (
    <>
      {/* each face gets .hw (opacity) individually: opacity on a parent would flatten the 3D */}
      <div className={s.lid}>
        <div className={`${s.hw} ${s.lidFront}`} />
        <div className={`${s.hw} ${s.lidBack}`} />
        {[s.eL, s.eR, s.eT, s.eB].map((c) => (
          <i key={c} className={`${s.hw} ${s.edge} ${c}`} />
        ))}
      </div>
      <div className={s.neck}>
        <i className={`${s.hw} ${s.nF}`} />
        <i className={`${s.hw} ${s.nL}`} />
        <i className={`${s.hw} ${s.nR}`} />
      </div>
      <div className={s.deck}>
        <div className={`${s.hw} ${s.dTop}`} />
        <div className={`${s.hw} ${s.dBot}`} />
        <i className={`${s.hw} ${s.dFront}`} />
        <i className={`${s.hw} ${s.dL}`} />
        <i className={`${s.hw} ${s.dR}`} />
      </div>
    </>
  );
}

function Plane({
  i,
  l,
  className = "",
  shell,
  children,
}: {
  i: number;
  l?: string;
  className?: string;
  shell?: ReactNode;
  children: ReactNode;
}) {
  const layer = LAYERS[i - 1];
  const nx = i < 5 ? `var(--l${i + 1})` : 0; // label hides once the next step starts
  return (
    <div className={`${styles.plane} ${className}`} style={v({ "--i": i, ...(l ? { "--l": l } : {}) })}>
      {shell}
      <div className={styles.glass} />
      {children}
      {/* pin sits on the pane; the bubble is counter-rotated to face the viewer */}
      <i className={styles.pin} style={v({ "--l": `var(--l${i})`, "--nx": nx })} />
      <div className={styles.label} style={v({ "--l": `var(--l${i})`, "--nx": nx })}>
        <span className={styles.name}>
          <span className={styles.badge}>{i}</span>
          {layer.title}
        </span>
        <p className={styles.desc}>{layer.desc}</p>
      </div>
    </div>
  );
}
