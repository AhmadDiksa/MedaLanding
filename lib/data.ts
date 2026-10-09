import type {
  ServiceLayer,
  ProcessStage,
  Product,
  CaseStudy,
  ClientLogo,
  FAQItem,
  Article,
} from '@/types';

/**
 * Trust strip. Real clients Meda has already named publicly; sector labels live
 * in `sector` for alt text only, never rendered under the logo.
 */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Astra Honda Motor', file: '/clients/ahm.png', sector: 'Manufacturing' },
  { name: 'Bridgestone', file: '/clients/bridgestone.png', sector: 'Manufacturing' },
  { name: 'DBS Bank', file: '/clients/dbs.png', sector: 'Banking' },
  { name: 'Fingerspot', file: '/clients/fingerspot.png', sector: 'Security technology' },
  { name: 'Byru', file: '/clients/byru.png', sector: 'Telecommunications' },
  { name: 'Simian', file: '/clients/simian.png', sector: 'Distribution' },
  { name: 'RDA', file: '/clients/rda.png', sector: 'Industrial logistics' },
];

/** Stack strip in the hero. Simple Icons CDN, themed via the currentColor hex. */
export const HERO_STACK: { name: string; slug: string }[] = [
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Go', slug: 'go' },
  { name: 'Next.js', slug: 'nextdotjs' },
  { name: 'PostgreSQL', slug: 'postgresql' },
  { name: 'Flutter', slug: 'flutter' },
  { name: 'Dotnet', slug: 'dotnet' },
];

