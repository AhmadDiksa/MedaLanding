import React from 'react';

/**
 * Section shells. Header rhythm is locked to one shape (label above, headline,
 * optional body stacked below, max 62ch) so no section grows a split header.
 * Only `label` renders the small uppercase micro-label, and it is rationed on
 * the page: hero, Services, Process, Blog. Everything else skips it.
 */

type Tone = 'page' | 'surface' | 'muted';

const toneClass: Record<Tone, string> = {
  page: 'bg-page text-ink',
  surface: 'bg-surface text-ink',
  muted: 'bg-surface-2 text-ink',
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}

export function Section({
  id,
  tone = 'page',
  className = '',
  children,
  labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative border-t border-line py-20 md:py-28 ${toneClass[tone]} ${className}`}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
      {children}
    </p>
  );
}

interface SectionHeadProps {
  id?: string;
  label?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: 'start' | 'center';
  className?: string;
}

export function SectionHead({
  id,
  label,
  title,
  body,
  align = 'start',
  className = '',
}: SectionHeadProps) {
  return (
    <header
      className={`flex flex-col gap-4 ${
        align === 'center' ? 'items-center text-center' : 'items-start'
      } ${className}`}
    >
      {label ? <Label>{label}</Label> : null}
      <h2
        id={id}
        className="max-w-[22ch] text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
      >
        {title}
      </h2>
      {body ? (
        <p className="prose-body text-[15px] text-ink-soft md:text-base">{body}</p>
      ) : null}
    </header>
  );
}
