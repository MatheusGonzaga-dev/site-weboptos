import { useEffect } from 'react';

/** AOS lite — adiciona classe `aos-animate` quando elemento entra na viewport. */
export function useAOS(dep?: unknown) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-aos]:not(.aos-animate)');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(
              (entry.target as HTMLElement).dataset.aosDelay || '0',
              10,
            );
            window.setTimeout(() => {
              (entry.target as HTMLElement).classList.add('aos-animate');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [dep]);
}
