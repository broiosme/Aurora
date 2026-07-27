// =========================================
// INTERACTIVE BIRTHDAY LETTER MODULE
// =========================================

const LETTER_TEXT = `Dear Mazyyatul,

Selamat ulang tahun! 🎉✨
Di antara miliaran bintang di jagat raya ini, kehadiranmu adalah kilau yang paling indah. Terima kasih telah membawa kehangatan, tawa, dan warna indah dalam setiap hariku.

Semoga di usiamu yang baru ini, setiap langkahmu dipenuhi keberkahan, impianmu tercapai satu per satu, dan kebahagiaan selalu memelukmu erat. Tetaplah menjadi dirimu yang luar biasa.

Happy Birthday, my favorite star. ❤️`;

export function initLetter() {
    const envelopeWrapper = document.querySelector(".envelope-wrapper");
    const letterPaper = document.querySelector(".letter-paper");
    const letterBody = document.querySelector(".letter-paper__body");

    if (!envelopeWrapper || !letterPaper) return;

    let isOpen = false;

    envelopeWrapper.addEventListener("click", () => {
        if (isOpen) return;
        isOpen = true;

        envelopeWrapper.classList.add("open");

        // Sound / visual particle effect
        createSparkles(envelopeWrapper);

        setTimeout(() => {
            letterPaper.classList.add("show");
            typewriterLetter(letterBody, LETTER_TEXT);

            // Scroll smoothly into view
            letterPaper.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 600);
    });
}

function typewriterLetter(element, text) {
    element.innerHTML = "";
    let index = 0;
    const speed = 35;

    function type() {
        if (index < text.length) {
            const char = text.charAt(index);
            if (char === "\n") {
                element.innerHTML += "<br>";
            } else {
                element.innerHTML += char;
            }
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

function createSparkles(container) {
    const rect = container.getBoundingClientRect();
    const count = 20;

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement("div");
        sparkle.style.position = "fixed";
        sparkle.style.left = `${rect.left + rect.width / 2}px`;
        sparkle.style.top = `${rect.top + rect.height / 2}px`;
        sparkle.style.width = "8px";
        sparkle.style.height = "8px";
        sparkle.style.backgroundColor = ["#ffd700", "#c084fc", "#ffffff"][Math.floor(Math.random() * 3)];
        sparkle.style.borderRadius = "50%";
        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "999";

        document.body.appendChild(sparkle);

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 120 + 40;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;

        if (typeof gsap !== "undefined") {
            gsap.to(sparkle, {
                x: targetX,
                y: targetY,
                opacity: 0,
                scale: Math.random() * 1.5 + 0.5,
                duration: Math.random() * 0.8 + 0.6,
                ease: "power2.out",
                onComplete: () => sparkle.remove()
            });
        } else {
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
}
