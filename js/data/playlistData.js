// =========================================
// PLAYLIST DATA — Our Love Soundtrack
// =========================================

const PLAYLIST_STORAGE_KEY = "aurora_playlist_songs_v2";

export const initialPlaylist = [
    {
        id: "song_1",
        title: "Penjaga Hati",
        artist: "Nadhif Basalamah",
        spotifyId: "2takcwOaAZWiXQijPHIx7B",
        color: "#FF5EA8",
        memory: "Lagu yang pertama kali kita dengar bersama saat malam tenang. Setiap liriknya selalu mengingatkanku betapa bahagianya memiliki kamu sebagai rumahku.",
        date: "13 Juli 2024",
        emoji: "✨",
        tag: "Pertama Kali",
        isFavorite: true
    },
    {
        id: "song_2",
        title: "Anugerah Terindah Yang Pernah Ku Miliki",
        artist: "Sheila On 7",
        spotifyId: "2NHiy6rZOvm7XFMAIN7jxT",
        color: "#7C5CFF",
        memory: "Soundtrack kencan pertama kita. Masih teringat senyuman manismu di dalam mobil saat lagu ini diputar.",
        date: "15 September 2024",
        emoji: "☕",
        tag: "First Date",
        isFavorite: true
    },
    {
        id: "song_3",
        title: "Satu Bulan",
        artist: "Bernadya",
        spotifyId: "7qiZfU4dY1lWllzX7mPBI3",
        color: "#6FAEFF",
        memory: "Lagu tenang yang selalu kuputar saat rindu menyerang di malam hari sambil melihat bintang-bintang di langit.",
        date: "November 2024",
        emoji: "🌙",
        tag: "Malam Kita",
        isFavorite: false
    },
    {
        id: "song_4",
        title: "Die With A Smile",
        artist: "Lady Gaga & Bruno Mars",
        spotifyId: "2takcwOaAZWiXQijPHIx7B",
        color: "#FFD166",
        memory: "Setiap kali mendengarkan melodi indahnya, rasanya seperti semesta merayakan kisah cinta kita berdua.",
        date: "Desember 2024",
        emoji: "💛",
        tag: "Cinta",
        isFavorite: true
    },
    {
        id: "song_5",
        title: "To The Bone",
        artist: "Pamungkas",
        spotifyId: "5ghIJDpPoe3CfHMGu71E6T",
        color: "#C084FC",
        memory: "Lagu impian masa depan kita. Janji untuk saling menyayangi dan tumbuh bersama hingga tua nanti.",
        date: "2025",
        emoji: "🚀",
        tag: "Masa Depan",
        isFavorite: false
    }
];

/**
 * Memproses link atau URI Spotify untuk mengambil 22 karakter Spotify Track ID
 */
export function extractSpotifyId(input) {
    if (!input) return "";
    const str = input.trim();
    
    // Check URL format: https://open.spotify.com/track/XXXXXXXXXXXXXXXXXXXXXX
    const urlMatch = str.match(/track\/([a-zA-Z0-9]{22})/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    
    // Check URI format: spotify:track:XXXXXXXXXXXXXXXXXXXXXX
    const uriMatch = str.match(/spotify:track:([a-zA-Z0-9]{22})/);
    if (uriMatch && uriMatch[1]) return uriMatch[1];
    
    // Check if raw 22-char ID
    if (/^[a-zA-Z0-9]{22}$/.test(str)) {
        return str;
    }
    
    // Fallback: extract substring if query params exist
    const cleaned = str.split("?")[0].split("/").pop();
    return cleaned || str;
}

/**
 * Mengambil daftar lagu dari localStorage atau default initialPlaylist
 */
export function getAllSongs() {
    try {
        const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
        if (stored !== null) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn("Gagal membaca playlist dari localStorage", e);
    }
    
    // Simpan initial list ke localStorage pertama kali
    saveSongs(initialPlaylist);
    return [...initialPlaylist];
}

/**
 * Menyimpan array lagu ke localStorage
 */
function saveSongs(songs) {
    try {
        localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
        console.warn("Gagal menyimpan playlist", e);
    }
}

/**
 * Menambahkan lagu kustom baru ke dalam playlist
 */
export function addCustomSong(song) {
    const songs = getAllSongs();
    songs.unshift(song); // Tambah di paling depan
    saveSongs(songs);
    return songs;
}

/**
 * Menghapus lagu dari playlist berdasarkan ID
 */
export function deleteSong(songId) {
    const songs = getAllSongs().filter(s => s.id !== songId);
    saveSongs(songs);
    return songs;
}

/**
 * Menghapus lagu kustom (alias untuk deleteSong demi kompatibilitas)
 */
export function deleteCustomSong(songId) {
    return deleteSong(songId);
}

/**
 * Mengubah status favorit pada lagu
 */
export function toggleFavorite(songId) {
    const songs = getAllSongs();
    const song = songs.find(s => s.id === songId);
    if (song) {
        song.isFavorite = !song.isFavorite;
        saveSongs(songs);
    }
    return songs;
}
