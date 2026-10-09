import { Section } from '@/components/primitives/Section';

const PRINCIPLES = [
  {
    title: 'One team, every layer',
    body: 'Frontend, backend, data and infrastructure under one roof, so nothing gets lost between vendors.',
  },
  {
    title: 'Visible progress',
    body: 'You see working builds throughout the engagement, not a surprise at the end.',
  },
  {
    title: 'Products of our own',
    body: 'ShiftGenius, Loyalty+ and Meda Billing are our work, built and maintained by the same team.',
  },
  {
    title: 'Plain language',
    body: 'We explain trade-offs without jargon, and say when a simpler option solves the problem.',
  },
];

/**
 * About, as an editorial pull quote over a two-column statement grid. This is
 * the only section on the page with a display-scale quote, and the only one
 * with a numbered principle list.
 */
export default function AboutSection() {
  return (
    <Section id="about" tone="surface" labelledBy="about-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <h2
            id="about-title"
            className="text-2xl font-bold leading-[1.35] tracking-tight text-balance sm:text-3xl md:text-[2.125rem]"
          >
            We believe your system
            should feel like clothes that fit properly, not something your team has to
            force itself into.
          </h2>
          <p className="prose-body mt-6 text-[15px] text-ink-soft md:text-base">
            That belief decides how we work: we scope before we build, we show you the
            system as it grows, and we hand over code you own.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-6">
          {PRINCIPLES.map((principle, index) => (
            <div key={principle.title} className="border-t border-line pt-5">
              <dt className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tabular text-ink-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-base font-bold tracking-tight text-ink">
                  {principle.title}
                </span>
              </dt>
              <dd className="mt-2 pl-7 text-sm leading-relaxed text-ink-soft">
                {principle.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
