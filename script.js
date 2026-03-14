// ─────────────────────────────────────────────────────────────────────────────
// EMAILJS CREDENTIALS
// Replace these three values after setting up your account at emailjs.com
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = '-9xCQItNl1NN1zTfE';
const EMAILJS_SERVICE_ID  = 'service_dv9z7a8';
const EMAILJS_TEMPLATE_ID = 'template_limcjh2';
// ─────────────────────────────────────────────────────────────────────────────

gsap.registerPlugin(Observer);

// ─── Three.js 3D Background ───────────────────────────────────────────────────
const init3DBackground = () => {
    const container = document.getElementById('canvas-container');

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const materialPrimary = new THREE.MeshPhysicalMaterial({
        color: 0x6366f1,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.5,
        thickness: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const materialSecondary = new THREE.MeshPhysicalMaterial({
        color: 0xa5b4fc,
        metalness: 0.5,
        roughness: 0.2,
        wireframe: true
    });

    const geometries = [
        new THREE.IcosahedronGeometry(4, 0),
        new THREE.TorusGeometry(3, 1, 16, 100),
        new THREE.ConeGeometry(3, 6, 4),
        new THREE.OctahedronGeometry(4, 0)
    ];

    const objects = [];

    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = Math.random() > 0.5 ? materialPrimary : materialSecondary;
        const mesh     = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.2) * 50;
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = (Math.random() - 0.5) * 40 - 10;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        const scale = Math.random() * 0.5 + 0.5;
        mesh.scale.set(scale, scale, scale);

        objects.push({
            mesh,
            rotSpeedX:   (Math.random() - 0.5) * 0.01,
            rotSpeedY:   (Math.random() - 0.5) * 0.01,
            floatSpeed:  Math.random() * 0.02 + 0.01,
            floatOffset: Math.random() * Math.PI * 2
        });

        group.add(mesh);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const pl1 = new THREE.PointLight(0x6366f1, 2, 100);
    pl1.position.set(10, 10, 10);
    scene.add(pl1);

    const pl2 = new THREE.PointLight(0xa5b4fc, 2, 100);
    pl2.position.set(-10, -10, 10);
    scene.add(pl2);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX - halfW) * 0.001;
        mouseY = (e.clientY - halfH) * 0.001;
    });

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        targetX = mouseX * 2;
        targetY = mouseY * 2;

        group.rotation.x += 0.05 * (targetY - group.rotation.x);
        group.rotation.y += 0.05 * (targetX - group.rotation.y);

        objects.forEach(obj => {
            obj.mesh.rotation.x += obj.rotSpeedX;
            obj.mesh.rotation.y += obj.rotSpeedY;
            obj.mesh.position.y += Math.sin(time * obj.floatSpeed + obj.floatOffset) * 0.05;
        });

        camera.position.y = -(window.scrollY * 0.01);
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ─── Cursor Glow ─────────────────────────────────────────────────────────────
const initCursorGlow = () => {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    });
};

// ─── Hero Typewriter / Role Cycling ──────────────────────────────────────────
const initTypingEffect = () => {
    const el = document.querySelector('.hero-typing');
    if (!el) return;

    const roles = [
        'Creative Developer',
        'Full Stack Engineer',
        'React Enthusiast',
        'Problem Solver'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const current = roles[roleIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 45 : 85;

        if (!isDeleting && charIndex === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex  = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(type, delay);
    };

    // Start after hero entrance animation completes
    setTimeout(type, 2200);
};

// ─── GSAP Hero Entrance ───────────────────────────────────────────────────────
const initHeroAnimations = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.subtitle',        { y: 0, opacity: 1, duration: 0.8 }, 0.4)
      .to('.title',           { y: 0, opacity: 1, duration: 1.0 }, 0.65)
      .to('.hero-role',       { y: 0, opacity: 1, duration: 0.8 }, 0.9)
      .to('.description',     { y: 0, opacity: 1, duration: 0.8 }, 1.05)
      .to('.cta-buttons',     { y: 0, opacity: 1, duration: 0.8 }, 1.25)
      .to('.scroll-indicator',{ opacity: 1, duration: 1.0 },       2.2);
};

// ─── Navbar Hide / Show on Scroll ────────────────────────────────────────────
const initNavbar = () => {
    const navbar   = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        navbar.style.transform = (current > lastScroll && current > 100)
            ? 'translateY(-100%)'
            : 'translateY(0)';
        lastScroll = Math.max(current, 0);
    }, { passive: true });
};

