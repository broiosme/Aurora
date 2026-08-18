// =========================================
// TICKETS APP — Cosmic Passports & Romance Stubs
// js/ticketsApp.js
// =========================================

import { initThemeToggle } from './theme-toggle.js';
import { initTicketsSection } from './sections/tickets.js';
import { initDatePlanner } from './sections/datePlanner.js';

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initStars();
    initTicketsSection();
    initDatePlanner();
});

// Canvas stars background initializer for tickets.html
function initStars() {
    const canvas = document.getElementById('tickets-stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createStarList();
    });

    let stars = [];

    function createStarList() {
        stars = [];
        const numStars = Math.floor((width * height) / 3500);
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.2) {
                star.speed = -star.speed;
            }
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }

    createStarList();
    animate();
}
