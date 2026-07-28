import { initialBucketList, getStoredBucketListState, saveBucketListState } from "../data/bucketListData.js";

export function initBucketListSection() {
    const gridContainer = document.querySelector("#bucket-list .bucket-grid");
    const progressFill = document.querySelector("#bucket-list .bucket-progress__fill");
    const progressText = document.querySelector("#bucket-list .bucket-progress__text");
    const countText = document.querySelector("#bucket-list .bucket-progress__count");

    if (!gridContainer) return;

    const storedState = getStoredBucketListState();

    function updateProgress() {
        const total = initialBucketList.length;
        let completed = 0;
        initialBucketList.forEach(item => {
            if (storedState[item.id]) completed++;
        });

        const percent = Math.round((completed / total) * 100);
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${percent}% Impian Terwujud!`;
        if (countText) countText.textContent = `${completed} dari ${total} impian selaras`;
    }

    gridContainer.innerHTML = initialBucketList.map(item => {
        const isChecked = !!storedState[item.id];
        return `
            <div class="bucket-card ${isChecked ? 'is-completed' : ''}" data-id="${item.id}">
                <div class="bucket-card__check-wrap">
                    <input type="checkbox" id="bucket-${item.id}" ${isChecked ? 'checked' : ''}>
                    <label for="bucket-${item.id}" class="bucket-card__checkbox">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </label>
                </div>
                <div class="bucket-card__body">
                    <div class="bucket-card__header">
                        <span class="bucket-card__icon">${item.icon}</span>
                        <span class="bucket-card__badge">${item.category}</span>
                    </div>
                    <h4 class="bucket-card__title">${item.title}</h4>
                    <p class="bucket-card__desc">${item.description}</p>
                </div>
            </div>
        `;
    }).join('');

    updateProgress();

    // Event Delegation for checkbox clicks
    gridContainer.addEventListener("change", (e) => {
        if (e.target.matches("input[type='checkbox']")) {
            const card = e.target.closest(".bucket-card");
            const itemId = card.dataset.id;
            const checked = e.target.checked;

            storedState[itemId] = checked;
            saveBucketListState(storedState);

            if (checked) {
                card.classList.add("is-completed");
                triggerConfettiEffect(card);
            } else {
                card.classList.remove("is-completed");
            }

            updateProgress();
        }
    });
}

function triggerConfettiEffect(element) {
    if (typeof gsap !== "undefined") {
        gsap.fromTo(element, 
            { scale: 0.96 }, 
            { scale: 1, duration: 0.4, ease: "back.out(2)" }
        );
    }
}
