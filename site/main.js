// Quotiflex website: the phone menu and the demo request form. No cookies, no storage, no trackers.

// The one place the form's address is set: the Formspree form that delivers demo requests.
// The id is public by design; the mailbox it forwards to lives only in the Formspree account.
const FORM_ENDPOINT = 'https://formspree.io/f/mljgbndd';
const SEND_TIMEOUT_MS = 15000;

const TEXT = {
  sending: 'Sending…',
  sent: 'Thank you. Your request has been sent, and we will answer by email.',
  failed: 'Sorry, the request could not be sent. Please try again later.',
  check: 'Please check the marked fields.',
};

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  setUpMenu();
  setUpDemoForm();
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

function setUpDemoForm() {
  const form = document.getElementById('demo-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const required = ['name', 'company', 'email', 'message'];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let busy = false;

  button.disabled = false;

  const say = (text, kind) => {
    status.textContent = text;
    status.classList.toggle('is-ok', kind === 'ok');
    status.classList.toggle('is-error', kind === 'error');
  };

  const fieldIsValid = (name) => {
    const input = form.elements[name];
    const value = input.value.trim();
    return name === 'email' ? emailPattern.test(value) : value.length > 0;
  };

  const mark = (name, valid) => {
    const input = form.elements[name];
    const error = document.getElementById(`e-${name}`);
    input.setAttribute('aria-invalid', String(!valid));
    if (error) error.hidden = valid;
  };

  for (const name of required) {
    form.elements[name].addEventListener('input', () => {
      if (form.elements[name].getAttribute('aria-invalid') === 'true') mark(name, fieldIsValid(name));
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    const invalid = required.filter((name) => !fieldIsValid(name));
    for (const name of required) mark(name, !invalid.includes(name));
    if (invalid.length) {
      say(TEXT.check, 'error');
      form.elements[invalid[0]].focus();
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      company: form.elements.company.value.trim(),
      email: form.elements.email.value.trim(),
      preferred_time: form.elements.preferred_time.value.trim(),
      message: form.elements.message.value.trim(),
      _gotcha: form.elements._gotcha.value,
      _subject: 'Demo request from the Quotiflex website',
    };

    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    say(TEXT.sending, null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      say(TEXT.sent, 'ok');
    } catch {
      // Whatever the service answered, the visitor sees only our own words.
      say(TEXT.failed, 'error');
    } finally {
      clearTimeout(timer);
      busy = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
