// =============================
// PREMIUM STARS ENGINE
// =============================

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const stars = [];
const STAR_COUNT = 350;

const colors = [
    "#FFFFFF",
    "#F8F9FF",
    "#D6E8FF",
    "#FFF3C4"
];

for (let i = 0; i < STAR_COUNT; i++) {

    stars.push({

        x: Math.random() * canvas.width,

        y: Math.random() * canvas.height,

        radius: Math.random() * 1.8 + 0.2,

        alpha: Math.random(),

        twinkleSpeed: Math.random() * 0.015 + 0.003,

        color: colors[Math.floor(Math.random() * colors.length)],

        glow: Math.random() > 0.92,

        offsetX: Math.random() * 0.15 - 0.075,

        offsetY: Math.random() * 0.15 - 0.075

    });

}

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {

        star.alpha += star.twinkleSpeed;

        if (star.alpha >= 1 || star.alpha <= 0.2) {

            star.twinkleSpeed *= -1;

        }

        // Floating movement
        star.x += star.offsetX;
        star.y += star.offsetY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;

        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Glow
        if (star.glow) {

            ctx.shadowBlur = 15;
            ctx.shadowColor = star.color;

        } else {

            ctx.shadowBlur = 0;

        }

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = star.color.replace(")", "");

        ctx.globalAlpha = star.alpha;

        ctx.fill();

        ctx.globalAlpha = 1;

    });

    requestAnimationFrame(animate);

}

animate();