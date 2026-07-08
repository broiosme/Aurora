import { memories } from "../data/memories.js";

const modal = document.querySelector(".memory-modal");

export function openMemory(id) {

    const memory = memories.find(m => m.id == id);

    if (!memory) return;

    modal.innerHTML = `
    <div class="memory-card">
        <img src="${memory.image}">
        <h2>${memory.title}</h2>
        <p class="date">${memory.date}</p>
        <p class="quote">${memory.quote}</p>
        <p class="story">${memory.story}</p>

        <button class="close">Close</button>
    </div>
    `;

    modal.classList.add("show");

    gsap.from(".memory-card", {
        y: 80,
        opacity: 0,
        scale: .9,
        duration: .7,
        ease: "power3.out"
    });

}

modal.addEventListener("click", (e) => {

    if (
        e.target.classList.contains("close") ||
        e.target.classList.contains("memory-modal")
    ) {

        modal.classList.remove("show");

    }

});