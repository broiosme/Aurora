// =========================================
// PLAYLIST DATA — Our Love Soundtrack
// =========================================
// Untuk mengganti lagu: ubah spotifyId dengan ID track Spotify.
// Cara dapat ID: Buka Spotify → klik kanan lagu → Share → Copy Song Link
// Link terlihat seperti: https://open.spotify.com/track/XXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXX itulah yang dimasukkan ke spotifyId.

const PLAYLIST_STORAGE_KEY = "aurora_playlist_songs";

export const initialPlaylist = [
    {
        id: "song_1",
        title: "Lagu Pertama Kita",
        artist: "Nama Artis",
        spotifyId: "https://open.spotify.com/track/6lzzVdbjMSBgXvCPoXSBUT?si=cucXVxI6Rmiw41U6BbFgbg&utm_source=copy-link&sci=spotify%3Acard-config%3A1J7YK85eqSgt3uFTcHYYJF", // Ganti dengan ID lagu asli
        color: "#FF5EA8",
        memory: "Lagu yang pertama kali kita dengar bersama. Setiap kali lagu ini mengalun, aku selalu teringat momen itu.",
        date: "13 Juli 2024",
        emoji: "✨",
        tag: "Pertama Kali"
    },
    {
        id: "song_2",
        title: "Soundtrack Kencan Kita",
        artist: "Nama Artis",
        spotifyId: "https://open.spotify.com/track/2NHiy6rZOvm7XFMAIN7jxT?si=hfwlQc7jSIm_Z4aWn9QnJA&utm_source=copy-link&sci=spotify%3Acard-config%3A3mJzYd7xwtROEDzCliXruT", // Ganti dengan ID lagu asli
        color: "#7C5CFF",
        memory: "Lagu yang menemani kencan pertama kita. Masih ingat saat kamu tersenyum mendengarnya.",
        date: "15 September 2024",
        emoji: "☕",
        tag: "First Date"
    },
    {
        id: "song_3",
        title: "Lagu Malam Favoritku",
        artist: "Nama Artis",
        spotifyId: "7qiZfU4dY1lWllzX7mPBI3", // Ganti dengan ID lagu asli
        color: "#6FAEFF",
        memory: "Kalau lagi kangen kamu di malam hari, ini lagu yang selalu kuputar sambil menatap bintang.",
        date: "November 2024",
        emoji: "🌙",
        tag: "Malam Kita"
    },
    {
        id: "song_4",
        title: "Lagu Yang Mengingatkanku Padamu",
        artist: "Nama Artis",
        spotifyId: "2takcwOaAZWiXQijPHIx7B", // Ganti dengan ID lagu asli
        color: "#FFD166",
        memory: "Setiap kali lagu ini muncul di playlist acak, rasanya seperti semesta mengingatkanku untuk tersenyum.",
        date: "Desember 2024",
        emoji: "💛",
        tag: "Selalu Ingat"
    },
    {
        id: "song_5",
        title: "Lagu Impian Kita",
        artist: "Nama Artis",
        spotifyId: "5ghIJDpPoe3CfHMGu71E6T", // Ganti dengan ID lagu asli
        color: "#C084FC",
        memory: "Lagu ini adalah soundtrack dari semua impian yang ingin kita wujudkan bersama.",
        date: "2025",
        emoji: "🚀",
        tag: "Masa Depan"
    }
];

const CUSTOM_PLAYLIST_KEY = "aurora_custom_songs";

export function getStoredPlaylist() {
    try {
        const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
        if (stored !== null) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn("Error reading stored playlist", e);
    }
    return [...initialPlaylist];
}

export function getCustomSongs() {
    try {
        const stored = localStorage.getItem(CUSTOM_PLAYLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

export function getAllSongs() {
    return [...getStoredPlaylist(), ...getCustomSongs()];
}

export function addCustomSong(song) {
    const songs = getCustomSongs();
    songs.push(song);
    try {
        localStorage.setItem(CUSTOM_PLAYLIST_KEY, JSON.stringify(songs));
    } catch (e) {
        console.warn("Error saving custom song", e);
    }
    return getAllSongs();
}

export function deleteCustomSong(songId) {
    const songs = getCustomSongs().filter(s => s.id !== songId);
    try {
        localStorage.setItem(CUSTOM_PLAYLIST_KEY, JSON.stringify(songs));
    } catch (e) {
        console.warn("Error deleting custom song", e);
    }
    return getAllSongs();
}
