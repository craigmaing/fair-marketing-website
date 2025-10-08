// Minimal enhancements for UX and analytics hooks
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = (e.currentTarget)?.getAttribute('href');
      const el = href && href !== '#' ? document.querySelector(href) : null;
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

