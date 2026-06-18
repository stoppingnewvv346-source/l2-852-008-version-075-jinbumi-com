(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    initHero();
    initFilters();
    initGlobalSearch();
  });

  function initHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }

    var bg = Array.prototype.slice.call(root.querySelectorAll("[data-hero-bg]"));
    var copy = Array.prototype.slice.call(root.querySelectorAll("[data-hero-copy]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function activate(nextIndex) {
      index = (nextIndex + bg.length) % bg.length;
      bg.forEach(function (item, i) {
        item.classList.toggle("is-active", i === index);
      });
      copy.forEach(function (item, i) {
        item.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (item, i) {
        item.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = setInterval(function () {
        activate(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        activate(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        activate(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        activate(i);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    start();
  }

  function initFilters() {
    var panel = document.querySelector("[data-filter-panel]");
    var grid = document.querySelector("[data-card-grid]");
    if (!panel || !grid) {
      return;
    }

    var search = panel.querySelector("[data-filter-search]");
    var year = panel.querySelector("[data-filter-year]");
    var kind = panel.querySelector("[data-filter-kind]");
    var region = panel.querySelector("[data-filter-region]");
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query && search) {
      search.value = query;
    }

    function valueOf(el) {
      return el ? el.value.trim().toLowerCase() : "";
    }

    function apply() {
      var term = valueOf(search);
      var yearValue = valueOf(year);
      var kindValue = valueOf(kind);
      var regionValue = valueOf(region);
      var visible = 0;

      cards.forEach(function (card) {
        var title = (card.getAttribute("data-title") || "").toLowerCase();
        var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
        var cardKind = (card.getAttribute("data-kind") || "").toLowerCase();
        var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
        var tags = (card.getAttribute("data-tags") || "").toLowerCase();
        var text = title + " " + cardYear + " " + cardKind + " " + cardRegion + " " + tags;
        var matched = true;

        if (term && text.indexOf(term) === -1) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        if (kindValue && cardKind !== kindValue) {
          matched = false;
        }
        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }

        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [search, year, kind, region].forEach(function (el) {
      if (el) {
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
      }
    });

    apply();
  }

  function initGlobalSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-global-search-form]"));
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var q = input ? input.value.trim() : "";
        var target = "./all.html";
        if (q) {
          target += "?q=" + encodeURIComponent(q);
        }
        window.location.href = target;
      });
    });
  }

  window.setupStreamPlayer = function (streamUrl) {
    ready(function () {
      var video = document.getElementById("movie-video");
      var overlay = document.getElementById("movie-play-overlay");
      var attached = false;
      var hls = null;

      if (!video || !streamUrl) {
        return;
      }

      function attach() {
        if (attached) {
          return;
        }
        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }

      function hideOverlay() {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      }

      function play() {
        attach();
        hideOverlay();
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {});
        }
      }

      attach();

      if (overlay) {
        overlay.addEventListener("click", play);
      }

      video.addEventListener("play", hideOverlay);
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  };
})();