// ─── Mobile Navigation ───────────────────────────────────────────────────────
const initMobileNav = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (!hamburger || !mobileNav) return;

    const toggle = () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggle);

    mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
};

// ─── Scroll Reveal (IntersectionObserver) ────────────────────────────────────
const initScrollReveal = () => {
    // Stagger delays for sibling cards
    document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
        el.style.setProperty('--delay', `${i * 0.15}s`);
    });

    document.querySelectorAll('.about-stats .stat-card').forEach((el, i) => {
        el.style.setProperty('--delay', `${i * 0.12}s`);
    });

    document.querySelectorAll('.skills-grid .skill-category').forEach((el, i) => {
        el.style.setProperty('--delay', `${i * 0.15}s`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Keep observing section-titles so the underline can animate
                if (!entry.target.classList.contains('section-title')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in-up, .section-title').forEach(el => observer.observe(el));
};

// ─── Animated Counters ───────────────────────────────────────────────────────
const initCounters = () => {
    const cards = document.querySelectorAll('.stat-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const h3 = entry.target.querySelector('.counter');
            if (!h3 || h3.dataset.counted) return;
            h3.dataset.counted = true;
            observer.unobserve(entry.target);

            const target = h3.dataset.target;
            const numMatch = target.match(/\d+/);
            if (!numMatch) return;

            const numTarget = parseInt(numMatch[0]);
            const suffix    = target.replace(/[0-9]/g, '');
            const duration  = 1600;
            const startTime = performance.now();

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 3);
                h3.textContent = Math.floor(eased * numTarget) + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else h3.textContent = target;
            };

            requestAnimationFrame(step);
        });
    }, { threshold: 0.5 });

    cards.forEach(c => observer.observe(c));
};

// ─── Skill Bar Animations ────────────────────────────────────────────────────
const initSkillBars = () => {
    const categories = document.querySelectorAll('.skill-category');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);

            entry.target.querySelectorAll('.skill-indicator').forEach((bar, i) => {
                const width = bar.dataset.width || 0;
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, i * 120);
            });
        });
    }, { threshold: 0.3 });

    categories.forEach(c => observer.observe(c));
};

// ─── Magnetic Buttons ────────────────────────────────────────────────────────
const initMagneticButtons = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx   = e.clientX - (rect.left + rect.width  / 2);
            const dy   = e.clientY - (rect.top  + rect.height / 2);
            btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
};

// ─── Contact Form (EmailJS) ───────────────────────────────────────────────────
const initContactForm = () => {
    // Skip initialisation if credentials are still placeholders
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.warn(
            '[Contact Form] EmailJS not configured.\n' +
            'Open script.js and replace EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID.'
        );
    } else {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const form      = document.getElementById('contact-form');
    const status    = document.getElementById('form-status');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText   = submitBtn.querySelector('.btn-text');
    if (!form) return;

    const setStatus = (type, message) => {
        status.className  = 'form-status ' + type;
        status.textContent = message;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Simple client-side validation
        const name    = form.from_name.value.trim();
        const email   = form.from_email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            setStatus('error', '✗ Please fill in all fields.');
            return;
        }

        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(email)) {
            setStatus('error', '✗ Please enter a valid email address.');
            return;
        }

        // Loading state
        submitBtn.classList.add('loading');
        btnText.textContent = 'Sending…';
        status.className = 'form-status';

        // Not configured — simulate a success so the UX is visible
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            await new Promise(r => setTimeout(r, 1200));
            setStatus('success', '✓ (Demo) Message received! Configure EmailJS to enable real delivery.');
            form.reset();
            submitBtn.classList.remove('loading');
            btnText.textContent = 'Send Message';
            return;
        }

        try {
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
            setStatus('success', '✓ Message sent! I\'ll get back to you soon.');
            form.reset();
        } catch (err) {
            console.error('EmailJS error:', err);
            setStatus('error', '✗ Something went wrong. Please email me directly.');
        } finally {
            submitBtn.classList.remove('loading');
            btnText.textContent = 'Send Message';
        }
    });

    // Clear status when user starts typing again
    form.addEventListener('input', () => {
        if (status.classList.contains('error')) {
            status.className = 'form-status';
        }
    });
};

