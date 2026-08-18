// =========================================
// TIKET JALAN-JALAN & KENCAN KITA (DATE COUPON PASSES)
// =========================================

const DEFAULT_TICKETS = [
    {
        id: "ticket-1",
        category: "kencan",
        title: "Tiket Nonton Bioskop Bareng",
        location: "Bioskop XXI Favorit Kita",
        date: "Sabtu Malam Ini • 19:30 WIB",
        code: "COUPON-MOVIE-01",
        note: "Aku yang traktir popcorn rasa karamel & minuman favoritmu ya! 🍿",
        theme: "purple",
        used: false
    },
    {
        id: "ticket-2",
        category: "kuliner",
        title: "Voucher Berburu Kuliner & Ngopi",
        location: "Kafe Senja & Night Market",
        date: "Kapan Pun Kamu Laper",
        code: "COUPON-FOOD-02",
        note: "Bebas milih makanan apa aja sampai kenyang, gak usah mikirin diet! 🍰",
        theme: "rose",
        used: true
    },
    {
        id: "ticket-3",
        category: "jalan",
        title: "Tiket Piknik Sore Ke Pantai",
        location: "Pantai Sunset Aurora",
        date: "Weekend Depan • 16:30 WIB",
        code: "COUPON-BEACH-03",
        note: "Duduk santai sambil menikmati deru ombak & angin sore berdua. 🌅",
        theme: "cyan",
        used: false
    },
    {
        id: "ticket-4",
        category: "bebas",
        title: "Voucher Bebas Request (Wildcard)",
        location: "Terserah Kamu!",
        date: "Bebas Kapan Saja",
        code: "COUPON-FREE-04",
        note: "Kamu yang tentukan mau ke mana dan ngapain, aku siap nganterin! 🚗✨",
        theme: "gold",
        used: false
    }
];

function getStoredTickets() {
    try {
        const data = localStorage.getItem("aurora_date_tickets");
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.warn("Could not read date tickets from localStorage:", e);
    }
    return DEFAULT_TICKETS;
}

function saveTickets(tickets) {
    try {
        localStorage.setItem("aurora_date_tickets", JSON.stringify(tickets));
    } catch (e) {
        console.warn("Could not save date tickets to localStorage:", e);
    }
}

// Clean human-crafted Lucide / Feather inline SVG icons (No AI artifacts)
const ICONS = {
    ticket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
};

const CATEGORY_NAMES = {
    kencan: "KENCAN ROMANTIS",
    jalan: "JALAN-JALAN",
    kuliner: "WISATA KULINER",
    bebas: "VOUCHER BEBAS"
};

