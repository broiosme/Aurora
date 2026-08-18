export function initFloatingDock() {
    const dockNav = document.querySelector(".cosmic-dock");
    if (!dockNav) return;

    const itemsWrapper = dockNav.querySelector(".dock-items-wrapper");
    const dockItems = dockNav.querySelectorAll(".dock-item");
    const dockBead = dockNav.querySelector("#dock-bead");
    const dockBeadIcon = dockNav.querySelector("#dock-bead-icon");
    const dockActiveLabel = dockNav.querySelector("#dock-active-label");
    const skinFill = dockNav.querySelector(".dock-skin-fill");
    const skinRim = dockNav.querySelector(".dock-skin-rim");
    const skinSvg = dockNav.querySelector(".dock-skin-svg");

    let currentCx = 0;
    let targetCx = 0;
    let animFrameId = null;

    function updateNotchPath(cx) {
        const dockRect = dockNav.getBoundingClientRect();
        const W = dockRect.width;
        const H = dockRect.height || 54;
        if (W === 0) return;

        if (skinSvg) {
            skinSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        }

        const y0 = 12; // top line of bar track
        const sb = 22; // socket half width
        const sd = 22; // socket depth

        const leftEdge = Math.max(16, cx - sb - 14);
        const rightEdge = Math.min(W - 16, cx + sb + 14);

        // Path for closed fill shape
        const fillPath = `
            M 0,${y0 + 16}
            Q 0,${y0} 16,${y0}
            L ${leftEdge},${y0}
            C ${cx - sb + 2},${y0} ${cx - 12},${y0 + sd} ${cx},${y0 + sd}
            C ${cx + 12},${y0 + sd} ${cx + sb - 2},${y0} ${rightEdge},${y0}
            L ${W - 16},${y0}
            Q ${W},${y0} ${W},${y0 + 16}
            L ${W},${H - 16}
            Q ${W},${H} ${W - 16},${H}
            L 16,${H}
            Q 0,${H} 0,${H - 16}
            Z
        `.replace(/\s+/g, ' ').trim();

        // Path for glowing top rim stroke
        const rimPath = `
            M 0,${y0 + 16}
            Q 0,${y0} 16,${y0}
            L ${leftEdge},${y0}
            C ${cx - sb + 2},${y0} ${cx - 12},${y0 + sd} ${cx},${y0 + sd}
            C ${cx + 12},${y0 + sd} ${cx + sb - 2},${y0} ${rightEdge},${y0}
            L ${W - 16},${y0}
            Q ${W},${y0} ${W},${y0 + 16}
        `.replace(/\s+/g, ' ').trim();

        if (skinFill) skinFill.setAttribute("d", fillPath);
        if (skinRim) skinRim.setAttribute("d", rimPath);
    }

    function animateNotch() {
        const diff = targetCx - currentCx;
        if (Math.abs(diff) > 0.3) {
            currentCx += diff * 0.18;
            if (dockBead) dockBead.style.left = `${currentCx}px`;
            if (dockActiveLabel) dockActiveLabel.style.left = `${currentCx}px`;
            updateNotchPath(currentCx);
            animFrameId = requestAnimationFrame(animateNotch);
        } else {
            currentCx = targetCx;
            if (dockBead) dockBead.style.left = `${currentCx}px`;
            if (dockActiveLabel) dockActiveLabel.style.left = `${currentCx}px`;
            updateNotchPath(currentCx);
            animFrameId = null;
        }
    }

    function setActiveTab(item, immediate = false) {
        if (!item) return;

        dockItems.forEach(el => el.classList.remove("is-active"));
        item.classList.add("is-active");

        const itemRect = item.getBoundingClientRect();
        const dockRect = dockNav.getBoundingClientRect();
        
        // Calculate tab center relative to dock container
        targetCx = itemRect.left + itemRect.width / 2 - dockRect.left;

        // Copy icon content to floating bead
        const iconEl = item.querySelector(".dock-icon");
        if (iconEl && dockBeadIcon) {
            dockBeadIcon.innerHTML = iconEl.innerHTML;
        }

        // Update active label text
        const labelText = item.getAttribute("data-label") || 
                          item.querySelector(".dock-item__tooltip")?.textContent || "";
        if (dockActiveLabel) {
            dockActiveLabel.textContent = labelText;
        }

        // Ensure active item is visible in scrollable container if on mobile
        if (itemsWrapper) {
            const wrapperRect = itemsWrapper.getBoundingClientRect();
            if (itemRect.left < wrapperRect.left || itemRect.right > wrapperRect.right) {
                item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }

        if (immediate || currentCx === 0) {
            currentCx = targetCx;
            if (dockBead) dockBead.style.left = `${currentCx}px`;
            if (dockActiveLabel) dockActiveLabel.style.left = `${currentCx}px`;
            updateNotchPath(currentCx);
        } else {
            if (!animFrameId) {
                animFrameId = requestAnimationFrame(animateNotch);
            }
        }
    }

    // Click handler for links/buttons in dock
    dockItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            const targetId = item.getAttribute("data-target");
            if (targetId) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    if (window.lenis) {
                        window.lenis.scrollTo(targetEl, { offset: -20, duration: 1.2 });
                    } else {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }
            setActiveTab(item);
        });
    });

    // Observer for active section while scrolling
    const sections = document.querySelectorAll("section[id]");
    if (sections.length > 0) {
        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    current = "#" + section.getAttribute("id");
                }
            });

            if (current) {
                const matchingLink = dockNav.querySelector(`.dock-item[data-target="${current}"]`);
                if (matchingLink && !matchingLink.classList.contains("is-active")) {
                    setActiveTab(matchingLink);
                }
            }
        }, { passive: true });
    }

    // Initialize active tab
    const initialActive = dockNav.querySelector(".dock-item.is-active") || dockItems[0];
    setTimeout(() => {
        setActiveTab(initialActive, true);
    }, 50);

    // Update position on window resize
    window.addEventListener("resize", () => {
        const activeItem = dockNav.querySelector(".dock-item.is-active") || dockItems[0];
        setActiveTab(activeItem, true);
    });

    // Watch for theme toggle changes on #theme-toggle button
    const themeBtn = dockNav.querySelector("#theme-toggle");
    if (themeBtn) {
        const observer = new MutationObserver(() => {
            if (themeBtn.classList.contains("is-active")) {
                const iconEl = themeBtn.querySelector(".dock-icon");
                if (iconEl && dockBeadIcon) {
                    dockBeadIcon.innerHTML = iconEl.innerHTML;
                }
                const labelText = themeBtn.getAttribute("data-label") || 
                                  themeBtn.querySelector(".dock-item__tooltip")?.textContent || "";
                if (dockActiveLabel) dockActiveLabel.textContent = labelText;
            }
        });
        observer.observe(themeBtn, { childList: true, subtree: true, attributes: true });
    }
}
