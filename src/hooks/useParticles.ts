import { useEffect } from 'react';

type P = {
  x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string;
};

/** Canvas de partículas conectadas que reagem ao mouse. */
export function useParticles() {
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    const particles: P[] = [];
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };

    const resetParticle = (p: P) => {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.vx = (Math.random() - 0.5) * 0.4;
      p.vy = (Math.random() - 0.5) * 0.4;
      p.r = Math.random() * 1.5 + 0.5;
      p.alpha = Math.random() * 0.4 + 0.1;
      p.color = Math.random() > 0.5 ? '0,102,255' : '0,212,255';
    };

    const createParticle = (): P => {
      const p: P = { x: 0, y: 0, vx: 0, vy: 0, r: 0, alpha: 0, color: '' };
      resetParticle(p);
      return p;
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', onMouseMove);
    resize();

    const count = Math.min(120, Math.floor((W * H) / 14000));
    for (let i = 0; i < count; i++) particles.push(createParticle());

    const update = (p: P) => {
      p.x += p.vx;
      p.y += p.vy;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }
      }
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) resetParticle(p);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        update(p);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]!;
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,102,255,${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}
