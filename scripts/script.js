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
       MODULE: Init
    ──────────────────────────────────────────────────────── */
    function init() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        }
        
        applyConfig();
        renderReleases();
        renderGallery();
        renderAudioExperience();
        renderSocial();
        
        initPreloader();
        initParticles();
        initNav();
        initSmoothScroll();
        initHeroEq();
        initParallax();
        initContactForm();
        
        // Initialize ScrollReveal AFTER DOM elements are dynamically injected
        initScrollReveal(); 
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Config Integration
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

        if (cfg.hero) {
            const heroEl = document.getElementById('heroMedia');
            if (heroEl) {
                let heroInner = `<div class="vis-art ${cfg.hero.cssFallback || 'art--hero'}"></div>`;
                if (cfg.hero.path) {
                    if (cfg.hero.type === 'video') {
                        heroInner += `<video src="${cfg.hero.path}" autoplay muted loop playsinline aria-hidden="true"></video>`;
                    } else if (cfg.hero.type === 'image') {
                        heroInner += `<img src="${cfg.hero.path}" alt="${cfg.hero.alt}" loading="lazy">`;
                    }
                }
                heroEl.innerHTML = heroInner;
            }
        }

        if (cfg.aboutPhoto && cfg.aboutPhoto.path) {
            const aboutEl = document.getElementById('aboutPhoto');
            if (aboutEl) {
                aboutEl.innerHTML = `
                    <div class="vis-art art--about">
                        <div class="light-beam" style="left:30%;top:0;height:100%;"></div>
                        <div class="light-beam" style="left:65%;top:10%;height:80%;opacity:.5;"></div>
                    </div>
                    <img src="${cfg.aboutPhoto.path}" alt="${cfg.aboutPhoto.alt}" loading="lazy">
                `;
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
       MODULE: Dynamic Rendering
    ──────────────────────────────────────────────────────── */
    function renderReleases() {
        if (typeof RELEASES === 'undefined') return;
        const list = document.getElementById('releaseList');
        if (!list) return;

        list.innerHTML = RELEASES.map(r => {
            let mediaInner = '';
            if (r.video) {
                mediaInner = `<video src="${r.video}" poster="${r.thumbnail || r.cover}" autoplay loop muted playsinline></video>`;
            } else if (r.cover) {
                mediaInner = `<img src="${r.cover}" alt="${r.title}" loading="lazy">`;
            } else {
                mediaInner = `<div class="vis-art ${COVER_MAP[r.cssFallback] || 'art--cover-warm'}"></div>`;
            }

            const audioTag = r.audio ? `<audio class="release-audio" src="${r.audio}" preload="none"></audio>` : '';
            const platforms = r.platforms ? r.platforms.map(p => `<a href="${p.url}" target="_blank" rel="noopener" class="platform-link">${p.name}</a>`).join('') : '';
            const badge = r.featured ? `<div class="release-card__badge">Featured</div>` : '';

            return `
            <div class="release-card" data-id="${r.id}">
                <div class="release-card__cover">
                    <div class="vis-slot">${mediaInner}</div>
                    ${badge}
                    <div class="release-card__watermark">${r.title.toLowerCase()}</div>
                    <div class="release-card__play" role="button" aria-label="Play ${r.title}">
                        <div class="release-card__play-icon"></div>
                    </div>
                    ${audioTag}
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
        initAudioPlayback();
    }

    function renderGallery() {
        if (typeof GALLERY_ITEMS === 'undefined') return;
        const grid = document.getElementById('gallery');
        if (!grid) return;

        grid.innerHTML = GALLERY_ITEMS.map(item => {
            const content = item.image
                ? `<img src="${item.image}" alt="${item.label || 'Visual Experience'}" loading="lazy">`
                : `<div class="vis-art ${item.artClass || 'art--g1'}"></div>`;
            
            const labelHtml = (item.label && item.label.trim() !== '')
                ? `<div class="art-label"><span>${item.label}</span></div>`
                : '';

            return `
            <div class="gallery-item" data-id="${item.id}">
                <div class="vis-slot">${content}</div>
                ${labelHtml}
            </div>`;
        }).join('');
    }

    function renderAudioExperience() {
        if (typeof AUDIO_EXPERIENCE === 'undefined') return;
        const list = document.getElementById('audioExperienceList');
        if (!list) return;

        list.innerHTML = AUDIO_EXPERIENCE.map((item, i) => `
            <div class="audio-exp__item reveal reveal--d${(i % 5) + 1}">
                ${item.title ? `<h3 class="u-title">${item.title}</h3>` : ''}
                ${item.subtitle ? `<p class="u-subtitle">${item.subtitle}</p>` : ''}
                <div class="audio-exp__wave ambient-wave-container" data-bars="60" aria-hidden="true"></div>
                <div class="audio-exp__orb audio-orb-btn" role="button" tabindex="0" aria-label="Play ${item.title}">
                    <span class="audio-exp__icon">▶</span>
                </div>
                <span class="audio-exp__hint">Tap to Experience</span>
                ${item.audio ? `<audio class="ambient-audio-el" src="${item.audio}" preload="none"></audio>` : ''}
            </div>
        `).join('');

        document.querySelectorAll('.ambient-wave-container:not([data-built])').forEach(container => {
            const count = parseInt(container.dataset.bars) || 60;
            for (let i = 0; i < count; i++) {
                const bar = document.createElement('div');
                bar.className = 'ambient-bar';
                bar.style.setProperty('--ab-height', (3 + Math.random() * 35) + 'px');
                bar.style.setProperty('--ab-speed',  (1 + Math.random() * 2.5) + 's');
                bar.style.setProperty('--ab-delay',  (Math.random() * 2) + 's');
                container.appendChild(bar);
            }
            container.dataset.built = '1';
        });

        document.querySelectorAll('.audio-exp__item').forEach(item => {
            const orb = item.querySelector('.audio-orb-btn');
            const icon = orb.querySelector('.audio-exp__icon');
            const audioEl = item.querySelector('.ambient-audio-el');

            if (!orb || !audioEl) return;

            const toggle = () => {
                pauseAllAudioExcept(audioEl);

                if (audioEl.paused) {
                    audioEl.play().catch(e => console.error("Audio playback failed:", e));
                    icon.textContent = '❚❚';
                    orb.style.borderColor = 'var(--c-gold)';
                    orb.style.boxShadow = '0 0 60px rgba(194,160,78,.1)';
                } else {
                    audioEl.pause();
                    icon.textContent = '▶';
                    orb.style.borderColor = '';
                    orb.style.boxShadow = '';
                }
            };

            orb.addEventListener('click', toggle);
            orb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });
            
            audioEl.addEventListener('ended', () => {
                icon.textContent = '▶';
                orb.style.borderColor = '';
                orb.style.boxShadow = '';
            });
        });
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
       MODULE: Shared Audio Pause Logic
    ──────────────────────────────────────────────────────── */
    function pauseAllAudioExcept(exceptAudio) {
        document.querySelectorAll('audio').forEach(a => {
            if (a !== exceptAudio) {
                a.pause();
                
                const relIcon = a.parentElement.querySelector('.release-card__play-icon');
                if (relIcon) {
                    relIcon.style.borderStyle = 'solid';
                    relIcon.style.borderWidth = '6px 0 6px 10px';
                    relIcon.style.height = '0';
                    relIcon.style.marginLeft = '2px';
                }

                const ambIcon = a.parentElement.querySelector('.audio-exp__icon');
                const ambOrb = a.parentElement.querySelector('.audio-orb-btn');
                if (ambIcon) ambIcon.textContent = '▶';
                if (ambOrb) {
                    ambOrb.style.borderColor = '';
                    ambOrb.style.boxShadow = '';
                }
            }
        });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Interactions & Logic
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

    function initAudioPlayback() {
        document.querySelectorAll('.release-card').forEach(card => {
            const playBtn = card.querySelector('.release-card__play');
            const audioEl = card.querySelector('.release-audio');
            const playIcon = card.querySelector('.release-card__play-icon');

            if (!playBtn || !audioEl) return;

            playBtn.addEventListener('click', () => {
                pauseAllAudioExcept(audioEl);

                if (audioEl.paused) {
                    audioEl.play().catch(e => console.error("Audio playback failed:", e));
                    playIcon.style.borderStyle = 'double';
                    playIcon.style.borderWidth = '0px 0px 0px 10px';
                    playIcon.style.height = '12px';
                    playIcon.style.marginLeft = '0';
                } else {
                    audioEl.pause();
                    playIcon.style.borderStyle = 'solid';
                    playIcon.style.borderWidth = '6px 0 6px 10px';
                    playIcon.style.height = '0';
                    playIcon.style.marginLeft = '2px';
                }
            });

            audioEl.addEventListener('ended', () => {
                playIcon.style.borderStyle = 'solid';
                playIcon.style.borderWidth = '6px 0 6px 10px';
                playIcon.style.height = '0';
                playIcon.style.marginLeft = '2px';
            });
        });
    }

    /* ────────────────────────────────────────────────────────
       MODULE: Preloader & Particles
    ──────────────────────────────────────────────────────── */
    function initPreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('preloader');
                if (loader) loader.classList.add('is-done');
            }, PERF.loaderMs);
        });
    }

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
       MODULE: Navigation & Scroll
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

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(a.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

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
        document.querySelectorAll('.reveal:not([data-observed]), .release-card:not([data-observed]), .gallery-item:not([data-observed]), .audio-exp__item:not([data-observed])')
            .forEach(el => {
                scrollObserver.observe(el);
                el.dataset.observed = '1';
                el.classList.add('reveal');
            });
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
        
        if (fService && fInquiry) {
            fService.addEventListener('change', () => handleReveal(fService, serviceReveal, fServiceCustom));
            fInquiry.addEventListener('change', () => handleReveal(fInquiry, inquiryReveal, fInquiryCustom));
        }

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
