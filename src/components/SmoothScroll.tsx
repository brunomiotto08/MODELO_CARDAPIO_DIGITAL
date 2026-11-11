import { useEffect, type ReactNode } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const options = {
  autoRaf: true,
  anchors: true,
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
  lerp: 0.1,
};

function PauseWhenLocked() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const sync = () => {
      const locked = document.body.style.overflow === 'hidden';
      if (locked) lenis.stop();
      else lenis.start();
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, [lenis]);

  return null;
}

export function scrollWithLenis(
  lenis: Lenis | undefined,
  target: number | string | Element,
  immediate = false,
) {
  if (lenis) {
    // Lenis atualiza o limite de rolagem com atraso. Sem isso, um clique
    // vindo de outra página prende o destino na altura da página anterior.
    if (typeof target !== 'number') lenis.resize();
    lenis.scrollTo(target, { immediate });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }
  const node = typeof target === 'string' ? document.querySelector(target) : target;
  node?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={options}>
      <PauseWhenLocked />
      {children}
    </ReactLenis>
  );
}
