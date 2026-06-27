/* ============================================================
   ANIMATIONS — Sebei Property Partners
   Respects prefers-reduced-motion throughout
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== 1. HERO ENTRANCE ===== */
function initHeroAnimation() {
  if (reducedMotion) return;
  const targets = document.querySelectorAll('.hero-animate');
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.13}s, transform 0.7s ease ${i * 0.13}s`;
    /* Trigger on next frame so the transition fires */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
}

/* ===== 2. SCROLL-REVEAL CARDS (Intersection Observer, staggered) ===== */
function initCardReveal() {
  if (reducedMotion) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal-card {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .reveal-card.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const observe = (grid) => {
    const cards = grid.querySelectorAll('.reveal-card');
    if (!cards.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card  = entry.target;
        const cards = Array.from(grid.querySelectorAll('.reveal-card'));
        const idx   = cards.indexOf(card);
        setTimeout(() => card.classList.add('revealed'), idx * 80);
        io.unobserve(card);
      });
    }, { threshold: 0.12 });

    cards.forEach(card => io.observe(card));
  };

  /* Observe any grid present now */
  document.querySelectorAll('.properties-grid').forEach(observe);

  /* Re-observe when the grid is dynamically populated (listings/featured) */
  const grids = document.querySelectorAll('.properties-grid');
  grids.forEach(grid => {
    new MutationObserver(() => observe(grid)).observe(grid, { childList: true });
  });
}

/* ===== 3. STATS COUNTER ===== */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-item strong[data-count]');
  if (!stats.length) return;

  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animateCount = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = reducedMotion ? 0 : 1600;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(ease(progress) * target);
      el.textContent = new Intl.NumberFormat('en-UG').format(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => io.observe(el));
}

/* ===== 4. SMOOTH SCROLL for anchor links ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/* ===== 5. SECTION FADE-IN (non-card sections) ===== */
function initSectionReveal() {
  if (reducedMotion) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal-section {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal-section.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-section').forEach(el => io.observe(el));
}

/* ===== BOOT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  initCardReveal();
  initStatsCounter();
  initSmoothScroll();
  initSectionReveal();
});
