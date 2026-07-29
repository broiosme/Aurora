import { getStoredJourneyMilestones, deleteJourneyMilestone } from "../data/journeyData.js";

export function initJourneySection() {
    renderJourneyTimeline();
}

export function renderJourneyTimeline() {
    const journeyContainer = document.querySelector("#journey .journey-timeline");
    if (!journeyContainer) return;

    const milestones = getStoredJourneyMilestones();

    if (milestones.length === 0) {
        journeyContainer.innerHTML = `
            <div style="text-align: center; color: var(--muted); padding: 40px 20px;">
                Belum ada kenangan di garis waktu. Klik <strong>"Tambah Kenangan"</strong> di bawah untuk mengabadikan momen baru! ✨
            </div>
        `;
        return;
    }

    journeyContainer.innerHTML = milestones.map((item, idx) => {
        const isEven = idx % 2 === 0;
        const color = item.color || "#FF5EA8";
        const hasImage = Boolean(item.image);
        return `
            <div class="journey-card ${isEven ? 'journey-card--left' : 'journey-card--right'}" data-id="${item.id}" data-index="${idx}">
                <div class="journey-card__node">
                    <span class="journey-card__icon">${item.icon || '✨'}</span>
                </div>
                <div class="journey-card__content">
                    <div class="journey-card__header">
                        <span class="journey-card__tag" style="background: ${color}22; color: ${color}; border: 1px solid ${color}44;">
                            ${item.tag || item.subtitle || 'Kenangan'}
                        </span>
                        <span class="journey-card__date">${item.date}</span>
                        <button type="button" class="journey-card__delete-btn" data-id="${item.id}" title="Hapus Kenangan">🗑️</button>
                    </div>
                    <h3 class="journey-card__title">${item.title}</h3>
                    <p class="journey-card__subtitle">${item.subtitle || ''}</p>
                    ${hasImage ? `
                    <div class="journey-card__img-wrap">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                    </div>` : ''}
                    <p class="journey-card__desc">${item.description || item.story || ''}</p>
                </div>
            </div>
        `;
    }).join('');

    // Attach delete handlers
    journeyContainer.querySelectorAll(".journey-card__delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const card = btn.closest(".journey-card");
            const titleEl = card ? card.querySelector(".journey-card__title") : null;
            const title = titleEl ? titleEl.textContent : "kenangan ini";

            if (confirm(`Apakah Anda yakin ingin menghapus "${title}" dari Garis Waktu?`)) {
                if (typeof gsap !== "undefined" && card) {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        onComplete: () => {
                            deleteJourneyMilestone(id);
                            renderJourneyTimeline();
                        }
                    });
                } else {
                    deleteJourneyMilestone(id);
                    renderJourneyTimeline();
                }
            }
        });
    });

    // GSAP ScrollTrigger animation for cards if available
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        const cards = journeyContainer.querySelectorAll('.journey-card');
        cards.forEach((card) => {
            gsap.fromTo(card,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        ScrollTrigger.refresh();
    }
}

