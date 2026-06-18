(function () {
  function all(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector),
    );
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("hidden");
      var icon = button.querySelector(".menu-icon");
      if (icon) {
        icon.textContent = menu.classList.contains("hidden") ? "☰" : "×";
      }
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = all("[data-hero-slide]", root);
    var dots = all("[data-hero-dot]", root);
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        var active = idx === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        show(idx);
        restart();
      });
    });
    show(0);
    restart();
  }

  function textValue(card) {
    return [
      card.getAttribute("data-title") || "",
      card.getAttribute("data-genre") || "",
      card.getAttribute("data-year") || "",
      card.getAttribute("data-region") || "",
      card.getAttribute("data-type") || "",
      card.textContent || "",
    ]
      .join(" ")
      .toLowerCase();
  }

  function setupFilters() {
    var cards = all("[data-movie-card]");
    if (!cards.length) {
      return;
    }
    var input = document.querySelector("[data-search-input]");
    var genre = document.querySelector("[data-genre-select]");
    var reset = document.querySelector("[data-filter-reset]");
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || params.get("keyword") || "";
    if (input && q) {
      input.value = q;
    }

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var selected = genre ? genre.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var text = textValue(card);
        var genreText = (card.getAttribute("data-genre") || "").toLowerCase();
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchGenre =
          !selected ||
          genreText.indexOf(selected) !== -1 ||
          text.indexOf(selected) !== -1;
        card.hidden = !(matchQuery && matchGenre);
      });
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (genre) {
      genre.addEventListener("change", apply);
    }
    if (reset) {
      reset.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (genre) {
          genre.value = "";
        }
        apply();
      });
    }
    apply();
  }

  function setupPlayers() {
    all("[data-player]").forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector("[data-play-button]");
      var stream = box.getAttribute("data-stream");
      var hlsInstance = null;
      var started = false;
      if (!video || !button || !stream) {
        return;
      }

      function begin() {
        if (started) {
          video.play().catch(function () {});
          return;
        }
        started = true;
        button.classList.add("hidden");
        video.setAttribute("controls", "controls");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          video.play().catch(function () {});
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          video.addEventListener(
            "loadedmetadata",
            function () {
              video.play().catch(function () {});
            },
            { once: true },
          );
          return;
        }
        video.src = stream;
        video.play().catch(function () {});
      }

      button.addEventListener("click", begin);
      video.addEventListener("click", function () {
        if (!started) {
          begin();
        }
      });
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
