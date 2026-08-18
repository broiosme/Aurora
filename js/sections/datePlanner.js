// =========================================
// INTERACTIVE ROMANTIC DATE PLANNER & TICKET GENERATOR
// js/sections/datePlanner.js
// =========================================

const CUTE_MASCOTS = {
    step1: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 88C70 88 85 70 85 50C85 30 70 15 50 15C30 15 15 30 15 50C15 70 30 88 50 88Z" fill="#FFB7D5"/><circle cx="36" cy="46" r="6" fill="#10172D"/><circle cx="64" cy="46" r="6" fill="#10172D"/><ellipse cx="50" cy="58" rx="8" ry="6" fill="#FF5EA8"/><path d="M30 40C30 38 35 36 40 40" stroke="#10172D" stroke-width="2" stroke-linecap="round"/><path d="M60 40C60 38 65 36 70 40" stroke="#10172D" stroke-width="2" stroke-linecap="round"/><path d="M38 70C42 75 58 75 62 70" stroke="#10172D" stroke-width="3" stroke-linecap="round"/><path d="M20 25C22 15 32 18 36 24" stroke="#FF5EA8" stroke-width="4" stroke-linecap="round"/><path d="M80 25C78 15 68 18 64 24" stroke="#FF5EA8" stroke-width="4" stroke-linecap="round"/></svg>`,
    step2: `<svg viewBox="0 0 100 100" fill="none"><rect x="20" y="25" width="60" height="55" rx="12" fill="#7C5CFF" fill-opacity="0.2" stroke="#7C5CFF" stroke-width="4"/><path d="M35 15V25M65 15V25" stroke="#FFD166" stroke-width="5" stroke-linecap="round"/><rect x="30" y="40" width="10" height="10" rx="3" fill="#FF5EA8"/><rect x="45" y="40" width="10" height="10" rx="3" fill="#FFD166"/><rect x="60" y="40" width="10" height="10" rx="3" fill="#7C5CFF"/><rect x="30" y="55" width="10" height="10" rx="3" fill="#6FAEFF"/><rect x="45" y="55" width="10" height="10" rx="3" fill="#FF5EA8"/><rect x="60" y="55" width="10" height="10" rx="3" fill="#FFD166"/></svg>`,
    step3: `<svg viewBox="0 0 100 100" fill="none"><path d="M25 65C25 50 35 40 50 40C65 40 75 50 75 65C75 72 68 75 50 75C32 75 25 72 25 65Z" fill="#3BA4CF" fill-opacity="0.25" stroke="#3BA4CF" stroke-width="4"/><circle cx="50" cy="30" r="14" fill="#FFD166"/><path d="M15 80C30 75 70 75 85 80" stroke="#FF5EA8" stroke-width="4" stroke-linecap="round"/></svg>`,
    step4: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 78L22 46C12 36 12 20 26 14C36 10 45 16 50 22C55 16 64 10 74 14C88 20 88 36 78 46L50 78Z" fill="#FF5EA8" fill-opacity="0.8" stroke="#FF85C0" stroke-width="3"/><path d="M38 30C35 25 40 20 44 22" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    step5: `<svg viewBox="0 0 100 100" fill="none"><path d="M30 40C30 25 45 15 65 20C80 25 85 40 75 55C65 70 45 80 25 75C15 72 10 60 20 50" fill="#FFD166" fill-opacity="0.3" stroke="#FFD166" stroke-width="4"/><circle cx="70" cy="30" r="4" fill="#FFFFFF"/><circle cx="40" cy="65" r="3" fill="#FFFFFF"/><circle cx="30" cy="30" r="2.5" fill="#FF5EA8"/></svg>`,
    step6: `<svg viewBox="0 0 100 100" fill="none"><rect x="15" y="30" width="70" height="45" rx="10" fill="#FF5EA8" fill-opacity="0.2" stroke="#FFD166" stroke-width="3" stroke-dasharray="6 4"/><circle cx="50" cy="52" r="14" fill="#FFD166"/><path d="M45 52L49 56L56 47" stroke="#10172D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const DODGE_TEXTS = [
    "Pikir-pikir dulu... 🤔",
    "Yakin nih? 🥺",
    "Coba klik Yes! 💖",
    "Gak bisa nolak hihi! 🙈",
    "Tekan yang merah dong! 🌸",
    "Aku makin maksa nih! 😜",
    "Udah deh, klik Yes aja! ✨"
];

let state = {
    step: 1,
    dodgeCount: 0,
    day: "Sabtu Ini",
    time: "Malam (19:30 WIB)",
    location: null,
    gift: null,
    after: null,
    countdownInterval: null
};

export function initDatePlanner() {
    const cardContainer = document.getElementById("planner-card-container");
    if (!cardContainer) return;

    renderStep();

    // Mode Toggle Handlers
    const tabPlanner = document.getElementById("tab-planner");
    const tabCollection = document.getElementById("tab-collection");
    const stagePlanner = document.getElementById("date-planner-stage");
    const stageCollection = document.getElementById("tickets-container-stage");

    if (tabPlanner && tabCollection && stagePlanner && stageCollection) {
        tabPlanner.addEventListener("click", () => {
            tabPlanner.classList.add("is-active");
            tabCollection.classList.remove("is-active");
            stagePlanner.style.display = "block";
            stageCollection.style.display = "none";
        });

        tabCollection.addEventListener("click", () => {
            tabCollection.classList.add("is-active");
            tabPlanner.classList.remove("is-active");
            stagePlanner.style.display = "none";
            stageCollection.style.display = "grid";
        });
    }
}

function renderStep() {
    const container = document.getElementById("planner-card-container");
    if (!container) return;

    if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
        state.countdownInterval = null;
    }

    switch (state.step) {
        case 1:
            renderStep1(container);
            break;
        case 2:
            renderStep2(container);
            break;
        case 3:
            renderStep3(container);
            break;
        case 4:
            renderStep4(container);
            break;
        case 5:
            renderStep5(container);
            break;
        case 6:
            renderStep6(container);
            break;
        default:
            renderStep1(container);
    }
}

function renderProgressDots() {
    let dotsHtml = `<div class="planner-progress">`;
    for (let i = 1; i <= 5; i++) {
        const activeClass = i === state.step ? "is-active" : (i < state.step ? "is-done" : "");
        dotsHtml += `<div class="planner-dot ${activeClass}"></div>`;
    }
    dotsHtml += `</div>`;
    return dotsHtml;
}

// =========================================
// STEP 1: Will you go out with me?
// =========================================
function renderStep1(container) {
    container.innerHTML = `
        ${renderProgressDots()}
        <div class="planner-mascot">${CUTE_MASCOTS.step1}</div>
        <h2 class="planner-step-title">Mau Jalan-Jalan & Kencan Bareng Aku?</h2>
        <p class="planner-step-subtitle">Ada satu jawaban paling benar di dunia ini... ✨</p>
        
        <div class="planner-arena" id="planner-arena">
            <button type="button" class="planner-btn-yes" id="btn-yes">Mau Banget! 💖</button>
            <button type="button" class="planner-btn-no" id="btn-no">Pikir-pikir Dulu... 🤔</button>
        </div>
    `;

    const btnYes = container.querySelector("#btn-yes");
    const btnNo = container.querySelector("#btn-no");
    const arena = container.querySelector("#planner-arena");

    if (btnYes) {
        btnYes.addEventListener("click", () => {
            state.step = 2;
            renderStep();
        });
    }

    if (btnNo && arena) {
        const dodge = (e) => {
            e.preventDefault();
            state.dodgeCount++;

            // Playful text shift
            const textIdx = Math.min(state.dodgeCount, DODGE_TEXTS.length - 1);
            btnNo.textContent = DODGE_TEXTS[textIdx];

            // Scale up Yes Button
            const scale = 1 + Math.min(state.dodgeCount * 0.12, 0.7);
            if (btnYes) {
                btnYes.style.transform = `scale(${scale})`;
            }

            // Move No Button to random position within arena
            btnNo.classList.add("is-dodging");
            const arenaRect = arena.getBoundingClientRect();
            const btnRect = btnNo.getBoundingClientRect();

            const maxX = Math.max(0, arenaRect.width - btnRect.width - 20);
            const maxY = Math.max(0, arenaRect.height - btnRect.height - 10);

            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);

            btnNo.style.left = `${randomX}px`;
            btnNo.style.top = `${randomY}px`;
        };

        btnNo.addEventListener("mouseover", dodge);
        btnNo.addEventListener("touchstart", dodge, { passive: false });
        btnNo.addEventListener("click", dodge);
    }
}

// =========================================
// STEP 2: When are you free?
// =========================================
function renderStep2(container) {
    container.innerHTML = `
        <button type="button" class="planner-back-btn" id="btn-back">← Kembali</button>
        ${renderProgressDots()}
        <div class="planner-mascot">${CUTE_MASCOTS.step2}</div>
        <h2 class="planner-step-title">Kapan Kamu Senggang?</h2>
        <p class="planner-step-subtitle">Pilih hari dan waktu terbaik untuk agenda kencan kita 🗓️</p>

        <div style="text-align:left; margin-bottom:8px; font-size:0.8rem; font-weight:700; color:var(--muted);">PILIH HARI:</div>
        <div class="planner-pills-row" id="days-row">
            <button type="button" class="planner-pill ${state.day === 'Hari Ini' ? 'is-selected' : ''}" data-val="Hari Ini">Hari Ini 🌟</button>
            <button type="button" class="planner-pill ${state.day === 'Besok' ? 'is-selected' : ''}" data-val="Besok">Besok 🌅</button>
            <button type="button" class="planner-pill ${state.day === 'Sabtu Ini' ? 'is-selected' : ''}" data-val="Sabtu Ini">Sabtu Ini ☕</button>
            <button type="button" class="planner-pill ${state.day === 'Minggu Ini' ? 'is-selected' : ''}" data-val="Minggu Ini">Minggu Ini 🍦</button>
            <button type="button" class="planner-pill ${state.day === 'Surprise Me' ? 'is-selected' : ''}" data-val="Surprise Me">Surprise Me! 🎁</button>
        </div>

        <div style="text-align:left; margin-bottom:8px; font-size:0.8rem; font-weight:700; color:var(--muted);">PILIH WAKTU:</div>
        <div class="planner-pills-row" id="times-row">
            <button type="button" class="planner-pill ${state.time.includes('Pagi') ? 'is-selected' : ''}" data-val="Pagi (09:30 WIB)">Pagi • 09:30 ☀️</button>
            <button type="button" class="planner-pill ${state.time.includes('Siang') ? 'is-selected' : ''}" data-val="Siang (12:30 WIB)">Siang • 12:30 🍧</button>
            <button type="button" class="planner-pill ${state.time.includes('Sore') ? 'is-selected' : ''}" data-val="Sore (16:30 WIB)">Sore • 16:30 🌅</button>
            <button type="button" class="planner-pill ${state.time.includes('Malam') ? 'is-selected' : ''}" data-val="Malam (19:30 WIB)">Malam • 19:30 🌙</button>
        </div>

        <button type="button" class="planner-next-btn" id="btn-next">Lanjut Ke Tempat Tujuan →</button>
    `;

    bindBackAndNext(container, 1, 3);

    // Pill selections
    container.querySelectorAll("#days-row .planner-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            container.querySelectorAll("#days-row .planner-pill").forEach(p => p.classList.remove("is-selected"));
            pill.classList.add("is-selected");
            state.day = pill.getAttribute("data-val");
        });
    });

    container.querySelectorAll("#times-row .planner-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            container.querySelectorAll("#times-row .planner-pill").forEach(p => p.classList.remove("is-selected"));
            pill.classList.add("is-selected");
            state.time = pill.getAttribute("data-val");
        });
    });
}

// =========================================
// STEP 3: Where are we going?
// =========================================
function renderStep3(container) {
    const LOCATIONS = [
        { id: "loc-coffee", icon: "☕", title: "Ngopi Santai", sub: "Kafe estetik & nyaman favorit kita" },
        { id: "loc-dinner", icon: "🍽️", title: "Dinner Romantis", sub: "Makan malam bertabur cahaya lilin" },
        { id: "loc-movie", icon: "🎬", title: "Nonton Bioskop", sub: "Kamu yang pilih filmnya, aku traktir!" },
        { id: "loc-beach", icon: "🌅", title: "Piknik Pantai", sub: "Menikmati angin sore & deru ombak" }
    ];

    if (!state.location) state.location = LOCATIONS[0];

    let gridHtml = LOCATIONS.map(loc => `
        <div class="planner-option-card ${state.location.id === loc.id ? 'is-selected' : ''}" data-id="${loc.id}">
            <div class="planner-opt-title"><span class="planner-opt-icon">${loc.icon}</span> ${loc.title}</div>
            <div class="planner-opt-sub">${loc.sub}</div>
        </div>
    `).join("");

    container.innerHTML = `
        <button type="button" class="planner-back-btn" id="btn-back">← Kembali</button>
        ${renderProgressDots()}
        <div class="planner-mascot">${CUTE_MASCOTS.step3}</div>
        <h2 class="planner-step-title">Mau Jalan Ke Mana Kita?</h2>
        <p class="planner-step-subtitle">Pilih destinasi kencan seru impianmu berdua 🗺️</p>

        <div class="planner-options-grid">${gridHtml}</div>

        <button type="button" class="planner-next-btn" id="btn-next">Lanjut Pilih Bawaan →</button>
    `;

    bindBackAndNext(container, 2, 4);

    container.querySelectorAll(".planner-option-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            state.location = LOCATIONS.find(l => l.id === id);
            container.querySelectorAll(".planner-option-card").forEach(c => c.classList.remove("is-selected"));
            card.classList.add("is-selected");
        });
    });
}

// =========================================
// STEP 4: What should I bring?
// =========================================
function renderStep4(container) {
    const GIFTS = [
        { id: "gift-flowers", icon: "💐", title: "Bunga Cantik", sub: "Biar senyummu makin cerah seharian" },
        { id: "gift-sweets", icon: "🍰", title: "Cemilan Manis", sub: "Kue atau es krim buat disantap bareng" },
        { id: "gift-playlist", icon: "🎵", title: "Special Playlist", sub: "Lagu-lagu romantis buatanku khusus kamu" },
        { id: "gift-me", icon: "💖", title: "Hadirin Diri Aja", sub: "Yang penting kamu ada di sampingku" }
    ];

    if (!state.gift) state.gift = GIFTS[0];

    let gridHtml = GIFTS.map(g => `
        <div class="planner-option-card ${state.gift.id === g.id ? 'is-selected' : ''}" data-id="${g.id}">
            <div class="planner-opt-title"><span class="planner-opt-icon">${g.icon}</span> ${g.title}</div>
            <div class="planner-opt-sub">${g.sub}</div>
        </div>
    `).join("");

    container.innerHTML = `
        <button type="button" class="planner-back-btn" id="btn-back">← Kembali</button>
        ${renderProgressDots()}
        <div class="planner-mascot">${CUTE_MASCOTS.step4}</div>
        <h2 class="planner-step-title">Apa Yang Harus Aku Bawa?</h2>
        <p class="planner-step-subtitle">Hadiah manis kecil untuk melengkapi harimu 🎁</p>

        <div class="planner-options-grid">${gridHtml}</div>

        <button type="button" class="planner-next-btn" id="btn-next">Lanjut Pilihan Akhir →</button>
    `;

    bindBackAndNext(container, 3, 5);

    container.querySelectorAll(".planner-option-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            state.gift = GIFTS.find(g => g.id === id);
            container.querySelectorAll(".planner-option-card").forEach(c => c.classList.remove("is-selected"));
            card.classList.add("is-selected");
        });
    });
}

// =========================================
// STEP 5: And then? (After-date activity)
// =========================================
function renderStep5(container) {
    const AFTERS = [
        { id: "after-icecream", icon: "🍦", title: "Beli Es Krim", sub: "Jalan santai malam sambil ngobrol manis" },
        { id: "after-stars", icon: "🌌", title: "Stargazing", sub: "Melihat bintang malam di tempat sepi" },
        { id: "after-drive", icon: "🚗", title: "Night Drive", sub: "Buka kaca mobil, dengerin lagu favorit" },
        { id: "after-secret", icon: "🤫", title: "Rahasia Manis", sub: "Biarkan jadi kejutan spesial buatmu!" }
    ];

    if (!state.after) state.after = AFTERS[0];

    let gridHtml = AFTERS.map(a => `
        <div class="planner-option-card ${state.after.id === a.id ? 'is-selected' : ''}" data-id="${a.id}">
            <div class="planner-opt-title"><span class="planner-opt-icon">${a.icon}</span> ${a.title}</div>
            <div class="planner-opt-sub">${a.sub}</div>
        </div>
    `).join("");

    container.innerHTML = `
        <button type="button" class="planner-back-btn" id="btn-back">← Kembali</button>
        ${renderProgressDots()}
        <div class="planner-mascot">${CUTE_MASCOTS.step5}</div>
        <h2 class="planner-step-title">Setelah Itu Mau Ke Mana?</h2>
        <p class="planner-step-subtitle">Penutup malam kencan yang paling berkesan ✨</p>

        <div class="planner-options-grid">${gridHtml}</div>

        <button type="button" class="planner-next-btn" id="btn-submit">Terbitkan Tiket Kencan Kita ✨</button>
    `;

    bindBackAndNext(container, 4, 6);

    container.querySelectorAll(".planner-option-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            state.after = AFTERS.find(a => a.id === id);
            container.querySelectorAll(".planner-option-card").forEach(c => c.classList.remove("is-selected"));
            card.classList.add("is-selected");
        });
    });
}

// =========================================
// STEP 6: Issued Date Pass Ticket Voucher
// =========================================
function renderStep6(container) {
    const couponCode = "LOVE-PASS-" + Math.floor(1000 + Math.random() * 9000);
    
    // Save generated ticket to localStorage collection automatically
    saveNewTicketToCollection({
        id: "ticket-" + Date.now(),
        category: "kencan",
        title: `Kencan: ${state.location?.title || 'Jalan-Jalan'}`,
        location: state.location?.title || 'Terserah Kamu',
        date: `${state.day} • ${state.time}`,
        code: couponCode,
        note: `Bawa: ${state.gift?.title || 'Senyuman'} • Penutup: ${state.after?.title || 'Es Krim'}`,
        theme: "rose",
        used: false
    });

    container.innerHTML = `
        <div class="planner-mascot" style="width:80px;height:80px;margin-bottom:8px;">${CUTE_MASCOTS.step6}</div>
        <h2 class="planner-step-title" style="color:var(--gold);">It's a Date! 🎫</h2>
        <p class="planner-step-subtitle">Tiket kencan resmi kalian telah berhasil diterbitkan!</p>

        <div class="date-pass-voucher">
            <div class="date-pass-header">
                <span class="date-pass-badge">SPECIAL DATE PASS</span>
                <span class="date-pass-code">${couponCode}</span>
            </div>

            <div class="date-pass-title">${state.location?.icon || '💖'} ${state.location?.title || 'Kencan Romantis'}</div>

            <div class="date-pass-specs">
                <div class="date-spec-item">
                    <span class="date-spec-label">HARI / TANGGAL</span>
                    <span class="date-spec-val">${state.day}</span>
                </div>
                <div class="date-spec-item">
                    <span class="date-spec-label">WAKTU</span>
                    <span class="date-spec-val">${state.time}</span>
                </div>
                <div class="date-spec-item">
                    <span class="date-spec-label">BAWAAN</span>
                    <span class="date-spec-val">${state.gift?.icon} ${state.gift?.title}</span>
                </div>
                <div class="date-spec-item">
                    <span class="date-spec-label">SETELAH ITU</span>
                    <span class="date-spec-val">${state.after?.icon} ${state.after?.title}</span>
                </div>
            </div>

            <div class="date-pass-countdown">
                <div class="countdown-label">STARTING COUNTDOWN</div>
                <div class="countdown-timer" id="countdown-timer">02 Hari : 07 Jam : 12 Menit</div>
            </div>

            <div class="date-pass-actions">
                <button type="button" class="date-pass-btn" id="btn-save-calendar">
                    📅 Simpan Ke Kalender
                </button>
                <button type="button" class="date-pass-btn date-pass-btn--secondary" id="btn-reset-planner">
                    ✨ Buat Kencan Lagi
                </button>
            </div>
        </div>
    `;

    // Start live countdown interval
    startCountdown();

    // Calendar Modal Handler
    const btnCalendar = container.querySelector("#btn-save-calendar");
    if (btnCalendar) {
        btnCalendar.addEventListener("click", () => {
            openCalendarModal();
        });
    }

    // Reset Planner Handler
    const btnReset = container.querySelector("#btn-reset-planner");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            state.step = 1;
            state.dodgeCount = 0;
            renderStep();
        });
    }
}

function bindBackAndNext(container, backStep, nextStep) {
    const btnBack = container.querySelector("#btn-back");
    const btnNext = container.querySelector("#btn-next") || container.querySelector("#btn-submit");

    if (btnBack) {
        btnBack.addEventListener("click", () => {
            state.step = backStep;
            renderStep();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            state.step = nextStep;
            renderStep();
        });
    }
}

function startCountdown() {
    const timerEl = document.getElementById("countdown-timer");
    if (!timerEl) return;

    // Fixed dummy countdown for romantic aesthetic (e.g. 2 days 7 hours 15 minutes)
    let totalSeconds = 2 * 86400 + 7 * 3600 + 15 * 60;

    const updateTimer = () => {
        if (totalSeconds <= 0) {
            timerEl.textContent = "HARI INI ADALAH TANGGALNYA! 🎉";
            return;
        }
        totalSeconds--;
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        timerEl.textContent = `${String(d).padStart(2, '0')}D : ${String(h).padStart(2, '0')}H : ${String(m).padStart(2, '0')}M : ${String(s).padStart(2, '0')}S`;
    };

    updateTimer();
    state.countdownInterval = setInterval(updateTimer, 1000);
}

function saveNewTicketToCollection(newTicket) {
    try {
        const stored = localStorage.getItem("aurora_date_tickets");
        let tickets = stored ? JSON.parse(stored) : [];
        tickets.unshift(newTicket);
        localStorage.setItem("aurora_date_tickets", JSON.stringify(tickets));
    } catch (e) {
        console.warn("Failed to save date ticket to collection:", e);
    }
}

// =========================================
// INTERACTIVE CALENDAR MODAL
// =========================================
function openCalendarModal() {
    let modal = document.getElementById("calendar-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "calendar-modal";
        modal.className = "calendar-modal";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="calendar-modal-content">
            <div class="calendar-modal-title">ADDING TO YOUR CALENDAR</div>
            <div class="calendar-month-name">Agustus 2026</div>

            <div class="calendar-grid">
                <div class="calendar-day-head">Ming</div>
                <div class="calendar-day-head">Sen</div>
                <div class="calendar-day-head">Sel</div>
                <div class="calendar-day-head">Rab</div>
                <div class="calendar-day-head">Kam</div>
                <div class="calendar-day-head">Jum</div>
                <div class="calendar-day-head">Sab</div>

                <!-- Empty offset cells for Aug 2026 (Starts on Saturday) -->
                <div class="calendar-day-cell is-empty"></div>
                <div class="calendar-day-cell is-empty"></div>
                <div class="calendar-day-cell is-empty"></div>
                <div class="calendar-day-cell is-empty"></div>
                <div class="calendar-day-cell is-empty"></div>
                <div class="calendar-day-cell is-empty"></div>

                <!-- Days 1 - 31 -->
                ${generateCalendarDaysHtml(22)}
            </div>

            <div class="calendar-note-text">
                Agenda kencan <strong>${state.location?.title || 'Kencan'}</strong> (${state.day}) berhasil ditambahkan ke kalender! Aku siap menghitung mundur bersamamu. 💖
            </div>

            <button type="button" class="calendar-confirm-btn" id="btn-close-calendar">
                Sampai Jumpa Nanti! ✨
            </button>
        </div>
    `;

    modal.classList.add("is-open");

    const closeBtn = modal.querySelector("#btn-close-calendar");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("is-open");
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("is-open");
        }
    });
}

function generateCalendarDaysHtml(selectedDayNum) {
    let html = "";
    for (let d = 1; d <= 31; d++) {
        const isSel = d === selectedDayNum;
        html += `<div class="calendar-day-cell ${isSel ? 'is-selected-date' : ''}">${d}</div>`;
    }
    return html;
}
