// =====================================
// CURSOR LIGHT
// =====================================

const light = document.querySelector(".cursor-light");

window.addEventListener("mousemove", (e) => {

    gsap.to(light, {

        x: e.clientX,

        y: e.clientY,

        duration: 0.8,

        ease: "power3.out"

    });

});