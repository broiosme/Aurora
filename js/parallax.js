// =====================================
// PARALLAX ENGINE
// =====================================

const hero = document.querySelector(".hero__content");
const moon = document.querySelector(".moon");
const aurora = document.querySelector(".aurora");

let mouseX = 0;
let mouseY = 0;
let ticking = false;

window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);

    if (!ticking) {
        requestAnimationFrame(() => {
            if (hero) {
                gsap.to(hero, {
                    x: mouseX * 12,
                    y: mouseY * 12,
                    duration: 1.2,
                    ease: "power2.out"
                });
            }

            if (moon) {
                gsap.to(moon, {
                    x: mouseX * 24,
                    y: mouseY * 24,
                    duration: 1.5,
                    ease: "power2.out"
                });
            }

            if (aurora) {
                gsap.to(aurora, {
                    x: mouseX * 40,
                    y: mouseY * 40,
                    duration: 2,
                    ease: "power2.out"
                });
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });