import { useEffect } from 'react';

/** Anima elementos `.counter[data-target]` ao entrar na viewport. */
export function useCounters() {
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.dataset.animated) return;
          el.dataset.animated = '1';
          const target = parseInt(el.dataset.target || '0', 10);
          const duration = 2000;
          const start = performance.now();
          const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
          const update = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOut(progress) * target);
            el.textContent = value.toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          observer.unobserve(el);
        });
      },
      { threshold: 0.3 },
    );

    counters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
}
