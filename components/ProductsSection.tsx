import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
import { Section, SectionHead } from '@/components/primitives/Section';
import Reveal from '@/components/primitives/Reveal';

const PRODUCT_IMAGES: Record<string, string> = {
  shiftgenius: '/images/hero_tech_architecture_1791276908553.jpg',
  'loyalty-plus': '/works/loyaltyplus.png',
  'meda-billing': '/works/meda-billing.png',
};

/**
 * Ready-made products. Three cells: one tall feature with its own screenshot,
 * two shorter tiles offset below it. Each product links out to a demo request.
 */
export default function ProductsSection() {
  const [featured, ...rest] = PRODUCTS;

  return (
    <Section id="products" tone="page" labelledBy="products-title">
      <SectionHead
        id="products-title"
        title="Built once. Running now."
        body="We turn recurring business problems into products you can start using without commissioning a build."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <article className="card flex h-full flex-col overflow-hidden">
            <div className="relative aspect-[16/10] w-full bg-surface-2">
              <Image
                src={PRODUCT_IMAGES[featured.id]}
                alt={`${featured.name} interface`}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
                HR &amp; workforce
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                {featured.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">{featured.tagline}</p>
              <p className="prose-body mt-4 text-[15px] text-ink-soft">{featured.body}</p>

              <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute sm:pt-0.5">
                    Built for
                  </dt>
                  <dd className="text-ink-soft">{featured.builtFor}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute sm:pt-0.5">
                    Includes
                  </dt>
                  <dd className="text-ink-soft">{featured.features.join(' · ')}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute sm:pt-0.5">
                    Before
                  </dt>
                  <dd className="text-ink-mute">{featured.before}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute sm:pt-0.5">
                    After
                  </dt>
                  <dd className="font-medium text-ink">{featured.after}</dd>
                </div>
              </dl>

              <a
                href={featured.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-hover active:translate-y-px"
              >
                Request a demo
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </article>
        </Reveal>

        <div className="flex flex-col gap-6 lg:col-span-5">
          {rest.map((product, index) => (
            <Reveal key={product.id} delay={0.08 * (index + 1)} className="h-full">
              <article className="card flex h-full flex-col p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{product.name}</h3>
                    <p className="mt-1 text-sm font-medium text-accent">{product.tagline}</p>
                  </div>
                  <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2">
                    <Image
                      src={PRODUCT_IMAGES[product.id]}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.body}</p>

                <p className="mt-4 text-sm text-ink-mute">
                  <span className="font-medium text-ink">{product.after}</span>
                  <span className="block text-xs">was: {product.before}</span>
                </p>

                <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-xs">
                  <div className="flex gap-2">
                    <dt className="font-mono uppercase tracking-[0.14em] text-ink-mute">
                      Built for
                    </dt>
                    <dd className="text-ink-soft">{product.builtFor}</dd>
                  </div>
                </dl>

                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  Request a demo
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
