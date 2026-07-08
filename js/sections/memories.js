import { memories } from "../data/memories.js";
import { showMemory } from "../ui/memory-card.js";

console.log("Memories.js berhasil di-load");

const canvas = document.querySelector("#constellationCanvas");

console.log(canvas);

if (!canvas) {
    console.error("Canvas #constellationCanvas tidak ditemukan!");
}

const ctx = canvas?.getContext("2d");
// ==========================================
// RESIZE
// ==========================================

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize", resize);

// ==========================================
// DRAW STAR
// ==========================================

function drawStar(x,y){

    ctx.beginPath();

    ctx.arc(x,y,10,0,Math.PI*2);

    ctx.fillStyle="red";

    ctx.fill();

}

function drawLine(x1, y1, x2, y2) {

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "rgba(255,255,255,.15)";

    ctx.lineWidth = 1.2;

    ctx.stroke();

}

// ==========================================
// RENDER
// ==========================================

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < memories.length - 1; i++) {

        const a = memories[i];

        const b = memories[i + 1];

        drawLine(

            canvas.width * (a.x / 100),

            canvas.height * (a.y / 100),

            canvas.width * (b.x / 100),

            canvas.height * (b.y / 100)

        );

    }

    starPositions.length = 0;

memories.forEach(memory=>{

    const x = canvas.width * (memory.x / 100);

    const y = canvas.height * (memory.y / 100);

    starPositions.push({

        x,
        y,
        memory

    });

    drawStar(x,y,"#FFE9A8",5);

});

}

const starPositions = [];

render();

console.log("Memories Loaded");
console.log(canvas);
console.log(memories);

canvas.addEventListener("mousemove",(e)=>{

    const rect = canvas.getBoundingClientRect();

    const mx = e.clientX - rect.left;

    const my = e.clientY - rect.top;

    let hovering = false;

    starPositions.forEach(star=>{

        const dx = mx - star.x;

        const dy = my - star.y;

        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < 18){

            hovering = true;

        }

    });

    canvas.style.cursor = hovering ? "pointer" : "default";

});

canvas.addEventListener("click",(e)=>{

    const rect = canvas.getBoundingClientRect();

    const mx = e.clientX - rect.left;

    const my = e.clientY - rect.top;

    starPositions.forEach(star=>{

        const dx = mx - star.x;

        const dy = my - star.y;

        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < 18){

            showMemory(star.memory);

        }

    });

});