import { useEffect } from 'react';

/** Adiciona `.scrolled` no #header quando scrollY > 20. */
export function useScrollHeader() {
  useEffect(() => {
    const header = document.getElementById('header');
    if (!header) return;
    const check = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);
}

/** Atualiza --scroll-pct CSS var conforme página rola. */
export function useScrollOrb() {
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        const pct = max > 0 ? window.scrollY / max : 0;
        document.body.style.setProperty('--scroll-pct', String(pct));
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

/** Destaca link da nav quando a seção correspondente está visível. */
export function useActiveNavLink() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const links = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
    if (!sections.length || !links.length) return;

    const update = () => {
      const scrollY = window.scrollY + 120;
      sections.forEach((section) => {
        if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
          links.forEach((link) => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${section.id}`) {
              link.style.color = 'var(--cyan)';
            }
          });
        }
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
}

/** Smooth scroll para âncoras (offset 80px do header). */
export function useSmoothAnchors() {
  useEffect(() => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]:not([data-open-signup])',
    );
    const handler = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    };
    anchors.forEach((a) => a.addEventListener('click', handler));
    return () => anchors.forEach((a) => a.removeEventListener('click', handler));
  }, []);
}
