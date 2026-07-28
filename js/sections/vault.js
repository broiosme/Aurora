export function initSecretVault() {
    const vaultSection = document.querySelector("#secret-vault");
    if (!vaultSection) return;

    const pinInput = vaultSection.querySelector("#vault-pin");
    const unlockBtn = vaultSection.querySelector("#vault-unlock-btn");
    const feedback = vaultSection.querySelector(".vault-feedback");
    const lockScreen = vaultSection.querySelector(".vault-lock-screen");
    const contentScreen = vaultSection.querySelector(".vault-content-screen");
    const hintBtn = vaultSection.querySelector(".vault-hint-btn");
    const hintPopup = vaultSection.querySelector(".vault-hint-popup");

    // Correct Passcodes (supports multiples like "1307", "130724", "13072024", or custom)
    const VALID_PINS = ["1307", "130724", "13072024", "13", "137"];

    function attemptUnlock() {
        const value = (pinInput ? pinInput.value : "").trim();
        if (!value) {
            showFeedback("Silakan masukkan PIN rahasia!", "warning");
            return;
        }

        if (VALID_PINS.includes(value)) {
            // Success
            showFeedback("PIN Benar! Membuka Kubah Rahasia...", "success");
            
            if (typeof gsap !== "undefined") {
                gsap.to(".vault-lock-icon", {
                    scale: 1.3,
                    rotation: 360,
                    duration: 0.6,
                    ease: "back.in(2)",
                    onComplete: () => {
                        lockScreen.classList.add("is-hidden");
                        contentScreen.classList.remove("is-hidden");

                        gsap.fromTo(contentScreen, 
                            { opacity: 0, y: 30, scale: 0.95 },
                            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
                        );
                    }
                });
            } else {
                lockScreen.classList.add("is-hidden");
                contentScreen.classList.remove("is-hidden");
            }
        } else {
            // Wrong PIN
            showFeedback("PIN Salah! Coba tanggal momen spesial pertama (Contoh: 1307)", "error");
            if (pinInput) pinInput.value = "";
            
            if (typeof gsap !== "undefined") {
                gsap.fromTo(lockScreen,
                    { x: -10 },
                    { x: 10, duration: 0.08, repeat: 5, yoyo: true }
                );
            }
        }
    }

    function showFeedback(msg, type) {
        if (!feedback) return;
        feedback.textContent = msg;
        feedback.className = `vault-feedback vault-feedback--${type}`;
    }

    if (unlockBtn) {
        unlockBtn.addEventListener("click", attemptUnlock);
    }

    if (pinInput) {
        pinInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                attemptUnlock();
            }
        });
    }

    if (hintBtn && hintPopup) {
        hintBtn.addEventListener("click", () => {
            hintPopup.classList.toggle("is-visible");
        });
    }
}
