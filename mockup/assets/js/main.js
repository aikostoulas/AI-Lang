(function () {
  'use strict';

  /* Links whose target has not been supplied yet: explain instead of jumping to the page top. */
  var toast = null, toastTimer = null;
  function showToast(message) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a.is-placeholder');
    if (!link) return;
    event.preventDefault();
    showToast((link.getAttribute('data-missing') || 'This resource') + ' will be linked here once it is available.');
  });

  /* Interactive guidelines graphic */
  var svg = document.querySelector('.graphic svg');
  if (!svg) return;
  var panel = document.querySelector('.g-panel');
  var defaultPanel = panel ? panel.innerHTML : '';
  var nodes = svg.querySelectorAll('.g-node');

  function activate(node) {
    svg.classList.add('has-active');
    nodes.forEach(function (n) { n.classList.toggle('is-active', n === node); });
    if (!panel) return;
    panel.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = node.getAttribute('data-title');
    var span = document.createElement('span');
    span.textContent = node.getAttribute('data-question');
    panel.appendChild(strong);
    panel.appendChild(span);
  }
  function reset() {
    svg.classList.remove('has-active');
    nodes.forEach(function (n) { n.classList.remove('is-active'); });
    if (panel) panel.innerHTML = defaultPanel;
  }
  nodes.forEach(function (node) {
    node.addEventListener('mouseenter', function () { activate(node); });
    node.addEventListener('focus', function () { activate(node); });
    node.addEventListener('mouseleave', reset);
    node.addEventListener('blur', reset);
  });

  /* On phones the labels move to a list below the graphic, so zoom in on the head. */
  var wide = svg.getAttribute('viewBox');
  var narrow = svg.getAttribute('data-narrow-viewbox');
  var query = window.matchMedia('(max-width: 700px)');
  function fit() { svg.setAttribute('viewBox', query.matches ? narrow : wide); }
  fit();
  if (query.addEventListener) query.addEventListener('change', fit);
})();
