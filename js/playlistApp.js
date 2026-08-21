// =========================================
// PLAYLIST APP — Our Love Soundtrack
// playlistApp.js
// =========================================

import { getAllSongs, addCustomSong, deleteSong, toggleFavorite, extractSpotifyId } from './data/playlistData.js';
import { initThemeToggle } from './theme-toggle.js';

// ===========================
// STATE
// ===========================
let activeSongId = null;
let allSongs = [];
let searchQuery = "";
let activeTag = "Semua";

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initStars();
    allSongs = getAllSongs();
    
    renderHero();
    renderTagFilters();
    
    if (allSongs.length > 0) {
        renderFeatured(allSongs[0]);
    }
    
    renderSongList();
    initSearch();
    initModal();
    initQuickActions();
    initCustomCursor();
});

// ===========================
// HERO STATS
// ===========================
function renderHero() {
    const countEl = document.getElementById('stat-songs');
    const memoriesEl = document.getElementById('stat-memories');
    const favEl = document.getElementById('stat-favorites');
    
    if (countEl) countEl.textContent = allSongs.length;
    if (memoriesEl) memoriesEl.textContent = allSongs.filter(s => s.memory && s.memory.trim().length > 0).length;
    if (favEl) favEl.textContent = allSongs.filter(s => s.isFavorite).length;
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

    // Update info panel text
    const setEl = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '';
    };

    setEl('featured-emoji', song.emoji || '🎵');
    setEl('featured-tag', song.tag || 'Lagu Kita');
    setEl('featured-title', song.title);
    setEl('featured-artist', song.artist);
    setEl('featured-memory', song.memory || 'Setiap melodi menyimpan kenangan berharga.');
    setEl('featured-date', song.date ? `🗓️ ${song.date}` : '');

    // Vinyl Disc update
    const vinylCenter = document.getElementById('vinyl-center');
    if (vinylCenter) {
        vinylCenter.textContent = song.emoji || '🎵';
        vinylCenter.style.backgroundColor = song.color || 'var(--primary)';
    }

    const vinylDisc = document.getElementById('vinyl-disc');
    if (vinylDisc) {
        vinylDisc.classList.remove('is-playing');
        void vinylDisc.offsetWidth; // Trigger reflow for spin animation reset
        vinylDisc.classList.add('is-playing');
    }

    // Equalizer animation state
    const eq = document.getElementById('eq-visualizer');
    if (eq) {
        eq.classList.add('is-active');
    }

    // Accent color on memory block
    const memoryEl = document.getElementById('featured-memory-block');
    if (memoryEl) {
        memoryEl.style.borderLeftColor = song.color || 'var(--primary)';
    }

    // Featured quick action buttons
    const trackId = extractSpotifyId(song.spotifyId);
    
    // Update Favorite Heart Button in featured player
    const favBtn = document.getElementById('featured-fav-btn');
    if (favBtn) {
        favBtn.innerHTML = song.isFavorite ? '❤️' : '🤍';
        favBtn.classList.toggle('is-fav', !!song.isFavorite);
        favBtn.dataset.songId = song.id;
    }

    // Update Spotify link
    const spotifyBtn = document.getElementById('featured-spotify-link');
    if (spotifyBtn) {
        if (trackId) {
            spotifyBtn.href = `https://open.spotify.com/track/${trackId}`;
            spotifyBtn.style.display = 'inline-flex';
        } else {
            spotifyBtn.style.display = 'none';
        }
    }

    // Render Spotify iframe embed
    renderSpotifyEmbed(trackId);

    // Update active row highlighting in list
    document.querySelectorAll('.playlist-song-row').forEach(row => {
        row.classList.toggle('is-active', row.dataset.songId === song.id);
    });
}

