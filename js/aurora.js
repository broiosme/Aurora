// ==========================
// AURORA ENGINE
// ==========================

const aurora = document.querySelector(".aurora");

// Animasi aurora menggunakan GSAP
gsap.to(aurora, {
    x: 80,
    y: -40,
    scale: 1.15,
    rotation: 3,

    duration: 12,

    ease: "sine.inOut",

    repeat: -1,

    yoyo: true
});