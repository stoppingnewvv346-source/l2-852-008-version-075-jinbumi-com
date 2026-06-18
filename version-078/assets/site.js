(function(){
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function initNav(){
    const btn = $('[data-nav-toggle]');
    const nav = $('[data-nav-links]');
    if(!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  }
  function initSearch(){
    const inputs = $all('[data-search-input]');
    if(!inputs.length) return;
    inputs.forEach(input => {
      const page = input.closest('[data-search-page]') || document;
      const cards = $all('[data-search-card]', page);
      const empty = $('[data-empty-state]', page);
      const count = $('[data-search-count]', page);
      const apply = () => {
        const q = (input.value || '').trim().toLowerCase();
        let visible = 0;
        cards.forEach(card => {
          const hay = (card.getAttribute('data-search-key') || card.textContent || '').toLowerCase();
          const ok = !q || hay.includes(q);
          card.style.display = ok ? '' : 'none';
          if(ok) visible++;
        });
        if(count) count.textContent = visible.toString();
        if(empty) empty.style.display = visible ? 'none' : 'block';
      };
      input.addEventListener('input', apply);
      apply();
    });
  }
  function initPlayer(){
    const video = $('[data-player]');
    if(!video) return;
    const mp4 = video.getAttribute('data-mp4');
    const hls = video.getAttribute('data-hls');
    function setSource(url){
      if(!url) return;
      if(video.dataset.bound === url) return;
      video.dataset.bound = url;
      while(video.firstChild) video.removeChild(video.firstChild);
      const source = document.createElement('source');
      source.src = url;
      if(url.endsWith('.m3u8')) source.type = 'application/vnd.apple.mpegurl';
      else if(url.endsWith('.mp4')) source.type = 'video/mp4';
      video.appendChild(source);
      video.load();
    }
    if(hls && video.canPlayType('application/vnd.apple.mpegurl')) {
      setSource(hls);
    } else if(hls && window.Hls && window.Hls.isSupported()) {
      try{
        var hlsObj = new window.Hls();
        hlsObj.loadSource(hls);
        hlsObj.attachMedia(video);
      }catch(err){
        setSource(mp4);
      }
    } else {
      setSource(mp4);
    }
  }
  function initBackTop(){
    const btn = $('[data-backtop]');
    if(!btn) return;
    window.addEventListener('scroll', () => {
      btn.style.opacity = window.scrollY > 500 ? '1' : '.3';
    }, {passive:true});
    btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }
  document.addEventListener('DOMContentLoaded', function(){
    initNav();
    initSearch();
    initPlayer();
    initBackTop();
  });
}})();
