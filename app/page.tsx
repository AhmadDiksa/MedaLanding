import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ArchitectureSection from '@/components/ArchitectureSection';
import ServicesSection from '@/components/ServicesSection';
import ProductsSection from '@/components/ProductsSection';
import WorkSection from '@/components/WorkSection';
import ProcessSection from '@/components/ProcessSection';
import AboutSection from '@/components/AboutSection';
import BlogSection from '@/components/BlogSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/primitives/ScrollProgress';

export default function Page() {
  return (
    <div id="top" className="min-h-[100dvh] bg-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        {/* <ArchitectureSection /> */}
        <ServicesSection />
        {/* <ProductsSection /> */}
        <WorkSection />
        <ProcessSection />
        <AboutSection />
        <BlogSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