export function initTicketsSection() {
    const container = document.getElementById("tickets-container");
    if (!container) return;

    let tickets = getStoredTickets();
    let currentFilter = "all";

    function renderTickets() {
        container.innerHTML = "";

        const filtered = tickets.filter(t => {
            if (currentFilter === "all") return true;
            return t.category === currentFilter;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="tickets-empty">
                    <div class="tickets-empty-icon">${ICONS.ticket}</div>
                    <p class="tickets-empty-title">Belum ada tiket untuk kategori ini.</p>
                    <p class="tickets-empty-desc">Klik "Buat Tiket Baru" untuk menambah tiket jalan-jalan kalian!</p>
                </div>
            `;
            return;
        }

        filtered.forEach(ticket => {
            const card = document.createElement("div");
            card.className = `ticket-card ticket-card--${ticket.theme || 'purple'} ${ticket.used ? 'is-used' : ''}`;
            card.setAttribute("data-id", ticket.id);

            const categoryLabel = CATEGORY_NAMES[ticket.category] || "TIKET JALAN";

            card.innerHTML = `
                <!-- Left Stub -->
                <div class="ticket-stub-main">
                    <div class="ticket-top-bar">
                        <span class="ticket-category-tag">${categoryLabel}</span>
                        <div class="ticket-heart-icon">${ICONS.heart}</div>
                    </div>

                    <h3 class="ticket-title">${ticket.title}</h3>

                    <div class="ticket-details-list">
                        <div class="ticket-detail-item">
                            <span class="ticket-detail-icon">${ICONS.pin}</span>
                            <span class="ticket-detail-text"><strong>Lokasi:</strong> ${ticket.location || 'Terserah Kamu'}</span>
                        </div>
                        <div class="ticket-detail-item">
                            <span class="ticket-detail-icon">${ICONS.calendar}</span>
                            <span class="ticket-detail-text"><strong>Waktu:</strong> ${ticket.date || 'Bebas Kapan Aja'}</span>
                        </div>
                    </div>

                    ${ticket.note ? `
                    <div class="ticket-note-box">
                        <span class="ticket-note-icon">${ICONS.sparkle}</span>
                        <span class="ticket-note-text">${ticket.note}</span>
                    </div>` : ''}
                </div>

                <!-- Perforated Divider Edge -->
                <div class="ticket-divider"></div>

                <!-- Right Stub -->
                <div class="ticket-stub-side">
                    <div class="ticket-code-label">TICKET PASS</div>
                    <div class="ticket-code-val">${ticket.code || 'COUPON-LOVE'}</div>

                    <!-- Stamp Badge -->
                    <div class="ticket-stamp-badge">
                        ${ticket.used ? 'TERPAKAI 💕' : 'SIAP PAKAI ✨'}
                    </div>

                    <div class="ticket-actions-group">
                        <button type="button" class="ticket-use-btn ${ticket.used ? 'is-used' : ''}" title="${ticket.used ? 'Batalkan Status Terpakai' : 'Gunakan Tiket Ini'}">
                            <span class="ticket-use-icon">${ICONS.check}</span>
                            <span>${ticket.used ? 'Sudah Kepakai' : 'Gunakan Tiket'}</span>
                        </button>
                        <button type="button" class="ticket-delete-btn" title="Hapus Tiket">
                            ${ICONS.trash}
                        </button>
                    </div>
                </div>
            `;

            // Toggle used / stamp status
            const useBtn = card.querySelector(".ticket-use-btn");
            if (useBtn) {
                useBtn.addEventListener("click", () => {
                    ticket.used = !ticket.used;
                    card.classList.toggle("is-used", ticket.used);
                    useBtn.classList.toggle("is-used", ticket.used);
                    
                    const badge = card.querySelector(".ticket-stamp-badge");
                    if (badge) {
                        badge.textContent = ticket.used ? 'TERPAKAI 💕' : 'SIAP PAKAI ✨';
                    }

                    const label = useBtn.querySelector("span:last-child");
                    if (label) {
                        label.textContent = ticket.used ? 'Sudah Kepakai' : 'Gunakan Tiket';
                    }

                    saveTickets(tickets);
                });
            }

            // Delete ticket
            const deleteBtn = card.querySelector(".ticket-delete-btn");
            if (deleteBtn) {
                deleteBtn.addEventListener("click", () => {
                    if (confirm(`Hapus tiket "${ticket.title}"?`)) {
                        tickets = tickets.filter(t => t.id !== ticket.id);
                        saveTickets(tickets);
                        renderTickets();
                    }
                });
            }

            container.appendChild(card);
        });
    }

    // Filter Buttons Listener
    const filterBtns = document.querySelectorAll(".tickets-filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            currentFilter = btn.getAttribute("data-filter") || "all";
            renderTickets();
        });
    });

    // Create Ticket Modal Controller
    const modal = document.getElementById("create-ticket-modal");
    const openBtn = document.getElementById("open-create-ticket-modal");
    const closeBtn = document.getElementById("close-ticket-modal");
    const form = document.getElementById("create-ticket-form");

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => {
            modal.classList.add("is-open");
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("is-open");
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("is-open");
            }
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const title = document.getElementById("ticket-title-input")?.value || "Tiket Jalan-Jalan";
            const category = document.getElementById("ticket-category-select")?.value || "kencan";
            const location = document.getElementById("ticket-location-input")?.value || "Terserah Kamu";
            const date = document.getElementById("ticket-date-input")?.value || "Bebas Kapan Aja";
            const note = document.getElementById("ticket-note-input")?.value || "";
            const theme = document.getElementById("ticket-theme-select")?.value || "purple";

            const newTicket = {
                id: "ticket-" + Date.now(),
                category,
                title,
                location,
                date,
                code: "COUPON-" + Math.floor(1000 + Math.random() * 9000),
                note,
                theme,
                used: false
            };

            tickets.unshift(newTicket);
            saveTickets(tickets);
            renderTickets();

            form.reset();
            if (modal) modal.classList.remove("is-open");
        });
    }

    // Initial Render
    renderTickets();
}
