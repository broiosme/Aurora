// ======================================
// MOON ANIMATION
// ======================================

const moon = document.querySelector(".moon");

// Animasi naik turun
gsap.to(moon, {
    y: 18,
    duration: 8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
});

// Animasi cahaya bulan
gsap.to(moon, {
    boxShadow: `
        0 0 70px rgba(255,255,255,.45),
        0 0 180px rgba(255,255,255,.15)
    `,
    duration: 4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
});