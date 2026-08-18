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

    function getBeadDimensions() {
        if (!dockBead) return { sb: 22, sd: 22, beadWidth: 46 };
        const beadRect = dockBead.getBoundingClientRect();
        const w = beadRect.width > 0 ? beadRect.width : 46;
        const r = w / 2;
        return { sb: Math.round(r + 1), sd: Math.round(r - 1), beadWidth: w };
    }

    function calculateTargetCx(item) {
        if (!item) return 0;
        const itemRect = item.getBoundingClientRect();
        const dockRect = dockNav.getBoundingClientRect();
        return itemRect.left + itemRect.width / 2 - dockRect.left;
    }

    function updateBeadAndNotch(cx) {
        const dockRect = dockNav.getBoundingClientRect();
        const W = dockRect.width;
        const H = dockRect.height || 54;
        if (W === 0) return;

        const { sb, sd, beadWidth } = getBeadDimensions();

        // Clamp cx to keep socket notch inside dock SVG boundaries
        const minCx = sb + 14;
        const maxCx = W - (sb + 14);
        const safeCx = Math.min(Math.max(cx, minCx), maxCx);

        if (skinSvg) {
            skinSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        }

        const trackBg = dockNav.querySelector(".dock-track-bg");
        const y0 = trackBg ? (parseFloat(window.getComputedStyle(trackBg).top) || 12) : 12;

        const leftEdge = Math.max(16, safeCx - sb - 14);
        const rightEdge = Math.min(W - 16, safeCx + sb + 14);

        // Path for closed fill shape
        const fillPath = `
            M 0,${y0 + 16}
            Q 0,${y0} 16,${y0}
            L ${leftEdge},${y0}
            C ${safeCx - sb + 2},${y0} ${safeCx - 12},${y0 + sd} ${safeCx},${y0 + sd}
            C ${safeCx + 12},${y0 + sd} ${safeCx + sb - 2},${y0} ${rightEdge},${y0}
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
            C ${safeCx - sb + 2},${y0} ${safeCx - 12},${y0 + sd} ${safeCx},${y0 + sd}
            C ${safeCx + 12},${y0 + sd} ${safeCx + sb - 2},${y0} ${rightEdge},${y0}
            L ${W - 16},${y0}
            Q ${W},${y0} ${W},${y0 + 16}
        `.replace(/\s+/g, ' ').trim();

        if (skinFill) skinFill.setAttribute("d", fillPath);
        if (skinRim) skinRim.setAttribute("d", rimPath);

        // Clamp bead position within dock container width
        const safeBeadLeft = Math.min(Math.max(cx, beadWidth / 2 + 4), W - (beadWidth / 2 + 4));
        if (dockBead) dockBead.style.left = `${safeBeadLeft}px`;

        // Clamp active label position so it stays inside dock container boundaries
        if (dockActiveLabel) {
            const labelWidth = dockActiveLabel.offsetWidth || 60;
            const safeLabelLeft = Math.min(Math.max(cx, labelWidth / 2 + 8), W - (labelWidth / 2 + 8));
            dockActiveLabel.style.left = `${safeLabelLeft}px`;
        }
    }

    function animateNotch() {
        const diff = targetCx - currentCx;
        if (Math.abs(diff) > 0.3) {
            currentCx += diff * 0.22;
            updateBeadAndNotch(currentCx);
            animFrameId = requestAnimationFrame(animateNotch);
        } else {
            currentCx = targetCx;
            updateBeadAndNotch(currentCx);
            animFrameId = null;
        }
    }

    function setActiveTab(item, immediate = false) {
        if (!item) return;

        dockItems.forEach(el => el.classList.remove("is-active"));
        item.classList.add("is-active");

        // Center active item in scrollable wrapper
        if (itemsWrapper && item) {
            const itemOffsetLeft = item.offsetLeft;
            const itemWidth = item.offsetWidth;
            const wrapperWidth = itemsWrapper.clientWidth;
            const scrollTarget = itemOffsetLeft - (wrapperWidth / 2) + (itemWidth / 2);

            itemsWrapper.scrollTo({
                left: Math.max(0, scrollTarget),
                behavior: immediate ? 'auto' : 'smooth'
            });
        }

        // Calculate tab center relative to dock container
        targetCx = calculateTargetCx(item);

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

        if (immediate || currentCx === 0) {
            currentCx = targetCx;
            updateBeadAndNotch(currentCx);
        } else {
            if (!animFrameId) {
                animFrameId = requestAnimationFrame(animateNotch);
            }
        }
    }

    // Handle horizontal scrolling of itemsWrapper to keep bead & socket aligned live
    if (itemsWrapper) {
        let scrollTicking = false;
        itemsWrapper.addEventListener("scroll", () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    const activeItem = dockNav.querySelector(".dock-item.is-active");
                    if (activeItem) {
                        targetCx = calculateTargetCx(activeItem);
                        if (!animFrameId) {
                            currentCx = targetCx;
                            updateBeadAndNotch(currentCx);
                        }
                    }
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
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

    // Update position on orientation change (mobile)
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            const activeItem = dockNav.querySelector(".dock-item.is-active") || dockItems[0];
            setActiveTab(activeItem, true);
        }, 150);
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

