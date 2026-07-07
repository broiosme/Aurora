// =======================================
// TRANSITION
// =======================================

gsap.from(".transition__title",{

    scrollTrigger:{

        trigger:".transition",

        start:"top 75%"

    },

    y:60,

    opacity:0,

    duration:1.2

});

gsap.from(".transition__desc",{

    scrollTrigger:{

        trigger:".transition",

        start:"top 75%"

    },

    y:40,

    opacity:0,

    duration:1,

    delay:.2

});