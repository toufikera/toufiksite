(function () {
    'use strict';

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       EMAILJS CREDENTIALS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const EMAILJS_CONFIG = {
        publicKey:  'ZuFt7S5ifcJd0DP9Q',
        serviceId:  'service_9scrsjf',
        templateId: 'template_7w7rjpd'
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       COVER ART CLASS MAP
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const COVER_MAP = {
        'css-warm': 'art--cover-warm',
        'css-cool': 'art--cover-cool',
        'css-deep': 'art--cover-deep',
        'css-dusk': 'art--cover-dusk'
    };

    /* Performance config */
    const PERF = {
        loaderMs:      2400,
        particleCount: 15,
        eqBarCount:    28,
        ambientBars:   60,
        scrollOffset:  50
    };

    /* ────────────────────────────────────────────────────────
       MODULE: Init — bootstraps everything
    ──────────────────────────────────────────────────────── */
    function init() {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        applyConfig();
        renderReleases();
        renderGallery();
        renderSocial();
        initPreloader();
        initParticles();
        initNav();
        initSmoothScroll();
        initHeroEq();
        initAmbientWave();
        initScrollReveal();
        initAudioOrb();
        initParallax();
        initContactForm();
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Config — applies SITE_CONFIG to static elements
    ──────────────────────────────────────────────────────── */
    function applyConfig() {
        if (typeof SITE_CONFIG === 'undefined') return;
        const cfg = SITE_CONFIG;

        setEl('pageTitle', `${cfg.artistSlug} — ${cfg.tagline}`);
        const desc = document.getElementById('metaDesc');
        if (desc) desc.content = cfg.description;

        setEl('heroName',     cfg.artistName);
        setEl('heroTagline',  cfg.tagline);
        setEl('navLogo',      cfg.artistSlug);
        setEl('footerLogo',   cfg.artistSlug);
        setEl('preloaderName',cfg.artistSlug);
        setEl('footerCopy',   `© ${cfg.year} ${cfg.artistSlug} — All Rights Reserved`);

        setAttr('contactEmailLink', 'href', `mailto:${cfg.contactEmail}`);
        setEl('contactEmailText', cfg.contactEmail);

        if (cfg.hero.path) {
            const heroEl = document.getElementById('heroMedia');
            if (heroEl) {
                heroEl.innerHTML = cfg.hero.type === 'video'
                    ? `<video src="${cfg.hero.path}" autoplay muted loop playsinline aria-hidden="true"></video>`
                    : `<img src="${cfg.hero.path}" alt="${cfg.hero.alt}" loading="lazy">`;
            }
        }

        if (cfg.aboutPhoto.path) {
            const aboutEl = document.getElementById('aboutPhoto');
            if (aboutEl) {
                aboutEl.innerHTML =
                    `<img src="${cfg.aboutPhoto.path}" alt="${cfg.aboutPhoto.alt}" loading="lazy">`;
            }
        }

        const tagsEl = document.getElementById('skillTags');
        if (tagsEl) {
            tagsEl.innerHTML = cfg.skills
                .map(s => `<span class="skill-tag">${s}</span>`)
                .join('');
        }

        const svcEl = document.getElementById('contactServices');
        if (svcEl) {
            svcEl.innerHTML = cfg.services
                .map(s => `<div class="service-pill"><span>${s}</span></div>`)
                .join('');
        }
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Renders — builds dynamic content from data
    ──────────────────────────────────────────────────────── */
    function renderReleases() {
        if (typeof RELEASES === 'undefined') return;
        const list = document.getElementById('releaseList');
        if (!list) return;

        list.innerHTML = RELEASES.map(r => {
            const isRealCover = r.coverArt && !r.coverArt.startsWith('css-');
            const coverInner  = isRealCover
                ? `<img src="${r.coverArt}" alt="${r.title}" loading="lazy">`
                : `<div class="vis-art ${COVER_MAP[r.coverArt] || 'art--cover-warm'}"></div>`;

            const platforms = r.platforms
                .map(p => `<a href="${p.url}" target="_blank" rel="noopener" class="platform-link">${p.name}</a>`)
                .join('');

            const badge = r.featured
                ? `<div class="release-card__badge">Featured</div>` : '';

            return `
            <div class="release-card" data-id="${r.id}">
                <div class="release-card__cover">
                    <div class="vis-slot">${coverInner}</div>
                    ${badge}
                    <div class="release-card__watermark">${r.title.toLowerCase()}</div>
                    <div class="release-card__play">
                        <div class="release-card__play-icon"></div>
                    </div>
                </div>
                <div class="release-card__info">
                    <div class="release-card__type">${r.type}</div>
                    <h3 class="release-card__title">${r.title}</h3>
                    ${r.date ? `<div class="release-card__date">${r.date}</div>` : ''}
                    <p class="release-card__desc">${r.description}</p>
                    <div class="release-card__platforms">${platforms}</div>
                    <div class="release-card__wave" data-bars="50"></div>
                </div>
            </div>`;
        }).join('');

        buildWaveforms();
        initCardHovers();
        initScrollReveal(); 
    }

    function renderGallery() {
        if (typeof GALLERY_ITEMS === 'undefined') return;
        const grid = document.getElementById('gallery');
        if (!grid) return;

        grid.innerHTML = GALLERY_ITEMS.map(item => {
            const content = item.image
                ? `<img src="${item.image}" alt="${item.label}" loading="lazy">`
                : `<div class="vis-art ${item.artClass}"></div>`;
            return `
            <div class="gallery-item" data-id="${item.id}">
                <div class="vis-slot">${content}</div>
                <div class="art-label"><span>${item.label}</span></div>
            </div>`;
        }).join('');
    }

    function renderSocial() {
        if (typeof SITE_CONFIG === 'undefined') return;
        const grid = document.getElementById('socialGrid');
        if (!grid) return;
        grid.innerHTML = SITE_CONFIG.socialLinks.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener" class="social-card">
                <div class="social-card__icon">
                    <svg viewBox="0 0 24 24" aria-label="${s.name}">${s.icon}</svg>
                </div>
                <span class="social-card__name">${s.name}</span>
            </a>`
        ).join('');
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Waveforms & Card Interactions
    ──────────────────────────────────────────────────────── */
    function buildWaveforms() {
        document.querySelectorAll('.release-card__wave:not([data-built])').forEach(container => {
            const count = parseInt(container.dataset.bars) || 45;
            for (let i = 0; i < count; i++) {
                const bar = document.createElement('div');
                bar.className = 'wave-bar';
                bar.style.height = (2 + Math.random() * 18) + 'px';
                container.appendChild(bar);
            }
            container.dataset.built = '1';
        });
    }

    function initCardHovers() {
        document.querySelectorAll('.release-card:not([data-hover])').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.querySelectorAll('.wave-bar').forEach(b => {
                    b.style.transition = 'height .3s ease';
                    b.style.height = (2 + Math.random() * 20) + 'px';
                });
            });
            card.addEventListener('mouseleave', () => {
                card.querySelectorAll('.wave-bar').forEach(b => {
                    b.style.height = (2 + Math.random() * 10) + 'px';
                });
            });
            card.dataset.hover = '1';
        });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Preloader
    ──────────────────────────────────────────────────────── */
    function initPreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('preloader');
                if (loader) loader.classList.add('is-done');
            }, PERF.loaderMs);
        });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Ambient Particles
    ──────────────────────────────────────────────────────── */
    function initParticles() {
        const layer = document.getElementById('particles');
        if (!layer) return;
        for (let i = 0; i < PERF.particleCount; i++) {
            const p   = document.createElement('div');
            p.className = 'particle';
            const sz  = 1 + Math.random() * 1.5;
            Object.assign(p.style, {
                left:   Math.random() * 100 + '%',
                width:  sz + 'px',
                height: sz + 'px',
                '--p-speed': (18 + Math.random() * 24) + 's',
                '--p-delay': (Math.random() * 18) + 's'
            });
            layer.appendChild(p);
        }
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Navigation
    ──────────────────────────────────────────────────────── */
    function initNav() {
        const nav     = document.getElementById('nav');
        const burger  = document.getElementById('burger');
        const mobileM = document.getElementById('mobileMenu');

        window.addEventListener('scroll', () => {
            if (nav) nav.classList.toggle('is-scrolled', window.scrollY > PERF.scrollOffset);
        }, { passive: true });

        if (burger && mobileM) {
            burger.addEventListener('click', () => {
                const isOpen = burger.classList.toggle('is-open');
                mobileM.classList.toggle('is-open', isOpen);
                burger.setAttribute('aria-expanded', String(isOpen));
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });

            mobileM.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    burger.classList.remove('is-open');
                    mobileM.classList.remove('is-open');
                    burger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Smooth Scroll
    ──────────────────────────────────────────────────────── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(a.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Hero Equalizer
    ──────────────────────────────────────────────────────── */
    function initHeroEq() {
        const container = document.getElementById('heroEq');
        if (!container) return;
        for (let i = 0; i < PERF.eqBarCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'eq-bar';
            bar.style.setProperty('--eq-delay',  (Math.random() * 2) + 's');
            bar.style.setProperty('--eq-speed',  (.6 + Math.random() * .7) + 's');
            bar.style.setProperty('--eq-height', (4 + Math.random() * 14) + 'px');
            container.appendChild(bar);
        }
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Ambient Wave (Audio section)
    ──────────────────────────────────────────────────────── */
    function initAmbientWave() {
        const container = document.getElementById('ambientWave');
        if (!container) return;
        for (let i = 0; i < PERF.ambientBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'ambient-bar';
            bar.style.setProperty('--ab-height', (3 + Math.random() * 35) + 'px');
            bar.style.setProperty('--ab-speed',  (1 + Math.random() * 2.5) + 's');
            bar.style.setProperty('--ab-delay',  (Math.random() * 2) + 's');
            container.appendChild(bar);
        }
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Scroll Reveal
    ──────────────────────────────────────────────────────── */
    let scrollObserver = null;
    function initScrollReveal() {
        if (!scrollObserver) {
            scrollObserver = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-visible');
                        scrollObserver.unobserve(e.target);
                    }
                });
            }, { threshold: .07, rootMargin: '0px 0px -30px 0px' });
        }
        document.querySelectorAll('.reveal:not([data-observed]), .release-card:not([data-observed]), .gallery-item:not([data-observed])')
            .forEach(el => {
                scrollObserver.observe(el);
                el.dataset.observed = '1';
                el.classList.add('reveal');
            });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Audio Orb
    ──────────────────────────────────────────────────────── */
    function initAudioOrb() {
        const orb  = document.getElementById('audioOrb');
        const icon = document.getElementById('audioOrbIcon');
        if (!orb || !icon) return;
        let playing = false;
        const toggle = () => {
            playing = !playing;
            icon.textContent = playing ? '❚❚' : '▶';
            orb.style.borderColor = playing ? 'var(--c-gold)' : '';
            orb.style.boxShadow   = playing ? '0 0 60px rgba(194,160,78,.1)' : '';
        };
        orb.addEventListener('click', toggle);
        orb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Subtle Parallax (Hero)
    ──────────────────────────────────────────────────────── */
    function initParallax() {
        const heroBg = document.querySelector('.hero__bg');
        if (!heroBg) return;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = `translateY(${y * .08}px)`;
            }
        }, { passive: true });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Contact Form
    ──────────────────────────────────────────────────────── */
    function initContactForm() {
        const form          = document.getElementById('contactForm');
        const successEl     = document.getElementById('formSuccess');
        const errorEl       = document.getElementById('formError');
        const errorTextEl   = document.getElementById('formErrorText');
        const submitBtn     = document.getElementById('formSubmit');

        const fService      = document.getElementById('fService');
        const fInquiry      = document.getElementById('fInquiry');
        const serviceReveal = document.getElementById('serviceReveal');
        const inquiryReveal = document.getElementById('inquiryReveal');
        const fServiceCustom= document.getElementById('fServiceCustom');
        const fInquiryCustom= document.getElementById('fInquiryCustom');

        function handleReveal(selectEl, revealEl, customInput) {
            const isOther = selectEl.value === 'other';
            revealEl.classList.toggle('is-open', isOther);
            customInput.required = isOther;
            if (!isOther) customInput.value = '';
            if (isOther) setTimeout(() => customInput.focus(), 380);
        }
        fService.addEventListener('change', () => handleReveal(fService, serviceReveal, fServiceCustom));
        fInquiry.addEventListener('change', () => handleReveal(fInquiry, inquiryReveal, fInquiryCustom));

        function setLoading(on) {
            submitBtn.classList.toggle('is-loading', on);
            submitBtn.disabled = on;
        }
        function showError(msg) {
            errorTextEl.textContent = msg || 'Something went wrong. Please email directly.';
            errorEl.classList.add('is-shown');
            setTimeout(() => errorEl.classList.remove('is-shown'), 8000);
        }
        function showSuccess() {
            form.style.display = 'none';
            successEl.classList.add('is-shown');
        }

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorEl.classList.remove('is-shown');

            const name    = document.getElementById('fName').value.trim();
            const email   = document.getElementById('fEmail').value.trim();
            const svc     = fService.value;
            const inq     = fInquiry.value;
            const svcCust = fServiceCustom.value.trim();
            const inqCust = fInquiryCustom.value.trim();
            const message = document.getElementById('fMessage').value.trim();

            if (!name)  { showError('Please enter your name.'); return; }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('Please enter a valid email address.'); return;
            }
            if (!svc)  { showError('Please select a service.'); return; }
            if (svc === 'other' && !svcCust) { showError('Please describe your custom service.'); return; }
            if (!inq)  { showError('Please select an inquiry type.'); return; }
            if (inq === 'other' && !inqCust) { showError('Please describe your custom inquiry type.'); return; }
            if (!message) { showError('Please describe your project.'); return; }

            const finalService = svc === 'other' ? svcCust : svc;
            const finalInquiry = inq === 'other' ? inqCust : inq;

            setLoading(true);

            try {
                const res = await emailjs.send(
                    EMAILJS_CONFIG.serviceId,
                    EMAILJS_CONFIG.templateId,
                    {
                        from_name:      name,
                        from_email:     email,
                        service_type:   finalService,
                        inquiry_type:   finalInquiry,
                        custom_service: svc === 'other' ? svcCust : '',
                        custom_inquiry: inq === 'other' ? inqCust : '',
                        message:        message
                    }
                );

                if (res.status === 200) {
                    showSuccess();
                } else {
                    setLoading(false);
                    showError(`Delivery failed (${res.status}). Please email directly.`);
                }
            } catch (err) {
                setLoading(false);
                showError(err?.text ? `Error: ${err.text}` : 'Could not send. Please email directly.');
                console.error('[EmailJS]', err);
            }
        });
    }

    /* ────────────────────────────────────────────────────────
       HELPERS
    ──────────────────────────────────────────────────────── */
    function setEl(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
    function setAttr(id, attr, value) {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, value);
    }

    /* ────────────────────────────────────────────────────────
       BOOT
    ──────────────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
