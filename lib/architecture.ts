/**
 * The five layers of the scroll-driven architecture section, front end first.
 *
 * `name` and `body` are reused verbatim by the reduced-motion composition, the
 * `sr-only` list and the exploded-view labels, so the copy is declared once.
 *
 * `chips` is what the layer shows *inside* its slab while the stack is
 * assembled, so each slab reads as its own piece of the system rather than a
 * copy of the one in front of it. `hot` marks the single chip per layer that
 * carries the accent, and is an index into `chips`.
 */
export type LayerTone = 'accent' | 'ink' | 'mute';

export interface ArchitectureLayer {
  /** Stable identity for keys and layout targeting. */
  id: 'frontend' | 'api' | 'logic' | 'database' | 'infrastructure';
  /** Position in the stack, rendered as the badge on the label. */
  n: '1' | '2' | '3' | '4' | '5';
  name: string;
  /**
   * The label's text under `lg`, where the stack is taller than it is wide and
   * a full layer name cannot fit beside its slab without running off screen.
   */
  short: string;
  body: string;
  /** What the slab draws while the stack is closed. */
  chips: readonly string[];
  hot: number;
  tone: LayerTone;
}

/**
 * Layer copy. The first slab is the monitor's own screen, so its `body` is
 * written to the presentation layer the reader is looking at; the four under it
 * describe what serves that screen.
 */
export const ARCHITECTURE_LAYERS: readonly ArchitectureLayer[] = [
  {
    id: 'frontend',
    n: '1',
    name: 'Frontend / Presentation',
    short: 'Frontend',
    body: 'Interfaces, design system and client-side state.',
    chips: ['Overview', 'Orders', 'Reports'],
    hot: 0,
    tone: 'accent',
  },
  {
    id: 'api',
    n: '2',
    name: 'API Layer',
    short: 'API',
    body: 'Typed endpoints, authentication and validation.',
    chips: ['GET /orders', 'POST /orders', 'Auth'],
    hot: 1,
    tone: 'ink',
  },
  {
    id: 'logic',
    n: '3',
    name: 'Application / Business Logic',
    short: 'App Logic',
    body: 'Domain rules, workflows and background jobs.',
    chips: ['Rules', 'Workflows', 'Jobs'],
    hot: 1,
    tone: 'ink',
  },
  {
    id: 'database',
    n: '4',
    name: 'Database',
    short: 'Database',
    body: 'Schema, migrations, indexing and backups.',
    chips: ['customers', 'orders', 'invoices'],
    hot: 1,
    tone: 'ink',
  },
  {
    id: 'infrastructure',
    n: '5',
    name: 'Infrastructure / Deployment',
    short: 'Infra',
    body: 'CI/CD, containers, monitoring and scaling.',
    chips: ['CI/CD', 'Containers', 'Monitoring'],
    hot: 1,
    tone: 'mute',
  },
];

/** Width of one slab, and the clearance between it and the slab behind it. */
export const SLAB_WIDTH = 'min(34vw, 470px)';
export const SLAB_GAP = 'min(14vw, 210px)';

/**
 * Height of the scroll track each storyboard beat gets, in viewport heights.
 * The last beat also holds the finished composition before the section lets go.
 */
export const SECTION_HEIGHT = '1000svh';

/**
 * The tagline under the finished composition.
 */
export const SYSTEM_FOOTER = {
  title: 'One system',
  body: 'Every layer below the screen is there to keep the one above it honest.',
} as const;
