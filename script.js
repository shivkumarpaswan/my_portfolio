/* =====================================
   MOBILE MENU
===================================== */

const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileBtn && mobileMenu) {

    mobileBtn.addEventListener("click", () => {

        const isNowHidden = mobileMenu.classList.toggle("hidden");

        mobileBtn.setAttribute("aria-expanded", String(!isNowHidden));

        mobileBtn.setAttribute(
            "aria-label",
            isNowHidden ? "Open navigation menu" : "Close navigation menu"
        );

    });

    document
        .querySelectorAll("#mobileMenu a")
        .forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.add("hidden");

                mobileBtn.setAttribute("aria-expanded", "false");
                mobileBtn.setAttribute("aria-label", "Open navigation menu");

            });

        });

}


/* =====================================
   TYPING EFFECT
===================================== */

const typingText = document.getElementById("typingText");

const roles = [
    "Software Engineer",
    "Full Stack Developer",
    "MERN Stack Developer",
    "Java + MERN Developer",
    "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

    if (!typingText) return;

    const current = roles[roleIndex];

    if (!deleting) {

        typingText.textContent = current.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === current.length) {

            deleting = true;

            setTimeout(typeEffect, 1600);

            return;

        }

    } else {

        typingText.textContent = current.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {

            deleting = false;

            roleIndex = (roleIndex + 1) % roles.length;

        }

    }

    setTimeout(typeEffect, deleting ? 45 : 90);

}

typeEffect();


/* =====================================
   CUSTOM CURSOR (DESKTOP ONLY)
===================================== */

const isFinePointer = window.matchMedia("(pointer: fine)").matches;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice && isFinePointer) {

    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    let cursorVisible = false;

    window.addEventListener("mousemove", e => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!cursorVisible) {
            cursorVisible = true;
            if (dot) dot.style.opacity = "1";
            if (ring) ring.style.opacity = "1";
        }

        if (dot) {
            dot.style.left = mouseX + "px";
            dot.style.top = mouseY + "px";
        }

    });

    function animateCursor() {

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        if (ring) {
            ring.style.left = ringX + "px";
            ring.style.top = ringY + "px";
        }

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

    document
        .querySelectorAll("a, button, .project-card, .skill-pill")
        .forEach(element => {

            element.addEventListener("mouseenter", () => {

                if (ring) ring.classList.add("cursor-active");

            });

            element.addEventListener("mouseleave", () => {

                if (ring) ring.classList.remove("cursor-active");

            });

        });

}


/* =====================================
   SCROLL REVEAL
===================================== */

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },
    {
        threshold: 0.12
    }
);

document
    .querySelectorAll(".reveal")
    .forEach(element => {

        observer.observe(element);

    });


/* =====================================
   COUNTERS
===================================== */

const counters = document.querySelectorAll(".counter");

if (counters.length > 0) {

    const counterObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const counter = entry.target;

                const target = +counter.dataset.target;

                let current = 0;

                const increment = Math.max(1, Math.ceil(target / 40));

                const update = () => {

                    current += increment;

                    if (current >= target) {

                        counter.textContent = target + "+";

                        return;

                    }

                    counter.textContent = current;

                    requestAnimationFrame(update);

                };

                update();

                counterObserver.unobserve(counter);

            });

        },
        {
            threshold: 0.8
        }
    );

    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

}


/* =====================================
   VANILLA TILT (DESKTOP ONLY, LIMITED)
===================================== */

if (
    typeof VanillaTilt !== "undefined" &&
    window.innerWidth > 768 &&
    !isTouchDevice
) {

    VanillaTilt.init(
        document.querySelectorAll(".project-card, .profile-wrapper"),
        {
            max: 4,
            speed: 500,
            glare: true,
            "max-glare": 0.08,
            perspective: 1000
        }
    );

}


/* =====================================
   THREE.JS PARTICLES (WITH GUARD)
===================================== */

const canvas = document.getElementById("webgl-canvas");

if (typeof THREE !== "undefined" && canvas) {

    try {

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        camera.position.z = 5;


        const geometry = new THREE.BufferGeometry();

        const particleCount = window.innerWidth < 768 ? 700 : 1500;

        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {

            positions[i] = (Math.random() - 0.5) * 18;

        }

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );


        const material = new THREE.PointsMaterial({

            color: 0x3b82f6,

            size: window.innerWidth < 768 ? 0.018 : 0.022,

            transparent: true,

            opacity: 0.65

        });


        const particles = new THREE.Points(geometry, material);

        scene.add(particles);


        let bgMouseX = 0;
        let bgMouseY = 0;

        window.addEventListener("mousemove", e => {

            bgMouseX = (e.clientX / window.innerWidth) - 0.5;
            bgMouseY = (e.clientY / window.innerHeight) - 0.5;

        });


        const clock = new THREE.Clock();


        function animateBackground() {

            requestAnimationFrame(animateBackground);

            const time = clock.getElapsedTime();

            particles.rotation.y = time * 0.025 + bgMouseX * 0.15;
            particles.rotation.x = time * 0.01 + bgMouseY * 0.08;

            renderer.render(scene, camera);

        }

        animateBackground();


        window.addEventListener("resize", () => {

            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        });

    } catch (error) {

        console.warn("Three.js background failed to initialize:", error);

    }

}


/* =====================================
   EASTER EGG
===================================== */

let keySequence = "";

document.addEventListener("keydown", e => {

    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) {
        return;
    }

    keySequence += e.key.toLowerCase();

    keySequence = keySequence.slice(-4);

    if (keySequence === "shiv") {

        console.log(
            "%c🚀 Hey! You found Shiv's developer console.",
            "color:#60a5fa;font-size:16px;font-weight:bold;"
        );

        console.log(
            "%c👉 Want to collaborate? Reach out: shivkumartech95@gmail.com",
            "color:#94a3b8;font-size:12px;"
        );

        keySequence = "";

    }

});