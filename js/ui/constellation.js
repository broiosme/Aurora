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
    // UPDATE POSISI GARIS (Precise Bounding Box Center)
    // ==========================================

    function updateLines() {

        const skyRect = sky.getBoundingClientRect();
        if (!skyRect.width || !skyRect.height) return;

        lines.forEach(({ line, fromIdx, toIdx }) => {

            const a = memories[fromIdx]?.element;
            const b = memories[toIdx]?.element;

            if (!a || !b) return;

            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();

            // Hitung koordinat relatif terhadap container .sky
            const x1 = aRect.left + aRect.width / 2 - skyRect.left;
            const y1 = aRect.top + aRect.height / 2 - skyRect.top;
            const x2 = bRect.left + bRect.width / 2 - skyRect.left;
            const y2 = bRect.top + bRect.height / 2 - skyRect.top;

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

    // Update bertahap agar aman setelah layout & GSAP selesai
    requestAnimationFrame(() => {
        updateLines();
        setTimeout(updateLines, 100);
        setTimeout(updateLines, 400);
    });

    // Event listener resize & scroll
    window.addEventListener("resize", updateLines);
    window.addEventListener("scroll", updateLines, { passive: true });

}