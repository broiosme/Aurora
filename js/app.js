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
import { initAudio } from "./audio.js";
import { initLetter } from "./letter.js";
import { initGallery } from "./gallery.js";
import { initJourneySection } from "./sections/journey.js";
import { initBucketListSection } from "./sections/bucketList.js";
import { initSecretVault } from "./sections/vault.js";
import { initFloatingDock } from "./ui/dock.js";
import { initAddMemoryModal } from "./sections/addMemory.js";
import "./cursor.js";

console.clear();

console.log("✨ Aurora — Our Cosmic Sanctuary (Mazyyatul & You)");

// Initialize after DOM is ready and all elements exist
document.addEventListener("DOMContentLoaded", () => {
    initAudio();
    createStars();
    connectStars();

    initLetter();
    initGallery();
    initJourneySection();
    initBucketListSection();
    initSecretVault();
    initFloatingDock();
    initAddMemoryModal();

    // Scroll-triggered animations for constellation & stars
    // Must run AFTER stars are created so GSAP can find the elements
    initScrollAnimations();

    // Refresh ScrollTrigger to detect newly created elements
    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
});