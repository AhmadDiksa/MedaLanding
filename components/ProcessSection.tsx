'use client';

import React, { useState } from 'react';
import { PROCESS_STAGES } from '@/lib/data';
import { Section, SectionHead } from '@/components/primitives/Section';

/**
 * Process as a staged timeline: one vertical spine, six stops, the active one
 * unfurled. Layout family deliberately different from the accordion in
 * Services: this one carries a running spine and role column.
 */
export default function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PROCESS_STAGES[activeIndex];

  return (
    <Section id="process" tone="page" labelledBy="process-title">
      <SectionHead
        id="process-title"
        label="Process"
        title="From brief to built"
        body="A clear, visible journey from first conversation to production. You always know what is happening and what we need from you."
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <ol className="lg:col-span-5">
          {PROCESS_STAGES.map((stage, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={stage.index} className="relative">
                <div className="flex gap-5">
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    <span
                      className={`mt-2 h-3 w-3 shrink-0 rounded-full border-2 transition-colors duration-200 ${
                        isActive
                          ? 'border-accent bg-accent'
                          : 'border-line-strong bg-page'
                      }`}
                    />
                    {index < PROCESS_STAGES.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className={`w-px flex-1 ${isActive ? 'bg-accent/50' : 'bg-line'}`}
                      />
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-current={isActive}
                    className="flex flex-1 items-baseline gap-3 pb-8 text-left"
                  >
                    <span className="font-mono text-xs tabular text-ink-faint">
                      {stage.index}
                    </span>
                    <span
                      className={`text-lg font-bold tracking-tight transition-colors duration-200 ${
                        isActive ? 'text-accent' : 'text-ink hover:text-ink-soft'
                      }`}
                    >
                      {stage.name}
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="lg:col-span-7">
          <div className="card p-6 md:p-9">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              {active.name}
            </h3>

            <p className="prose-body mt-5 text-[15px] leading-relaxed text-ink-soft md:text-base">
              {active.whatWeDo}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                  You receive
                </dt>
                <dd className="mt-2 text-sm font-medium leading-snug text-ink">
                  {active.youReceive}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                  Your role
                </dt>
                <dd className="mt-2 text-sm text-ink-soft">{active.yourRole}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-5 text-sm text-ink-soft">
            After launch: a support window for fixes and questions, then a maintenance
            agreement if you want us to keep improving the system.
          </p>
        </div>
      </div>
    </Section>
  );
}
