export interface ServiceLayer {
  id: 'frontend' | 'backend' | 'database' | 'infrastructure';
  index: string;
  name: string;
  headline: string;
  body: string;
  deliverablesLabel: string;
  deliverables: string[];
  stackLabel: string;
  stack: string[];
}

export interface ProcessStage {
  index: string;
  name: string;
  whatWeDo: string;
  youReceive: string;
  yourRole: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  body: string;
  builtFor: string;
  features: string[];
  before: string;
  after: string;
  href: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  built: string;
  context: string;
  points: string[];
  result: string;
  year: string;
  image: string;
}

export interface ClientLogo {
  name: string;
  file: string;
  sector: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export type Language = 'en' | 'id';
