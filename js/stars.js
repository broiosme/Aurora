// =========================================
// PREMIUM STARS & SHOOTING STARS ENGINE
// =========================================

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

// =========================================
// SHOOTING STARS SYSTEM
// =========================================

const shootingStars = [];

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        this.y = Math.random() * canvas.height * 0.4;
        this.length = Math.random() * 80 + 80;
        this.speed = Math.random() * 10 + 12;
        this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // ~45 deg
        this.dx = Math.cos(this.angle) * this.speed;
        this.dy = Math.sin(this.angle) * this.speed;
        this.radius = Math.random() * 1.5 + 1.2;
        this.alpha = 1;
        this.active = true;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.008;

        if (this.alpha <= 0 || this.x > canvas.width || this.y > canvas.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 215, 0, ${this.alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(192, 132, 252, 0)`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.radius;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glow head
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#FFD700";
        ctx.fill();
        ctx.restore();
    }
}

// Spawn shooting stars periodically
setInterval(() => {
    if (shootingStars.length < 3 && Math.random() > 0.3) {
        shootingStars.push(new ShootingStar());
    }
}, 3200);

// Detect click on shooting stars for Easter Egg
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    shootingStars.forEach((star) => {
        if (!star.active) return;
        const dist = Math.hypot(clickX - star.x, clickY - star.y);
        if (dist < 50) {
            star.active = false;
            triggerStarWishSecret();
        }
    });
});

function triggerStarWishSecret() {
    const wishes = [
        "✨ Kamu menangkap bintang jatuh! 'Semoga semua impian Mazyyatul menjadi kenyataan!'",
        "🌟 Bintang Rahasia Diketik! 'Terima kasih telah menjadi bagian paling bersinar dalam hidupku.'",
        "💫 Make a Wish! 'Semoga tahun ini membawa ribuan kebahagiaan untuk Mazyyatul!'"
    ];
    const wish = wishes[Math.floor(Math.random() * wishes.length)];

    showSecretToast(wish);
}

function showSecretToast(message) {
    let toast = document.querySelector(".secret-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "secret-toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4500);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render Ambient Stars
    stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha >= 1 || star.alpha <= 0.2) {
            star.twinkleSpeed *= -1;
        }

        star.x += star.offsetX;
        star.y += star.offsetY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    // Render & Update Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.update();
        ss.draw(ctx);
        if (!ss.active) {
            shootingStars.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();