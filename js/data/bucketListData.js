const STORAGE_KEY = "aurora_bucket_list_state";

export const initialBucketList = [
    {
        id: "b1",
        title: "Stargazing di Atas Bukit",
        category: "Petualangan",
        icon: "🌌",
        description: "Melihat bintang jatuh bareng sambil minum teh hangat di bawah langit malam."
    },
    {
        id: "b2",
        title: "Nonton Konser Musik Favorit Bareng",
        category: "Kenangan",
        icon: "🎙️",
        description: "Bernyanyi keras-keras di tengah kerumunan lagu kesayangan kita."
    },
    {
        id: "b3",
        title: "Picnic Santai di Taman Saat Sunset",
        category: "Santai",
        icon: "🧺",
        description: "Bawa camilan buatan sendiri, mengobrol dan menikmati matahari terbenam."
    },
    {
        id: "b4",
        title: "Road Trip ke Pantai Rahasia",
        category: "Travel",
        icon: "🌊",
        description: "Mendengarkan playlist perjalanan dan main ombak di tepi pantai."
    },
    {
        id: "b5",
        title: "Masak Resep Baru Bersama di Dapur",
        category: "Home",
        icon: "🍳",
        description: "Coba resep kue/makanan baru meskipun nanti berantakan tapi seru!"
    },
    {
        id: "b6",
        title: "Beli Baju / Jaket Couple Konyol",
        category: "Fun",
        icon: "👕",
        description: "Pakai baju pasangan yang lucunya bikin senyum-senyum sendiri."
    },
    {
        id: "b7",
        title: "Foto Box Polaroid Tema Retro",
        category: "Kenangan",
        icon: "📸",
        description: "Cetak strip foto ekspresi konyol dan tempel di tempat favorit."
    },
    {
        id: "b8",
        title: "Merayakan 1000+ Hari Bersama",
        category: "Milestone",
        icon: "💎",
        description: "Makan malam romantis untuk merayakan perjalanan panjang cinta kita."
    }
];

export function getStoredBucketListState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
}

export function saveBucketListState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn("Unable to save bucket list state", e);
    }
}
