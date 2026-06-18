(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var opened = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    var quickSearch = document.querySelector('[data-quick-search]');
    if (quickSearch) {
        quickSearch.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = quickSearch.querySelector('input');
            var value = input ? input.value.trim() : '';
            var target = './search.html';

            if (value) {
                target += '?q=' + encodeURIComponent(value);
            }

            window.location.href = target;
        });
    }

    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.search-card'));
    var empty = document.querySelector('.filter-empty');

    function applySearch(value) {
        var keyword = (value || '').trim().toLowerCase();
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = card.getAttribute('data-keywords') || card.textContent.toLowerCase();
            var matched = !keyword || haystack.indexOf(keyword) !== -1;
            card.classList.toggle('hidden-card', !matched);

            if (matched) {
                visible += 1;
            }
        });

        if (empty) {
            empty.style.display = visible ? 'none' : 'block';
        }
    }

    if (searchInput && cards.length) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (query) {
            searchInput.value = query;
        }

        applySearch(searchInput.value);
        searchInput.addEventListener('input', function () {
            applySearch(searchInput.value);
        });
    }
})();
