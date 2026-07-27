// =========================================
// COSMIC POLAROID GALLERY MODULE
// =========================================

export function initGallery() {
    const cards = document.querySelectorAll(".polaroid-card");
    const lightbox = document.querySelector(".gallery-lightbox");
    const lightboxImg = document.querySelector(".gallery-lightbox__img");
    const lightboxCaption = document.querySelector(".gallery-lightbox__caption");
    const lightboxClose = document.querySelector(".gallery-lightbox__close");

    cards.forEach((card) => {
        // 3D Tilt Effect on mouse movement
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 15;
            const rotateY = (x / rect.width) * 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

        // Click to open Lightbox
        card.addEventListener("click", () => {
            if (!lightbox) return;

            const img = card.querySelector("img");
            const caption = card.querySelector(".polaroid-card__caption");

            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.style.display = "block";
            } else if (lightboxImg) {
                lightboxImg.style.display = "none";
            }

            if (caption && lightboxCaption) {
                lightboxCaption.textContent = caption.textContent;
            }

            lightbox.classList.add("show");
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            lightbox.classList.remove("show");
        });
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("show");
            }
        });
    }
}
