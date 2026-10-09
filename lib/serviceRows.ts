import { SERVICES } from '@/lib/data';
import type { ServiceRow } from '@/components/primitives/ServiceIndex';

const FRONTEND = SERVICES.find((service) => service.id === 'frontend')!;
const BACKEND = SERVICES.find((service) => service.id === 'backend')!;
const INFRASTRUCTURE = SERVICES.find((service) => service.id === 'infrastructure')!;

/**
 * The five rows the Services section indexes. Titles come from the reviewed
 * design; every deliverable and stack line below is copied from the real
 * capability groups in lib/data.ts, so nothing in the spec panel is invented
 * and each row stays reviewable against its source group.
 */
export const SERVICE_ROWS: ServiceRow[] = [
  {
    id: 'strategy',
    n: '01 / Strategy',
    title: 'Product strategy',
    left: 'Scope, architecture and delivery plan',
    right: 'Requirements · Design & scope',
    body: 'The requirements and design-and-scope stages, where we map users and workflows, separate what must exist on day one from what can wait, and agree what gets built.',
    deliverablesLabel: 'What you receive',
    deliverables: [
      'Requirements document and prioritised scope',
      'Clickable mockups and a PRD',
      'Quote and contract against the agreed scope',
    ],
    stackLabel: 'Covers',
    stack: ['Requirements', 'Design & scope', 'Handover'],
  },
  {
    id: 'web',
    n: '02 / Web platforms',
    title: 'Web platforms',
    left: 'Web apps, portals and internal tools',
    right: 'Next.js · TypeScript',
    body: FRONTEND.body,
    deliverablesLabel: FRONTEND.deliverablesLabel,
    deliverables: [
      'Business web apps and internal tools',
      'Customer portals and company websites',
      'Marketing sites that share the same design system',
    ],
    stackLabel: FRONTEND.stackLabel,
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    id: 'mobile',
    n: '03 / Mobile apps',
    title: 'Mobile apps',
    left: 'Android and iOS from one codebase',
    right: 'Flutter',
    body: 'One Flutter codebase for Android and iOS, built to share models, calls and validation with the web layer rather than duplicate them.',
    deliverablesLabel: FRONTEND.deliverablesLabel,
    deliverables: [
      'Android and iOS apps from one Flutter codebase',
      'Shared API client and offline-tolerant forms',
      'Release builds and store submission',
    ],
    stackLabel: FRONTEND.stackLabel,
    stack: ['Flutter', 'Dart', 'Android', 'iOS'],
  },
  {
    id: 'ai',
    n: '04 / AI features',
    title: 'AI features',
    left: 'APIs, integrations and workflow rules',
    right: 'Go · C# · TypeScript',
    body: 'The backend surface any model-backed feature needs: services, integrations and permission models that keep generated output inside the rules of your system.',
    deliverablesLabel: BACKEND.deliverablesLabel,
    deliverables: [
      'REST APIs and third-party integrations',
      'Users, roles and permission models',
      'Workflows, billing and notification systems',
    ],
    stackLabel: BACKEND.stackLabel,
    stack: BACKEND.stack,
  },
  {
    id: 'cloud',
    n: '05 / Cloud & DevOps',
    title: 'Cloud & DevOps',
    left: 'Environments, deploys and monitoring',
    right: 'Cloud · CI/CD',
    body: INFRASTRUCTURE.body,
    deliverablesLabel: INFRASTRUCTURE.deliverablesLabel,
    deliverables: INFRASTRUCTURE.deliverables,
    stackLabel: INFRASTRUCTURE.stackLabel,
    stack: INFRASTRUCTURE.stack,
  },
];
