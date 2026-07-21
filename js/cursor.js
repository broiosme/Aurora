// =====================================
// CUSTOM CURSOR
// =====================================

// Create custom cursor elements
const cursor = document.createElement("div");
cursor.className = "custom-cursor";

const cursorDot = document.createElement("div");
cursorDot.className = "custom-cursor__dot";

document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Track mouse position
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animate cursor following with smooth delay
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;

    gsap.set(cursor, {
        x: cursorX,
        y: cursorY
    });

    gsap.set(cursorDot, {
        x: mouseX,
        y: mouseY
    });

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Enlarge cursor over interactive elements
const interactiveSelectors = "a, button, .memory-star, .memory-card, input, select, textarea, [data-cursor]";

document.addEventListener("mouseover", (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
        gsap.to(cursor, {
            scale: 1.8,
            borderColor: "rgba(174, 132, 255, 0.5)",
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(cursorDot, {
            scale: 0.5,
            duration: 0.3,
            ease: "power2.out"
        });
    }
});

document.addEventListener("mouseout", (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
        gsap.to(cursor, {
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(cursorDot, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }
});

// Hide cursor on touch devices
if ("ontouchstart" in window) {
    cursor.style.display = "none";
    cursorDot.style.display = "none";
}
