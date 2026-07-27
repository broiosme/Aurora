import { memories } from "../data/memories.js";

const modal = document.querySelector(".memory-modal");
let lastOpenedTime = 0;
let isMouseDownOnBackdrop = false;

export function openMemory(id) {

    const memory = memories.find(m => m.id == id);

    if (!memory) return;

    // Image fallback: use gradient placeholder if no image
    let imageHtml = "";
    if (memory.image) {
        imageHtml = `<img src="${memory.image}" alt="${memory.title}" onerror="this.parentElement.innerHTML='<div class=\\'memory-card__image-fallback\\' style=\\'background:${memory.fallbackColor}\\'><span>✦</span></div>'" />`;
    } else {
        imageHtml = `<div class="memory-card__image-fallback" style="background: ${memory.fallbackColor}"><span>✦</span></div>`;
    }

    modal.innerHTML = `
    <div class="memory-card">
        <button class="memory-card__close-icon" title="Tutup">✕</button>
        <div class="memory-card__image">
            ${imageHtml}
        </div>
        <div class="memory-card__body">
            <h2 class="memory-card__title">${memory.title}</h2>
            <p class="memory-card__date">${memory.date}</p>
            <p class="memory-card__quote">“${memory.quote}”</p>
            <p class="memory-card__story">${memory.story}</p>
            <button class="memory-card__close">Tutup</button>
        </div>
    </div>
    `;

    modal.classList.add("show");
    lastOpenedTime = Date.now();
    isMouseDownOnBackdrop = false;

    // Prevent clicks inside card from bubbling to modal backdrop
    const cardEl = modal.querySelector(".memory-card");
    if (cardEl) {
        cardEl.addEventListener("click", (e) => {
            // Allow close buttons to trigger
            if (!e.target.classList.contains("memory-card__close") && 
                !e.target.classList.contains("memory-card__close-icon")) {
                e.stopPropagation();
            }
        });
    }

    // Pause Lenis smooth scroll while card is open
    if (window.lenis) {
        window.lenis.stop();
    }

    gsap.fromTo(".memory-card", 
        { y: 60, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
    );

    // Lock body scroll
    document.body.style.overflow = "hidden";

}

export function closeMemory() {
    if (!modal.classList.contains("show")) return;
    
    gsap.to(".memory-card", {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            modal.classList.remove("show");
            document.body.style.overflow = "";

            // Resume Lenis smooth scroll
            if (window.lenis) {
                window.lenis.start();
            }
        }
    });
}

// Track where mousedown started to avoid closing when selecting text or dragging
modal.addEventListener("mousedown", (e) => {
    isMouseDownOnBackdrop = (e.target === modal);
});

// Click overlay or close button to close
modal.addEventListener("click", (e) => {
    // 1. Explicit close buttons
    if (
        e.target.classList.contains("memory-card__close") ||
        e.target.classList.contains("memory-card__close-icon")
    ) {
        closeMemory();
        return;
    }

    // 2. Prevent backdrop close within 500ms of opening (prevents double-clicks / tap releases from closing)
    if (Date.now() - lastOpenedTime < 500) return;

    // 3. Only close if click AND mousedown both occurred directly on backdrop overlay
    if (e.target === modal && isMouseDownOnBackdrop) {
        closeMemory();
    }
});

// Escape key to close
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMemory();
    }
});