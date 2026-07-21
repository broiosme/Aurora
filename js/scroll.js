// =====================================
// SCROLL ANIMATIONS ENGINE
// =====================================

/**
 * Initialize scroll-triggered animations for the memories section.
 * Must be called AFTER the DOM elements (.memory-star, .constellation-lines line)
 * have been created by createStars() and connectStars().
 */
export function initScrollAnimations() {

    // --- Scroll-triggered constellation lines reveal ---
    gsap.from(".constellation-lines line", {
        scrollTrigger: {
            trigger: ".memories",
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play none none reverse"
        },
        strokeDasharray: 800,
        strokeDashoffset: 800,
        duration: 2,
        stagger: 0.15,
        ease: "power2.out"
    });

    // --- Fade in memory stars (initial appearance on scroll) ---
    // Uses fromTo to avoid clashing with the twinkle gsap.to() that runs on each star
    gsap.fromTo(".memory-star",
        { scale: 0, opacity: 0 },
        {
            scrollTrigger: {
                trigger: ".memories",
                start: "top 65%",
            },
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: {
                each: 0.12,
                from: "random"
            },
            ease: "back.out(2)",
            clearProps: "scale,opacity"  // reset so twinkle can take over
        }
    );

    // --- Special stars pulse glow ---
    gsap.to(".memory-star--special", {
        boxShadow: "0 0 40px rgba(255, 230, 150, 1), 0 0 100px rgba(255, 230, 150, 0.5)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // --- Parallax for sky on scroll ---
    const sky = document.querySelector(".sky");
    if (sky) {
        gsap.to(sky, {
            scrollTrigger: {
                trigger: ".memories",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -60,
            ease: "none"
        });
    }
}

// --- Transition section animations are handled in js/transition.js ---
