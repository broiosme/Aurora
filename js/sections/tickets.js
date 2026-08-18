// =========================================
// TIKET PERJALANAN KITA (ROMANTIC BOARDING PASS & STUBS)
// =========================================

const DEFAULT_TICKETS = [
    {
        id: "ticket-1",
        category: "flight",
        title: "FLIGHT TO LOVE",
        airline: "AURORA AIRWAYS",
        passName: "MAZYYATUL & RAFI",
        passNo: "AU-777-ROMANCE",
        fromCode: "BUMI",
        fromCity: "Awal Pertemuan",
        toCode: "BINTANG",
        toCity: "Hati Kamu",
        date: "13 Juli • Hari Pertama",
        seat: "01A VIP",
        gate: "GATE 07",
        note: "Awal dari semua cerita manis dan perjalanan tak terlupakan.",
        theme: "purple",
        stamped: true
    },
    {
        id: "ticket-2",
        category: "date",
        title: "SPECIAL NIGHT DATE",
        airline: "COSMIC NIGHTS",
        passName: "RAFI & MAZYYATUL",
        passNo: "CN-888-DATE",
        fromCode: "RUTINITAS",
        fromCity: "Keseharian",
        toCode: "SYAHDU",
        toCity: "Kencan Bintang",
        date: "Setiap Malam Minggu",
        seat: "FRONT ROW",
        gate: "GATE 12",
        note: "Tiket khusus kencan makan malam & bincang di bawah aurora.",
        theme: "rose",
        stamped: false
    },
    {
        id: "ticket-3",
        category: "future",
        title: "FUTURE DISCOVERY PASS",
        airline: "DESTINY EXPRESS",
        passName: "MAZYYATUL & RAFI",
        passNo: "DE-999-FOREVER",
        fromCode: "HARI INI",
        fromCity: "Saat Ini",
        toCode: "SELAMANYA",
        toCity: "Masa Depan",
        date: "Forever & Always",
        seat: "INFINITY A1",
        gate: "GATE 99",
        note: "Paspor menuju kebahagiaan abadi dan mimpi yang akan kita raih.",
        theme: "gold",
        stamped: true
    }
];

function getStoredTickets() {
    try {
        const data = localStorage.getItem("aurora_tickets");
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.warn("Could not read tickets from localStorage:", e);
    }
    return DEFAULT_TICKETS;
}

function saveTickets(tickets) {
    try {
        localStorage.setItem("aurora_tickets", JSON.stringify(tickets));
    } catch (e) {
        console.warn("Could not save tickets to localStorage:", e);
    }
}

