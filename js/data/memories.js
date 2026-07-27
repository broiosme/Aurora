export const geminiConnections = [
    [0, 1], // Castor <-> Pollux (Twin Heads)
    [0, 2], // Castor <-> Castor Arm
    [0, 4], // Castor <-> Mebsuta (Castor Body)
    [4, 6], // Mebsuta <-> Tejat (Castor Foot)
    [1, 3], // Pollux <-> Pollux Shoulder
    [1, 5], // Pollux <-> Wasat (Pollux Body)
    [4, 5], // Mebsuta <-> Wasat (Twin Torso Bridge)
    [5, 7], // Wasat <-> Mekbuda (Pollux Knee)
    [7, 8], // Mekbuda <-> Alhena (Pollux Foot)
    [8, 9]  // Alhena <-> Alzirr (Outer Foot)
];

export const memories = [
    {
        id: 1,
        title: "The First Chapter",
        date: "13 July 2024",
        starName: "Castor (α Gem)",
        image: "",
        fallbackColor: "#FF5EA8",
        quote: "Every beautiful story begins unexpectedly.",
        story: `Hari itu mungkin terlihat biasa.
        Tetapi tanpa sadar,
        hari itu menjadi awal dari semua cerita yang akhirnya ingin selalu kuingat.`,
        x: 36,
        y: 20,
        importance: "special"
    },
    {
        id: 2,
        title: "A Beautiful Smile",
        date: "10 Agustus 2024",
        starName: "Pollux (β Gem)",
        description: "A smile that quietly became one of my favorite memories.",
        image: "",
        fallbackColor: "#7C5CFF",
        quote: "Some smiles are like stars — small but bright enough to light up the dark.",
        story: `Senyum yang tanpa sengaja menjadi salah satu kenangan favorit.
        Mungkin kamu tidak sadar,
        tapi senyum itu punya cara sendiri untuk membuat hari-hari terasa lebih ringan.`,
        x: 54,
        y: 18,
        importance: "special"
    },
    {
        id: 3,
        title: "When the Stars Aligned",
        date: "15 September 2024",
        starName: "Propus (ι Gem)",
        description: "A moment when everything felt perfectly in place.",
        image: "",
        fallbackColor: "#FFD166",
        quote: "The universe has its own way of bringing the right people together.",
        story: `Ada kalanya semesta terasa begitu sempurna.
        Seolah semua bintang sejajar, semua takdir bersatu.
        Saat-saat seperti itulah yang membuatku percaya pada takdir.`,
        x: 22,
        y: 28,
        importance: "normal"
    },
    {
        id: 4,
        title: "A Thousand Words",
        date: "22 Oktober 2024",
        starName: "Kappa Geminorum",
        description: "Sometimes silence speaks louder than words.",
        image: "",
        fallbackColor: "#AE84FF",
        quote: "The most beautiful conversations are the ones where words aren't needed.",
        story: `Tidak semua momen butuh kata-kata.
        Ada saat-saat diam yang justru terasa penuh makna.
        Hanya dengan berada di dekatmu, semuanya terasa lengkap.`,
        x: 66,
        y: 26,
        importance: "normal"
    },
    {
        id: 5,
        title: "Little Things",
        date: "11 November 2024",
        starName: "Mebsuta (ε Gem)",
        description: "It's always the small things that matter the most.",
        image: "",
        fallbackColor: "#FF6FAE",
        quote: "Happiness is found in the smallest moments — if you know where to look.",
        story: `Bukan hal besar yang selalu kuingat.
        Justru hal-hal kecil yang mungkin kamu anggap sepele:
        cara kamu tertawa, cara kamu bicara, atau bahkan cara kamu diam.
        Itu semua berarti lebih dari yang kamu tahu.`,
        x: 38,
        y: 44,
        importance: "normal"
    },
    {
        id: 6,
        title: "Through the Seasons",
        date: "5 Desember 2024",
        starName: "Wasat (δ Gem)",
        description: "Some bonds only grow stronger with time.",
        image: "",
        fallbackColor: "#7DD3FC",
        quote: "Like the seasons, some things change. But the ones that matter stay.",
        story: `Musim berganti, waktu terus berjalan.
        Tapi ada satu hal yang tidak berubah:
        perasaan ini. Seperti pohon yang semakin kuat akarnya seiring waktu,
        begitu pula cerita kita.`,
        x: 56,
        y: 46,
        importance: "normal"
    },
    {
        id: 7,
        title: "A Promise Written in Stars",
        date: "13 Januari 2025",
        starName: "Tejat (μ Gem)",
        description: "A promise whispered to the night sky.",
        image: "",
        fallbackColor: "#FFE29A",
        quote: "Stars don't fade, and neither will this.",
        story: `Suatu malam, di bawah langit penuh bintang,
        aku berjanji dalam hati.
        Tidak ada yang perlu diucapkan,
        karena bintang-bintang tahu apa yang tak terkatakan.`,
        x: 28,
        y: 70,
        importance: "special"
    },
    {
        id: 8,
        title: "The Universe in Your Eyes",
        date: "20 Februari 2025",
        starName: "Mekbuda (ζ Gem)",
        description: "I found galaxies where I least expected them.",
        image: "",
        fallbackColor: "#C084FC",
        quote: "Look into someone's eyes and you might just find the entire universe.",
        story: `Mereka bilang mata adalah jendela jiwa.
        Tapi di matamu, aku menemukan lebih dari itu.
        Aku menemukan galaksi, bintang, dan seluruh semesta
        yang ingin terus kujelajahi.`,
        x: 64,
        y: 64,
        importance: "normal"
    },
    {
        id: 9,
        title: "Still Here",
        date: "Hari Ini",
        starName: "Alhena (γ Gem)",
        description: "No matter how much time passes, some people remain special.",
        image: "",
        fallbackColor: "#6FAEFF",
        quote: "Not all who wander are lost. Some are just waiting to find their way back.",
        story: `Seiring waktu, banyak hal berubah.
        Tapi ada beberapa orang yang tetap spesial,
        tidak peduli seberapa banyak waktu berlalu.
        Kamu adalah salah satunya.`,
        x: 72,
        y: 80,
        importance: "special"
    },
    {
        id: 10,
        title: "And Still Counting",
        date: "Terus berlanjut...",
        starName: "Alzirr (ξ Gem)",
        description: "The best chapters are yet to be written.",
        image: "",
        fallbackColor: "linear-gradient(135deg, #FF5EA8, #7C5CFF)",
        quote: "Every ending is a new beginning. Our story doesn't end here.",
        story: `Setiap cerita pasti ada akhirnya.
        Tapi kupilih untuk percaya bahwa
        ini bukanlah akhir — ini hanya awal dari bab baru.
        Dan aku akan terus menulisnya,
        selama masih ada kata-kata yang tersisa.`,
        x: 84,
        y: 84,
        importance: "special"
    }
];