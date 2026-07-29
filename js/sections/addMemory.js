import { renderJourneyTimeline } from "./journey.js";

const CUSTOM_MEMORIES_KEY = "aurora_custom_memories";

export function initAddMemoryModal() {
    const triggerBtn = document.querySelector("#add-memory-btn");
    const modal = document.querySelector("#add-memory-modal");
    if (!modal) return;

    const closeBtn = modal.querySelector(".modal-add__close");
    const form = modal.querySelector("#add-memory-form");
    const imageInput = modal.querySelector("#memory-image");
    const previewWrap = modal.querySelector("#memory-image-preview-wrap");
    const previewImg = modal.querySelector("#memory-image-preview");
    const removeImgBtn = modal.querySelector("#remove-image-btn");

    let currentImageDataUrl = "";

    function resetImagePreview() {
        currentImageDataUrl = "";
        if (imageInput) imageInput.value = "";
        if (previewImg) previewImg.src = "";
        if (previewWrap) previewWrap.style.display = "none";
    }

    if (imageInput) {
        imageInput.addEventListener("change", (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentImageDataUrl = event.target.result;
                    if (previewImg) previewImg.src = currentImageDataUrl;
                    if (previewWrap) previewWrap.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removeImgBtn) {
        removeImgBtn.addEventListener("click", resetImagePreview);
    }

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add("is-visible");
        document.body.style.overflow = "hidden"; // Prevent background scroll when modal open
    }

    function closeModal() {
        modal.classList.remove("is-visible");
        document.body.style.overflow = "";
        if (form) form.reset();
        resetImagePreview();
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
                image: currentImageDataUrl || "assets/images/memory1.png",
                description: story
            };

            saveCustomMemory(newMemory);
            renderJourneyTimeline();
            closeModal();

            // Scroll to the newly added memory
            setTimeout(() => {
                const container = document.querySelector("#journey .journey-timeline");
                const newCard = container ? container.lastElementChild : null;
                if (newCard) {
                    if (window.lenis) {
                        window.lenis.scrollTo(newCard, { offset: -50, duration: 1.2 });
                    } else {
                        newCard.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }, 300);

            // Notification / Feedback
            alert("✨ Kenangan indah baru berhasil disimpan di perjalanan kalian!");
        });
    }
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

