// Quotiflex website: the phone menu and the demo request form. No cookies, no storage, no trackers.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  setUpMenu();
});

function setUpMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const label = toggle.querySelector('.visually-hidden');
  const icon = toggle.querySelector('use');

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close menu' : 'Menu';
    if (icon) icon.setAttribute('href', open ? '#i-close' : '#i-menu');
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}
