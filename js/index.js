history.scrollRestoration = 'manual';
window.addEventListener('pagehide', () => {
    sessionStorage.setItem('lastScrollY', window.scrollY);
});

window.addEventListener('load', () => {
    const savedY = sessionStorage.getItem('lastScrollY');

    if (savedY === null) return;

    setTimeout(() => {
        window.scrollTo({
            top: Number(savedY),
            behavior: 'smooth'
        });
    }, 50);
});

document.addEventListener('DOMContentLoaded', () => {
    
    //----- HOME -----//
    const nameMain = document.getElementById('nameMain');
    const nameGhost = document.getElementById('nameGhost');

    const frames = [
        'Suhyung Son',
        'Suhyung So',
        'Suhyung S',
        'Suhyung',
        'Suhyun',
        'Suhy',
        'Suh',
        // 'Su',
        'Sue'
    ];

    // scroll range
    const scrollStart = 0;
    const scrollEnd = 180;

    let ghostTimer;

    function updateNameByScroll() {
        const scrollY = window.scrollY;

        let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
        progress = Math.max(0, Math.min(1, progress));

        const index = Math.floor(progress * (frames.length - 1));
        const nextText = frames[index];

        if (nextText !== nameMain.textContent) {
            nameGhost.textContent = nameMain.textContent;
            nameGhost.style.opacity = '0.4';
            nameGhost.style.transform = 'translateY(0)';
            nameGhost.style.filter = 'blur(2px)';

            requestAnimationFrame(() => {
                nameGhost.style.transition =
                    'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease';
                nameGhost.style.opacity = '0';
                nameGhost.style.transform = 'translateY(-4px)';
                nameGhost.style.filter = 'blur(4px)';
            });

            clearTimeout(ghostTimer);
            ghostTimer = setTimeout(() => {
                nameGhost.style.transition = 'none';
            }, 300);

            nameMain.textContent = nextText;
        }
    }

    window.addEventListener('scroll', updateNameByScroll);
    updateNameByScroll();


    //----- ABOUT -----//
    //----- DONUTS -----//
    const r = 20;
    const dash = Math.round(2 * Math.PI * r);

    const rows = [
        // 1st row
        [
            { title: "HTML", value: 85, color: "#B85124" },
            { title: "CSS", value: 80, color: "#B85124" },
            { title: "JS", value: 73, color: "#B85124" },
            { title: "Vue.js", value: 70, color: "#B85124" },
        ],
        // 2nd row
        [
            { title: "php", value: 65, color: "#B85124" },
            { title: "jQuery", value: 75, color: "#B85124" },
        ],
        // 3rd row
        [
            { title: "Ai", value: 85, color: "#CD8158" },
            { title: "Figma", value: 78, color: "#CD8158" },
            { title: "Ps", value: 83, color: "#CD8158" },
            { title: "Pr", value: 70, color: "#CD8158" },
        ],
    ];

    function offsetFromPercent(percent) {
        return Math.round(dash * (1 - percent / 100));
    }

    function createDonut({ title, value, color }) {
        const el = document.createElement("div");
        el.className = "donut_wrap";

        const targetOffset = offsetFromPercent(value);

        el.innerHTML = `
            <svg class="donut"
            viewBox="0 0 50 50"
            style="--dash:${dash}; --offset:${dash}; --target:${targetOffset}; --color:${color};"
            >
            <circle class="donut_bg" cx="25" cy="25" r="${r}"></circle>
            <circle class="donut_value" cx="25" cy="25" r="${r}"></circle>
            </svg>
            <span class="donut_title">${title}</span>
        `;

        return el;
    }

    function renderDonuts() {
        const board = document.getElementById("donutBoard");
        rows.forEach(row => {
            const rowEl = document.createElement("div");
            rowEl.className = "donut_row" + (row.length === 2 ? " center" : "");
            row.forEach(item => rowEl.appendChild(createDonut(item)));
            board.appendChild(rowEl);
        });
    }

    function initDonutsOnEnter() {
        const board = document.getElementById("donutBoard");
        if (!board) return;

        const svgs = Array.from(board.querySelectorAll("svg.donut"));
        if (!svgs.length) return;

        const reset = () => {
            // reset to empty
            svgs.forEach(svg => svg.style.setProperty("--offset", String(dash)));
        };

        const play = () => {
            // apply the target after two frames to ensure the transition
            reset();
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    svgs.forEach(svg => {
                        const target = svg.style.getPropertyValue("--target").trim();
                        svg.style.setProperty("--offset", target);
                    });
                });
            });
        };


        reset();

        const io = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    play();
                } else {
                    reset();
                }
            }
        }, {
            threshold: 0.2
        });

        io.observe(board);
    }


    renderDonuts();
    initDonutsOnEnter();

    //----- INFO TXT -----//
    (() => {
        const downBtn = document.querySelector(".scroll_hint");
        const list = document.querySelector(".info_box");
        const wrap = document.querySelector(".info_wrap");

        if (!downBtn || !list || !wrap) return;

        const THRESHOLD = 20;

        // existing down button
        downBtn.classList.add("scroll_hint_down");

        // duplicate the up button in JS
        const upBtn = downBtn.cloneNode(true);
        upBtn.classList.remove("scroll_hint_down");
        upBtn.classList.add("scroll_hint_up", "is-up");

        const controls = document.createElement("div");
        controls.className = "scroll_controls";

        downBtn.parentNode.insertBefore(controls, downBtn);

        controls.appendChild(upBtn);
        controls.appendChild(downBtn);


        function maxScroll() {
            return list.scrollHeight - list.clientHeight;
        }


        function smoothScrollTo(target, duration = 500) {
            const start = list.scrollTop;
            const diff = target - start;
            const startT = performance.now();

            const ease = t =>
                t < 0.5
                    ? 2 * t * t
                    : 1 - Math.pow(-2 * t + 2, 2) / 2;

            function step(now) {
                const progress = Math.min(1, (now - startT) / duration);

                list.scrollTop = start + diff * ease(progress);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        }


        function updateMode() {
            const atTop = list.scrollTop <= THRESHOLD;
            const atBottom = list.scrollTop >= maxScroll() - THRESHOLD;
            const isMobile = window.innerWidth <= 1024;

            // gradient
            if (list.scrollTop > 5) {
                wrap.classList.add("has-top-fade");
            } else {
                wrap.classList.remove("has-top-fade");
            }


            if (isMobile) {
                upBtn.style.display = atTop ? "none" : "block";
                downBtn.style.display = atBottom ? "none" : "block";

                if (atTop || atBottom) {
                    controls.classList.add("is-floating");
                    controls.classList.remove("is-dual");
                } else {
                    controls.classList.remove("is-floating");
                    controls.classList.add("is-dual");
                }

            } else {
                upBtn.style.display = "none";
                downBtn.style.display = "block";

                controls.classList.add("is-floating");
                controls.classList.remove("is-dual");

                if (atBottom) {
                    downBtn.classList.add("is-up");
                } else {
                    downBtn.classList.remove("is-up");
                }
            }
        }


        // down button
        downBtn.addEventListener("click", () => {
            if (window.innerWidth <= 1024) {
                const step = list.clientHeight * 0.8;

                smoothScrollTo(
                    Math.min(maxScroll(), list.scrollTop + step),
                    500
                );

            } else {
                // PC
                if (downBtn.classList.contains("is-up")) {
                    smoothScrollTo(0, 600);
                } else {
                    smoothScrollTo(maxScroll(), 700);
                }
            }
        });


        // up button
        upBtn.addEventListener("click", () => {
            const step = list.clientHeight * 0.8;

            smoothScrollTo(
                Math.max(0, list.scrollTop - step),
                500
            );
        });


        list.addEventListener("scroll", () => {
            requestAnimationFrame(updateMode);
        });

        window.addEventListener("resize", updateMode);

        updateMode();
    })();




    
    

    //----- PROJECTS -----//
    const effectSections = document.querySelectorAll('.effect_section');

    const clamp01 = (v) => Math.max(0, Math.min(v, 1));
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const updateProjectPaper = () => {
        effectSections.forEach(section => {
            const paper = section.querySelector('.paper_box');
            if (!paper) return;

            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;

            const total = rect.height - vh;
            const traveled = -rect.top;

            const progress = clamp01(total <= 0 ? 1 : traveled / total);

            // upward movement
            const move = (1 - easeOutCubic(progress)) * 110;

            // lift one corner first
            const corner = 1 - easeOutCubic(progress);
            const rotZ = -12 * corner;
            const rotX = 18 * corner;

            paper.style.transform =
                `translate3d(0, ${move}vh, 0) rotateZ(${rotZ}deg) rotateX(${rotX}deg)`;
        });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            updateProjectPaper();
        });
    }, { passive: true });

    window.addEventListener('resize', updateProjectPaper);
    updateProjectPaper();


    //----- PROJECT PREVIEW -----//
    const preview = document.getElementById("projectPreview");
    const previewImg = document.getElementById("projectPreviewImg");

    let active = false;
    let mouseX = 0, mouseY = 0;
    let raf = null;

    // preview offset from the cursor
    const OFFSET_X = 18;
    const OFFSET_Y = -100;

    function showProjectPreview(src) {
        if (src && previewImg.src !== src) previewImg.src = src;
        preview.style.opacity = "1";
        active = true;
        if (!raf) raf = requestAnimationFrame(updateProjectPreviewPosition);
    }

    function hideProjectPreview() {
        preview.style.opacity = "0";
        active = false;
    }

    function updateProjectPreviewPosition() {
        if (!active) { raf = null; return; }

        // keep the preview within the viewport
        const rect = preview.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 8;
        const maxY = window.innerHeight - rect.height - 8;

        const x = Math.max(8, Math.min(mouseX + OFFSET_X, maxX));
        const y = Math.max(8, Math.min(mouseY + OFFSET_Y, maxY));

        preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        raf = requestAnimationFrame(updateProjectPreviewPosition);
    }

    // track the mouse position
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.querySelectorAll(".project_box").forEach(item => {
        item.addEventListener("mouseenter", () => {
            const src = item.dataset.img;
            showProjectPreview(src);
            previewImg.style.borderColor =
                item.closest("#project-01")
                ? "#FDF5EE"
                : null;

            item.classList.add("is-hover");

            item.style.background =
                item.closest("#project-01")
                ? "rgba(253, 245, 238, 0.1)"
                : "rgba(172, 52, 0, 0.1)";
            });

        item.addEventListener("mouseleave", () => {
            hideProjectPreview();

            item.classList.remove("is-hover");
            item.style.background = "";
        });
    });


    //----- NAV, FOOTER -----//
    // nav, footer color change
    const sections = document.querySelectorAll('section[data-theme]');
    const footer = document.querySelector('footer');
    const nav = document.querySelector('nav');
    const menuBtn = document.querySelector('#menu_btn');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theme = entry.target.dataset.theme;
                let id = entry.target.id;

                footer.classList.remove('theme-light', 'theme-dark');

                footer.classList.add(`theme-${theme}`);

                if (id.startsWith('project-')) {
                    id = 'projects';
                } else if (id.startsWith('about-')) {
                    id = 'about';
                }

                nav.classList.remove('nav_about', 'nav_projects', 'nav_contact', 'nav_home');
                nav.classList.add(`nav_${id}`);
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

    function updateMenuBtnTheme() {
        if (window.innerWidth > 1024) return;

        const rect = menuBtn.getBoundingClientRect();

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const elements = document.elementsFromPoint(x, y);

        const section = elements
            .map(el => el.closest?.('section[data-theme]'))
            .find(section => section);

        if (!section) return;

        const theme = section.dataset.theme;

        menuBtn.classList.remove('theme-light', 'theme-dark');
        menuBtn.classList.add(`theme-${theme}`);
    }

    window.addEventListener('scroll', updateMenuBtnTheme, { passive: true });
    window.addEventListener('resize', updateMenuBtnTheme);

    updateMenuBtnTheme();

    // nav bg toggle
    const navList = document.querySelector('.nav_li');

    window.addEventListener('scroll', () => {
        if (window.innerWidth > 1024) {
            navList.classList.toggle('scroll', window.scrollY > 100);
        } else {
            navList.classList.remove('scroll');
        }
    });


    //----- MOBILE -----//
    //----- NAV -----//
    const menuCloseBtn = document.querySelector('#menu_close_btn');
    const navMenuLinks = document.querySelectorAll('.nav_li a');

    function openMenu() {
        nav.style.display = 'block';

        requestAnimationFrame(() => {
            nav.classList.add('menu_open');
        });

        document.body.classList.add('scroll_lock');
    }

    function closeMenu(callback) {
        nav.classList.remove('menu_open');

        const finishClose = (e) => {
            if (e.propertyName !== 'transform') return;

            nav.removeEventListener('transitionend', finishClose);

            nav.style.display = 'none';
            document.body.classList.remove('scroll_lock');

            if (callback) callback();
        };

        nav.addEventListener('transitionend', finishClose);
    }


    // open menu
    menuBtn.addEventListener('click', openMenu);


    // close menu
    menuCloseBtn.addEventListener('click', () => {
        closeMenu();
    });

    // nav scroll
    navMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);

            if (!target) return;

            // PC
            if (window.innerWidth > 1024) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                history.replaceState(null, '', targetId);
                return;
            }

            // Tablet / Mobile
            closeMenu(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                history.replaceState(null, '', targetId);
            });
        });
    });
})