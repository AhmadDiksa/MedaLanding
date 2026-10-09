import React from 'react';
import Image from 'next/image';
import { CLIENT_LOGOS } from '@/lib/data';

/**
 * Client mark strip: label rail + edge-to-edge marquee row of logos.
 *
 * Cells are image-only. CLIENT_LOGOS carries a sector per client, and printing
 * it here would read as invented positioning, so the field is left unused.
 */

/** Cells are duplicated until the track is at least this wide, then doubled. */
const MIN_CELLS = 10;

/** One full loop, in seconds. Slower than the page's other motion. */
const DURATION = 42;

type CellProps = {
  name: string;
  file: string;
};

function Cell({ name, file }: CellProps) {
  return (
    <div className="group flex h-12 w-32 flex-none items-center justify-center border-r border-line px-4 last:border-r-0 lg:h-14 lg:w-40">
      <div className="relative h-6 w-24 lg:h-7 lg:w-28">
        <Image
          src={file}
          alt={`${name} logo`}
          fill
          sizes="112px"
          className="dark-invert-logo object-contain"
        />
      </div>
    </div>
  );
}

function Marker({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute z-10 size-1.5 bg-accent ${className}`} />
  );
}

interface MarqueeProps {
  /** Rendered in the left rail. Two lines read better here than one long string. */
  label?: string;
  /**
   * Span the full viewport instead of sitting inside `.wrap`. Drops the outer
   * frame and the label's right rule, which read as broken edges when the row
   * already runs edge to edge.
   */
  fullBleed?: boolean;
}

export default function Marquee({
  label = 'Working with\nteams at',
  fullBleed = false,
}: MarqueeProps) {
  // Repeat the list until the track comfortably overflows, then duplicate it so
  // the -50% translate lands exactly one set over.
  const repeat = Math.max(2, Math.ceil(MIN_CELLS / CLIENT_LOGOS.length));
  const set = Array.from({ length: repeat }).flatMap(() => CLIENT_LOGOS);

  return (
    <div
      className={`relative flex flex-col border-line lg:flex-row ${
        fullBleed ? 'border-b' : 'border'
      }`}
    >
      {!fullBleed && (
        <>
          <Marker className="-left-[3px] -top-[3px]" />
          <Marker className="-left-[3px] -bottom-[3px]" />
          <Marker className="-right-[3px] -bottom-[3px]" />
        </>
      )}

      <div
        className={`flex shrink-0 items-center border-line p-3 lg:w-56 lg:border-b-0 lg:p-4 ${
          fullBleed
            ? 'border-b lg:border-r-0 lg:border-b'
            : 'border-b lg:border-r'
        }`}
      >
        <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-ink-mute">
          {label.split('\n').map((line, index) => (
            <React.Fragment key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className="meda-marquee-mask marquee-paused relative min-w-0 flex-1 overflow-hidden">
        <div className="meda-marquee" style={{ animationDuration: `${DURATION}s` }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1 ? true : undefined}>
              {set.map((client, index) => (
                <Cell
                  key={`${copy}-${index}-${client.name}`}
                  name={client.name}
                  file={client.file}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
