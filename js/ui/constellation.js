import { memories } from "../data/memories.js";

export function connectStars() {

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.classList.add("constellation-lines");

    document.querySelector(".sky").appendChild(svg);

    for (let i = 0; i < memories.length - 1; i++) {

        const a = memories[i].element;
        const b = memories[i + 1].element;

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1", a.offsetLeft);
        line.setAttribute("y1", a.offsetTop);

        line.setAttribute("x2", b.offsetLeft);
        line.setAttribute("y2", b.offsetTop);

        svg.appendChild(line);

    }

}