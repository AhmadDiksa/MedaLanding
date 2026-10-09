import { Section, SectionHead } from '@/components/primitives/Section';
import ServiceIndex from '@/components/primitives/ServiceIndex';
import { SERVICE_ROWS } from '@/lib/serviceRows';

/**
 * Services as a hover index: five offering lines in the order a system gets
 * built, one ink bar springing to whichever row is being read, and a preview
 * card that follows the pointer. Replaces the earlier accordion, which answered
 * the same question in the same shape as this.
 */
export default function ServicesSection() {
  return (
    <Section id="services" tone="surface" labelledBy="services-title">
      <SectionHead
        id="services-title"
        label="Services"
        title="One team for every layer"
        body="From the interface people use to the servers that keep it running, we design and build the whole system. No hand-offs between vendors."
      />

      <div className="mt-12">
        <ServiceIndex services={SERVICE_ROWS} />
      </div>
    </Section>
  );
}
