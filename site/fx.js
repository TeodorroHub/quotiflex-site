'use strict';
// The motion of the Quotiflex application on the website: the highlight that follows the
// pointer over glass and buttons, blocks that settle in as they enter the screen, and the
// sliding thumb of the segmented control. Nothing here is needed to read or use the page;
// with reduced motion asked for, only the static look remains.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Blocks start hidden only when this script runs, so the page never stays blank without it.
  if (!reduced && 'IntersectionObserver' in window) document.documentElement.classList.add('fx');

  document.addEventListener('DOMContentLoaded', () => {
    // Specular highlight under the pointer (the app's --x/--y on .glass and .btn).
    if (!reduced && window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('pointermove', (event) => {
        const surface = event.target.closest('.glass, .glass-solid, .btn');
        if (!surface) return;
        const box = surface.getBoundingClientRect();
        surface.style.setProperty('--x', `${event.clientX - box.left}px`);
        surface.style.setProperty('--y', `${event.clientY - box.top}px`);
      }, { passive: true });
    }

    // Blocks settle in once, as they come into view; siblings follow one another.
    const blocks = [...document.querySelectorAll('.reveal')];
    if (reduced || !('IntersectionObserver' in window)) {
      blocks.forEach((block) => block.classList.add('in'));
    } else {
      const seen = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          seen.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      blocks.forEach((block) => {
        const group = block.parentElement.querySelectorAll(':scope > .reveal');
        block.style.setProperty('--i', String([...group].indexOf(block)));
        seen.observe(block);
      });
    }

    // The thumb of the segmented control slides to the selected tab.
    document.querySelectorAll('.seg').forEach((seg) => {
      const thumb = document.createElement('span');
      thumb.className = 'seg-thumb';
      thumb.setAttribute('aria-hidden', 'true');
      seg.prepend(thumb);
      const place = () => {
        const tab = seg.querySelector('[aria-selected="true"]');
        if (!tab) return;
        thumb.style.left = `${tab.offsetLeft}px`;
        thumb.style.width = `${tab.offsetWidth}px`;
      };
      place();
      new MutationObserver(place).observe(seg, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
      window.addEventListener('resize', place, { passive: true });
      if (document.fonts) document.fonts.ready.then(place);
    });
  });
})();
