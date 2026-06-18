(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-button]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function makeResultCard(item) {
    return [
      '<article class="movie-card">',
      '<a href="./' + escapeHtml(item.file) + '" class="card-link group">',
      '<div class="card-poster">',
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" onerror="this.classList.add(\'is-missing\')">',
      '<span class="card-year">' + escapeHtml(item.year) + '</span>',
      '<span class="card-play">立即播放</span>',
      '</div>',
      '<div class="card-body">',
      '<h3>' + escapeHtml(item.title) + '</h3>',
      '<p>' + escapeHtml(item.oneLine) + '</p>',
      '<div class="card-meta">',
      '<span>' + escapeHtml(item.region) + '</span>',
      '<span>' + escapeHtml(item.type) + '</span>',
      '</div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function initSearch() {
    var results = document.querySelector('[data-search-results]');
    var status = document.querySelector('[data-search-status]');
    if (!results || !status) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim();
    var input = document.querySelector('[data-search-input]');
    if (input) {
      input.value = q;
    }
    if (!q) {
      return;
    }
    var items = typeof SEARCH_ITEMS !== 'undefined' ? SEARCH_ITEMS : [];
    var key = q.toLowerCase();
    var matched = items.filter(function (item) {
      return item.searchText.indexOf(key) !== -1;
    }).slice(0, 96);
    if (!matched.length) {
      status.textContent = '没有找到匹配内容，请尝试其他关键词。';
      return;
    }
    status.textContent = '以下内容与“' + q + '”相关。';
    results.innerHTML = matched.map(makeResultCard).join('');
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('.player-start');
      var label = player.querySelector('.player-label');
      var status = player.querySelector('.player-status');
      var stream = player.getAttribute('data-stream');
      var started = false;
      var hlsInstance = null;

      function setStatus(text) {
        if (!status) {
          return;
        }
        status.textContent = text || '';
        status.classList.toggle('is-visible', Boolean(text));
      }

      function tryPlay() {
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            player.classList.remove('is-loading');
            player.classList.add('is-playing');
            setStatus('点击视频控件继续播放。');
          });
        }
      }

      function start() {
        if (!video || !stream) {
          setStatus('播放暂时不可用。');
          return;
        }
        if (started) {
          if (video.paused) {
            tryPlay();
          } else {
            video.pause();
          }
          return;
        }
        started = true;
        if (label) {
          label.textContent = '正在加载';
        }
        player.classList.add('is-loading');
        video.controls = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          video.addEventListener('loadedmetadata', function () {
            player.classList.remove('is-loading');
            player.classList.add('is-playing');
            tryPlay();
          }, { once: true });
          video.load();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            player.classList.remove('is-loading');
            player.classList.add('is-playing');
            tryPlay();
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus('播放暂时不可用，请稍后再试。');
              player.classList.remove('is-loading');
              if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
              }
            }
          });
          return;
        }

        setStatus('播放暂时不可用。');
        player.classList.remove('is-loading');
      }

      if (button) {
        button.addEventListener('click', start);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!started) {
            start();
          }
        });
        video.addEventListener('playing', function () {
          player.classList.remove('is-loading');
          player.classList.add('is-playing');
          setStatus('');
        });
        video.addEventListener('pause', function () {
          if (started) {
            player.classList.remove('is-playing');
          }
        });
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initPlayers();
  });
})();
