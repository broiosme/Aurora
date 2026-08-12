// =========================================
// PLAYLIST APP — Our Love Soundtrack
// playlistApp.js
// =========================================

import { getAllSongs, addCustomSong, deleteCustomSong } from './data/playlistData.js';
import { initThemeToggle } from './theme-toggle.js';

// ===========================
// STATE
// ===========================
let activeSongId = null;
let allSongs = [];

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initStars();
    allSongs = getAllSongs();
    renderHero();
    renderFeatured(allSongs[0]);
    renderSongList();
    initModal();
    initCustomCursor();
});

// ===========================
// HERO STATS
// ===========================
function renderHero() {
    const countEl = document.getElementById('stat-songs');
    const memoriesEl = document.getElementById('stat-memories');
    if (countEl) countEl.textContent = allSongs.length;
    if (memoriesEl) memoriesEl.textContent = allSongs.filter(s => s.memory).length;
}

// ===========================
// FEATURED PLAYER
// ===========================
function renderFeatured(song) {
    if (!song) return;
    activeSongId = song.id;

    const card = document.querySelector('.playlist-featured__card');
    if (card) {
        card.style.setProperty('--featured-color', song.color || 'var(--primary)');
    }

    // Update info panel
    const setEl = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '';
    };

    setEl('featured-emoji', song.emoji || '🎵');
    setEl('featured-tag', song.tag || '');
    setEl('featured-title', song.title);
    setEl('featured-artist', song.artist);
    setEl('featured-memory', song.memory || '');
    setEl('featured-date', song.date ? `🗓️ ${song.date}` : '');

    // Accent color on memory border
    const memoryEl = document.getElementById('featured-memory-block');
    if (memoryEl) {
        memoryEl.style.borderLeftColor = song.color || 'var(--primary)';
    }

    // Render Spotify embed
    renderSpotifyEmbed(song.spotifyId);

    // Update active state in list
    document.querySelectorAll('.playlist-song-row').forEach(row => {
        row.classList.toggle('is-active', row.dataset.songId === song.id);
        row.style.setProperty('--song-color', row.dataset.color || 'var(--primary)');
    });

    // Scroll featured into view smoothly
    const featured = document.querySelector('.playlist-featured');
    if (featured) {
        featured.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderSpotifyEmbed(spotifyId) {
    const embedWrap = document.getElementById('featured-embed');
    if (!embedWrap) return;

    if (!spotifyId) {
        embedWrap.innerHTML = `
            <div class="playlist-featured__embed-placeholder">
                <div class="spotify-logo">🎵</div>
                <p>Tambahkan Spotify Track ID<br>untuk memutar lagu ini</p>
            </div>
        `;
        return;
    }

    // Use Spotify Embed API — works without login for 30s preview,
    // full playback when user is logged in to Spotify in the browser.
    embedWrap.innerHTML = `
        <iframe
            id="spotify-player-iframe"
            src="https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0"
            width="100%"
            height="280"
            frameborder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style="border-radius: 0; min-height: 280px;">
        </iframe>
    `;
}

// ===========================
// SONG LIST
// ===========================
function renderSongList() {
    const list = document.getElementById('song-list');
    if (!list) return;

    if (allSongs.length === 0) {
        list.innerHTML = `
            <div class="playlist-empty">
                <div class="playlist-empty__icon">🎵</div>
                <p class="playlist-empty__text">Playlist masih kosong</p>
                <p>Tambahkan lagu pertama kalian!</p>
            </div>
        `;
        return;
    }

    list.innerHTML = allSongs.map((song, index) => `
        <div class="playlist-song-row${song.id === activeSongId ? ' is-active' : ''}"
             data-song-id="${song.id}"
             data-custom="${song.id.startsWith('custom_')}"
             data-color="${song.color || 'var(--primary)'}"
             style="--song-color: ${song.color || 'var(--primary)'}; animation-delay: ${index * 0.06}s;">
            <div class="playlist-song-row__index">${song.emoji || '🎵'}</div>
            <div class="playlist-song-row__info">
                <div class="playlist-song-row__title">${escHtml(song.title)}</div>
                <div class="playlist-song-row__artist">${escHtml(song.artist)}</div>
                ${song.tag ? `<span class="playlist-song-row__tag">${escHtml(song.tag)}</span>` : ''}
            </div>
            <div class="playlist-song-row__actions">
                <span class="playlist-song-row__play-icon">▶</span>
                <button class="playlist-song-row__delete" data-song-id="${song.id}" title="Hapus lagu ini">🗑️</button>
            </div>
        </div>
    `).join('');

    // Attach click events
    list.querySelectorAll('.playlist-song-row').forEach(row => {
        row.addEventListener('click', (e) => {
            // Don't trigger if clicking delete button
            if (e.target.closest('.playlist-song-row__delete')) return;
            const songId = row.dataset.songId;
            const song = allSongs.find(s => s.id === songId);
            if (song) renderFeatured(song);
        });
    });

    // Delete buttons
    list.querySelectorAll('.playlist-song-row__delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = btn.dataset.songId;
            if (confirm('Hapus lagu ini dari playlist?')) {
                allSongs = deleteCustomSong(songId);
                renderHero();
                renderSongList();
                // Reset featured to first song
                if (allSongs.length > 0) renderFeatured(allSongs[0]);
            }
        });
    });
}

