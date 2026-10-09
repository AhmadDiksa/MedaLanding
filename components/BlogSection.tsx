import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { ARTICLES } from '@/lib/data';
import { Section, SectionHead } from '@/components/primitives/Section';

/**
 * Blog preview. Three cards on one row with real photography. The archive and
 * per-article pages come later; today this links to the contact form so no
 * visitor lands on a dead end.
 */
export default function BlogSection() {
  return (
    <Section id="blog" tone="page" labelledBy="blog-title">
      <SectionHead
        id="blog-title"
        label="Blog"
        title="Notes from the build"
        body="Practical guides for teams planning, buying or improving their software. No jargon."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((article) => (
          <article key={article.id} className="card group flex flex-col overflow-hidden">
            <div className="relative aspect-[16/10] w-full bg-surface-2">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {article.category}
              </p>
              <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight">
                {article.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6 font-mono text-[11px] text-ink-mute">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>

              <a
                href={`#contact`}
                className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-4 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                Read the piece
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        Full article pages are being migrated. In the meantime, ask us directly and we
        will send the piece.
      </p>
    </Section>
  );
}
