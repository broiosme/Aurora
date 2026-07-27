import { memories, geminiConnections } from "../data/memories.js";

export function connectStars() {

    const sky = document.querySelector(".sky");
    if (!sky) return;

    // Bersihkan SVG garis jika sudah ada sebelumnya
    const existingSvg = sky.querySelector(".constellation-lines");
    if (existingSvg) {
        existingSvg.remove();
    }

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.classList.add("constellation-lines");
    sky.appendChild(svg);

    // Buat elemen line berdasarkan koneksi khusus rasi bintang Gemini
    const lines = [];

    geminiConnections.forEach(([fromIdx, toIdx]) => {

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.dataset.from = fromIdx;
        line.dataset.to = toIdx;
        svg.appendChild(line);
        lines.push({ line, fromIdx, toIdx });

    });

    // ==========================================
    // UPDATE POSISI GARIS (Fast Percentage Calculation)
    // ==========================================

    function updateLines() {

        const w = sky.clientWidth;
        const h = sky.clientHeight;
        if (!w || !h) return;

        lines.forEach(({ line, fromIdx, toIdx }) => {

            const memA = memories[fromIdx];
            const memB = memories[toIdx];

            if (!memA || !memB) return;

            const x1 = (memA.x / 100) * w;
            const y1 = (memA.y / 100) * h;
            const x2 = (memB.x / 100) * w;
            const y2 = (memB.y / 100) * h;

            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);

        });

    }

    // Interaktivitas hover: Bintang yang di-hover menyalakan semua garis terhubung
    memories.forEach((mem, idx) => {
        const star = mem.element;
        if (!star) return;

        star.addEventListener("mouseenter", () => {
            lines.forEach(({ line, fromIdx, toIdx }) => {
                if (fromIdx === idx || toIdx === idx) {
                    line.classList.add("line-active");
                }
            });
        });

        star.addEventListener("mouseleave", () => {
            lines.forEach(({ line }) => line.classList.remove("line-active"));
        });
    });

    // Initial updates
    updateLines();
    setTimeout(updateLines, 200);

    // Event listener resize saja (bebas lag scroll)
    window.addEventListener("resize", updateLines, { passive: true });

}