// ===========================
// ADD SONG MODAL
// ===========================
function initModal() {
    const addBtn = document.getElementById('add-song-btn');
    const modal = document.getElementById('add-song-modal');
    const closeBtn = modal?.querySelector('.playlist-add-modal__close-btn');
    const form = document.getElementById('add-song-form');

    if (!addBtn || !modal || !form) return;

    const openModal = () => modal.classList.add('is-open');
    const closeModal = () => modal.classList.remove('is-open');

    addBtn.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Handle Spotify link input — extract ID from URL
    const spotifyInput = document.getElementById('song-spotify-id');
    if (spotifyInput) {
        spotifyInput.addEventListener('blur', () => {
            const val = spotifyInput.value.trim();
            // If user pasted full URL, extract just the track ID
            const match = val.match(/track\/([A-Za-z0-9]+)/);
            if (match) spotifyInput.value = match[1];
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('song-title')?.value.trim();
        const artist = document.getElementById('song-artist')?.value.trim();
        let spotifyId = document.getElementById('song-spotify-id')?.value.trim();
        const memory = document.getElementById('song-memory')?.value.trim();
        const date = document.getElementById('song-date')?.value.trim();
        const emoji = document.getElementById('song-emoji')?.value || '🎵';
        const tag = document.getElementById('song-tag')?.value.trim();
        const color = document.getElementById('song-color')?.value || '#FF5EA8';

        if (!title || !artist) return;

        // Extract Spotify ID from URL if pasted
        const match = spotifyId.match(/track\/([A-Za-z0-9]+)/);
        if (match) spotifyId = match[1];

        const newSong = {
            id: `custom_${Date.now()}`,
            title,
            artist,
            spotifyId,
            memory,
            date,
            emoji,
            tag,
            color
        };

        allSongs = addCustomSong(newSong);
        renderHero();
        renderSongList();
        renderFeatured(newSong);
        closeModal();
        form.reset();
    });
}

// ===========================
// STARS CANVAS (mini)
// ===========================
function initStars() {
    const canvas = document.getElementById('playlist-stars-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStars();
    }

    function generateStars() {
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 8000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.7 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }

    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;
        stars.forEach(star => {
            const opacity = star.opacity * (0.6 + 0.4 * Math.sin(frame * star.twinkleSpeed + star.twinklePhase));
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

// ===========================
// CUSTOM CURSOR
// ===========================
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const dot = document.createElement('div');
    dot.className = 'custom-cursor__dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    function animateCursor() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// ===========================
// UTILS
// ===========================
function escHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
