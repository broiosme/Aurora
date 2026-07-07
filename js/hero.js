// =======================================
// HERO ANIMATION
// =======================================

const tl = gsap.timeline();

tl.from(".hero__eyebrow", {

    y: 30,

    opacity: 0,

    duration: .8

})

.from(".hero__title", {

    y: 60,

    opacity: 0,

    duration: 1

}, "-=.4")

.from(".hero__subtitle", {

    y: 30,

    opacity: 0,

    duration: .8

}, "-=.5")

.from(".hero__scroll", {

    opacity: 0,

    duration: .8

}, "-=.3");