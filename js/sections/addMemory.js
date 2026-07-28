const CUSTOM_MEMORIES_KEY = "aurora_custom_memories";

export function initAddMemoryModal() {
    const triggerBtn = document.querySelector("#add-memory-btn");
    const modal = document.querySelector("#add-memory-modal");
    if (!modal) return;

    const closeBtn = modal.querySelector(".modal-add__close");
    const form = modal.querySelector("#add-memory-form");

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add("is-visible");
        document.body.style.overflow = "hidden"; // Prevent background scroll when modal open
    }

    function closeModal() {
        modal.classList.remove("is-visible");
        document.body.style.overflow = "";
        if (form) form.reset();
    }

    if (triggerBtn) {
        triggerBtn.addEventListener("click", openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = form.querySelector("#memory-title").value.trim();
            const date = form.querySelector("#memory-date").value.trim();
            const tag = form.querySelector("#memory-tag").value.trim() || "Kenangan Baru";
            const story = form.querySelector("#memory-story").value.trim();
            const icon = form.querySelector("#memory-icon").value || "💖";

            if (!title || !story) {
                alert("Silakan isi judul dan cerita kenangan!");
                return;
            }

            const newMemory = {
                id: "custom_" + Date.now(),
                title,
                date: date || "Momen Baru",
                subtitle: tag,
                tag,
                icon,
                color: "#FF5EA8",
                image: "assets/images/memory1.png",
                description: story
            };

            saveCustomMemory(newMemory);
            const newCard = appendCustomMemoryToTimeline(newMemory);
            closeModal();

            // Scroll to the newly added memory
            if (newCard) {
                setTimeout(() => {
                    if (window.lenis) {
                        window.lenis.scrollTo(newCard, { offset: -50, duration: 1.2 });
                    } else {
                        newCard.scrollIntoView({ behavior: "smooth" });
                    }
                }, 300);
            }

            // Notification / Feedback
            alert("✨ Kenangan indah baru berhasil disimpan di perjalanan kalian!");
        });
    }

    // Load any existing custom memories from localStorage on startup
    loadCustomMemories();
}

function getStoredCustomMemories() {
    try {
        const stored = localStorage.getItem(CUSTOM_MEMORIES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveCustomMemory(item) {
    const list = getStoredCustomMemories();
    list.push(item);
    try {
        localStorage.setItem(CUSTOM_MEMORIES_KEY, JSON.stringify(list));
    } catch (e) {
        console.warn("Could not save custom memory", e);
    }
}

function loadCustomMemories() {
    const list = getStoredCustomMemories();
    list.forEach(item => {
        appendCustomMemoryToTimeline(item);
    });
}

function appendCustomMemoryToTimeline(item) {
    const container = document.querySelector("#journey .journey-timeline");
    if (!container) return null;

    const existingCards = container.querySelectorAll(".journey-card");
    const count = existingCards.length;
    const isEven = count % 2 === 0;

    const card = document.createElement("div");
    card.className = `journey-card ${isEven ? 'journey-card--left' : 'journey-card--right'} journey-card--custom`;
    card.innerHTML = `
        <div class="journey-card__node">
            <span class="journey-card__icon">${item.icon}</span>
        </div>
        <div class="journey-card__content">
            <div class="journey-card__header">
                <span class="journey-card__tag" style="background: ${item.color}22; color: ${item.color}; border: 1px solid ${item.color}44;">
                    ${item.tag}
                </span>
                <span class="journey-card__date">${item.date}</span>
            </div>
            <h3 class="journey-card__title">${item.title}</h3>
            <p class="journey-card__subtitle">${item.subtitle}</p>
            <p class="journey-card__desc">${item.description}</p>
        </div>
    `;

    container.appendChild(card);
    return card;
}
