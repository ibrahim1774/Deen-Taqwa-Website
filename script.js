// Generate streak-style grid — looks like a real prayer log, not uniform noise
(function buildStreakGrid() {
  const grid = document.querySelector('.streak-grid');
  if (!grid) return;

  const cols = 14;
  const rows = 7;
  const total = cols * rows;

  // Realistic distribution: mostly high, some gaps — someone building the habit
  const weights = [4, 4, 4, 3, 4, 4, 2, 4, 4, 4, 4, 3, 4, 4, 4, 4, 1, 4, 4, 3, 4, 4, 4, 4, 4, 2, 4, 4];

  for (let i = 0; i < total; i++) {
    const cell = document.createElement('span');
    cell.className = 'streak-cell';

    // Use a seeded-ish pattern so it looks organic, not random noise
    const r = (Math.sin(i * 2.7) + 1) / 2;
    let level;
    if (r > 0.85) level = 4;
    else if (r > 0.55) level = 3;
    else if (r > 0.3) level = 2;
    else if (r > 0.15) level = 1;
    else level = 0;

    // Intro ramp — earlier cells lower, recent cells higher (building habit)
    if (i < 8 && level > 1) level = Math.max(0, level - 1);
    if (i > total - 12 && level < 3) level = Math.min(4, level + 1);

    if (level > 0) cell.classList.add('l' + level);
    grid.appendChild(cell);
  }
})();

// Smooth anchor scroll offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Intersection-based fade-up for feature blocks
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.step, .price-card, .learning__card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.6, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.6, 0.2, 1)';
  io.observe(el);
});
