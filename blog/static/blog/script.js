// 1) Dark / light theme --------------------------------------------
// The chosen theme is saved in the browser (localStorage).
var root = document.documentElement;

function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var button = document.getElementById("theme-toggle");
    if (button) {
        button.textContent = theme === "dark" ? "☀️" : "🌙";
    }
}

function savedTheme() {
    try {
        return localStorage.getItem("theme") || "light";
    } catch (e) {
        return "light";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    applyTheme(savedTheme());

    var button = document.getElementById("theme-toggle");
    if (button) {
        button.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
            try {
                localStorage.setItem("theme", next);
            } catch (e) {}
        });
    }

    // 2) Whole post card is clickable ---------------------------------
    document.querySelectorAll(".post-grid .card").forEach(function (card) {
        var link = card.querySelector("h2 a");
        if (!link) return;
        card.classList.add("is-clickable");
        card.addEventListener("click", function (event) {
            if (event.target.closest("a")) return; // real links work normally
            window.location.href = link.href;
        });
    });

    // 4) Post page: reading time, progress bar, copy link -------------
    var body = document.getElementById("post-body");
    if (body) {
        var words = body.textContent.trim().split(/\s+/).filter(Boolean).length;
        var minutes = Math.max(1, Math.round(words / 200));
        var timeLabel = document.getElementById("reading-time");
        if (timeLabel) {
            timeLabel.textContent = words + " words · " + minutes + " min read";
        }

        var bar = document.getElementById("progress-bar");
        window.addEventListener("scroll", function () {
            var scrollable = document.documentElement.scrollHeight - window.innerHeight;
            var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            if (bar) bar.style.width = percent + "%";
        });

        var copy = document.getElementById("copy-link");
        if (copy) {
            copy.addEventListener("click", function () {
                if (!navigator.clipboard) return;
                navigator.clipboard.writeText(window.location.href).then(function () {
                    copy.textContent = "Copied!";
                    setTimeout(function () { copy.textContent = "Copy link"; }, 1500);
                });
            });
        }
    }

    // 3) Cards fade in when they appear on screen ----------------------
    var cards = document.querySelectorAll(".post-grid .card");
    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        });
        cards.forEach(function (card) {
            card.classList.add("reveal");
            observer.observe(card);
        });
    }
});
