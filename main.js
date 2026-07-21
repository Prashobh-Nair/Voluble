// Voluble Landing Page Interactions
// CONFIGURATION: Paste your Google Apps Script Web App URL below to send waitlist leads to Google Sheets:
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxB96z625hHIhL84ZfYJJOJzoT-8jl6glC6qRGvvz0ZigkDDEox9i_OiPCO_ijgReE1/exec'; 

document.addEventListener('DOMContentLoaded', () => {
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

                // Prepare waitlist lead data
                const formData = {
                    name: nameInput.value.trim(),
                    countryCode: document.getElementById('countryCode').value,
                    phone: phoneInput.value.trim(),
                    email: emailInput.value.trim(),
                    timestamp: new Date().toISOString()
                };

                const handleSuccess = () => {
                    // Save lead in localStorage for local browser backup
                    localStorage.setItem('voluble_waitlist_lead', JSON.stringify(formData));

                    // Show success screen state
                    successMsg.classList.add('active');
                    
                    // Reset button and form values
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    waitlistForm.reset();
                };

                // Send to Google Sheets if Script Web App URL is configured
                if (GOOGLE_SHEETS_URL) {
                    fetch(GOOGLE_SHEETS_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'text/plain'
                        },
                        body: JSON.stringify(formData)
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
                { icon: "☕", title: "Ordering coffee", sub: "At cafes and coffee shops" },
                { icon: "💼", title: "Office introductions", sub: "First meetings & small talk" },
                { icon: "🏠", title: "Renting apartments", sub: "Talking to landlords & agents" },
                { icon: "👥", title: "Making friends", sub: "Socializing & building connections" }
            ]
        },
        canada: {
            name: "Canada",
            flag: "assets/ca.svg",
            items: [
                { icon: "☕", title: "Ordering coffee", sub: "At local cafes and coffee shops" },
                { icon: "❄️", title: "Surviving winter", sub: "Weather small talk & gear" },
                { icon: "🏠", title: "Renting apartments", sub: "Interacting with landlords" },
                { icon: "💼", title: "Workplace culture", sub: "Icebreakers & team networking" }
            ]
        },
        uk: {
            name: "United Kingdom",
            flag: "assets/gb.svg",
            items: [
                { icon: "🍻", title: "Pub talk & socializing", sub: "Ordering drinks & pub chat" },
                { icon: "🚇", title: "Asking directions", sub: "Tube stations & transit queries" },
                { icon: "☕", title: "Office small talk", sub: "Tea breaks & local office slang" },
                { icon: "🏥", title: "Doctor appointments", sub: "GP registration & queries" }
            ]
        },
        australia: {
            name: "Australia",
            flag: "assets/au.svg",
            items: [
                { icon: "☕", title: "Ordering coffee", sub: "Flat white orders & cafe talks" },
                { icon: "🏠", title: "Renting a house", sub: "Leases & property inspections" },
                { icon: "🍖", title: "Barbecue small talk", sub: "Weekend BBQ social chats" },
                { icon: "💼", title: "Workplace slang", sub: "Understanding local office terms" }
            ]
        },
        nz: {
            name: "New Zealand",
            flag: "assets/nz.svg",
            items: [
                { icon: "☕", title: "Ordering coffee", sub: "Flat whites & local order styles" },
                { icon: "🏠", title: "Flatting interviews", sub: "Meeting potential flatmates" },
                { icon: "👋", title: "Casual greetings", sub: "Greeting colleagues & kiwi terms" },
                { icon: "🤝", title: "Making connections", sub: "Joining clubs & hobby groups" }
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
});
