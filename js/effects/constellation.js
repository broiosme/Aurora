// =====================================
// CONSTELLATION ENGINE
// =====================================

gsap.from(".star",{

    scale:0,

    opacity:0,

    duration:.8,

    stagger:.15,

    ease:"back.out(2)"

});

gsap.from(".constellation__lines line",{

    strokeDasharray:300,

    strokeDashoffset:300,

    duration:1.8,

    stagger:.2,

    ease:"power2.out"

});

gsap.to(".star",{

    opacity:.35,

    duration:2,

    repeat:-1,

    yoyo:true,

    stagger:{

        each:.2,

        from:"random"

    }

});