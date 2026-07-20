import { memories } from "../data/memories.js";

export function connectStars() {

    const sky = document.querySelector(".sky");
    if (!sky) return;

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.classList.add("constellation-lines");

    sky.appendChild(svg);

    // Buat elemen line untuk setiap pasangan bintang
    const lines = [];

    for (let i = 0; i < memories.length - 1; i++) {

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        svg.appendChild(line);
        lines.push(line);

    }

    // ==========================================
    // UPDATE POSISI GARIS (center-to-center)
    // ==========================================

    function updateLines() {

        for (let i = 0; i < memories.length - 1; i++) {

            const a = memories[i].element;
            const b = memories[i + 1].element;

            if (!a || !b) continue;

            const line = lines[i];

            // Hitung dari tengah elemen (offset + setengah ukuran)
            line.setAttribute("x1", a.offsetLeft + a.offsetWidth / 2);
            line.setAttribute("y1", a.offsetTop + a.offsetHeight / 2);
            line.setAttribute("x2", b.offsetLeft + b.offsetWidth / 2);
            line.setAttribute("y2", b.offsetTop + b.offsetHeight / 2);

        }

    }

    // Update pertama — tunggu layout selesai
    requestAnimationFrame(() => {
        requestAnimationFrame(updateLines);
    });

    // Update setiap kali ukuran jendela berubah
    window.addEventListener("resize", updateLines);

}