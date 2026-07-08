import "./stars.js";
import "./aurora.js";
import "./moon.js";
import "./opening.js";
import "./hero.js";

import "./parallax.js";
import "./cursor-light.js";
import "./transition.js";

// import "./sections/memories.js";
import { createStars } from "./ui/stars.js";
import { connectStars } from "./ui/constellation.js"; 

console.clear();

console.log("✨ Constellation of Us");

createStars();

connectStars();