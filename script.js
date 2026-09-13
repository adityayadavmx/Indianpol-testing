const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const navWrap = document.querySelector('.nav-wrap');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// Sticky-nav state
const updateNav = () => navWrap?.classList.toggle('scrolled', window.scrollY > 18);
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

// Premium reveal system
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Gentle pointer depth on desktop — deliberately restrained.
const dashboard = document.querySelector('.dashboard-shell');
if (dashboard && window.matchMedia('(pointer:fine)').matches) {
  dashboard.addEventListener('pointermove', e => {
    const r = dashboard.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    dashboard.style.transform = `perspective(1200px) rotateY(${x * -5 - 4}deg) rotateX(${y * -3 + 2}deg) translateY(-4px)`;
  });
  dashboard.addEventListener('pointerleave', () => {
    dashboard.style.transform = '';
  });
}

// Count-up effect for the headline metrics.
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.8 });
counters.forEach(el => counterObserver.observe(el));

// Make cards feel alive without becoming distracting.
document.querySelectorAll('.founder, .work-card, .stage-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  });
});
