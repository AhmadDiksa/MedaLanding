'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Mode = 'light' | 'dark';

function currentMode(): Mode {
  const explicit = document.documentElement.classList.contains('dark')
    ? 'dark'
    : document.documentElement.classList.contains('light')
      ? 'light'
      : null;
  if (explicit) return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Theme switch. The page ships one locked theme by default (it follows the OS);
 * this control exists only so a visitor can override that, and the choice is
 * remembered. No section inverts on its own.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(currentMode());
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(next);
      try {
        window.localStorage.setItem('meda-theme', next);
      } catch {
        /* storage unavailable; the toggle still works for this session */
      }
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface-2 text-ink-soft transition-colors duration-150 hover:text-ink ${className}`}
    >
      {mounted && mode === 'dark' ? (
        <Sun className="h-4 w-4" strokeWidth={2} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  );
}
