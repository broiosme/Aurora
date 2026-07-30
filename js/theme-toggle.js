// =========================================
// THEME TOGGLE — DARK / LIGHT MODE
// =========================================

export function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const html = document.documentElement;
    const STORAGE_KEY = "aurora-theme";

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem(STORAGE_KEY) || "dark";
    html.setAttribute("data-theme", savedTheme);
    updateToggleIcon(toggle, savedTheme);

    toggle.addEventListener("click", () => {
        const current = html.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";

        html.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE_KEY, next);
        updateToggleIcon(toggle, next);

        // Dispatch custom event for other modules to react
        window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
    });
}

function updateToggleIcon(btn, theme) {
    if (theme === "light") {
        btn.innerHTML = `🌙<span class="dock-item__tooltip">Mode Malam</span>`;
    } else {
        btn.innerHTML = `☀️<span class="dock-item__tooltip">Mode Pantai</span>`;
    }
}
