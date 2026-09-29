// Applies the saved (or system) theme before the page is painted.
(function () {
  var root = document.documentElement;
  var theme = null;

  try {
    theme = localStorage.getItem('theme');
  } catch (error) {
    // Storage can be unavailable (private mode); fall back to system preference.
  }

  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  root.setAttribute('data-theme', theme);
  root.classList.add('js');
})();
