/**
 * El único JavaScript del sitio: el conmutador de tema.
 *
 * Va inline en <head> y corre antes del primer pintado, así que no hay
 * parpadeo. Sin elección explícita del usuario NO toca nada: manda
 * prefers-color-scheme desde el CSS. Recién cuando alguien aprieta el botón se
 * escribe data-theme, se guarda en localStorage y se pisan los tres
 * <meta name="theme-color"> (el navegador usa el primero que matchea, así que
 * hay que sacarles el media a los tres o la elección no gana).
 *
 * La página entera funciona con este script bloqueado: el CSS ya resuelve
 * claro y oscuro por preferencia de sistema, y el botón simplemente no hace
 * nada en vez de romper algo.
 */
export const THEME_SCRIPT = `(function () {
  var root = document.documentElement;
  var KEY = 'theme';
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (stored === 'light' || stored === 'dark') { root.setAttribute('data-theme', stored); }

  function active() {
    return root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light');
  }

  function stampMeta() {
    if (!root.getAttribute('data-theme')) { return; }
    var color = getComputedStyle(root).getPropertyValue('--browser-chrome').trim();
    if (!color) { return; }
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].removeAttribute('media');
      metas[i].setAttribute('content', color);
    }
  }

  function sync(btn) {
    var dark = active() === 'dark';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.setAttribute('aria-label', dark ? btn.getAttribute('data-label-light') : btn.getAttribute('data-label-dark'));
  }

  function ready() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) { return; }
    sync(btn);
    stampMeta();
    btn.addEventListener('click', function () {
      root.setAttribute('data-theme', active() === 'dark' ? 'light' : 'dark');
      try { localStorage.setItem(KEY, root.getAttribute('data-theme')); } catch (e) {}
      sync(btn);
      stampMeta();
    });
    if (mq.addEventListener) {
      mq.addEventListener('change', function () {
        if (!root.getAttribute('data-theme')) { sync(btn); }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();`;
