// =========================================
// BIRDS ANIMATION — LIGHT MODE
// Animated canvas birds flying across the sky
// =========================================

const birdsCanvas = document.createElement("canvas");
birdsCanvas.id = "birds-canvas";
birdsCanvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.8s ease;
`;
document.querySelector(".background").appendChild(birdsCanvas);

const bCtx = birdsCanvas.getContext("2d");

function resizeBirdsCanvas() {
    birdsCanvas.width = window.innerWidth;
    birdsCanvas.height = window.innerHeight;
}

resizeBirdsCanvas();
window.addEventListener("resize", resizeBirdsCanvas);

// Bird class — simple V-shape silhouette with flapping animation
class Bird {
    constructor(flockX, flockY, offsetX, offsetY) {
        this.baseX = flockX + offsetX;
        this.baseY = flockY + offsetY;
        this.x = this.baseX;
        this.y = this.baseY;
        this.wingSpan = Math.random() * 6 + 8; // 8-14px wing size
        this.flapSpeed = Math.random() * 0.04 + 0.03;
        this.flapPhase = Math.random() * Math.PI * 2;
        this.flapAngle = 0;
        this.driftY = Math.random() * 0.3 - 0.15; // subtle vertical drift
    }

    update(t, speedX) {
        this.x += speedX;
        this.y += this.driftY + Math.sin(t * 0.001 + this.flapPhase) * 0.2;
        this.flapAngle = Math.sin(t * this.flapSpeed + this.flapPhase) * 0.6;
    }

    draw(ctx) {
        const ws = this.wingSpan;
        const fa = this.flapAngle;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = "rgba(40, 40, 60, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";

        // Left wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-ws * 0.5, -ws * fa, -ws, -ws * fa * 0.5);
        ctx.stroke();

        // Right wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(ws * 0.5, -ws * fa, ws, -ws * fa * 0.5);
        ctx.stroke();

        ctx.restore();
    }
}

// Flock class — group of birds
class Flock {
    constructor() {
        this.reset();
    }

    reset() {
        const startX = -100 - Math.random() * 200;
        const startY = Math.random() * birdsCanvas.height * 0.35 + 30;
        this.speedX = Math.random() * 0.5 + 0.3;
        this.birds = [];
        const count = Math.floor(Math.random() * 4) + 3; // 3-6 birds per flock

        for (let i = 0; i < count; i++) {
            // V-formation offset
            const row = Math.floor(i / 2) + 1;
            const side = i % 2 === 0 ? -1 : 1;
            const offsetX = i === 0 ? 0 : row * 20 * side + (Math.random() * 10 - 5);
            const offsetY = i === 0 ? 0 : row * 15 + (Math.random() * 8 - 4);
            this.birds.push(new Bird(startX, startY, offsetX, offsetY));
        }

        this.active = true;
    }

    update(t) {
        let allOffScreen = true;
        this.birds.forEach(bird => {
            bird.update(t, this.speedX);
            if (bird.x < birdsCanvas.width + 100) {
                allOffScreen = false;
            }
        });

        if (allOffScreen) {
            this.active = false;
        }
    }

    draw(ctx) {
        this.birds.forEach(bird => bird.draw(ctx));
    }
}

const flocks = [];
const MAX_FLOCKS = 5;

// Spawn flocks periodically
function spawnFlock() {
    if (flocks.length < MAX_FLOCKS) {
        flocks.push(new Flock());
    }
}

// Initial flocks at staggered positions
for (let i = 0; i < 3; i++) {
    const flock = new Flock();
    // Stagger their start positions
    flock.birds.forEach(bird => {
        bird.x += Math.random() * birdsCanvas.width * 0.6;
        bird.baseX = bird.x;
    });
    flocks.push(flock);
}

setInterval(spawnFlock, 8000);

// Check if light mode
function isLightMode() {
    return document.documentElement.getAttribute("data-theme") === "light";
}

function animateBirds(t) {
    bCtx.clearRect(0, 0, birdsCanvas.width, birdsCanvas.height);

    if (isLightMode()) {
        birdsCanvas.style.opacity = "1";

        for (let i = flocks.length - 1; i >= 0; i--) {
            flocks[i].update(t);
            flocks[i].draw(bCtx);

            if (!flocks[i].active) {
                flocks[i].reset();
            }
        }
    } else {
        birdsCanvas.style.opacity = "0";
    }

    requestAnimationFrame(animateBirds);
}

animateBirds(0);

export { isLightMode };