function renderSpotifyEmbed(trackId) {
    const embedWrap = document.getElementById('featured-embed');
    if (!embedWrap) return;

    if (!trackId) {
        embedWrap.innerHTML = `
            <div class="playlist-featured__embed-placeholder">
                <div class="spotify-logo">🎵</div>
                <p>Tidak ada Spotify Track ID<br>untuk lagu ini</p>
            </div>
        `;
        return;
    }

    embedWrap.innerHTML = `
        <iframe
            id="spotify-player-iframe"
            src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0"
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
// TAG FILTERS
// ===========================
function renderTagFilters() {
    const container = document.getElementById('playlist-tags-filter');
    if (!container) return;

    // Collect all unique tags from songs
    const tagsSet = new Set();
    allSongs.forEach(s => {
        if (s.tag && s.tag.trim()) tagsSet.add(s.tag.trim());
    });

    const tags = ['Semua', '❤️ Favorit', ...Array.from(tagsSet)];

    container.innerHTML = tags.map(tag => `
        <button type="button" class="playlist-tag-pill${tag === activeTag ? ' is-active' : ''}" data-tag="${escHtml(tag)}">
            ${escHtml(tag)}
        </button>
    `).join('');

    container.querySelectorAll('.playlist-tag-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTag = btn.dataset.tag;
            renderTagFilters();
            renderSongList();
        });
    });
}

// ===========================
// SEARCH & FILTER
// ===========================
function initSearch() {
    const searchInput = document.getElementById('playlist-search');
    const clearBtn = document.getElementById('playlist-search-clear');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) {
            clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
        }
        renderSongList();
    });

    clearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        renderSongList();
    });
}

// ===========================
// SONG LIST RENDERING
// ===========================
function renderSongList() {
    const list = document.getElementById('song-list');
    if (!list) return;

    // Filter songs based on activeTag and searchQuery
    let filtered = [...allSongs];

    if (activeTag === '❤️ Favorit') {
        filtered = filtered.filter(s => s.isFavorite);
    } else if (activeTag !== 'Semua') {
        filtered = filtered.filter(s => s.tag && s.tag.trim() === activeTag);
    }

    if (searchQuery) {
        filtered = filtered.filter(s =>
            (s.title && s.title.toLowerCase().includes(searchQuery)) ||
            (s.artist && s.artist.toLowerCase().includes(searchQuery)) ||
            (s.memory && s.memory.toLowerCase().includes(searchQuery))
        );
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="playlist-empty">
                <div class="playlist-empty__icon">🎶</div>
                <p class="playlist-empty__text">Lagu tidak ditemukan</p>
                <p>${searchQuery ? `Tidak ada lagu dengan kata kunci "${escHtml(searchQuery)}"` : 'Belum ada lagu untuk kategori ini.'}</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map((song, index) => `
        <div class="playlist-song-row${song.id === activeSongId ? ' is-active' : ''}"
             data-song-id="${song.id}"
             style="--song-color: ${song.color || 'var(--primary)'}; animation-delay: ${index * 0.05}s;">
            <div class="playlist-song-row__index">${song.emoji || '🎵'}</div>
            <div class="playlist-song-row__info">
                <div class="playlist-song-row__title">${escHtml(song.title)}</div>
                <div class="playlist-song-row__artist">${escHtml(song.artist)}</div>
                ${song.tag ? `<span class="playlist-song-row__tag">${escHtml(song.tag)}</span>` : ''}
            </div>
            <div class="playlist-song-row__actions">
                <button class="playlist-song-row__fav-btn${song.isFavorite ? ' is-fav' : ''}" data-song-id="${song.id}" title="${song.isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}">
                    ${song.isFavorite ? '❤️' : '🤍'}
                </button>
                <span class="playlist-song-row__play-icon" title="Putar">▶</span>
                <button class="playlist-song-row__delete" data-song-id="${song.id}" title="Hapus lagu ini">🗑️</button>
            </div>
        </div>
    `).join('');

    // Row click -> feature song
    list.querySelectorAll('.playlist-song-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('.playlist-song-row__delete') || e.target.closest('.playlist-song-row__fav-btn')) return;
            const song = allSongs.find(s => s.id === row.dataset.songId);
            if (song) renderFeatured(song);
        });
    });

    // Favorite toggle button inside row
    list.querySelectorAll('.playlist-song-row__fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = btn.dataset.songId;
            allSongs = toggleFavorite(songId);
            renderHero();
            renderSongList();
            
            const currentActive = allSongs.find(s => s.id === activeSongId);
            if (currentActive) renderFeatured(currentActive);
            
            const targetSong = allSongs.find(s => s.id === songId);
            if (targetSong) {
                showToast(targetSong.isFavorite ? `"${targetSong.title}" ditambahkan ke Favorit ❤️` : `"${targetSong.title}" dihapus dari Favorit`);
            }
        });
    });

    // Delete buttons
    list.querySelectorAll('.playlist-song-row__delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = btn.dataset.songId;
            const song = allSongs.find(s => s.id === songId);
            const songName = song ? song.title : 'lagu ini';
            
            if (confirm(`Hapus "${songName}" dari playlist kenangan?`)) {
                allSongs = deleteSong(songId);
                renderHero();
                renderTagFilters();
                renderSongList();
                
                showToast(`"${songName}" telah dihapus`, 'warning');

                if (activeSongId === songId) {
                    if (allSongs.length > 0) {
                        renderFeatured(allSongs[0]);
                    } else {
                        activeSongId = null;
                        resetFeaturedPlayer();
                    }
                }
            }
        });
    });
}

function resetFeaturedPlayer() {
    const embedWrap = document.getElementById('featured-embed');
    if (embedWrap) {
        embedWrap.innerHTML = `
            <div class="playlist-featured__embed-placeholder">
                <div class="spotify-logo">🎵</div>
                <p>Pilih atau tambahkan lagu untuk memutar</p>
            </div>
        `;
    }
    const setEl = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    setEl('featured-title', 'Pilih Lagu');
    setEl('featured-artist', '–');
    setEl('featured-memory', 'Tambahkan lagu baru ke dalam playlist kenangan kalian.');
    setEl('featured-date', '');
    setEl('featured-emoji', '🎵');
    setEl('featured-tag', 'Kenangan');
    
    const eq = document.getElementById('eq-visualizer');
    if (eq) eq.classList.remove('is-active');
}

// ===========================
// QUICK ACTIONS
// ===========================
function initQuickActions() {
    // Favorite toggle button in Now Playing card
    const favBtn = document.getElementById('featured-fav-btn');
    if (favBtn) {
        favBtn.addEventListener('click', () => {
            if (!activeSongId) return;
            allSongs = toggleFavorite(activeSongId);
            renderHero();
            renderSongList();
            
            const activeSong = allSongs.find(s => s.id === activeSongId);
            if (activeSong) {
                renderFeatured(activeSong);
                showToast(activeSong.isFavorite ? `"${activeSong.title}" ditambahkan ke Favorit ❤️` : `"${activeSong.title}" dihapus dari Favorit`);
            }
        });
    }

    // Copy link button
    const copyBtn = document.getElementById('featured-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const activeSong = allSongs.find(s => s.id === activeSongId);
            if (!activeSong) return;
            
            const trackId = extractSpotifyId(activeSong.spotifyId);
            const link = trackId ? `https://open.spotify.com/track/${trackId}` : activeSong.title;
            
            navigator.clipboard.writeText(link).then(() => {
                showToast('Link Spotify berhasil disalin ke clipboard! 📋');
            }).catch(() => {
                showToast('Gagal menyalin link', 'warning');
            });
        });
    }
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

    // Auto-extract Spotify ID dari URL saat user blur dari field
    const spotifyInput = document.getElementById('song-spotify-id');
    if (spotifyInput) {
        spotifyInput.addEventListener('blur', () => {
            const extracted = extractSpotifyId(spotifyInput.value);
            if (extracted) spotifyInput.value = extracted;
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title     = document.getElementById('song-title')?.value.trim();
        const artist    = document.getElementById('song-artist')?.value.trim();
        const spotifyId = extractSpotifyId(document.getElementById('song-spotify-id')?.value);
        const memory    = document.getElementById('song-memory')?.value.trim();
        const date      = document.getElementById('song-date')?.value.trim();
        const emoji     = document.getElementById('song-emoji')?.value || '🎵';
        const tag       = document.getElementById('song-tag')?.value.trim() || 'Kenangan';
        const color     = document.getElementById('song-color')?.value || '#FF5EA8';

        if (!title || !artist) return;

        const newSong = {
            id: `custom_${Date.now()}`,
            title,
            artist,
            spotifyId,
            memory,
            date: date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            emoji,
            tag,
            color,
            isFavorite: false
        };

        allSongs = addCustomSong(newSong);
        renderHero();
        renderTagFilters();
        renderSongList();
        renderFeatured(newSong);
        closeModal();
        form.reset();
        
        showToast(`Lagu "${title}" berhasil ditambahkan! ✨`);
    });
}

// ===========================
// TOAST NOTIFICATIONS
// ===========================
function showToast(message, type = 'info') {
    const container = document.getElementById('playlist-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `playlist-toast playlist-toast--${type}`;
    toast.innerHTML = `
        <span class="playlist-toast__text">${escHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('is-show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('is-show');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ===========================
// STARS CANVAS
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
    // Avoid creating duplicate custom cursors
    if (document.querySelector('.custom-cursor')) return;

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
        cx += (mx - cx) * 0.14;
        cy += (my - cy) * 0.14;
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
