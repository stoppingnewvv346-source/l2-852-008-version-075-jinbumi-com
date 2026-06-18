(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector(".mobile-toggle");
        var mobileNav = document.querySelector(".mobile-nav");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var slider = document.querySelector("[data-hero-slider]");
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
            var prev = slider.querySelector(".hero-prev");
            var next = slider.querySelector(".hero-next");
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            }

            function play() {
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            function restart() {
                if (timer) {
                    window.clearInterval(timer);
                }
                play();
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                    restart();
                });
            });

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

            show(0);
            play();
        }

        var search = document.getElementById("pageSearch");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-card"));
        var empty = document.getElementById("emptyState");
        var pills = Array.prototype.slice.call(document.querySelectorAll(".filter-pill"));
        var activeFilter = "all";

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilters() {
            var term = search ? normalize(search.value) : "";
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute("data-search"));
                var values = normalize(card.getAttribute("data-filter-values"));
                var matchTerm = !term || haystack.indexOf(term) !== -1;
                var matchFilter = activeFilter === "all" || values.indexOf(activeFilter) !== -1;
                var show = matchTerm && matchFilter;
                card.classList.toggle("search-hidden", !show);
                if (show) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.style.display = visible ? "none" : "block";
            }
        }

        if (search && cards.length) {
            var query = new URLSearchParams(window.location.search).get("q");
            if (query) {
                search.value = query;
            }
            search.addEventListener("input", applyFilters);
            applyFilters();
        }

        pills.forEach(function (pill) {
            pill.addEventListener("click", function () {
                activeFilter = pill.getAttribute("data-filter") || "all";
                pills.forEach(function (item) {
                    item.classList.toggle("active", item === pill);
                });
                applyFilters();
            });
        });
    });
})();
