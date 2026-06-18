(function () {
  function initPlayer() {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var status = document.querySelector('[data-player-status]');
    var stream = window.playerStream || '';
    var attached = false;
    var hls = null;

    if (!video || !overlay) return;

    function showStatus(text) {
      if (!status) return;
      status.textContent = text;
      status.hidden = !text;
    }

    function attach() {
      if (attached) return;
      attached = true;
      if (!stream) {
        showStatus('视频暂时无法加载，请稍后再试');
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showStatus('视频加载失败，请稍后再试');
          }
        });
      } else {
        showStatus('当前浏览器无法播放该视频');
      }
    }

    function start() {
      attach();
      overlay.classList.add('is-hidden');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    }

    overlay.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) overlay.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (hls) hls.destroy();
    });
  }

  document.addEventListener('DOMContentLoaded', initPlayer);
})();
