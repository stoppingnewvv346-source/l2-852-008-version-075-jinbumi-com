
(function() {
  const STREAM_SOURCES = [
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e398cb38b257828eeedbcaa0ae2856da/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/77ae15566dde5cfb920bae4712a38399/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/41cb67b47a3668efaea014219666e659/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/31227358d3c181b7168e28ad248cfb4e/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/d0af4221b8947fda8c23f4955947cb58/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e70b98acb53eb889d108057988609efb/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/86ea18f9954dbaf22eff5e16c41b4a25/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/2df81e778442675885257ce3e84c7173/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/af3d3f3b4940cee04efcd8ff2c9eef0a/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/60b4ddb3d166e1239abfc7adf611a6a3/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/a27121d514ff0079e1e81a6678f14e0c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/f0d38b8679a1231eff816a8e04cc1a0c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c66b5309b3b64d15ed856810d6cc0b72/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c99d86ece73a935b77e57d322461ddb5/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fe0c41d994d01211debb24e84e3384a9/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/929fdb8e536c1fc43a83b32d1a838547/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fbc04ae173a0e633458658e80ee78c2a/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/0ba4f146b0e6ea192526706f495d460f/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1e53f0e1aef7ec2fb5f30ef5d309d69c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1116997bf50b78f22bbfaced8975a021/manifest/video.m3u8"
];
  const THEME_PALETTES = [["#0f172a", "#4c1d95", "#f59e0b"], ["#111827", "#7c3aed", "#06b6d4"], ["#0b1020", "#2563eb", "#f97316"], ["#171717", "#be123c", "#f59e0b"], ["#0f172a", "#0f766e", "#22c55e"], ["#111827", "#7c2d12", "#fb7185"], ["#0b1020", "#1d4ed8", "#a855f7"], ["#111827", "#4338ca", "#f59e0b"], ["#0f172a", "#dc2626", "#f97316"], ["#10172a", "#9333ea", "#14b8a6"], ["#09101f", "#0ea5e9", "#22c55e"], ["#1f2937", "#8b5cf6", "#f59e0b"]];
  window.STREAM_SOURCES = STREAM_SOURCES;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function escapeHtml(str) {
    return (str ?? '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function themeForSeed(seed) {
    const idx = Math.abs(Number(seed || 0)) % THEME_PALETTES.length;
    const [c1, c2, c3] = THEME_PALETTES[idx];
    return { c1, c2, c3 };
  }

  function currentPathName() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function renderMovieCard(movie) {
    const theme = themeForSeed(movie.posterNo || movie.id);
    const tags = (movie.tags || []).slice(0, 3).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
    return `
      <article class="movie-card"
        data-movie-card
        data-title="${escapeHtml(movie.title)}"
        data-region="${escapeHtml(movie.region)}"
        data-genre="${escapeHtml(movie.genre)}"
        data-year="${escapeHtml(movie.year)}"
        data-tags="${escapeHtml((movie.tags || []).join(' '))}"
        data-score="${escapeHtml(movie.score || 0)}"
      >
        <a class="movie-link" href="${escapeHtml(movie.url)}">
          <div class="poster" style="--c1:${theme.c1};--c2:${theme.c2};--c3:${theme.c3};">
            <span class="poster-number">NO. ${String(movie.posterNo || movie.id).padStart(3, '0')}</span>
            <span class="poster-title">${escapeHtml(movie.title)}</span>
            <span class="poster-sub">${escapeHtml(movie.genre || '')}</span>
          </div>
          <div class="movie-meta">
            <h3 class="movie-title">${escapeHtml(movie.title)}</h3>
            <p class="movie-desc">${escapeHtml(movie.oneLine || '')}</p>
            <div class="movie-foot">
              <span class="badge">${escapeHtml(movie.region)} · ${escapeHtml(movie.year)}</span>
              <span class="badge">${escapeHtml(movie.genre || '')}</span>
            </div>
            <div class="tags">${tags}</div>
          </div>
        </a>
      </article>
    `;
  }

  function initNav() {
    const header = qs('.site-header');
    const toggle = qs('[data-menu-toggle]');
    if (toggle && header) {
      toggle.addEventListener('click', () => {
        header.classList.toggle('nav-open');
      });
    }

    const path = currentPathName();
    qsa('.nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path || (!path && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  function initQuickSearch() {
    qsa('[data-quick-search-form]').forEach(form => {
      const input = qs('input', form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = (input && input.value || '').trim();
        const url = new URL('search.html', location.href);
        if (q) url.searchParams.set('q', q);
        location.href = url.toString();
      });
    });
  }

  function initHeroCarousel() {
    const root = qs('[data-hero-carousel]');
    if (!root) return;

    const slides = qsa('.hero-slide', root);
    if (!slides.length) return;

    let idx = 0;
    let timer = null;

    function setHeroSlide(nextIdx) {
      idx = ((nextIdx % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      const dots = qsa('.hero-dot', root);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      const active = slides[idx];
      const title = qs('[data-hero-title]', root);
      const lead = qs('[data-hero-lead]', root);
      const meta = qs('[data-hero-meta]', root);
      const btnWatch = qs('[data-hero-watch]', root);
      const btnDetail = qs('[data-hero-detail]', root);
      const tagsWrap = qs('[data-hero-tags]', root);

      if (active) {
        const titleText = active.getAttribute('data-title') || '';
        const leadText = active.getAttribute('data-lead') || '';
        const metaText = active.getAttribute('data-meta') || '';
        const url = active.getAttribute('data-url') || '#';
        const tags = (active.getAttribute('data-tags') || '').split('|').filter(Boolean);

        if (title) title.textContent = titleText;
        if (lead) lead.textContent = leadText;
        if (meta) meta.textContent = metaText;
        if (btnWatch) btnWatch.setAttribute('href', url);
        if (btnDetail) btnDetail.setAttribute('href', url);
        if (tagsWrap) {
          tagsWrap.innerHTML = tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
        }

        const c1 = active.getAttribute('data-theme-c1');
        const c2 = active.getAttribute('data-theme-c2');
        const c3 = active.getAttribute('data-theme-c3');
        if (c1 && c2 && c3) {
          root.style.setProperty('--hero-c1', c1);
          root.style.setProperty('--hero-c2', c2);
          root.style.setProperty('--hero-c3', c3);
        }
      }
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => setHeroSlide(idx + 1), 5000);
    }

    qsa('[data-hero-prev]', root).forEach(btn => btn.addEventListener('click', () => {
      setHeroSlide(idx - 1);
      restart();
    }));

    qsa('[data-hero-next]', root).forEach(btn => btn.addEventListener('click', () => {
      setHeroSlide(idx + 1);
      restart();
    }));

    qsa('.hero-dot', root).forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.getAttribute('data-index') || '0', 10);
        setHeroSlide(n);
        restart();
      });
    });

    root.addEventListener('mouseenter', () => timer && clearInterval(timer));
    root.addEventListener('mouseleave', restart);

    setHeroSlide(0);
    restart();
  }

  function sortMovies(arr, mode) {
    const list = [...arr];
    if (mode === 'year-desc') {
      list.sort((a, b) => (b.year - a.year) || (b.score - a.score));
    } else if (mode === 'year-asc') {
      list.sort((a, b) => (a.year - b.year) || (b.score - a.score));
    } else if (mode === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
    } else {
      list.sort((a, b) => (b.score - a.score) || (b.year - a.year));
    }
    return list;
  }

  function filterMovies(list, query, facets) {
    const q = (query || '').trim().toLowerCase();
    return list.filter(m => {
      if (facets.region && facets.region !== 'all' && (m.region || '') !== facets.region) return false;
      if (facets.genre && facets.genre !== 'all') {
        const ok = (m.genre || '').includes(facets.genre) || (m.tags || []).includes(facets.genre);
        if (!ok) return false;
      }
      if (!q) return true;
      const hay = [
        m.title, m.region, m.genre, m.oneLine,
        ...(m.tags || [])
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  function initListPage() {
    const root = qs('[data-list-page]');
    if (!root || !window.MOVIES) return;

    const grid = qs('[data-list-grid]', root);
    const input = qs('[data-list-input]', root);
    const sort = qs('[data-list-sort]', root);
    const region = qs('[data-list-region]', root);
    const genre = qs('[data-list-genre]', root);
    const meta = qs('[data-list-meta]', root);
    const limit = parseInt(root.getAttribute('data-list-limit') || '48', 10);

    function refresh() {
      const facets = {
        region: region ? region.value : 'all',
        genre: genre ? genre.value : 'all',
      };
      const q = input ? input.value : '';
      const mode = sort ? sort.value : 'score';
      const shown = sortMovies(filterMovies(window.MOVIES, q, facets), mode).slice(0, limit);
      if (grid) {
        grid.innerHTML = shown.map(m => renderMovieCard(m)).join('');
      }
      if (meta) {
        meta.textContent = `已展示 ${shown.length} 条内容，支持按片名、地区、类型、标签检索。`;
      }
    }

    [input, sort, region, genre].forEach(el => {
      if (!el) return;
      el.addEventListener('input', refresh);
      el.addEventListener('change', refresh);
    });

    refresh();
  }

  function initSearchPage() {
    const root = qs('[data-search-page]');
    if (!root || !window.MOVIES) return;

    const input = qs('[data-search-input]', root);
    const results = qs('[data-search-results]', root);
    const count = qs('[data-search-count]', root);
    const sort = qs('[data-search-sort]', root);
    const region = qs('[data-search-region]', root);
    const genre = qs('[data-search-genre]', root);

    const clearBtn = qs('[data-search-clear]', root);
    if (clearBtn && input) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        input.focus();
        update();
      });
    }

    const url = new URL(location.href);
    if (input && url.searchParams.get('q')) {
      input.value = url.searchParams.get('q');
    }

    function update() {
      const facets = {
        region: region ? region.value : 'all',
        genre: genre ? genre.value : 'all',
      };
      const q = input ? input.value : '';
      const mode = sort ? sort.value : 'score';
      const list = sortMovies(filterMovies(window.MOVIES, q, facets), mode);
      const shown = list.slice(0, 80);
      if (results) {
        results.innerHTML = shown.map(m => renderMovieCard(m)).join('');
      }
      if (count) {
        count.textContent = `共找到 ${list.length} 部影片，当前显示最多 80 部。`;
      }
    }

    [input, sort, region, genre].forEach(el => {
      if (!el) return;
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });

    update();
  }

  function initDetailPlayer() {
    const player = qs('[data-player]');
    if (!player) return;

    const video = qs('video', player);
    const overlay = qs('[data-play-overlay]', player);
    const sourceButtons = qsa('[data-source-index]', player);
    const sourceIndex = parseInt(player.getAttribute('data-stream-index') || '0', 10);
    const initial = ((sourceIndex % STREAM_SOURCES.length) + STREAM_SOURCES.length) % STREAM_SOURCES.length;
    let current = initial;
    let hls = null;
    let wantPlay = false;

    function setButtonActive(idx) {
      sourceButtons.forEach(btn => {
        const match = parseInt(btn.getAttribute('data-source-index') || '0', 10) === idx;
        btn.classList.toggle('active', match);
      });
    }

    function loadSource(idx, autoplay) {
      current = ((idx % STREAM_SOURCES.length) + STREAM_SOURCES.length) % STREAM_SOURCES.length;
      const url = STREAM_SOURCES[current];
      if (!video) return;
      wantPlay = Boolean(autoplay);
      if (window.Hls && window.Hls.isSupported()) {
        if (hls) {
          hls.destroy();
          hls = null;
        }
        hls = new window.Hls({
          maxBufferLength: 30,
        });
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          if (wantPlay) {
            video.play().catch(() => {});
          }
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        if (wantPlay) {
          video.play().catch(() => {});
        }
      } else {
        video.src = url;
        if (wantPlay) {
          video.play().catch(() => {});
        }
      }
      setButtonActive(current);
    }

    function startPlay() {
      loadSource(current, true);
      if (video) {
        video.play().catch(() => {});
      }
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    }

    sourceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-source-index') || '0', 10);
        loadSource(idx);
        if (video) video.play().catch(() => {});
      });
    });

    if (overlay) {
      const btn = overlay.querySelector('button');
      if (btn) btn.addEventListener('click', startPlay);
      overlay.addEventListener('click', startPlay);
    }

    if (video) {
      video.addEventListener('click', () => {
        if (video.paused) startPlay(); else video.pause();
      });
      loadSource(current);
    }

    setButtonActive(current);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initQuickSearch();
    initHeroCarousel();
    initListPage();
    initSearchPage();
    initDetailPlayer();
  });
})();
