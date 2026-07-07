// =====================================
// PARALLAX ENGINE
// =====================================

const hero = document.querySelector(".hero__content");
const moon = document.querySelector(".moon");
const aurora = document.querySelector(".aurora");

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e)=>{

    mouseX = (e.clientX / window.innerWidth - .5);

    mouseY = (e.clientY / window.innerHeight - .5);

    gsap.to(hero,{

        x: mouseX * 12,

        y: mouseY * 12,

        duration:1.5,

        ease:"power3.out"

    });

    gsap.to(moon,{

        x: mouseX * 30,

        y: mouseY * 30,

        duration:2,

        ease:"power3.out"

    });

    gsap.to(aurora,{

        x: mouseX * 50,

        y: mouseY * 50,

        duration:3,

        ease:"power3.out"

    });

});