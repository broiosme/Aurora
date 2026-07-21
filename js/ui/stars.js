import { memories } from "../data/memories.js";
import { openMemory } from "./modal.js";

const sky = document.querySelector(".sky");

// Tooltip element
const tooltip = document.createElement("div");
tooltip.className = "star-tooltip";
document.body.appendChild(tooltip);

export function createStars() {

    if (!sky) return;

    memories.forEach(memory => {

        const star = document.createElement("button");

        star.className = "memory-star";

        if (memory.importance === "special") {
            star.classList.add("memory-star--special");
        }

        star.style.left = `${memory.x}%`;
        star.style.top = `${memory.y}%`;

        star.dataset.id = memory.id;
        star.dataset.label = memory.title;
        star.dataset.date = memory.date;

        sky.appendChild(star);

        memory.element = star;

        // Hover Animation + Tooltip
        star.addEventListener("mouseenter", (e) => {
            gsap.to(star, {
                scale: 2,
                duration: 0.35,
                ease: "back.out(2)",
                boxShadow: "0 0 45px rgba(255,226,154,1)"
            });

            // Show tooltip
            tooltip.textContent = `${memory.title} — ${memory.date}`;
            tooltip.classList.add("visible");
        });

        star.addEventListener("mousemove", (e) => {
            // Follow cursor with offset
            tooltip.style.left = `${e.clientX + 16}px`;
            tooltip.style.top = `${e.clientY - 10}px`;
        });

        star.addEventListener("mouseleave", () => {
            gsap.to(star, {
                scale: 1,
                duration: 0.35,
                ease: "power2.out",
                boxShadow: memory.importance === "special"
                    ? "0 0 25px rgba(255,230,150,1), 0 0 80px rgba(255,230,150,0.6)"
                    : "0 0 18px rgba(255,226,154,0.8), 0 0 50px rgba(255,226,154,0.25)"
            });

            // Hide tooltip
            tooltip.classList.remove("visible");
        });

        // Touch support for mobile
        star.addEventListener("touchstart", (e) => {
            e.preventDefault();
            openMemory(memory.id);
        });

        // Click Star
        star.addEventListener("click", () => {
            if (typeof openMemory === "function") {
                openMemory(memory.id);
            } else {
                console.log(memory);
            }
        });

        // Twinkle Animation (using GSAP)
        gsap.to(star, {
            scale: gsap.utils.random(1.15, 1.5),
            opacity: gsap.utils.random(0.7, 1),
            duration: gsap.utils.random(1.5, 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 4)
        });

    });

}