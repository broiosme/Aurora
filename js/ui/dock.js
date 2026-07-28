export function initFloatingDock() {
    const dockNav = document.querySelector(".cosmic-dock");
    if (!dockNav) return;

    const dockLinks = dockNav.querySelectorAll(".dock-item[data-target]");

    dockLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                // If Lenis smooth scroll is available
                if (window.lenis) {
                    window.lenis.scrollTo(targetEl, { offset: -20, duration: 1.2 });
                } else {
                    targetEl.scrollIntoView({ behavior: "smooth" });
                }
            }

            dockLinks.forEach(item => item.classList.remove("is-active"));
            link.classList.add("is-active");
        });
    });

    // Update active icon on scroll using Intersection Observer or scroll event
    const sections = document.querySelectorAll("section[id]");
    if (sections.length > 0) {
        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 200) {
                    current = "#" + section.getAttribute("id");
                }
            });

            if (current) {
                dockLinks.forEach(link => {
                    link.classList.remove("is-active");
                    if (link.getAttribute("data-target") === current) {
                        link.classList.add("is-active");
                    }
                });
            }
        });
    }
}
