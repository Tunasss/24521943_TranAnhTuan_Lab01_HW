const root = document.documentElement;

// ----- Theme toggle -----
const themeToggle = document.querySelector('#theme-toggle');

function syncThemeButton() {
  themeToggle.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
}
syncThemeButton();

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  syncThemeButton();
  try {
    localStorage.setItem('theme', next);
  } catch (error) {
    // Ignore: the theme still changes for this visit.
  }
});

// ----- Mobile navigation -----
const navToggle = document.querySelector('#nav-toggle');
const siteNav = document.querySelector('#site-nav');

function openNav() {
  siteNav.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  siteNav.querySelector('a').focus();          // move focus into the menu
}

function closeNav(returnFocus = false) {
  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) navToggle.focus();          // give focus back to the trigger
}

navToggle.addEventListener('click', () => {
  if (siteNav.classList.contains('open')) closeNav();
  else openNav();
});

siteNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeNav();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && siteNav.classList.contains('open')) {
    closeNav(true);
  }
});

// ----- Loading skeleton for the project cards -----
// This is a static site, so the delay is simulated. With real data,
// remove the attribute when the fetch() promise resolves instead.
const cards = document.querySelector('.cards');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  setTimeout(() => cards.removeAttribute('data-loading'), reduceMotion ? 0 : 900);
});

// ----- Footer year -----
document.querySelector('#year').textContent = new Date().getFullYear();
