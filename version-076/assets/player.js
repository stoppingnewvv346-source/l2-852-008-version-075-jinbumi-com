(function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));

  function loadHls() {
    return new Promise(function (resolve, reject) {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }
      var existing = document.querySelector('script[data-hls-library]');
      if (existing) {
        existing.addEventListener('load', function () {
          resolve(window.Hls);
        });
        existing.addEventListener('error', reject);
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
      script.async = true;
      script.setAttribute('data-hls-library', 'true');
      script.addEventListener('load', function () {
        resolve(window.Hls);
      });
      script.addEventListener('error', reject);
      document.head.appendChild(script);
    });
  }

  function getSource(video) {
    var item = video.querySelector('source');
    return item ? item.getAttribute('src') : video.currentSrc || video.src;
  }

  function start(shell) {
    var video = shell.querySelector('video');
    if (!video) {
      return;
    }
    var url = getSource(video);
    if (!url) {
      return;
    }

    function playNow() {
      shell.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          shell.classList.remove('is-playing');
        });
      }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.src = url;
      }
      playNow();
      return;
    }

    loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        if (!video.__hls) {
          var hls = new Hls({ enableWorker: true });
          hls.loadSource(url);
          hls.attachMedia(video);
          video.__hls = hls;
        }
        playNow();
      } else {
        video.src = url;
        playNow();
      }
    }).catch(function () {
      video.src = url;
      playNow();
    });
  }

  shells.forEach(function (shell) {
    var button = shell.querySelector('[data-player-start]');
    var video = shell.querySelector('video');
    if (button) {
      button.addEventListener('click', function () {
        start(shell);
      });
    }
    if (video) {
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
          shell.classList.remove('is-playing');
        }
      });
    }
  });
})();