// ─── Active Nav Link on Scroll ───────────────────────────────────────────────
const initActiveNavLinks = () => {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
};

// ─── Intro Animation (GSAP Observer-driven PORTFOLIO reveal) ──────────────────
const initIntroAnimation = (onComplete) => {
    const overlay   = document.getElementById('intro-overlay');
    const introText = document.getElementById('intro-logo-text');
    const navLogo   = document.querySelector('.navbar .logo');

    if (!overlay || !introText || !navLogo) { onComplete(); return; }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        overlay.remove(); onComplete(); return;
    }

    document.body.style.overflow = 'hidden';
    gsap.set(navLogo, { opacity: 0 });

    requestAnimationFrame(() => {
        // Size the text to exactly 90 vw
        introText.style.fontSize = '100px';
        const ratio = (window.innerWidth * 0.9) / introText.offsetWidth;
        introText.style.fontSize = Math.floor(100 * ratio) + 'px';

        // Wait for CSS entrance animation to finish before GSAP takes over
        setTimeout(() => {
            introText.style.animation = 'none';
            gsap.set(introText, { opacity: 1 });

            const iR = introText.getBoundingClientRect();
            const nR = navLogo.getBoundingClientRect();

            // Build the exit timeline (paused — Observer will fire it)
            const exitTl = gsap.timeline({
                paused: true,
                onComplete() {
                    overlay.remove();
                    gsap.to(navLogo, { opacity: 1, duration: 0.3 });
                    document.body.style.overflow = '';
                    onComplete();
                }
            });

            exitTl
                .to('.intro-hint', { opacity: 0, duration: 0.2 }, 0)
                .to(introText, {
                    x: (nR.left + nR.width  / 2) - (iR.left + iR.width  / 2),
                    y: (nR.top  + nR.height / 2) - (iR.top  + iR.height / 2),
                    scale: nR.width / iR.width,
                    transformOrigin: 'center center',
                    ease: 'power3.inOut',
                    duration: 1.2
                }, 0)
                .to(overlay, { opacity: 0, duration: 0.4 }, 0.9);

            let played = false;
            const play = () => {
                if (played) return;
                played = true;
                obs.kill();
                clearTimeout(autoTimer);
                exitTl.play();
            };

            // GSAP Observer — normalises wheel / touch / pointer across all devices
            const obs = Observer.create({
                type: 'wheel,touch,pointer',
                preventDefault: true,
                onDown: play,
                tolerance: 10
            });

            overlay.addEventListener('click', play, { once: true });
            const autoTimer = setTimeout(play, 5000);

        }, 950);
    });
};

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        init3DBackground();
    } else {
        console.error('Three.js not loaded.');
    }

    // These don't touch the hero so start immediately
    initCursorGlow();
    initNavbar();
    initMobileNav();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initMagneticButtons();
    initContactForm();
    initActiveNavLinks();

    // Intro gates the hero animations — they play only after the logo lands
    if (typeof gsap !== 'undefined') {
        initIntroAnimation(() => {
            initHeroAnimations();
            initTypingEffect();
        });
    } else {
        console.error('GSAP not loaded.');
        document.querySelectorAll('.subtitle, .title, .hero-role, .description, .cta-buttons, .scroll-indicator')
            .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    }
});
