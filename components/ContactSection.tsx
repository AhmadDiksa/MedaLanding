'use client';

import React, { useId, useState } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { CONTACT, CONTACT_OPTIONS } from '@/lib/data';

type Errors = { name?: string; email?: string; message?: string };

const fieldClass =
  'w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25';

const labelClass =
  'block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft';

/**
 * Contact. Four fields plus the required message, labels above inputs, inline
 * errors below. WhatsApp and email sit beside the form so nobody has to fill
 * anything in to reach us.
 */
export default function ContactSection() {
  const uid = useId();
  const [values, setValues] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    need: CONTACT_OPTIONS[0] as string,
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const setField = (field: keyof typeof values) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Tell us who we are replying to.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = 'Enter an email address we can reply to.';
    }
    if (values.message.trim().length < 20) {
      next.message = 'A sentence or two about the problem is enough.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  };

  const mailtoHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    `Project enquiry from ${values.company || values.name || 'the website'}`
  )}&body=${encodeURIComponent(
    `Need: ${values.need}\nName: ${values.name}\nCompany: ${values.company}\nWhatsApp: ${values.whatsapp}\n\n${values.message}`
  )}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative border-t border-line bg-page py-20 md:py-28"
    >
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2
            id="contact-title"
            className="max-w-[20ch] text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
          >
            What needs to work better?
          </h2>
          <p className="prose-body mt-5 text-[15px] text-ink-soft md:text-base">
            Tell us about the system you want to build, improve or bring to life. If one
            of our products already fits, we will say so.
          </p>

          <dl className="mt-10 space-y-5 border-t border-line pt-8">
            <div>
              <dt className={labelClass}>Email</dt>
              <dd className="mt-1.5">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {CONTACT.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className={labelClass}>WhatsApp</dt>
              <dd className="mt-1.5">
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {CONTACT.phoneLabel}
                </a>
              </dd>
            </div>
          </dl>

          <p className="mt-8 flex items-start gap-2.5 text-xs leading-relaxed text-ink-mute">
            <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
            One reply per enquiry, written by the engineer who would scope the work.
          </p>
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="card flex h-full flex-col justify-center p-8 md:p-10">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Check className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-2xl font-bold tracking-tight">
                Your brief is filled in
              </h3>
              <p className="prose-body mt-3 text-[15px] text-ink-soft">
                Nothing has left your browser yet. Send it with the button below and it
                opens in your mail client, addressed to us, with everything you typed.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-hover active:translate-y-px"
                >
                  Send with my email app
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </a>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-2 active:translate-y-px"
                >
                  Send on WhatsApp instead
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 w-fit text-sm font-medium text-ink-mute underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
              >
                Edit the brief
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-9">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-name`} className={labelClass}>
                    Name
                  </label>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={setField('name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                    className={`mt-2 ${fieldClass}`}
                  />
                  {errors.name ? (
                    <p id={`${uid}-name-error`} className="mt-2 text-xs text-accent">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={`${uid}-email`} className={labelClass}>
                    Email
                  </label>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={setField('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                    className={`mt-2 ${fieldClass}`}
                  />
                  {errors.email ? (
                    <p id={`${uid}-email-error`} className="mt-2 text-xs text-accent">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={`${uid}-whatsapp`} className={labelClass}>
                    WhatsApp <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    id={`${uid}-whatsapp`}
                    name="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    value={values.whatsapp}
                    onChange={setField('whatsapp')}
                    className={`mt-2 ${fieldClass}`}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-company`} className={labelClass}>
                    Company
                  </label>
                  <input
                    id={`${uid}-company`}
                    name="company"
                    autoComplete="organization"
                    value={values.company}
                    onChange={setField('company')}
                    className={`mt-2 ${fieldClass}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-need`} className={labelClass}>
                    What do you need?
                  </label>
                  <select
                    id={`${uid}-need`}
                    name="need"
                    value={values.need}
                    onChange={setField('need')}
                    className={`mt-2 ${fieldClass}`}
                  >
                    {CONTACT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-message`} className={labelClass}>
                    What is slow, manual or broken today?
                  </label>
                  <textarea
                    id={`${uid}-message`}
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={setField('message')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${uid}-message-error` : undefined}
                    className={`mt-2 resize-y ${fieldClass}`}
                  />
                  {errors.message ? (
                    <p id={`${uid}-message-error`} className="mt-2 text-xs text-accent">
                      {errors.message}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-ink-mute">
                      A few sentences is plenty. We will ask questions we cannot answer
                      ourselves.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-hover active:translate-y-px"
                >
                  Send message
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
                <p className="text-xs text-ink-mute">
                  We reply from {CONTACT.email}, usually within one working day.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
