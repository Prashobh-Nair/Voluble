// Voluble Landing Page Interactions
// CONFIGURATION: Paste your Google Apps Script Web App URL below to send waitlist leads to Google Sheets:
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxB96z625hHIhL84ZfYJJOJzoT-8jl6glC6qRGvvz0ZigkDDEox9i_OiPCO_ijgReE1/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Hamburger Menu Toggle
    const hamburgerBtn = document.getElementById('mobile-hamburger-btn');
    const headerEl = document.querySelector('.header');

    if (hamburgerBtn && headerEl) {
        hamburgerBtn.addEventListener('click', () => {
            headerEl.classList.toggle('mobile-open');
        });

        // Close menu when clicking outside or on a link
        document.addEventListener('click', (e) => {
            if (!headerEl.contains(e.target)) {
                headerEl.classList.remove('mobile-open');
            }
        });
    }

    // Waitlist Form Validation and Submission
    const waitlistForm = document.getElementById('waitlistForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');
    
    // Error element lookups
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\s\-()+]{7,15}$/;

    // Field validation status check
    const validateField = (input, errorEl, condition) => {
        const group = input.closest('.form-group');
        if (condition) {
            group.classList.remove('invalid');
            return true;
        } else {
            group.classList.add('invalid');
            return false;
        }
    };

    // Real-time input cleaning and validations
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            validateField(nameInput, nameError, nameInput.value.trim().length > 1);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            // Keep only valid phone characters
            phoneInput.value = phoneInput.value.replace(/[^0-9\s\-()+]/g, '');
            validateField(phoneInput, phoneError, phoneRegex.test(phoneInput.value.trim()));
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
        });
    }

    // Submit handler
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields
            const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 1);
            const isPhoneValid = validateField(phoneInput, phoneError, phoneRegex.test(phoneInput.value.trim()));
            const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));

            if (isNameValid && isPhoneValid && isEmailValid) {
                // Trigger loading state on button
                submitBtn.disabled = true;
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <span>Joining...</span>
                    <svg class="submit-icon spinning" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="30 30" fill="none"></circle>
                    </svg>
                `;

                // Determine page type and target sheet tab (English, Nurse, Student)
                let pageType = 'English';
                let sourcePage = 'Home Page';
                
                const hiddenSheetInput = document.getElementById('sheetNameInput');
                if (hiddenSheetInput && hiddenSheetInput.value) {
                    pageType = hiddenSheetInput.value;
                } else if (document.body.classList.contains('germany-page') || window.location.pathname.includes('germany.html')) {
                    pageType = 'Nurse';
                } else if (document.body.classList.contains('germany-students-page') || window.location.pathname.includes('germany-students.html')) {
                    pageType = 'Student';
                }

                if (pageType === 'Nurse') {
                    sourcePage = 'Germany Nurses Page';
                } else if (pageType === 'Student') {
                    sourcePage = 'Germany Students Page';
                }

                // Prepare waitlist lead data with target sheet identifiers
                const formData = {
                    name: nameInput.value.trim(),
                    countryCode: document.getElementById('countryCode').value,
                    phone: phoneInput.value.trim(),
                    email: emailInput.value.trim(),
                    sheetName: pageType,
                    sheet: pageType,
                    pageType: pageType,
                    tab: pageType,
                    sourcePage: sourcePage,
                    timestamp: new Date().toISOString()
                };

                const handleSuccess = () => {
                    // Save lead in localStorage for local browser backup
                    localStorage.setItem(`voluble_waitlist_${pageType.toLowerCase()}_lead`, JSON.stringify(formData));

                    // Show success screen state
                    successMsg.classList.add('active');
                    
                    // Reset button and form values
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    waitlistForm.reset();
                };

                // Send to Google Sheets if Script Web App URL is configured
                if (GOOGLE_SHEETS_URL) {
                    // Construct URL query parameters so e.parameter.sheetName is populated in Google Apps Script!
                    const targetUrl = `${GOOGLE_SHEETS_URL}?sheetName=${encodeURIComponent(pageType)}&sheet=${encodeURIComponent(pageType)}&pageType=${encodeURIComponent(pageType)}&tab=${encodeURIComponent(pageType)}&sourcePage=${encodeURIComponent(sourcePage)}`;

                    // Send form encoded body
                    const urlParams = new URLSearchParams();
                    for (const key in formData) {
                        urlParams.append(key, formData[key]);
                    }

                    fetch(targetUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: urlParams.toString()
                    })
                    .then(() => {
                        handleSuccess();
                    })
                    .catch((error) => {
                        console.error('Google Sheets submission error:', error);
                        // Fallback to local success to ensure user gets immediate confirmation
                        handleSuccess();
                    });
                } else {
                    // Mockup simulation when URL is not set yet
                    setTimeout(() => {
                        handleSuccess();
                    }, 1200);
                }
            }
        });
    }

    // Add CSS spinning keyframe dynamically if not present
    if (!document.getElementById('spin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spin-keyframes';
        style.innerHTML = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Country Spotlight Interactive Data
    const countryData = {
        usa: {
            name: "United States",
            flag: "assets/us.svg",
            items: [
                { icon: "💵", title: "Tipping culture", sub: "Handling tips at dining & bars" },
                { icon: "🏥", title: "US health insurance", sub: "Navigating copays & networks" },
                { icon: "🛒", title: "Target & Trader Joe's", sub: "Checkout slang & bag requests" },
                { icon: "💬", title: "Watercooler chats", sub: "Weekend plans & NFL/sports talk" }
            ]
        },
        canada: {
            name: "Canada",
            flag: "assets/ca.svg",
            items: [
                { icon: "🧥", title: "Winter coat shopping", sub: "Asking for parkas & thermal gear" },
                { icon: "🏒", title: "Ice hockey (NHL) talks", sub: "Joining local fan banter" },
                { icon: "💳", title: "Building credit score", sub: "Opening accounts & credit types" },
                { icon: "🍂", title: "Canadianisms (eh/loonie)", sub: "Blending in with local accents" }
            ]
        },
        uk: {
            name: "United Kingdom",
            flag: "assets/gb.svg",
            items: [
                { icon: "🎫", title: "Transit & Oyster cards", sub: "Buying tube tickets & tap-ins" },
                { icon: "🍻", title: "Ordering a pub pint", sub: "Paying at the bar (no tables)" },
                { icon: "☔", title: "Weather small talk", sub: "Discussing rain & overcast skies" },
                { icon: "🏥", title: "NHS GP registration", sub: "Setting up local medical checkups" }
            ]
        },
        australia: {
            name: "Australia",
            flag: "assets/au.svg",
            items: [
                { icon: "☕", title: "Ordering custom coffee", sub: "Flat whites, sizes & local terms" },
                { icon: "🦘", title: "Aussie slang (arvo/barbie)", sub: "Greeting mates at social events" },
                { icon: "🏠", title: "Renting inspections", sub: "Handling rental queues & forms" },
                { icon: "🏄", title: "Surf & beach safety", sub: "Understanding flags & swimming terms" }
            ]
        },
        nz: {
            name: "New Zealand",
            flag: "assets/nz.svg",
            items: [
                { icon: "🥝", title: "Kia Ora & Maori terms", sub: "Using common kiwi greetings" },
                { icon: "🏡", title: "Flatting interviews", sub: "Convincing potential kiwi flatmates" },
                { icon: "🥾", title: "Tramping in the wild", sub: "Gear lists & hiking track chats" },
                { icon: "🍎", title: "Supermarket comparisons", sub: "Pak'nSave vs Woolworths jargon" }
            ]
        }
    };

    const mapTooltipCard = document.getElementById('mapTooltipCard');
    const tooltipFlag = document.getElementById('tooltipFlag');
    const tooltipCountry = document.getElementById('tooltipCountry');
    const tooltipList = document.getElementById('tooltipList');
    const tooltipClose = document.getElementById('tooltipClose');
    
    const pinButtons = document.querySelectorAll('.map-pin-btn');
    const selectorButtons = document.querySelectorAll('.selector-item-btn');

    const updateCountrySpotlight = (countryKey) => {
        const data = countryData[countryKey];
        if (!data) return;

        // 1. Update text content
        if (tooltipFlag) {
            tooltipFlag.src = data.flag;
            tooltipFlag.alt = data.name + " Flag";
        }
        if (tooltipCountry) {
            tooltipCountry.textContent = data.name;
        }

        if (tooltipList) {
            tooltipList.innerHTML = data.items.map(item => `
                <li class="tooltip-item">
                    <span class="tooltip-item-icon">${item.icon}</span>
                    <div class="tooltip-item-text">
                        <h5>${item.title}</h5>
                        <p>${item.sub}</p>
                    </div>
                </li>
            `).join('');
        }

        // 2. Synchronize active state of Pins and position tooltip
        pinButtons.forEach(pin => {
            if (pin.getAttribute('data-country') === countryKey) {
                pin.classList.add('active');
                
                if (mapTooltipCard) {
                    const topVal = pin.style.top;
                    const leftVal = pin.style.left;
                    
                    const topInt = parseInt(topVal);
                    const leftInt = parseInt(leftVal);
                    
                    // Position tooltip card: on wide screens, place relative to the pin location
                    if (window.innerWidth > 768) {
                        if (leftInt > 55) {
                            mapTooltipCard.style.left = 'auto';
                            mapTooltipCard.style.right = (100 - leftInt + 2) + '%';
                        } else {
                            mapTooltipCard.style.right = 'auto';
                            mapTooltipCard.style.left = (leftInt + 6) + '%';
                        }
                        
                        if (topInt > 60) {
                            mapTooltipCard.style.top = 'auto';
                            mapTooltipCard.style.bottom = (100 - topInt - 10) + '%';
                        } else {
                            mapTooltipCard.style.bottom = 'auto';
                            mapTooltipCard.style.top = (topInt - 10) + '%';
                        }
                    } else {
                        // Reset absolute coordinate positions on tablet/mobile where overlay is centered
                        mapTooltipCard.style.left = '';
                        mapTooltipCard.style.right = '';
                        mapTooltipCard.style.top = '';
                        mapTooltipCard.style.bottom = '';
                    }
                }
            } else {
                pin.classList.remove('active');
            }
        });

        // 3. Synchronize active state of Bottom Selector Pill
        selectorButtons.forEach(btn => {
            if (btn.getAttribute('data-country') === countryKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Make tooltip active/visible
        if (mapTooltipCard) {
            mapTooltipCard.classList.add('active');
        }
    };

    let closeTimeout = null;

    const showTooltip = (countryKey) => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
        updateCountrySpotlight(countryKey);
    };

    const hideTooltip = () => {
        if (closeTimeout) return;
        closeTimeout = setTimeout(() => {
            if (mapTooltipCard) {
                mapTooltipCard.classList.remove('active');
            }
            // Remove active classes when not hovering any country
            pinButtons.forEach(pin => pin.classList.remove('active'));
            selectorButtons.forEach(btn => btn.classList.remove('active'));
        }, 200); // 200ms buffer for mouse movement between pin and card
    };

    // Map Pins Hover and Click Listeners
    pinButtons.forEach(pin => {
        const countryKey = pin.getAttribute('data-country');
        
        pin.addEventListener('mouseenter', () => {
            showTooltip(countryKey);
        });
        
        pin.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        pin.addEventListener('click', () => {
            showTooltip(countryKey);
        });
    });

    // Bottom Selector Buttons Hover and Click Listeners
    selectorButtons.forEach(btn => {
        const countryKey = btn.getAttribute('data-country');
        
        btn.addEventListener('mouseenter', () => {
            showTooltip(countryKey);
        });
        
        btn.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        btn.addEventListener('click', () => {
            showTooltip(countryKey);
        });
    });

    // Tooltip Card Hover Listeners to prevent auto-close
    if (mapTooltipCard) {
        mapTooltipCard.addEventListener('mouseenter', () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        });
        
        mapTooltipCard.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    }

    // Tooltip Close Action
    if (tooltipClose && mapTooltipCard) {
        tooltipClose.addEventListener('click', () => {
            mapTooltipCard.classList.remove('active');
            pinButtons.forEach(pin => pin.classList.remove('active'));
            selectorButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    // ── Auto-open USA on mobile (touch devices) ──────────────────────────
    const isTouchDevice = () => window.innerWidth <= 768 || ('ontouchstart' in window);
    if (isTouchDevice()) {
        // Short delay so the section is painted and visible first
        setTimeout(() => {
            showTooltip('usa');
        }, 600);
    }

    // ==========================================
    // 3D PARALLAX & TILT INTERACTION ENGINE
    // ==========================================
    const init3DTiltEffect = (selector, maxDegree = 10) => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            el.style.transformStyle = 'preserve-3d';
            
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -maxDegree;
                const rotateY = ((x - centerX) / centerX) * maxDegree;
                
                el.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
                el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.5s ease';
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    };

    // Initialize 3D Tilt on hero passport graphic, comparison cards, and journey cards
    init3DTiltEffect('.hero-graphic', 8);
    init3DTiltEffect('.comparison-card', 7);
    init3DTiltEffect('.journey-card', 7);
    init3DTiltEffect('.career-growth-bar', 4);

    // ==========================================
    // PAGE 4: TRANSFORMATION SPOTLIGHT TOGGLE
    // ==========================================
    const btnWeek1 = document.getElementById('btn-week-1');
    const btnWeek12 = document.getElementById('btn-week-12');
    const spotlightAvatar = document.getElementById('spotlight-avatar');
    const spotlightLabel = document.getElementById('spotlight-label');
    const spotlightQuote = document.getElementById('spotlight-quote');
    const spotlightPct = document.getElementById('spotlight-pct');
    const spotlightBar = document.getElementById('spotlight-bar');
    const spotlightStatus = document.getElementById('spotlight-status');

    if (btnWeek1 && btnWeek12) {
        btnWeek1.addEventListener('click', () => {
            btnWeek1.classList.add('active');
            btnWeek12.classList.remove('active');
            
            spotlightAvatar.textContent = '😰';
            spotlightLabel.textContent = 'Real Scenario: Standup Meeting';
            spotlightQuote.textContent = '"Umm... I think... my code has bug... sorry, can you repeat that question again?"';
            spotlightPct.textContent = '25%';
            spotlightBar.style.width = '25%';
            spotlightBar.style.background = 'linear-gradient(90deg, #e74c3c, #f39c12)';
            spotlightStatus.textContent = '⚠️ High anxiety & translation hesitation';
        });

        btnWeek12.addEventListener('click', () => {
            btnWeek12.classList.add('active');
            btnWeek1.classList.remove('active');
            
            spotlightAvatar.textContent = '🚀';
            spotlightLabel.textContent = 'Real Scenario: Executive Architecture Review';
            spotlightQuote.textContent = '"Let me walk you through our architectural trade-offs, performance gains, and proposed rollout."';
            spotlightPct.textContent = '98%';
            spotlightBar.style.width = '98%';
            spotlightBar.style.background = 'linear-gradient(90deg, #088a99, #2ecc71)';
            spotlightStatus.textContent = '✨ Fluent, natural & confident leader';
        });
    }

    // ==========================================
    // APPLE-STYLE SLIDING CAROUSEL ENGINE
    // ==========================================
    const appleTrack = document.getElementById('apple-carousel-track');
    const applePrevBtn = document.getElementById('apple-carousel-prev');
    const appleNextBtn = document.getElementById('apple-carousel-next');
    const appleDots = document.querySelectorAll('.apple-dot');

    if (appleTrack) {
        const updateAppleControls = () => {
            const maxScroll = appleTrack.scrollWidth - appleTrack.clientWidth;
            if (applePrevBtn) applePrevBtn.disabled = appleTrack.scrollLeft <= 5;
            if (appleNextBtn) appleNextBtn.disabled = appleTrack.scrollLeft >= maxScroll - 5;

            // Sync active dot
            if (maxScroll > 0) {
                const scrollRatio = appleTrack.scrollLeft / maxScroll;
                const activeIndex = Math.min(
                    appleDots.length - 1,
                    Math.round(scrollRatio * (appleDots.length - 1))
                );

                appleDots.forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        // Arrow Button Clicks
        if (applePrevBtn) {
            applePrevBtn.addEventListener('click', () => {
                const firstCard = appleTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 340;
                appleTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (appleNextBtn) {
            appleNextBtn.addEventListener('click', () => {
                const firstCard = appleTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 340;
                appleTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        // Dot Navigation Clicks
        appleDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const cards = appleTrack.querySelectorAll('.apple-slide-card');
                if (cards[idx]) {
                    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            });
        });

        // Mouse Drag Interaction (Apple-like desktop dragging)
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        appleTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            appleTrack.classList.add('is-dragging');
            startX = e.pageX - appleTrack.offsetLeft;
            startScrollLeft = appleTrack.scrollLeft;
        });

        appleTrack.addEventListener('mouseleave', () => {
            isDragging = false;
            appleTrack.classList.remove('is-dragging');
        });

        appleTrack.addEventListener('mouseup', () => {
            isDragging = false;
            appleTrack.classList.remove('is-dragging');
        });

        appleTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - appleTrack.offsetLeft;
            const walk = (x - startX) * 1.6;
            appleTrack.scrollLeft = startScrollLeft - walk;
        });

        appleTrack.addEventListener('scroll', updateAppleControls);
        window.addEventListener('resize', updateAppleControls);
        updateAppleControls();
    }

    // ==========================================
    // ROADMAP CAROUSEL ENGINE (Germany Students)
    // ==========================================
    const rmapTrack = document.getElementById('roadmap-carousel-track');
    const rmapPrevBtn = document.getElementById('roadmap-carousel-prev');
    const rmapNextBtn = document.getElementById('roadmap-carousel-next');
    const rmapDots = document.querySelectorAll('#roadmap-carousel-dots .apple-dot');

    if (rmapTrack) {
        const updateRmapControls = () => {
            const maxScroll = rmapTrack.scrollWidth - rmapTrack.clientWidth;
            if (rmapPrevBtn) rmapPrevBtn.disabled = rmapTrack.scrollLeft <= 5;
            if (rmapNextBtn) rmapNextBtn.disabled = rmapTrack.scrollLeft >= maxScroll - 5;

            if (maxScroll > 0 && rmapDots.length > 0) {
                const scrollRatio = rmapTrack.scrollLeft / maxScroll;
                const activeIndex = Math.min(
                    rmapDots.length - 1,
                    Math.round(scrollRatio * (rmapDots.length - 1))
                );

                rmapDots.forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        if (rmapPrevBtn) {
            rmapPrevBtn.addEventListener('click', () => {
                const firstCard = rmapTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                rmapTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (rmapNextBtn) {
            rmapNextBtn.addEventListener('click', () => {
                const firstCard = rmapTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                rmapTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        rmapDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const cards = rmapTrack.querySelectorAll('.apple-slide-card');
                if (cards[idx]) {
                    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            });
        });

        let isDraggingRmap = false;
        let startXRmap = 0;
        let startScrollLeftRmap = 0;

        rmapTrack.addEventListener('mousedown', (e) => {
            isDraggingRmap = true;
            rmapTrack.classList.add('is-dragging');
            startXRmap = e.pageX - rmapTrack.offsetLeft;
            startScrollLeftRmap = rmapTrack.scrollLeft;
        });

        rmapTrack.addEventListener('mouseleave', () => {
            isDraggingRmap = false;
            rmapTrack.classList.remove('is-dragging');
        });

        rmapTrack.addEventListener('mouseup', () => {
            isDraggingRmap = false;
            rmapTrack.classList.remove('is-dragging');
        });

        rmapTrack.addEventListener('mousemove', (e) => {
            if (!isDraggingRmap) return;
            e.preventDefault();
            const x = e.pageX - rmapTrack.offsetLeft;
            const walk = (x - startXRmap) * 1.6;
            rmapTrack.scrollLeft = startScrollLeftRmap - walk;
        });

        rmapTrack.addEventListener('scroll', updateRmapControls);
        window.addEventListener('resize', updateRmapControls);
        updateRmapControls();
    }

    // ==========================================
    // NURSE ROADMAP CAROUSEL ENGINE (Germany Nurses)
    // ==========================================
    const nurseTrack = document.getElementById('nurse-roadmap-track');
    const nursePrevBtn = document.getElementById('nurse-roadmap-prev');
    const nurseNextBtn = document.getElementById('nurse-roadmap-next');
    const nurseDots = document.querySelectorAll('#nurse-roadmap-dots .apple-dot');

    if (nurseTrack) {
        const updateNurseControls = () => {
            const maxScroll = nurseTrack.scrollWidth - nurseTrack.clientWidth;
            if (nursePrevBtn) nursePrevBtn.disabled = nurseTrack.scrollLeft <= 5;
            if (nurseNextBtn) nurseNextBtn.disabled = nurseTrack.scrollLeft >= maxScroll - 5;

            if (maxScroll > 0 && nurseDots.length > 0) {
                const scrollRatio = nurseTrack.scrollLeft / maxScroll;
                const activeIndex = Math.min(
                    nurseDots.length - 1,
                    Math.round(scrollRatio * (nurseDots.length - 1))
                );

                nurseDots.forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        if (nursePrevBtn) {
            nursePrevBtn.addEventListener('click', () => {
                const firstCard = nurseTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                nurseTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (nurseNextBtn) {
            nurseNextBtn.addEventListener('click', () => {
                const firstCard = nurseTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                nurseTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        nurseDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const cards = nurseTrack.querySelectorAll('.apple-slide-card');
                if (cards[idx]) {
                    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            });
        });

        let isDraggingNurse = false;
        let startXNurse = 0;
        let startScrollLeftNurse = 0;

        nurseTrack.addEventListener('mousedown', (e) => {
            isDraggingNurse = true;
            nurseTrack.classList.add('is-dragging');
            startXNurse = e.pageX - nurseTrack.offsetLeft;
            startScrollLeftNurse = nurseTrack.scrollLeft;
        });

        nurseTrack.addEventListener('mouseleave', () => {
            isDraggingNurse = false;
            nurseTrack.classList.remove('is-dragging');
        });

        nurseTrack.addEventListener('mouseup', () => {
            isDraggingNurse = false;
            nurseTrack.classList.remove('is-dragging');
        });

        nurseTrack.addEventListener('mousemove', (e) => {
            if (!isDraggingNurse) return;
            e.preventDefault();
            const x = e.pageX - nurseTrack.offsetLeft;
            const walk = (x - startXNurse) * 1.6;
            nurseTrack.scrollLeft = startScrollLeftNurse - walk;
        });

        nurseTrack.addEventListener('scroll', updateNurseControls);
        window.addEventListener('resize', updateNurseControls);
        updateNurseControls();
    }

    // ==========================================
    // HURDLES CAROUSEL ENGINE (Germany Nurses Fold 4)
    // ==========================================
    const hurdlesTrack = document.getElementById('hurdles-carousel-track');
    const hurdlesPrevBtn = document.getElementById('hurdles-carousel-prev');
    const hurdlesNextBtn = document.getElementById('hurdles-carousel-next');
    const hurdlesDots = document.querySelectorAll('#hurdles-carousel-dots .apple-dot');

    if (hurdlesTrack) {
        const updateHurdlesControls = () => {
            const maxScroll = hurdlesTrack.scrollWidth - hurdlesTrack.clientWidth;
            if (hurdlesPrevBtn) hurdlesPrevBtn.disabled = hurdlesTrack.scrollLeft <= 5;
            if (hurdlesNextBtn) hurdlesNextBtn.disabled = hurdlesTrack.scrollLeft >= maxScroll - 5;

            if (maxScroll > 0 && hurdlesDots.length > 0) {
                const scrollRatio = hurdlesTrack.scrollLeft / maxScroll;
                const activeIndex = Math.min(
                    hurdlesDots.length - 1,
                    Math.round(scrollRatio * (hurdlesDots.length - 1))
                );

                hurdlesDots.forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        if (hurdlesPrevBtn) {
            hurdlesPrevBtn.addEventListener('click', () => {
                const firstCard = hurdlesTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                hurdlesTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (hurdlesNextBtn) {
            hurdlesNextBtn.addEventListener('click', () => {
                const firstCard = hurdlesTrack.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                hurdlesTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        hurdlesDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const cards = hurdlesTrack.querySelectorAll('.apple-slide-card');
                if (cards[idx]) {
                    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            });
        });

        let isDraggingHurdles = false;
        let startXHurdles = 0;
        let startScrollLeftHurdles = 0;

        hurdlesTrack.addEventListener('mousedown', (e) => {
            isDraggingHurdles = true;
            hurdlesTrack.classList.add('is-dragging');
            startXHurdles = e.pageX - hurdlesTrack.offsetLeft;
            startScrollLeftHurdles = hurdlesTrack.scrollLeft;
        });

        hurdlesTrack.addEventListener('mouseleave', () => {
            isDraggingHurdles = false;
            hurdlesTrack.classList.remove('is-dragging');
        });

        hurdlesTrack.addEventListener('mouseup', () => {
            isDraggingHurdles = false;
            hurdlesTrack.classList.remove('is-dragging');
        });

        hurdlesTrack.addEventListener('mousemove', (e) => {
            if (!isDraggingHurdles) return;
            e.preventDefault();
            const x = e.pageX - hurdlesTrack.offsetLeft;
            const walk = (x - startXHurdles) * 1.6;
            hurdlesTrack.scrollLeft = startScrollLeftHurdles - walk;
        });

        hurdlesTrack.addEventListener('scroll', updateHurdlesControls);
        window.addEventListener('resize', updateHurdlesControls);
        updateHurdlesControls();
    }

    // ==========================================
    // GENERIC APPLE CAROUSEL INITIALIZER HELPER
    // ==========================================
    const initAppleCarousel = (trackId, prevBtnId, nextBtnId, dotsSelector) => {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const dots = document.querySelectorAll(dotsSelector);

        if (!track) return;

        const updateControls = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (prevBtn) prevBtn.disabled = track.scrollLeft <= 5;
            if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 5;

            if (maxScroll > 0 && dots.length > 0) {
                const scrollRatio = track.scrollLeft / maxScroll;
                const activeIndex = Math.min(
                    dots.length - 1,
                    Math.round(scrollRatio * (dots.length - 1))
                );

                dots.forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const firstCard = track.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const firstCard = track.querySelector('.apple-slide-card');
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
                track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const cards = track.querySelectorAll('.apple-slide-card');
                if (cards[idx]) {
                    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            });
        });

        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            track.classList.add('is-dragging');
            startX = e.pageX - track.offsetLeft;
            startScrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDragging = false;
            track.classList.remove('is-dragging');
        });

        track.addEventListener('mouseup', () => {
            isDragging = false;
            track.classList.remove('is-dragging');
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.6;
            track.scrollLeft = startScrollLeft - walk;
        });

        track.addEventListener('scroll', updateControls);
        window.addEventListener('resize', updateControls);
        updateControls();
    };

    // Initialize all solution and after-germany carousels
    initAppleCarousel('nurse-sol-track', 'nurse-sol-prev', 'nurse-sol-next', '#nurse-sol-dots .apple-dot');
    initAppleCarousel('student-sol-track', 'student-sol-prev', 'student-sol-next', '#student-sol-dots .apple-dot');
    initAppleCarousel('student-after-track', 'student-after-prev', 'student-after-next', '#student-after-dots .apple-dot');
});
