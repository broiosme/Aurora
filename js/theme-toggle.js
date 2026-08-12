// =========================================
// THEME TOGGLE — DARK / LIGHT MODE
// =========================================

export function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const html = document.documentElement;
    const STORAGE_KEY = "aurora-theme";
    const overlay = document.querySelector(".theme-transition-overlay");

    let isRippling = false;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem(STORAGE_KEY) || "dark";
    html.setAttribute("data-theme", savedTheme);
    updateToggleIcon(toggle, savedTheme);

    toggle.addEventListener("click", () => {
        // Ignore clicks while a transition is in progress
        if (isRippling || (overlay && overlay.classList.contains("is-visible"))) return;

        const current = html.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";

        const onThemeApplied = () => {
            updateToggleIcon(toggle, next);
            // Dispatch custom event for other modules to react
            window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
        };

        // Ripple effect: light spreads outward from the toggle button
        if (supportsViewTransitions() && !prefersReducedMotion()) {
            isRippling = true;
            try {
                const rippleDone = rippleTheme(html, toggle, next, STORAGE_KEY, onThemeApplied);
                rippleDone
                    .catch(() => {})
                    .finally(() => { isRippling = false; });
                return;
            } catch (err) {
                // startViewTransition threw (e.g. another transition is active) —
                // reset the guard, un-freeze transitions, and fall back to the
                // normal switch below.
                isRippling = false;
                html.classList.remove("theme-rippling");
            }
        }

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

function supportsViewTransitions() {
    return typeof document.startViewTransition === "function";
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Ripple: the new theme expands as a circle from the toggle button,
// so the light (or night) visibly flows out of the button across the page.
function rippleTheme(html, toggle, next, storageKey, onThemeApplied) {
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    ) + 12;

    // The circle origin + reach are read by the CSS view-transition rules
    html.style.setProperty("--theme-ripple-x", `${x}px`);
    html.style.setProperty("--theme-ripple-y", `${y}px`);
    html.style.setProperty("--theme-ripple-r", `${radius}px`);

    // Freeze CSS transitions while the ripple plays, so the new-theme
    // snapshot is captured with its final colors
    html.classList.add("theme-rippling");

    const transition = document.startViewTransition(() => {
        html.setAttribute("data-theme", next);
        localStorage.setItem(storageKey, next);
        onThemeApplied();
    });

    return transition.finished.finally(() => {
        html.classList.remove("theme-rippling");
    });
}

// Crossfade between themes using a full-screen overlay:
// 1) fade overlay in (tinted with the incoming theme's atmosphere)
// 2) swap the theme while fully covered
// 3) fade the overlay out to reveal the new theme
function transitionTheme(html, overlay, next, storageKey, onDone) {
    const FADE_MS = 350; // must match .theme-transition-overlay transition-duration

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
    const isDockItem = btn.classList.contains("dock-item");
    const tooltipClass = isDockItem ? "dock-item__tooltip" : "btn-label";
    if (theme === "light") {
        btn.innerHTML = `<span>🌙</span><span class="${tooltipClass}">Mode Malam</span>`;
    } else {
        btn.innerHTML = `<span>☀️</span><span class="${tooltipClass}">Mode Pantai</span>`;
    }
}