export const SERVICES: ServiceLayer[] = [
  {
    id: 'frontend',
    index: '01',
    name: 'Front-end',
    headline: 'Interfaces people enjoy using',
    body: 'Web apps, dashboards and mobile apps that feel considered, fast and unmistakably yours.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'Business web apps and internal tools',
      'Customer portals and company websites',
      'Android and iOS apps from one Flutter codebase',
    ],
    stackLabel: 'Stack',
    stack: ['Next.js', 'TypeScript', 'Flutter'],
  },
  {
    id: 'backend',
    index: '02',
    name: 'Backend',
    headline: 'Logic that makes products work',
    body: 'APIs, services, authentication and business rules that turn complexity into clarity.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'REST APIs and third-party integrations',
      'Users, roles and permission models',
      'Workflows, billing and notification systems',
    ],
    stackLabel: 'Stack',
    stack: ['Go', 'C#', 'TypeScript'],
  },
  {
    id: 'database',
    index: '03',
    name: 'Database',
    headline: 'Information with direction',
    body: 'Data structured for decisions, with reporting that makes every number visible.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'Schema design and managed migrations',
      'Reports and operational dashboards',
      'Import from spreadsheets or older systems',
    ],
    stackLabel: 'Stack',
    stack: ['PostgreSQL', 'SQLite'],
  },
  {
    id: 'infrastructure',
    index: '04',
    name: 'Infrastructure',
    headline: 'Foundations that hold the whole system',
    body: 'Cloud-ready environments, deployment and monitoring designed for resilience.',
    deliverablesLabel: 'What we ship',
    deliverables: [
      'Separate dev, staging and production setup',
      'Automated deployment pipelines',
      'Monitoring, alerting and scheduled backups',
    ],
    stackLabel: 'Stack',
    stack: ['Cloud', 'CI/CD'],
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    index: '01',
    name: 'Requirements',
    whatWeDo:
      'We interview stakeholders, map users and workflows, and separate what must exist on day one from what can wait.',
    youReceive: 'Requirements document and prioritised scope',
    yourRole: 'Explain workflows, share examples, connect us to users',
  },
  {
    index: '02',
    name: 'Infrastructure',
    whatWeDo:
      'We set up dev and staging environments, repositories, the database and the deployment pipeline.',
    youReceive: 'A working environment where progress is visible',
    yourRole: 'Approve hosting and accounts',
  },
  {
    index: '03',
    name: 'Design & scope',
    whatWeDo:
      'We turn requirements into mockups and a PRD, then agree scope, timeline and contract.',
    youReceive: 'Clickable mockups, PRD, quote and contract',
    yourRole: 'Review and sign off',
  },
  {
    index: '04',
    name: 'Coding',
    whatWeDo: 'We build backend, frontend and mobile in iterations.',
    youReceive: 'A demo build at the end of every iteration',
    yourRole: 'Give feedback on demos',
  },
  {
    index: '05',
    name: 'UAT',
    whatWeDo: 'Real users test on staging; we fix and refine.',
    youReceive: 'Test checklist and resolved issue list',
    yourRole: 'Test with real users, confirm acceptance',
  },
  {
    index: '06',
    name: 'Production',
    whatWeDo: 'We release, migrate data and hand over.',
    youReceive: 'Live system, documentation, support window',
    yourRole: 'Approve go-live',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'shiftgenius',
    name: 'ShiftGenius',
    tagline: 'Every shift covered.',
    body: 'Workforce management that brings scheduling, attendance and payroll into one clear view.',
    builtFor: 'HR teams and businesses with shift-based staff',
    features: ['Shift scheduling', 'Attendance tracking', 'Payroll'],
    before: 'Schedules in chat and spreadsheets, attendance reconciled by hand',
    after: 'One view for schedule, attendance and pay',
    href: 'https://wa.me/6289687353669?text=Hello%20Meda%20Technology%2C%20I%20would%20like%20a%20demo%20of%20ShiftGenius.',
  },
  {
    id: 'loyalty-plus',
    name: 'Loyalty+',
    tagline: 'Make every visit count.',
    body: 'Loyalty management for points, rewards, campaigns and customers who keep coming back.',
    builtFor: 'Retail, F&B and service businesses',
    features: ['Points and tiers', 'Reward catalogue', 'Campaigns'],
    before: 'Paper cards and guesswork about who returns',
    after: 'Points, rewards and campaigns tied to real customers',
    href: 'https://wa.me/6289687353669?text=Hello%20Meda%20Technology%2C%20I%20would%20like%20a%20demo%20of%20Loyalty%2B.',
  },
  {
    id: 'meda-billing',
    name: 'Meda Billing',
    tagline: 'Clarity for every class.',
    body: 'School billing and operations, designed to make education administration feel lighter.',
    builtFor: 'Schools and foundation administrators',
    features: ['Invoices per class', 'Payment tracking', 'Reminders to parents'],
    before: 'Manual recaps of who has paid',
    after: 'Every invoice and payment visible in one place',
    href: 'https://wa.me/6289687353669?text=Hello%20Meda%20Technology%2C%20I%20would%20like%20a%20demo%20of%20Meda%20Billing.',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'school-billing',
    client: 'Private school groups',
    industry: 'Education',
    built: 'Automated billing and payment reconciliation',
    context:
      'Tuition collection ran on manual bank receipt checks across several branches, so bursars could not see who had actually paid.',
    points: [
      'Invoices per student and class',
      'Payment capture and reconciliation',
      'Reminders to parents',
    ],
    result: 'Every invoice and payment readable in one place',
    year: '2016',
    image: '/works/meda-billing.png',
  },
  {
    id: 'retail-loyalty',
    client: 'Retail and F&B chains',
    industry: 'Retail',
    built: 'Omnichannel loyalty and rewards engine',
    context:
      'Points lived on separate systems per store, so members and campaigns never lined up with the POS.',
    points: [
      'Points, tiers and reward catalogue',
      'Redemption at the point of sale',
      'Campaign and member history',
    ],
    result: 'One member record across every outlet',
    year: '2021',
    image: '/works/loyaltyplus.png',
  },
  {
    id: 'distribution-systems',
    client: 'Distribution and service companies',
    industry: 'Logistics',
    built: 'Internal operations and reporting systems',
    context:
      'Operational data sat in spreadsheets per team, which made monthly reporting slow and hard to verify.',
    points: [
      'Shared operational data model',
      'Role-based access for each team',
      'Scheduled reports for management',
    ],
    result: 'Spreadsheets replaced with one system of record',
    year: '2023',
    image: 'https://picsum.photos/seed/meda-ops-reporting/1200/800',
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-included',
    question: 'What does a project include?',
    answer:
      'Requirements, infrastructure, design and scope, coding, user acceptance testing and production. You see each stage, from first conversation to launch. You approve scope and timeline before coding starts.',
  },
  {
    id: 'faq-cost',
    question: 'How much does custom software cost?',
    answer:
      'It depends on scope: users and roles, features, integrations, platforms and data migration. After the requirements stage we agree the scope in writing and issue a quote against it, so pricing follows a document you have read rather than an estimate made on a first call.',
  },
  {
    id: 'faq-timeline',
    question: 'How long does it take?',
    answer:
      'Small internal tools take weeks. Larger platforms built across several modules take months. The timeline is agreed at the design and scope stage, once we both know what is being built.',
  },
  {
    id: 'faq-ownership',
    question: 'Who owns the source code?',
    answer:
      'Ownership is defined in your contract. The repository, database schema and deployment configuration are written to a scope you hold and can be handed to another team at any point.',
  },
  {
    id: 'faq-payment',
    question: 'How does payment work?',
    answer:
      'Payment is tied to milestones defined in the contract, so each invoice follows work you have already seen in a demo build.',
  },
  {
    id: 'faq-support',
    question: 'Do you support us after launch?',
    answer:
      'Yes. Production releases come with a support window, and we can continue on a maintenance agreement for monitoring, fixes and further iterations.',
  },
  {
    id: 'faq-integrations',
    question: 'Can you connect to our existing systems?',
    answer:
      'Yes, through APIs or data import where the existing system allows it. We check what is actually possible during the requirements stage and tell you plainly if an integration is not realistic.',
  },
  {
    id: 'faq-stack',
    question: 'Which technologies do you use?',
    answer:
      'Go, JavaScript and TypeScript, Next.js, PostgreSQL, SQLite, C# and Flutter. We choose by fit, not fashion, and we will say when a simpler option solves the problem.',
  },
  {
    id: 'faq-custom-or-product',
    question: 'Custom software or a ready-made product?',
    answer:
      'If one of our products already covers your need, we will say so. If not, we build it custom.',
  },
];

