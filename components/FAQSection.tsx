'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { FAQ_DATA } from '@/lib/data';
import { Section, SectionHead } from '@/components/primitives/Section';

/**
 * FAQ. Nine questions is too many for a bulleted list, so they run as
 * single-open accordion rows with hairline separators and a question count
 * instead of a decorative label.
 */
export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  return (
    <Section id="faq" tone="muted" labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <SectionHead
            id="faq-title"
            title="Frequently asked"
            body="Scope, pricing, ownership and support, answered the same way we would answer them on a call."
          />
          <p className="mt-6 font-mono text-[11px] text-ink-mute">
            {FAQ_DATA.length} questions
          </p>
        </div>

        <div className="border-t border-line-strong lg:col-span-8">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-trigger-${item.id}`;

            return (
              <div key={item.id} className="border-b border-line">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={`text-base font-semibold leading-snug transition-colors duration-200 md:text-lg ${
                        isOpen ? 'text-accent' : 'text-ink group-hover:text-accent'
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        isOpen
                          ? 'border-accent text-accent'
                          : 'border-line-strong text-ink-soft group-hover:border-ink-soft'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                      ) : (
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                    </span>
                  </button>
                </h3>

                {isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="prose-body pb-6 text-[15px] leading-relaxed text-ink-soft"
                  >
                    {item.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
