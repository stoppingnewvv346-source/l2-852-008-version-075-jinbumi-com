(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, pos) {
        slide.classList.toggle('is-active', pos === current);
      });
      dots.forEach(function (dot, pos) {
        dot.classList.toggle('is-active', pos === current);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, pos) {
      dot.addEventListener('click', function () {
        show(pos);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        play();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
    show(0);
    play();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-local-filter]')).forEach(function (filter) {
    var input = filter.querySelector('[data-filter-input]');
    var category = filter.querySelector('[data-filter-category]');
    var region = filter.querySelector('[data-filter-region]');
    var year = filter.querySelector('[data-filter-year]');
    var grid = document.querySelector('[data-card-grid]');
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);

    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    function matchText(card, value) {
      if (!value) {
        return true;
      }
      return (card.getAttribute('data-search') || '').toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }

    function matchAttr(card, name, value) {
      if (!value) {
        return true;
      }
      return (card.getAttribute(name) || '') === value;
    }

    function apply() {
      if (!grid) {
        return;
      }
      var query = input ? input.value.trim() : '';
      var cat = category ? category.value : '';
      var reg = region ? region.value : '';
      var yr = year ? year.value : '';
      var visible = 0;
      Array.prototype.slice.call(grid.querySelectorAll('.movie-card')).forEach(function (card) {
        var ok = matchText(card, query) && matchAttr(card, 'data-category', cat) && matchAttr(card, 'data-region', reg) && matchAttr(card, 'data-year', yr);
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, category, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  });
})();
