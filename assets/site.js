
(function () {
  const data = window.MOVIE_DATA || [];
  const info = window.SITE_INFO || { title: document.title };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }
  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function pick(array, index) {
    return array[index % array.length];
  }
  function fillCards(container, items, emptyText) {
    if (!container) return;
    container.innerHTML = items.map(renderCard).join('') || `<div class="page-note">${escapeHtml(emptyText || '暂无内容')}</div>`;
  }
  function renderCard(movie) {
    return `
      <article class="card">
        <a href="/movie/${movie.id}.html" aria-label="${escapeHtml(movie.title)}">
          <div class="poster">
            <img src="/${movie.poster}" alt="${escapeHtml(movie.title)}海报" loading="lazy">
          </div>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(movie.title)}</h3>
            <div class="card-meta">
              <span class="pill">${escapeHtml(movie.region)}</span>
              <span class="pill">${escapeHtml(movie.type)}</span>
              <span class="pill">${escapeHtml(movie.year)}</span>
            </div>
            <p class="card-excerpt">${escapeHtml(movie.oneLine || movie.summary || '')}</p>
          </div>
        </a>
      </article>`;
  }
  function renderSlide(movie, active, index) {
    const tags = (movie.tags || []).slice(0, 3).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join('');
    return `
      <div class="slide ${active ? 'active' : ''}" data-slide="${index}">
        <a class="slide-poster" href="/movie/${movie.id}.html">
          <img src="/${movie.poster}" alt="${escapeHtml(movie.title)}海报" loading="eager">
        </a>
        <div class="slide-copy">
          <div class="kicker">${escapeHtml(movie.region)} · ${escapeHtml(movie.type)} · ${escapeHtml(movie.year)}</div>
          <h3>${escapeHtml(movie.title)}</h3>
          <p>${escapeHtml(movie.summary || movie.oneLine || '')}</p>
          <div class="badge-row">${tags}</div>
          <div class="hero-actions">
            <a class="btn" href="/movie/${movie.id}.html">立即观看</a>
            <a class="secondary-btn" href="/all.html">浏览全部 2000 部</a>
          </div>
        </div>
      </div>`;
  }

  function initHero() {
    const hero = qs('[data-hero-carousel]');
    if (!hero) return;
    const featured = data
      .slice()
      .sort((a, b) => (b.heat || 0) - (a.heat || 0))
      .slice(0, 6);
    hero.innerHTML = featured.map((movie, index) => renderSlide(movie, index === 0, index)).join('');
    const slides = qsa('.slide', hero);
    const prev = qs('[data-hero-prev]');
    const next = qs('[data-hero-next]');
    const dots = qs('[data-hero-dots]');
    if (dots) {
      dots.innerHTML = featured.map((_, i) => `<button class="tab ${i === 0 ? 'active' : ''}" type="button" data-dot="${i}">${i + 1}</button>`).join('');
    }
    let index = 0;
    let timer = null;
    const setActive = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, s) => slide.classList.toggle('active', s === index));
      qsa('[data-dot]', dots || document).forEach((dot, s) => dot.classList.toggle('active', s === index));
    };
    const play = () => {
      timer = window.setInterval(() => setActive(index + 1), 4800);
    };
    const reset = () => {
      if (timer) window.clearInterval(timer);
      play();
    };
    if (prev) prev.addEventListener('click', () => { setActive(index - 1); reset(); });
    if (next) next.addEventListener('click', () => { setActive(index + 1); reset(); });
    if (dots) {
      dots.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-dot]');
        if (!btn) return;
        setActive(Number(btn.dataset.dot || 0));
        reset();
      });
    }
    play();
  }

  function filterMovies(list, query, type, region, year) {
    const q = (query || '').trim().toLowerCase();
    return list.filter(movie => {
      const byQuery = !q || [movie.title, movie.region, movie.type, movie.genreRaw, movie.oneLine, movie.summary, (movie.tags || []).join(' ')].join(' ').toLowerCase().includes(q);
      const byType = !type || type === '全部' || movie.type === type;
      const byRegion = !region || region === '全部' || movie.region === region;
      const byYear = !year || year === '全部' || String(movie.year) === String(year);
      return byQuery && byType && byRegion && byYear;
    });
  }

  function initCatalogPage() {
    const root = qs('[data-catalog]');
    if (!root) return;
    const cards = qsa('[data-movie-card]', root);
    const queryInput = qs('[data-search-input]');
    const typeSelect = qs('[data-filter-type]');
    const regionSelect = qs('[data-filter-region]');
    const yearSelect = qs('[data-filter-year]');
    const counter = qs('[data-count]');
    const empty = qs('[data-empty]');
    const pager = qs('[data-pager]');
    const perPage = Number(root.dataset.perPage || '120');
    let currentPage = 1;
    const allMovies = data.slice();

    function update() {
      const filtered = filterMovies(
        allMovies,
        queryInput && queryInput.value,
        typeSelect && typeSelect.value,
        regionSelect && regionSelect.value,
        yearSelect && yearSelect.value,
      );
      const pages = Math.max(1, Math.ceil(filtered.length / perPage));
      currentPage = Math.min(currentPage, pages);
      const start = (currentPage - 1) * perPage;
      const end = start + perPage;
      const visible = filtered.slice(start, end);
      const visibleIds = new Set(visible.map(m => m.id));
      cards.forEach(card => card.classList.toggle('hidden', !visibleIds.has(card.dataset.id)));
      if (counter) counter.textContent = String(filtered.length);
      if (empty) empty.classList.toggle('hidden', filtered.length !== 0);
      if (pager) {
        pager.innerHTML = '';
        if (pages > 1) {
          const prev = document.createElement('button');
          prev.className = 'secondary-btn';
          prev.type = 'button';
          prev.textContent = '上一页';
          prev.disabled = currentPage === 1;
          prev.addEventListener('click', () => { currentPage = Math.max(1, currentPage - 1); update(); root.scrollIntoView({behavior:'smooth', block:'start'}); });
          pager.appendChild(prev);
          const pageInfo = document.createElement('span');
          pageInfo.className = 'page-note';
          pageInfo.textContent = `${currentPage} / ${pages}`;
          pager.appendChild(pageInfo);
          const next = document.createElement('button');
          next.className = 'secondary-btn';
          next.type = 'button';
          next.textContent = '下一页';
          next.disabled = currentPage === pages;
          next.addEventListener('click', () => { currentPage = Math.min(pages, currentPage + 1); update(); root.scrollIntoView({behavior:'smooth', block:'start'}); });
          pager.appendChild(next);
        }
      }
    }

    [queryInput, typeSelect, regionSelect, yearSelect].forEach(el => {
      if (el) el.addEventListener('input', () => { currentPage = 1; update(); });
      if (el) el.addEventListener('change', () => { currentPage = 1; update(); });
    });
    update();
  }

  function initTabs() {
    const tabs = qs('[data-tabs]');
    if (!tabs) return;
    const buttons = qsa('[data-tab-btn]', tabs);
    const panes = qsa('[data-tab-pane]');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.tabBtn;
        buttons.forEach(btn => btn.classList.toggle('active', btn === button));
        panes.forEach(pane => pane.classList.toggle('hidden', pane.dataset.tabPane !== target));
      });
    });
  }

  function initDetailPlayer() {
    const video = qs('[data-player-video]');
    if (!video) return;
    const source = video.dataset.src || '';
    const fallback = video.dataset.fallback || '/assets/demo.mp4';
    const setSource = (url) => {
      if (!url) return;
      video.src = url;
      video.load();
    };
    const tryNativeHls = () => {
      return !!video.canPlayType && video.canPlayType('application/vnd.apple.mpegurl').length > 0;
    };
    if (/\.m3u8(\?|$)/i.test(source)) {
      if (window.Hls && typeof window.Hls.isSupported === 'function' && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) setSource(fallback);
        });
      } else if (tryNativeHls()) {
        setSource(source);
      } else {
        setSource(fallback);
      }
    } else {
      setSource(source || fallback);
    }

    const playBtn = qs('[data-play-btn]');
    if (playBtn) playBtn.addEventListener('click', () => video.play());
    const demoBtn = qs('[data-demo-btn]');
    if (demoBtn) demoBtn.addEventListener('click', () => setSource(fallback));
  }

  function initBackToTop() {
    const btn = qs('[data-top]');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('hidden', window.scrollY < 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initPageTitles() {
    const body = document.body;
    if (!body) return;
    const title = body.dataset.pageTitle || info.title || document.title;
    const brand = qs('[data-brand-title]');
    if (brand) brand.textContent = title;
  }

  function init() {
    initPageTitles();
    initHero();
    initCatalogPage();
    initTabs();
    initDetailPlayer();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
