export const journeyMilestones = [
    {
        id: "m1",
        date: "13 Juli 2024",
        title: "Pertama Kali Bertemu",
        subtitle: "Awal Dari Segala Cerita",
        tag: "Awal Mula",
        icon: "✨",
        color: "#FF5EA8",
        image: "assets/images/memory1.png",
        description: "Momen pertama di mana takdir mempertemukan kita. Waktu seolah berhenti sejenak dan bintang-bintang tersenyum melihat awal kisah ini."
    },
    {
        id: "m2",
        date: "10 Agustus 2024",
        title: "Senyum Pertama yang Memikat",
        subtitle: "Cahaya di Tengah Malam",
        tag: "Momen Manis",
        icon: "💖",
        color: "#7C5CFF",
        image: "assets/images/memory2.png",
        description: "Malam itu kamu tertawa lepas, dan di sanalah aku sadar bahwa senyummu adalah pemandangan terindah di alam semesta ini."
    },
    {
        id: "m3",
        date: "15 September 2024",
        title: "Kencan Pertama & Percakapan Panjang",
        subtitle: "Menyelami Duniamu",
        tag: "First Date",
        icon: "☕",
        color: "#6FAEFF",
        image: "assets/images/memory3.png",
        description: "Duduk bersama selama berjam-jam tanpa terasa. Membicarakan segalanya mulai dari hal konyol hingga impian masa depan."
    },
    {
        id: "m4",
        date: "11 November 2024",
        title: "Hari Spesial Kita",
        subtitle: "Komitmen Bintang & Bulan",
        tag: "Milestone",
        icon: "🌙",
        color: "#FFD166",
        image: "assets/images/memory1.png",
        description: "Hari di mana kita berjanji untuk saling menemani, tumbuh bersama, dan saling menjaga di setiap babak kehidupan."
    },
    {
        id: "m5",
        date: "25 Desember 2024",
        title: "Petualangan Pertama Bersama",
        subtitle: "Menjelajah Tempat Baru",
        tag: "Perjalanan",
        icon: "🗺️",
        color: "#C084FC",
        image: "assets/images/memory2.png",
        description: "Jalan-jalan pertama ke tempat favorit baru. Mengambil banyak foto lucu dan menikmati setiap detik yang dihabiskan bersama."
    },
    {
        id: "m6",
        date: "Hari Ini & Selamanya",
        title: "Menulis Bab Baru",
        subtitle: "Bersama Menuju Langit Lebih Tinggi",
        tag: "Masa Depan",
        icon: "🚀",
        color: "#7DD3FC",
        image: "assets/images/memory3.png",
        description: "Setiap hari bersamamu adalah hadiah terindah. Cerita ini masih panjang dan aku tidak sabar melewati ribuan esok bersamamu."
    }
];

const CUSTOM_MEMORIES_KEY = "aurora_custom_memories";
const DELETED_MILESTONES_KEY = "aurora_deleted_milestones";

export function getDeletedMilestoneIds() {
    try {
        const stored = localStorage.getItem(DELETED_MILESTONES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

export function getCustomMemories() {
    try {
        const stored = localStorage.getItem(CUSTOM_MEMORIES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

export function getStoredJourneyMilestones() {
    const deletedIds = getDeletedMilestoneIds();
    const activeInitial = journeyMilestones.filter(m => !deletedIds.includes(m.id));
    const customList = getCustomMemories();
    return [...activeInitial, ...customList];
}

export function deleteJourneyMilestone(id) {
    if (String(id).startsWith("custom_")) {
        const customList = getCustomMemories().filter(m => m.id !== id);
        try {
            localStorage.setItem(CUSTOM_MEMORIES_KEY, JSON.stringify(customList));
        } catch (e) {
            console.warn("Could not delete custom memory", e);
        }
    } else {
        const deletedIds = getDeletedMilestoneIds();
        if (!deletedIds.includes(id)) {
            deletedIds.push(id);
            try {
                localStorage.setItem(DELETED_MILESTONES_KEY, JSON.stringify(deletedIds));
            } catch (e) {
                console.warn("Could not save deleted milestone ID", e);
            }
        }
    }
    return getStoredJourneyMilestones();
}

