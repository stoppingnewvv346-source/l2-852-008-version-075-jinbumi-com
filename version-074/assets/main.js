(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var button = qs('[data-menu-toggle]');
    var nav = qs('[data-mobile-nav]');
    if (!button || !nav) return;
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initBackTop() {
    qsa('[data-back-top]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function initHero() {
    var root = qs('[data-hero]');
    if (!root) return;
    var slides = qsa('[data-hero-slide]', root);
    var dots = qsa('[data-hero-dot]', root);
    var prev = qs('[data-hero-prev]', root);
    var next = qs('[data-hero-next]', root);
    if (!slides.length) return;
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function go(step) {
      show(current + step);
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        go(1);
      }, 5600);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    if (prev) prev.addEventListener('click', function () { go(-1); start(); });
    if (next) next.addEventListener('click', function () { go(1); start(); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    start();
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function initCardFilters() {
    qsa('[data-card-filter]').forEach(function (input) {
      var section = input.closest('.catalog-section') || document;
      var cards = qsa('.movie-card', section);
      var empty = qs('[data-no-results]', section);
      input.addEventListener('input', function () {
        var value = normalize(input.value);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute('data-keywords') || card.textContent);
          var matched = !value || haystack.indexOf(value) !== -1;
          card.hidden = !matched;
          if (matched) visible += 1;
        });
        if (empty) empty.hidden = visible !== 0;
      });
    });
  }

  function initSearch() {
    var layer = qs('[data-search-layer]');
    var input = qs('[data-global-search]');
    var results = qs('[data-search-results]');
    if (!layer || !input || !results || !window.SEARCH_INDEX) return;

    function open() {
      layer.classList.add('open');
      layer.setAttribute('aria-hidden', 'false');
      setTimeout(function () { input.focus(); }, 30);
    }

    function close() {
      layer.classList.remove('open');
      layer.setAttribute('aria-hidden', 'true');
    }

    function render(items) {
      if (!items.length) {
        results.innerHTML = '<p class="no-results">未找到匹配影片</p>';
        return;
      }
      results.innerHTML = items.slice(0, 12).map(function (item) {
        return '<a class="search-result" href="' + item.url + '">' +
          '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '">' +
          '<span><strong>' + escapeHtml(item.title) + '</strong>' +
          '<p>' + escapeHtml(item.region + ' · ' + item.year + ' · ' + item.genre + '｜' + item.line) + '</p></span></a>';
      }).join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function search() {
      var q = normalize(input.value);
      if (!q) {
        results.innerHTML = '';
        return;
      }
      var items = window.SEARCH_INDEX.filter(function (item) {
        return normalize([item.title, item.region, item.year, item.genre, item.line].join(' ')).indexOf(q) !== -1;
      });
      render(items);
    }

    qsa('[data-search-open]').forEach(function (button) {
      button.addEventListener('click', open);
    });
    qsa('[data-search-close]').forEach(function (button) {
      button.addEventListener('click', close);
    });
    layer.addEventListener('click', function (event) {
      if (event.target === layer) close();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });
    input.addEventListener('input', search);
  }

  function initHomeSearch() {
    qsa('.home-search').forEach(function (form) {
      form.addEventListener('submit', function () {
        var input = form.querySelector('input[name="q"]');
        if (input && input.value.trim()) {
          sessionStorage.setItem('movieSearchQuery', input.value.trim());
        }
      });
    });
    var filter = qs('[data-card-filter]');
    var stored = sessionStorage.getItem('movieSearchQuery');
    if (filter && stored) {
      filter.value = stored;
      sessionStorage.removeItem('movieSearchQuery');
      filter.dispatchEvent(new Event('input'));
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initBackTop();
    initHero();
    initCardFilters();
    initSearch();
    initHomeSearch();
  });
})();
