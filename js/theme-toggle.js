// =========================================
// THEME TOGGLE — DARK / LIGHT MODE
// =========================================

export function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const html = document.documentElement;
    const STORAGE_KEY = "aurora-theme";
    const overlay = document.querySelector(".theme-transition-overlay");

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem(STORAGE_KEY) || "dark";
    html.setAttribute("data-theme", savedTheme);
    updateToggleIcon(toggle, savedTheme);

    toggle.addEventListener("click", () => {
        // Ignore clicks while a crossfade transition is in progress
        if (overlay && overlay.classList.contains("is-visible")) return;

        const current = html.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";

        const onThemeApplied = () => {
            updateToggleIcon(toggle, next);
            // Dispatch custom event for other modules to react
            window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
        };

        if (overlay) {
            // Smooth crossfade (pages that include the overlay element)
            transitionTheme(html, overlay, next, STORAGE_KEY, onThemeApplied);
        } else {
            // Instant switch (default behavior)
            html.setAttribute("data-theme", next);
            localStorage.setItem(STORAGE_KEY, next);
            onThemeApplied();
        }
    });
}

// Crossfade between themes using a full-screen overlay:
// 1) fade overlay in (tinted with the incoming theme's atmosphere)
// 2) swap the theme while fully covered
// 3) fade the overlay out to reveal the new theme
function transitionTheme(html, overlay, next, storageKey, onDone) {
    const FADE_MS = 320; // must match .theme-transition-overlay transition-duration

    const tint = next === "light"
        ? "radial-gradient(circle at 50% 35%, rgba(210, 238, 252, 0.98) 0%, rgba(232, 244, 253, 1) 100%)"
        : "radial-gradient(circle at 50% 35%, rgba(16, 23, 45, 0.98) 0%, rgba(5, 8, 22, 1) 100%)";
    overlay.style.background = tint;

    // Fade the overlay in
    overlay.classList.add("is-visible");

    // Swap the theme while fully covered, then fade the overlay out
    setTimeout(() => {
        html.setAttribute("data-theme", next);
        localStorage.setItem(storageKey, next);
        onDone();

        // Use setTimeout (not requestAnimationFrame) so the overlay is
        // guaranteed to fade out even when the tab is in the background.
        setTimeout(() => {
            overlay.classList.remove("is-visible");
        }, 16);
    }, FADE_MS + 60);
}

function updateToggleIcon(btn, theme) {
    if (theme === "light") {
        btn.innerHTML = `🌙<span class="dock-item__tooltip">Mode Malam</span>`;
    } else {
        btn.innerHTML = `☀️<span class="dock-item__tooltip">Mode Pantai</span>`;
    }
}
