const BOOK_STORAGE_KEY = "aurora_novel_chapters";

export const initialChapters = [
    {
        id: "chap_1",
        chapterNumber: 1,
        title: "Pertemuan di Bawah Langit Malam",
        author: "Kamu & Mazyyatul",
        date: "13 Juli 2024",
        content: `Malam itu langit tidak berawan, bintang-bintang bersinar begitu terang seperti tahu sesuatu yang indah akan terjadi. 

Banyak cerita dimulai dari ketidaksengajaan. Begitu pula cerita kita. Percakapan pertama yang singkat namun berkesan, seolah-olah kita sudah saling mengenal dari kehidupan sebelumnya. Ada kehangatan tersendiri saat mendengar suaramu, sebuah rasa nyaman yang tidak pernah kurasakan sebelumnya.

Sejak malam itu, setiap kali aku melihat bintang di langit malam, aku tidak lagi sekadar melihat benda langit. Aku melihat pengingat bahwa di bawah langit yang sama, ada seseorang yang sangat spesial yang membuat hariku lebih berwarna.`
    },
    {
        id: "chap_2",
        chapterNumber: 2,
        title: "Tentang Senyum & Hal-Hal Kecil",
        author: "Kamu",
        date: "10 Agustus 2024",
        content: `Orang-orang sering kali mencari kebahagiaan pada hal-hal besar yang megah. Namun bersamamu, aku belajar bahwa kebahagiaan terbesar justru tersembunyi di dalam hal-hal kecil.

Cara kamu tertawa ketika mendengar cerita konyolku, cara kamu menceritakan harimu dengan penuh antusias, hingga tatapan matamu yang hangat. Semua itu adalah potongan-potongan kebahagiaan yang kukumpulkan setiap hari.

Ada satu senyuman yang paling kuingat—senyummu malam itu di bawah lampu taman. Senyum yang tidak hanya menerangi malam, tapi juga memberi ruang hangat di dalam hatiku yang akan selalu kujaga.`
    },
    {
        id: "chap_3",
        chapterNumber: 3,
        title: "Menatap Esok yang Lebih Indah",
        author: "Mazyyatul & Kamu",
        date: "15 September 2024",
        content: `Waktu berjalan dengan begitu cepat ketika kita menghabiskannya bersama orang yang kita sayangi. Hari-hari berganti, bulan berlalu, dan setiap babak baru selalu membawa keajaiban tersendiri.

Buku cerita ini ditulis bukan hanya untuk mengenang masa lalu, tetapi juga untuk merayakan esok hari. Masih banyak tempat yang belum kita kunjungi, masih banyak impian yang ingin kita capai bersama, dan masih banyak halaman kosong di buku ini yang siap kita isi dengan tinta kebahagiaan.

Terima kasih telah menjadi tokoh utama dalam cerita terindah dalam hidupku. Mari kita tulis ribuan halaman berikutnya bersama-sama.`
    }
];

export function getStoredChapters() {
    try {
        const stored = localStorage.getItem(BOOK_STORAGE_KEY);
        if (stored !== null) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn("Error reading stored book chapters", e);
    }
    return [...initialChapters];
}

export function saveChapter(newChapter) {
    const chapters = getStoredChapters();
    chapters.push(newChapter);
    try {
        localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(chapters));
    } catch (e) {
        console.warn("Error saving chapter", e);
    }
    return chapters;
}

export function deleteChapter(chapterId) {
    let chapters = getStoredChapters();
    chapters = chapters.filter(chap => chap.id !== chapterId);
    try {
        localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(chapters));
    } catch (e) {
        console.warn("Error deleting chapter", e);
    }
    return chapters;
}

