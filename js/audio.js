// =========================================
// AUDIO ENGINE (AMBIENT BGM & SYNTH ENGINE)
// =========================================

let audioCtx = null;
let isPlaying = false;
let isMuted = false;
let synthGain = null;
let synthInterval = null;
let bgmAudio = null;

// Ambient pentatonic notes for dreamy celestial melody (Hz)
const NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

export function initAudio() {
    createAudioControlUI();

    // Check or create audio element
    bgmAudio = document.getElementById("bgm-player");
    if (!bgmAudio) {
        bgmAudio = document.createElement("audio");
        bgmAudio.id = "bgm-player";
        bgmAudio.src = "assets/audio/bgm.mp3";
        bgmAudio.loop = true;
        bgmAudio.volume = 1.0;
        bgmAudio.preload = "auto";
        document.body.appendChild(bgmAudio);
    }
}

function createAudioControlUI() {
    if (document.querySelector(".audio-control")) return;

    const btn = document.createElement("div");
    btn.className = "audio-control";
    btn.innerHTML = `
        <div class="audio-icon">
            <svg viewBox="0 0 24 24" id="audio-svg">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
        </div>
        <div class="sound-waves">
            <span></span><span></span><span></span><span></span>
        </div>
        <span class="audio-label">Music</span>
    `;

    document.body.appendChild(btn);

    btn.addEventListener("click", toggleAudio);
}

export function startAudioOnOpening() {
    const btn = document.querySelector(".audio-control");
    if (btn) btn.classList.add("visible");

    playAudio();
}

function playAudio() {
    if (isPlaying) return;

    if (!bgmAudio) {
        bgmAudio = document.getElementById("bgm-player");
    }

    if (bgmAudio) {
        bgmAudio.play().then(() => {
            isPlaying = true;
            updateAudioUI(true);
        }).catch((err) => {
            console.warn("BGM Play prevented or waiting for user interaction:", err);
            // Fallback to synth audio if MP3 playback is blocked or fails
            playSynthMelody();
        });
    } else {
        playSynthMelody();
    }
}

function playSynthMelody() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    if (!synthGain) {
        synthGain = audioCtx.createGain();
        synthGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        synthGain.connect(audioCtx.destination);
    }

    isPlaying = true;
    updateAudioUI(true);

    // Play a gentle ambient note periodically
    playSineNote();
    synthInterval = setInterval(playSineNote, 2800);
}

function playSineNote() {
    if (!audioCtx || !isPlaying || isMuted) return;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    const freq = NOTES[Math.floor(Math.random() * NOTES.length)];
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Soft attack & release envelope
    const now = audioCtx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.06, now + 1.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    osc.connect(noteGain);
    noteGain.connect(synthGain);

    osc.start(now);
    osc.stop(now + 3.6);
}

export function toggleAudio() {
    if (!bgmAudio) {
        bgmAudio = document.getElementById("bgm-player");
    }

    if (!isPlaying) {
        if (bgmAudio) {
            bgmAudio.play().then(() => {
                isPlaying = true;
                updateAudioUI(true);
            }).catch(() => {
                playAudio();
            });
        } else {
            playAudio();
        }
    } else {
        pauseAudio();
    }
}

function pauseAudio() {
    isPlaying = false;
    if (bgmAudio) {
        bgmAudio.pause();
    }

    const htmlAudio = document.getElementById("bgm-player");
    if (htmlAudio) {
        htmlAudio.pause();
    }

    if (synthInterval) clearInterval(synthInterval);
    if (audioCtx && audioCtx.state === "running") audioCtx.suspend();
    updateAudioUI(false);
}

function updateAudioUI(playing) {
    const btn = document.querySelector(".audio-control");
    if (!btn) return;

    if (playing) {
        btn.classList.add("playing");
    } else {
        btn.classList.remove("playing");
    }
}
