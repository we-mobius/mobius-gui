import "../pages/index";

setTimeout(() => {
  document.documentElement.setAttribute('data-theme', 'light')
}, 5000);

setTimeout(() => {
  document.documentElement.setAttribute('data-theme', 'dark')
}, 10000);
