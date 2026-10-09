import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CASE_STUDIES } from '@/lib/data';
import { Section, SectionHead } from '@/components/primitives/Section';
import Reveal from '@/components/primitives/Reveal';

/**
 * Case studies as a bento grid: one wide feature on top spanning the full row,
 * two equal tiles below. Each card leads with its screenshot. On hover the
 * image scales and a gradient overlay reveals the outcome line, so the resting
 * state stays calm and the detail arrives only when the reader asks for it.
 *
 * Composition differs from ProductsSection (7+5 split) on purpose: this section
 * runs a 12-col full row then a 2x6 pair, so the two grid sections never read
 * as the same layout family.
 */
export default function WorkSection() {
  const [featured, ...rest] = CASE_STUDIES;

  return (
    <Section id="work" tone="muted" labelledBy="work-title">
      <SectionHead
        id="work-title"
        title="Proof, not promises"
        body="Systems we have designed and built, described the way we would describe them to you in a first meeting."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Featured case study - full width */}
        <Reveal className="lg:col-span-2">
          <CaseCard study={featured} featured />
        </Reveal>

        {/* Remaining case studies - half width each */}
        {rest.map((study, index) => (
          <Reveal key={study.id} delay={0.08 * (index + 1)}>
            <CaseCard study={study} />
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        Client names appear with written permission. Ask us for the specifics on a call.
      </p>
    </Section>
  );
}

function CaseCard({
  study,
  featured = false,
}: {
  study: (typeof CASE_STUDIES)[number];
  featured?: boolean;
}) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      {/* Image - focal point. Zooms on hover; overlay reveals outcome. */}
      <div
        className={`relative w-full overflow-hidden bg-surface-2 ${
          featured ? 'aspect-[16/9]' : 'aspect-[16/10]'
        }`}
      >
        <Image
          src={study.image}
          alt={`${study.built} for ${study.client}`}
          fill
          sizes={featured ? '100vw' : '50vw'}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          priority={featured}
        />
        {/* Hover overlay: outcome line slides up from bottom. Resting state is clean. */}
        {/* Uses black (not --ink) so the scrim stays dark in both light and dark themes; --ink flips light in dark mode. */}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100">
          <p className="p-5 text-sm font-semibold text-white md:p-6">
            {study.result}
          </p>
        </div>
      </div>

      {/* Caption block */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              {study.industry}
            </p>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-ink">
              {study.built}
            </h3>
          </div>
          <span
            aria-hidden="true"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-mute transition-colors duration-300 group-hover:border-accent group-hover:text-accent"
          >
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </span>
        </div>

        <p className="mt-1.5 text-sm text-ink-mute">{study.client}</p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-soft">
          {study.points.map((point) => (
            <li key={point} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-px w-2.5 bg-line-strong" />
              {point}
            </li>
          ))}
        </ul>

        <p className="mt-auto pt-4 font-mono text-[11px] text-ink-faint">
          {study.year}
        </p>
      </div>
    </article>
  );
}
