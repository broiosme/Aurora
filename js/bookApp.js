import { getStoredChapters, saveChapter } from "./data/bookData.js";

let chapters = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    initBookApp();
});

function initBookApp() {
    chapters = getStoredChapters();
    initCanvasStars();

    renderCurrentChapter();

    // Event listeners for page controls
    const prevBtn = document.querySelector("#prev-page-btn");
    const nextBtn = document.querySelector("#next-page-btn");
    const tocBtn = document.querySelector("#toc-btn");
    const addBtn = document.querySelector("#add-chapter-btn");

    if (prevBtn) prevBtn.addEventListener("click", goToPrevChapter);
    if (nextBtn) nextBtn.addEventListener("click", goToNextChapter);

    if (tocBtn) tocBtn.addEventListener("click", openTocModal);
    if (addBtn) addBtn.addEventListener("click", openAddChapterModal);

    // Modal close listeners
    document.querySelectorAll(".book-modal-close").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modal = e.target.closest(".book-toc-modal, .book-add-modal");
            if (modal) {
                modal.classList.remove("is-visible");
                document.body.style.overflow = "";
            }
        });
    });

    // Close modal on backdrop click
    document.querySelectorAll(".book-toc-modal, .book-add-modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("is-visible");
                document.body.style.overflow = "";
            }
        });
    });

    // Form submit for new chapter
    const addForm = document.querySelector("#add-chapter-form");
    if (addForm) {
        addForm.addEventListener("submit", handleAddChapterSubmit);
    }
}

function renderCurrentChapter() {
    const total = chapters.length;
    if (total === 0) return;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= total) currentIndex = total - 1;

    const chapter = chapters[currentIndex];

    // Left page: Chapter Header, Title, Author & First portion of story
    const leftTitle = document.querySelector("#left-sheet-title");
    const leftAuthor = document.querySelector("#left-sheet-author");
    const leftHeaderChapter = document.querySelector("#left-header-chapter");
    const leftHeaderDate = document.querySelector("#left-header-date");
    const leftBody = document.querySelector("#left-sheet-body");
    const leftFooterPage = document.querySelector("#left-footer-page");

    // Right page: Continuing portion of story & signature
    const rightTitle = document.querySelector("#right-sheet-title");
    const rightBody = document.querySelector("#right-sheet-body");
    const rightFooterPage = document.querySelector("#right-footer-page");
    const pageIndicator = document.querySelector("#page-indicator");

    if (leftTitle) leftTitle.textContent = chapter.title;
    if (leftAuthor) leftAuthor.textContent = `Ditulis oleh: ${chapter.author}`;
    if (leftHeaderChapter) leftHeaderChapter.textContent = `Bab ${chapter.chapterNumber || (currentIndex + 1)}`;
    if (leftHeaderDate) leftHeaderDate.textContent = chapter.date;

    // Split text paragraphs if long
    const paragraphs = chapter.content.split("\n\n");
    const midPoint = Math.ceil(paragraphs.length / 2);

    const leftContent = paragraphs.slice(0, midPoint).join("\n\n");
    const rightContent = paragraphs.slice(midPoint).join("\n\n") || "✨ Halaman ini disimpan untuk kelanjutan cerita kenangan indah berikutnya...";

    if (leftBody) leftBody.textContent = leftContent;
    if (rightTitle) rightTitle.textContent = `${chapter.title} (Lanjutan)`;
    if (rightBody) rightBody.textContent = rightContent;

    const leftPageNum = (currentIndex * 2) + 1;
    const rightPageNum = (currentIndex * 2) + 2;
    const totalPages = total * 2;

    if (leftFooterPage) leftFooterPage.textContent = `Hal. ${leftPageNum}`;
    if (rightFooterPage) rightFooterPage.textContent = `Hal. ${rightPageNum}`;
    if (pageIndicator) pageIndicator.textContent = `Bab ${currentIndex + 1} dari ${total} (Hal ${leftPageNum}-${rightPageNum} dari ${totalPages})`;

    // Update prev/next button state
    const prevBtn = document.querySelector("#prev-page-btn");
    const nextBtn = document.querySelector("#next-page-btn");

    if (prevBtn) prevBtn.disabled = (currentIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentIndex === total - 1);
}

function goToPrevChapter() {
    if (currentIndex > 0) {
        animatePageFlip(() => {
            currentIndex--;
            renderCurrentChapter();
        });
    }
}

function goToNextChapter() {
    if (currentIndex < chapters.length - 1) {
        animatePageFlip(() => {
            currentIndex++;
            renderCurrentChapter();
        });
    }
}

function animatePageFlip(callback) {
    const bookWrapper = document.querySelector(".book-wrapper");
    if (typeof gsap !== "undefined" && bookWrapper) {
        gsap.to(bookWrapper, {
            opacity: 0.4,
            scale: 0.98,
            duration: 0.2,
            onComplete: () => {
                callback();
                gsap.to(bookWrapper, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3
                });
            }
        });
    } else {
        callback();
    }
}

function openTocModal() {
    const tocModal = document.querySelector("#toc-modal");
    const tocList = document.querySelector("#toc-list");
    if (!tocModal || !tocList) return;

    tocList.innerHTML = chapters.map((chap, idx) => `
        <li class="book-toc-item" data-index="${idx}">
            <div>
                <div class="book-toc-item__title">Bab ${idx + 1}: ${chap.title}</div>
                <div class="book-toc-item__author">${chap.date} — Oleh ${chap.author}</div>
            </div>
            <span>👉</span>
        </li>
    `).join('');

    tocList.querySelectorAll(".book-toc-item").forEach(item => {
        item.addEventListener("click", () => {
            const index = parseInt(item.dataset.index, 10);
            currentIndex = index;
            renderCurrentChapter();
            tocModal.classList.remove("is-visible");
            document.body.style.overflow = "";
        });
    });

    tocModal.classList.add("is-visible");
    document.body.style.overflow = "hidden";
}

function openAddChapterModal() {
    const addModal = document.querySelector("#add-chapter-modal");
    if (addModal) {
        addModal.classList.add("is-visible");
        document.body.style.overflow = "hidden";
    }
}

function handleAddChapterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.querySelector("#chap-title").value.trim();
    const author = form.querySelector("#chap-author").value.trim() || "Kamu & Mazyyatul";
    const date = form.querySelector("#chap-date").value.trim() || "Hari Ini";
    const content = form.querySelector("#chap-content").value.trim();

    if (!title || !content) {
        alert("Silakan isi judul dan cerita bab novel!");
        return;
    }

    const newChap = {
        id: "chap_" + Date.now(),
        chapterNumber: chapters.length + 1,
        title,
        author,
        date,
        content
    };

    chapters = saveChapter(newChap);
    currentIndex = chapters.length - 1;
    renderCurrentChapter();

    const addModal = document.querySelector("#add-chapter-modal");
    if (addModal) {
        addModal.classList.remove("is-visible");
        document.body.style.overflow = "";
    }
    form.reset();

    alert("✨ Bab cerita novel baru berhasil ditambahkan!");
}

function initCanvasStars() {
    const canvas = document.querySelector("#book-stars-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.alpha += s.speed;
            if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}
