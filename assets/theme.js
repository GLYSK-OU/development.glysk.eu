/* GLYSK — light / dark / auto theme toggle
   Ported from anglerbook.fun (same mechanism), repaletted for GLYSK.
   Load this in <head> so the theme is set before first paint (no flash).
   Cycles: Auto (system) -> Light -> Dark. Persists to localStorage.
*/
(function () {
  var KEY = 'glysk-theme';
  var MODES = ['system', 'light', 'dark'];
  var LABELS = { system: 'Auto', light: 'Light', dark: 'Dark' };
  var ICON = {
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    light:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>'
  };
  var META = { light: '#F6F3EE', dark: '#111111' };
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function getMode() { try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; } }
  function setMode(m) { try { localStorage.setItem(KEY, m); } catch (e) {} }
  function resolve(m) { return (m === 'dark' || (m === 'system' && mq.matches)) ? 'dark' : 'light'; }
  function apply(m) {
    var r = resolve(m);
    document.documentElement.setAttribute('data-theme', r);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', META[r]);
  }

  apply(getMode());

  function render(btn, m) {
    btn.innerHTML = ICON[m] + '<span>' + LABELS[m] + '</span>';
    var next = MODES[(MODES.indexOf(m) + 1) % MODES.length];
    btn.setAttribute('aria-label', 'Theme: ' + LABELS[m] + '. Activate for ' + LABELS[next] + '.');
    btn.title = 'Theme: ' + LABELS[m];
  }
  function init() {
    var btn = document.getElementById('theme-btn');   // in-header button (advisory/holdings/development)
    var injected = false;
    if (!btn) {
      if (document.querySelector('.theme-toggle')) return;
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-toggle theme-toggle--floating';
      injected = true;
    }
    render(btn, getMode());
    btn.addEventListener('click', function () {
      var m = MODES[(MODES.indexOf(getMode()) + 1) % MODES.length];
      setMode(m); apply(m); render(btn, m);
    });
    if (injected) document.body.appendChild(btn);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  var onSys = function () { if (getMode() === 'system') apply('system'); };
  if (mq.addEventListener) mq.addEventListener('change', onSys);
  else if (mq.addListener) mq.addListener(onSys);
})();
