'use client';

import React, { useEffect, useState } from 'react';
import { Menu, X, MousePointerClick } from 'lucide-react';
import { NAV_LINKS } from '@/lib/data';
import ThemeToggle from '@/components/primitives/ThemeToggle';

/**
 * Navigation. Single line at every width, under 80px, opaque from the start so
 * nothing shifts on scroll and no scroll listener is needed. Below md the
 * links fold into one disclosure panel.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur-md">
      <div className="wrap flex h-[68px] items-center justify-between gap-6">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2 text-base font-bold tracking-tight text-ink"
        >
          <span aria-hidden="true" className="meda-pulse h-2 w-2 rounded-full bg-accent" />
          Meda Technology
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#system"
            title="How a system fits together"
            className="hidden items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-150 hover:border-line-strong hover:text-ink lg:inline-flex"
          >
            <MousePointerClick className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Interactive 3D
          </a>
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-hover sm:inline-flex"
          >
            Start a project
          </a>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface-2 text-ink-soft md:hidden"
          >
            {open ? (
              <X className="h-4 w-4" strokeWidth={2} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-line bg-page md:hidden"
        >
          <div className="wrap flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 text-[15px] font-medium text-ink-soft last:border-b-0 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#system"
              onClick={() => setOpen(false)}
              className="border-b border-line py-3.5 text-[15px] font-medium text-ink-soft hover:text-ink"
            >
              How a system fits together
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="my-3 inline-flex justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-ink"
            >
              Start a project
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
