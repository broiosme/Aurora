// =====================================
// MEMORY CARD ENGINE
// =====================================

const card = document.querySelector(".memory");

export function showMemory(memory){

    card.querySelector(".memory__title").textContent = memory.title;

    card.querySelector(".memory__text").textContent = memory.description;

    gsap.fromTo(

        card,

        {
            opacity:0,
            scale:.8,
            y:40
        },

        {
            opacity:1,
            scale:1,
            y:0,
            duration:.7,
            ease:"power3.out"
        }

    );

    card.style.display="block";

}

export function hideMemory(){

    gsap.to(card,{

        opacity:0,

        scale:.8,

        duration:.4,

        onComplete(){

            card.style.display="none";

        }

    });

}