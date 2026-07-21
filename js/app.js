import "./stars.js";
import "./aurora.js";
import "./moon.js";
import "./opening.js";
import "./hero.js";

import "./parallax.js";
import "./cursor-light.js";

import { createStars } from "./ui/stars.js";
import { connectStars } from "./ui/constellation.js";
import { initScrollAnimations } from "./scroll.js";
import "./cursor.js";

console.clear();

console.log("✨ Aurora — For Mazyyatul");

// Initialize after DOM is ready and all elements exist
document.addEventListener("DOMContentLoaded", () => {
    createStars();
    connectStars();

    // Scroll-triggered animations for constellation & stars
    // Must run AFTER stars are created so GSAP can find the elements
    initScrollAnimations();

    // Refresh ScrollTrigger to detect newly created elements
    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
});