import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { scrollWithLenis } from '../components/SmoothScroll';
import Hero from '../components/Hero';
import About from '../components/About';
import Catalog from '../components/Catalog';
import RealTables from '../components/RealTables';
import EventsSection from '../components/EventsSection';
import HowToOrder from '../components/HowToOrder';
import ContactInfo from '../components/ContactInfo';
import Faq from '../components/Faq';
import { useSeo } from '../seo/useSeo';

export default function HomePage() {
  const { hash } = useLocation();
  const lenis = useLenis();
  useSeo('/');

  useEffect(() => {
    let cancelled = false;

    const align = () => {
      if (cancelled) return;
      if (!hash) {
        scrollWithLenis(lenis, 0, true);
        return;
      }
      const target = document.querySelector(hash);
      if (target) scrollWithLenis(lenis, target);
    };

    const frame = window.requestAnimationFrame(align);
    // A página anterior ainda ocupa o layout durante a transição.
    const afterTransition = window.setTimeout(align, 480);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(afterTransition);
    };
  }, [hash, lenis]);

  return (
    <main>
      <Hero />
      <About />
      <Catalog />
      <RealTables />
      <EventsSection />
      <HowToOrder />
      <ContactInfo />
      <Faq />
    </main>
  );
}
