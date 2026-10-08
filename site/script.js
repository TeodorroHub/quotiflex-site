'use strict';

// Quotiflex website: the phone menu, the role tabs and the demo request form.
// No cookies, no storage, no trackers, nothing loaded from another address.

// The one place the form's address is set: the Formspree form that delivers demo requests.
// The id is public by design; the mailbox it forwards to lives only in the Formspree account.
const FORM_ENDPOINT = 'https://formspree.io/f/mljgbndd';
const SEND_TIMEOUT_MS = 15000;

const FORM_TEXT = {
  sending: 'Sending…',
  sent: 'Thank you. Your request has been sent, and we will answer by email.',
  failed: 'Sorry, the request could not be sent. Please try again later.',
  check: 'Please check the marked fields.',
};

const ROLES = {
  sales: {
    label: 'For sales teams',
    title: 'Keep the customer conversation moving.',
    description: 'Build a clear proposal around the customer’s requirements. Keep versions, commercial terms and the next step in one place.',
    points: ['Structured proposals', 'Clear commercial terms', 'Visible quote progress'],
  },
  engineering: {
    label: 'For engineering teams',
    title: 'Bring technical detail into the conversation.',
    description: 'Connect product requirements to the proposal. Help sales keep product choices and technical specifications clear as the quote evolves.',
    points: ['Structured product requirements', 'Traceable configuration choices', 'A shared technical context'],
  },
  finance: {
    label: 'For finance teams',
    title: 'Keep commercial decisions in perspective.',
    description: 'Review pricing, discounts and currency terms alongside the proposal. Keep approval decisions connected to the quote version.',
    points: ['Pricing and discount visibility', 'Currency context', 'Traceable approval decisions'],
  },
};

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  setUpMenu();
  setUpTabs();
  setUpDemoForm();
});

function setUpMenu() {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  if (!menu || !nav) return;
  const label = menu.querySelector('.visually-hidden');
  const icon = menu.querySelector('use');

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close menu' : 'Open menu';
    icon.setAttribute('href', open ? '#i-close' : '#i-menu');
  };

  menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      menu.focus();
    }
  });
}

function checkItem(text) {
  const svgNs = 'http://www.w3.org/2000/svg';
  const li = document.createElement('li');
  const svg = document.createElementNS(svgNs, 'svg');
  svg.setAttribute('class', 'ico');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(svgNs, 'use');
  use.setAttribute('href', '#i-check');
  svg.append(use);
  li.append(svg, document.createTextNode(text));
  return li;
}

function setUpTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panel = document.getElementById('role-panel');
  if (!tabs.length || !panel) return;

  const select = (tab) => {
    tabs.forEach((other) => {
      const active = other === tab;
      other.setAttribute('aria-selected', String(active));
      other.tabIndex = active ? 0 : -1;
    });
    const role = ROLES[tab.dataset.role];
    document.getElementById('role-label').textContent = role.label;
    document.getElementById('role-title').textContent = role.title;
    document.getElementById('role-description').textContent = role.description;
    document.getElementById('role-points').replaceChildren(...role.points.map(checkItem));
    panel.setAttribute('aria-labelledby', tab.id);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(tabs[next]);
        tabs[next].focus();
      }
    });
  });
}

function setUpDemoForm() {
  const form = document.getElementById('demo-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const required = ['name', 'email', 'company', 'message'];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let busy = false;

  button.disabled = false;

  const say = (text, kind) => {
    status.textContent = text;
    status.classList.toggle('is-ok', kind === 'ok');
    status.classList.toggle('is-error', kind === 'error');
  };

  const valueOf = (name) => form.elements.namedItem(name).value.trim();
  const isValid = (name) => (name === 'email' ? emailPattern.test(valueOf(name)) : valueOf(name).length > 0);
  const mark = (name, valid) => {
    form.elements.namedItem(name).setAttribute('aria-invalid', String(!valid));
    document.getElementById(`e-${name}`).hidden = valid;
  };

  for (const name of required) {
    const input = form.elements.namedItem(name);
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') mark(name, isValid(name));
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    const invalid = required.filter((name) => !isValid(name));
    for (const name of required) mark(name, !invalid.includes(name));
    if (invalid.length) {
      say(FORM_TEXT.check, 'error');
      form.elements.namedItem(invalid[0]).focus();
      return;
    }

    const payload = {
      name: valueOf('name'),
      email: valueOf('email'),
      company: valueOf('company'),
      preferred_time: valueOf('preferred_time'),
      message: valueOf('message'),
      _gotcha: form.elements.namedItem('_gotcha').value,
      _subject: 'Demo request from the Quotiflex website',
    };

    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    say(FORM_TEXT.sending, null);

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
      say(FORM_TEXT.sent, 'ok');
    } catch {
      // Whatever the service answered, the visitor sees only our own words.
      say(FORM_TEXT.failed, 'error');
    } finally {
      clearTimeout(timer);
      busy = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
