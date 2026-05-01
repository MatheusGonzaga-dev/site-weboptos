/* ═══════════════════════════════════════════════
   WEBOPTOS — MAIN SCRIPT
═══════════════════════════════════════════════ */

/* ─── Custom Cursor ─── */
(function initCursor() {
  const dot     = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');

  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outX = 0, outY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateOutline() {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  document.querySelectorAll('a, button, .feature-card, .pricing-card, .commitment-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      outline.style.width  = '52px';
      outline.style.height = '52px';
      outline.style.borderColor = 'rgba(0,212,255,0.8)';
      dot.style.width  = '6px';
      dot.style.height = '6px';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.width  = '32px';
      outline.style.height = '32px';
      outline.style.borderColor = 'rgba(0,212,255,0.5)';
      dot.style.width  = '8px';
      dot.style.height = '8px';
    });
  });
})();

/* ─── Particles Canvas ─── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '0,102,255' : '0,212,255';
  };

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;

    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }
    }

    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  const count = Math.min(120, Math.floor((W * H) / 14000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,102,255,${0.08 * (1 - dist/130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ─── Header scroll effect ─── */
(function initHeader() {
  const header = document.getElementById('header');
  function check() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();

/* ─── Mobile Menu ─── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const open = menu.classList.contains('open');
    btn.querySelectorAll('span')[0].style.transform = open ? 'translateY(9px) rotate(45deg)' : '';
    btn.querySelectorAll('span')[1].style.opacity   = open ? '0' : '';
    btn.querySelectorAll('span')[2].style.transform = open ? 'translateY(-9px) rotate(-45deg)' : '';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
})();

/* ─── AOS — Animate On Scroll ─── */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  // delays are read inline from data-aos-delay attribute

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ─── Counter Animation ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        const target = parseInt(entry.target.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.round(easeOut(progress) * target);
          entry.target.textContent = value.toLocaleString('pt-BR');
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── Smooth Anchor Scroll ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Contact Form ─── */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WHATSAPP = '5511942131306';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = (data.get('nome') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const wpp = (data.get('whatsapp') || '').toString().trim();
    const mensagem = (data.get('mensagem') || '').toString().trim();

    const lines = [
      '*Contato — Weboptos*',
      `Nome: ${nome}`,
      `E-mail: ${email}`,
    ];
    if (wpp) lines.push(`WhatsApp: ${wpp}`);
    lines.push('', 'Mensagem:', mensagem || '(sem mensagem)');

    const text = lines.join('\n');
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();

/* ─── Active Nav Link on Scroll ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function update() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + section.id) {
            link.style.color = 'var(--cyan)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─── Glowing orb on scroll ─── */
(function initOrbs() {
  const body = document.body;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        body.style.setProperty('--scroll-pct', scrollPct);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ─── Bar chart animation on scroll ─── */
(function initBars() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach((bar, i) => {
    bar.style.setProperty('--i', i);
  });
})();

