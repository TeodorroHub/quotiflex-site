'use strict';

// Quotiflex website: the phone menu, the role tabs, the demo request form and the videos.
// No cookies, no storage, no trackers. Nothing is loaded from another address, except a
// YouTube video in privacy-enhanced mode once the visitor presses its play button.

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
    label: 'For sales managers',
    title: 'More time with the customer, less with the quote.',
    description: 'Three screens, a quote that adds its own accessories, notes that turn into changes, and a document ready to send. Approvals are asked and answered inside the quote.',
    points: ['Meeting notes to quote changes', 'Accessories added by the rules', 'The approval decision comes back to you'],
  },
  product: {
    label: 'For product managers',
    title: 'Your rules, without a developer.',
    description: 'Write a rule as one sentence, or fill in a table like a spreadsheet. Try it on a real quote before you save it, and see what it would change on every open quote.',
    points: ['Rules from a sentence or a table', 'A trial on a quote that saves nothing', 'The effect on open quotes before you publish'],
  },
  management: {
    label: 'For approvers and management',
    title: 'See the cost of every discount.',
    description: 'Minimum margins on each product, approval levels by margin, and a request that shows the difference in money. Every decision keeps its reason, in the deal journal.',
    points: ['A margin floor on each product', 'Approval levels set without code', 'Every decision with its reason'],
  },
};

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  setUpMenu();
  setUpTabs();
  setUpDemoForm();
  setUpVideos();
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

// A video is a link to YouTube with our own poster. Pressing it puts YouTube's
// privacy-enhanced player (youtube-nocookie.com) in its place and starts the video;
// before that, nothing is requested from YouTube. Without script the link opens YouTube.
// The video library has one player and a list: choosing a video in the list puts it in the
// player and starts it, and the address gets the video's anchor (#video-...), so a link to
// the page with that anchor opens the section with that video in the player. The anchors sit
// at the top of the player, so the browser scrolls a link with one to the player by itself.
function setUpVideos() {
  let playing = null;
  const play = (poster) => {
    const id = poster.dataset.youtube;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return false;
    const frame = document.createElement('div');
    frame.className = 'video-frame';
    const player = document.createElement('iframe');
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
    player.title = poster.getAttribute('aria-label').replace(/^Play the video: /, '');
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.append(player);
    stop();
    poster.replaceWith(frame);
    playing = { frame, poster };
    player.focus();
    return true;
  };
  const stop = () => {
    if (playing) playing.frame.replaceWith(playing.poster);
    playing = null;
  };
  const plainClick = (event) => !(event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0);

  document.querySelectorAll('a.video-poster[data-youtube]').forEach((poster) => {
    poster.addEventListener('click', (event) => {
      if (plainClick(event) && play(poster)) event.preventDefault();
    });
  });

  const library = document.querySelector('[data-video-library]');
  if (!library) return;
  const poster = library.querySelector('.video-poster');
  const items = [...library.querySelectorAll('.video-item')];
  const field = (name) => library.querySelector(`[data-video-${name}]`);

  const select = (item) => {
    stop();
    items.forEach((other) => other.toggleAttribute('aria-current', other === item));
    item.setAttribute('aria-current', 'true');
    const title = item.querySelector('.video-item-title').textContent;
    const base = item.dataset.poster;
    poster.href = item.href;
    poster.dataset.youtube = item.dataset.youtube;
    poster.setAttribute('aria-label', `Play the video: ${title.replace(/\.$/, '')}, ${item.dataset.lengthLabel}`);
    poster.querySelector('source').srcset = `${base}-640.webp 640w, ${base}-1280.webp 1280w, ${base}-1920.webp 1920w`;
    poster.querySelector('img').src = `${base}-1280.jpg`;
    poster.querySelector('.video-time').textContent = item.dataset.length;
    field('topic').textContent = item.querySelector('.video-item-topic').textContent;
    field('title').textContent = title;
    field('desc').textContent = item.dataset.desc;
    field('watch').href = item.href;
    const page = field('page');
    if (page && item.dataset.page) page.href = item.dataset.page;
  };

  const showPlayer = () => {
    const top = library.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight / 3) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      library.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
  };

  items.forEach((item) => {
    item.addEventListener('click', (event) => {
      if (!plainClick(event)) return;
      event.preventDefault();
      select(item);
      history.replaceState(null, '', `#${item.dataset.anchor}`);
      showPlayer();
      play(poster);
    });
  });

  const fromAddress = () => {
    const item = items.find((candidate) => `#${candidate.dataset.anchor}` === location.hash);
    if (item) select(item);
  };
  fromAddress();
  window.addEventListener('hashchange', fromAddress);
}
