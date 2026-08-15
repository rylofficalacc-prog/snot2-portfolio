const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-word').forEach((el, index) => {
  if (!reduceMotion) el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(el);
});

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const progressBar = document.querySelector('.scroll-progress span');
const sectionLinks = [...document.querySelectorAll('.nav a')];
const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

function updateScrollUI() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? (scrollY / max) * 100 : 0;
  if (progressBar) progressBar.style.width = `${pct}%`;

  let active = '';
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top < innerHeight * .45) active = `#${section.id}`;
  });
  sectionLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === active));
}
addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

function updateNewYorkTime() {
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
  const target = document.querySelector('#local-time');
  if (target) target.textContent = time;
}
updateNewYorkTime();
setInterval(updateNewYorkTime, 30000);

const copyButton = document.querySelector('.copy-discord');
const toast = document.querySelector('.toast');
copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy || '');
    toast?.classList.add('show');
    setTimeout(() => toast?.classList.remove('show'), 1700);
  } catch {
    const strong = copyButton.querySelector('strong');
    if (strong) strong.textContent = 'snot2_';
  }
});

document.querySelectorAll('[data-placeholder-link]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

if (window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
  const cursor = document.querySelector('.cursor');
  let x = innerWidth / 2, y = innerHeight / 2;
  let tx = x, ty = y;

  addEventListener('mousemove', (event) => {
    tx = event.clientX; ty = event.clientY;
    cursor.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');

  function drawCursor() {
    x += (tx - x) * .19;
    y += (ty - y) * .19;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    requestAnimationFrame(drawCursor);
  }
  drawCursor();

  document.querySelectorAll('a, button, .project-row, .project-featured').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const r = el.getBoundingClientRect();
      const dx = event.clientX - (r.left + r.width / 2);
      const dy = event.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * .10}px, ${dy * .10}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
}