/** Blog preview. Three posts exist today; the archive page comes later. */
export const ARTICLES: Article[] = [
  {
    id: 247,
    slug: 'custom-website-buying-guide',
    title: 'Custom website buying guide: seven checks before you sign',
    excerpt:
      'What to ask a development partner before you commit: architecture, code ownership, integrations and how you will see progress.',
    category: 'Planning custom software',
    author: 'Naimatul Aini Sholehah',
    date: '28 September 2026',
    readTime: '6 min read',
    image: '/images/article_website_guide_1791276985766.jpg',
  },
  {
    id: 243,
    slug: 'app-running-slow-performance-fixes',
    title: 'App running slow? Seven places to look first',
    excerpt:
      'Most slowdowns start in the same few places: unindexed queries, oversized payloads and work that should not block a request.',
    category: 'Behind the build',
    author: 'Naimatul Aini Sholehah',
    date: '23 September 2026',
    readTime: '8 min read',
    image: '/images/article_app_performance_1791276928346.jpg',
  },
  {
    id: 240,
    slug: 'website-down-step-by-step',
    title: 'Website down? How to work through it calmly',
    excerpt:
      'A triage order that keeps a bad afternoon from becoming a bad week: reachability, infrastructure, DNS, then recent deployments.',
    category: 'Behind the build',
    author: 'Naimatul Aini Sholehah',
    date: '18 September 2026',
    readTime: '7 min read',
    image: '/images/article_website_resilience_1791276940531.jpg',
  },
];

export const CONTACT = {
  email: 'info@meda.technology',
  phoneLabel: '+62 896-8735-3669',
  phoneHref: 'tel:+6289687353669',
  whatsapp:
    'https://wa.me/6289687353669?text=Hello%20Meda%20Technology%2C%20I%20would%20like%20to%20discuss%20a%20software%20project.',
  linkedin: 'https://www.linkedin.com/company/medatechnology/',
  instagram: 'https://www.instagram.com/meda.technology/',
  glints: 'https://glints.com/id/companies/meda/bc461b59-d6ff-4c27-9e19-203f7dac6573',
  legalName: 'PT Kita Semua Satu',
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Architecture', href: '#system' },
  { label: 'Products', href: '#products' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Blog', href: '#blog' },
  { label: 'FAQ', href: '#faq' },
] as const;

/** Contact form: dropdown options must match real service lines and products. */
export const CONTACT_OPTIONS = [
  'New custom system',
  'Improve an existing system',
  'ShiftGenius',
  'Loyalty+',
  'Meda Billing',
  'Not sure yet',
] as const;
