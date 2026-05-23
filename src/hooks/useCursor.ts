import { useEffect } from 'react';

/** Cursor custom (dot + outline) — desabilitado em telas <= 900px via CSS. */
export function useCursor() {
  useEffect(() => {
    const dot = document.querySelector<HTMLDivElement>('.cursor-dot');
    const outline = document.querySelector<HTMLDivElement>('.cursor-outline');
    if (!dot || !outline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outX = 0;
    let outY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };
    document.addEventListener('mousemove', onMove);

    const animate = () => {
      outX += (mouseX - outX) * 0.12;
      outY += (mouseY - outY) * 0.12;
      outline.style.left = `${outX}px`;
      outline.style.top = `${outY}px`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const interactive = document.querySelectorAll(
      'a, button, .feature-card, .pricing-card, .commitment-card, .system-showcase-points li',
    );
    const onEnter = () => {
      outline.style.width = '52px';
      outline.style.height = '52px';
      outline.style.borderColor = 'rgba(0,212,255,0.8)';
      dot.style.width = '6px';
      dot.style.height = '6px';
    };
    const onLeave = () => {
      outline.style.width = '32px';
      outline.style.height = '32px';
      outline.style.borderColor = 'rgba(0,212,255,0.5)';
      dot.style.width = '8px';
      dot.style.height = '8px';
    };
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);
}