// Clean human-crafted Lucide / Feather inline SVG templates
const ICONS = {
    plane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.7-.1-1.3.3-1.5 1-.2.7.1 1.4.7 1.7l5.4 3.6-3 3-2.3-.8c-.4-.1-.8 0-1.1.3l-.9.9c-.3.3-.3.8 0 1.1l2.8 2.8c.3.3.8.3 1.1 0l.9-.9c.3-.3.4-.7.3-1.1l-.8-2.3 3-3 3.6 5.4c.3.6 1 .9 1.7.7.7-.2 1.1-.8 1-1.5z"/></svg>`,
    ticket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
    stamp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M19.2 16.8A2 2 0 0 0 21 15v-2a2 2 0 0 0-2-2h-3.4a2 2 0 0 1-1.8-1.1l-1.3-2.6A2 2 0 0 0 10.7 6H9.3a2 2 0 0 0-1.8 1.3L6.2 9.9A2 2 0 0 1 4.4 11H3a2 2 0 0 0-2 2v2a2 2 0 0 0 1.8 1.8"/><circle cx="12" cy="3" r="1"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,
    barcode: `<svg viewBox="0 0 100 30" fill="currentColor"><rect x="0" y="0" width="3" height="30"/><rect x="5" y="0" width="1" height="30"/><rect x="8" y="0" width="4" height="30"/><rect x="14" y="0" width="2" height="30"/><rect x="18" y="0" width="1" height="30"/><rect x="21" y="0" width="5" height="30"/><rect x="28" y="0" width="2" height="30"/><rect x="32" y="0" width="1" height="30"/><rect x="35" y="0" width="3" height="30"/><rect x="40" y="0" width="4" height="30"/><rect x="46" y="0" width="1" height="30"/><rect x="49" y="0" width="2" height="30"/><rect x="53" y="0" width="5" height="30"/><rect x="60" y="0" width="1" height="30"/><rect x="63" y="0" width="3" height="30"/><rect x="68" y="0" width="2" height="30"/><rect x="72" y="0" width="4" height="30"/><rect x="78" y="0" width="1" height="30"/><rect x="81" y="0" width="3" height="30"/><rect x="86" y="0" width="2" height="30"/><rect x="90" y="0" width="5" height="30"/><rect x="97" y="0" width="3" height="30"/></svg>`
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
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">
                    <p style="font-size: 1.1rem; margin-bottom: 8px;">Belum ada tiket untuk kategori ini.</p>
                    <p style="font-size: 0.85rem;">Klik "Buat Tiket Baru" untuk menambah tiket kenangan kalian!</p>
                </div>
            `;
            return;
        }

        filtered.forEach(ticket => {
            const card = document.createElement("div");
            card.className = `ticket-card ticket-card--${ticket.theme || 'purple'} ${ticket.stamped ? 'is-stamped' : ''}`;
            card.setAttribute("data-id", ticket.id);

            card.innerHTML = `
                <!-- Main Stub -->
                <div class="ticket-stub-main">
                    <div class="ticket-airline-bar">
                        <div class="ticket-airline-logo">
                            ${ICONS.plane}
                            <span>${ticket.airline || 'AURORA AIRWAYS'}</span>
                        </div>
                        <span class="ticket-class-badge">${ticket.title || 'BOARDING PASS'}</span>
                    </div>

                    <div class="ticket-route">
                        <div class="ticket-route-point">
                            <span class="ticket-route-code">${ticket.fromCode || 'ORIGIN'}</span>
                            <span class="ticket-route-name">${ticket.fromCity || ''}</span>
                        </div>
                        <div class="ticket-route-flight">
                            <span class="ticket-flight-icon">${ICONS.plane}</span>
                            <div class="ticket-flight-line"></div>
                        </div>
                        <div class="ticket-route-point" style="text-align: right;">
                            <span class="ticket-route-code">${ticket.toCode || 'DEST'}</span>
                            <span class="ticket-route-name">${ticket.toCity || ''}</span>
                        </div>
                    </div>

                    <div class="ticket-info-grid">
                        <div class="ticket-info-item">
                            <span class="ticket-info-label">PASSENGER</span>
                            <span class="ticket-info-value">${ticket.passName || 'MAZYYATUL & RAFI'}</span>
                        </div>
                        <div class="ticket-info-item">
                            <span class="ticket-info-label">DATE & TIME</span>
                            <span class="ticket-info-value">${ticket.date || 'ALWAYS'}</span>
                        </div>
                        <div class="ticket-info-item">
                            <span class="ticket-info-label">SEAT / GATE</span>
                            <span class="ticket-info-value">${ticket.seat || 'VIP'} • ${ticket.gate || 'GATE 07'}</span>
                        </div>
                    </div>

                    ${ticket.note ? `
                    <div class="ticket-memory-note">
                        ${ICONS.sparkle}
                        <span>${ticket.note}</span>
                    </div>` : ''}
                </div>

                <!-- Perforated Tear Line -->
                <div class="ticket-divider"></div>

                <!-- Right Stub -->
                <div class="ticket-stub-side">
                    <div class="ticket-stub-side-header">
                        <span class="ticket-stub-side-title">PASS NO.</span>
                        <div class="ticket-stub-pass-no">${ticket.passNo || 'AU-2026'}</div>
                    </div>

                    <div class="ticket-barcode-wrap">
                        <div class="ticket-barcode-svg">${ICONS.barcode}</div>
                        <div class="ticket-qr-svg">${ICONS.qr}</div>
                    </div>

                    <div class="ticket-stamp">
                        CONFIRMED • VALID
                    </div>

                    <div class="ticket-actions">
                        <button type="button" class="ticket-action-icon-btn ticket-action-icon-btn--stamp" title="Stempel Tiket">
                            ${ICONS.stamp}
                        </button>
                        <button type="button" class="ticket-action-icon-btn ticket-action-icon-btn--delete" title="Hapus Tiket">
                            ${ICONS.trash}
                        </button>
                    </div>
                </div>
            `;

            // Handle stamp click
            const stampBtn = card.querySelector(".ticket-action-icon-btn--stamp");
            if (stampBtn) {
                stampBtn.addEventListener("click", () => {
                    ticket.stamped = !ticket.stamped;
                    card.classList.toggle("is-stamped", ticket.stamped);
                    saveTickets(tickets);
                });
            }

            // Handle delete click
            const deleteBtn = card.querySelector(".ticket-action-icon-btn--delete");
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

            const title = document.getElementById("ticket-title-input")?.value || "BOARDING PASS";
            const category = document.getElementById("ticket-category-select")?.value || "flight";
            const airline = document.getElementById("ticket-airline-input")?.value || "AURORA AIRWAYS";
            const passName = document.getElementById("ticket-pass-name-input")?.value || "MAZYYATUL & RAFI";
            const fromCode = (document.getElementById("ticket-from-code-input")?.value || "BUMI").toUpperCase();
            const fromCity = document.getElementById("ticket-from-city-input")?.value || "";
            const toCode = (document.getElementById("ticket-to-code-input")?.value || "BINTANG").toUpperCase();
            const toCity = document.getElementById("ticket-to-city-input")?.value || "";
            const date = document.getElementById("ticket-date-input")?.value || "Hari Ini";
            const seat = document.getElementById("ticket-seat-input")?.value || "VIP 01";
            const note = document.getElementById("ticket-note-input")?.value || "";
            const theme = document.getElementById("ticket-theme-select")?.value || "purple";

            const newTicket = {
                id: "ticket-" + Date.now(),
                category,
                title,
                airline,
                passName,
                passNo: "AU-" + Math.floor(100 + Math.random() * 900) + "-LOVE",
                fromCode,
                fromCity,
                toCode,
                toCity,
                date,
                seat,
                gate: "GATE 07",
                note,
                theme,
                stamped: true
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
