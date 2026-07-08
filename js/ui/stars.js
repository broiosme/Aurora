import { memories } from "../data/memories.js";
import { openMemory } from "./modal.js";

const sky = document.querySelector(".sky");

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

        sky.appendChild(star);

        memory.element = star;

        // Hover Animation
        star.addEventListener("mouseenter", () => {

            gsap.to(star, {
                scale: 2,
                duration: 0.35,
                boxShadow: "0 0 45px rgba(255,226,154,1)"
            });

        });

        star.addEventListener("mouseleave", () => {

            gsap.to(star, {
                scale: 1,
                duration: 0.35,
                boxShadow: "0 0 20px rgba(255,226,154,.5)"
            });

        });

        // Klik Star
        star.addEventListener("click", () => {

            if (typeof openMemory === "function") {
                openMemory(memory.id);
            } else {
                console.log(memory);
            }

        });

        // Twinkle Animation
        gsap.to(star, {

            scale: gsap.utils.random(1.15, 1.4),
            opacity: gsap.utils.random(0.7, 1),
            duration: gsap.utils.random(1.2, 2.5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 3)

        });

    });

}