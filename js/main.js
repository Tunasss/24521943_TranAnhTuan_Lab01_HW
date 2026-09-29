const root = document.documentElement;

// ----- Theme toggle -----
const themeToggle = document.querySelector('#theme-toggle');

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch (error) {
    // Ignore: the theme still changes for this visit.
  }
});

// ----- Mobile navigation toggle -----
const navToggle = document.querySelector('#nav-toggle');
const siteNav = document.querySelector('#site-nav');

navToggle.addEventListener('click', () => {
  siteNav.classList.toggle('open');
});

siteNav.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    siteNav.classList.remove('open');
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
