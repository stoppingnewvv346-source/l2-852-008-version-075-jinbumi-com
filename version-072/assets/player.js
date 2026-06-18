(function () {
    var shell = document.querySelector('.player-shell');

    if (!shell) {
        return;
    }

    var video = shell.querySelector('video');
    var layer = shell.querySelector('.play-layer');
    var stream = video ? video.getAttribute('data-stream') : '';
    var hls = null;

    function begin() {
        if (!video || !stream) {
            return;
        }

        if (layer) {
            layer.classList.add('is-hidden');
        }

        video.controls = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (video.src !== stream) {
                video.src = stream;
            }
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (!hls) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else {
                video.play().catch(function () {});
            }
            return;
        }

        if (video.src !== stream) {
            video.src = stream;
        }
        video.play().catch(function () {});
    }

    if (layer) {
        layer.addEventListener('click', begin);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                begin();
            }
        });
    }
})();
