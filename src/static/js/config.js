/* Kayange frontend runtime config.
 * Loaded on every page after /env.js (which sets window.KAYANGE_API_BASE).
 * - Sends every root-relative fetch('/…') to the API host.
 * - Derives the record id from the URL (pages like /patients/12/edit are one shared HTML file).
 */
(function () {
  var base = (window.KAYANGE_API_BASE || '').replace(/\/+$/, '');
  window.KAYANGE_API_BASE = base;

  // Record id from the URL: first numeric path segment (/patients/12/edit -> 12)
  var m = location.pathname.match(/\/(\d+)(?=\/|$)/);
  window.ROUTE_ID = m ? parseInt(m[1], 10) : null;

  // Route every app-relative fetch to the API origin; send the auth cookie too.
  if (base) {
    var nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      if (typeof input === 'string' && input.charAt(0) === '/' && input.charAt(1) !== '/') {
        input = base + input;
        init = Object.assign({ credentials: 'include' }, init || {});
      }
      return nativeFetch(input, init);
    };
  }

  // Fill __RID__ placeholders (links, titles, labels) once the DOM is ready.
  function fill() {
    if (window.ROUTE_ID === null) return;
    var id = String(window.ROUTE_ID);
    if (document.title.indexOf('__RID__') !== -1) document.title = document.title.split('__RID__').join(id);
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n, texts = [];
    while ((n = walker.nextNode())) if (n.nodeValue.indexOf('__RID__') !== -1) texts.push(n);
    texts.forEach(function (t) { t.nodeValue = t.nodeValue.split('__RID__').join(id); });
    document.querySelectorAll('[href*="__RID__"],[onclick*="__RID__"],[src*="__RID__"]').forEach(function (el) {
      ['href', 'onclick', 'src'].forEach(function (a) {
        var v = el.getAttribute(a);
        if (v && v.indexOf('__RID__') !== -1) el.setAttribute(a, v.split('__RID__').join(id));
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
