import { journeyMilestones } from "../data/journeyData.js";

export function initJourneySection() {
    const journeyContainer = document.querySelector("#journey .journey-timeline");
    if (!journeyContainer) return;

    // Render milestone cards
    journeyContainer.innerHTML = journeyMilestones.map((item, idx) => {
        const isEven = idx % 2 === 0;
        return `
            <div class="journey-card ${isEven ? 'journey-card--left' : 'journey-card--right'}" data-index="${idx}">
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
                    <div class="journey-card__img-wrap">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                    </div>
                    <p class="journey-card__desc">${item.description}</p>
                </div>
            </div>
        `;
    }).join('');

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
    }
}
