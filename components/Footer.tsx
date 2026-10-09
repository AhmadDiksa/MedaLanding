import { ArrowUpRight } from 'lucide-react';
import { CONTACT, NAV_LINKS } from '@/lib/data';

const SOCIALS = [
  { label: 'LinkedIn', href: CONTACT.linkedin },
  { label: 'Instagram', href: CONTACT.instagram },
  { label: 'Glints', href: CONTACT.glints },
];

/**
 * Footer. Contact block, section index and social links on one grid line, then
 * a single bottom bar with the legal name and the year.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="wrap py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="text-lg font-bold tracking-tight text-ink">Meda Technology</p>
            <p className="prose-body mt-3 text-sm leading-relaxed text-ink-soft">
              Custom software development: web, mobile, backend and infrastructure. We
              make complicated things simple and build the system around your business.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>

          <nav aria-label="Sections" className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              Sections
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-ink-mute">
            &copy; {year} {CONTACT.legalName}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-ink-mute">
            Jakarta, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
