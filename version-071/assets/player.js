(function () {
    var playerScript = document.currentScript;
    var hlsUrl = playerScript && playerScript.src ? new URL("hls-dru42stk.js", playerScript.src).href : "./assets/hls-dru42stk.js";

    window.initMoviePlayer = function (streamUrl, videoId, buttonId, frameId) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var frame = document.getElementById(frameId);
        var attached = false;
        var hlsInstance = null;

        if (!video || !button || !frame || !streamUrl) {
            return;
        }

        function attachStream() {
            if (attached) {
                return Promise.resolve();
            }
            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return Promise.resolve();
            }

            return import(hlsUrl).then(function (module) {
                var Hls = module.H;
                if (Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = streamUrl;
                }
            }).catch(function () {
                video.src = streamUrl;
            });
        }

        function startPlayback(event) {
            if (event) {
                event.preventDefault();
            }
            attachStream().then(function () {
                frame.classList.add("playing");
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {});
                }
            });
        }

        button.addEventListener("click", startPlayback);
        frame.addEventListener("click", function (event) {
            if (event.target === frame) {
                startPlayback(event);
            }
        });
        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });
        video.addEventListener("play", function () {
            frame.classList.add("playing");
        });
        video.addEventListener("pause", function () {
            if (!video.ended) {
                frame.classList.remove("playing");
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    };
})();
