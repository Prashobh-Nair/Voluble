// Voluble Landing Page Interactions
// CONFIGURATION: Paste your Google Apps Script Web App URL below to send waitlist leads to Google Sheets:
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxB96z625hHIhL84ZfYJJOJzoT-8jl6glC6qRGvvz0ZigkDDEox9i_OiPCO_ijgReE1/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scroll Helper with Header Offset
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 80;
    const topMargin = 24; // 1.5rem top gap
    
    // Add scroll margin to sections dynamically to handle the fixed header offset
    document.querySelectorAll('.section').forEach(section => {
        section.style.scrollMarginTop = `${headerHeight + topMargin}px`;
    });

    // 2. Waitlist Form Validation and Submission
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
    const validateField = (input, errorEl, condition, defaultText) => {
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

    // 3. Intersection Observer for Comic Grid staggered reveal
    const comicFrames = document.querySelectorAll('.comic-frame-card');
    
    if ('IntersectionObserver' in window && comicFrames.length > 0) {
        // Set staggered delays based on layout grid columns (3 columns on desktop)
        comicFrames.forEach((frame, idx) => {
            // Apply delay classes/inline styling to stagger elements inside the same row
            const delay = (idx % 3) * 150; 
            frame.style.transitionDelay = `${delay}ms`;
        });

        const comicObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        comicFrames.forEach(frame => {
            comicObserver.observe(frame);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        comicFrames.forEach(frame => {
            frame.classList.add('revealed');
        });
    }

    // 4. Floating Pill Navigation Scroll Effects
    window.addEventListener('scroll', () => {
        const isMobile = window.innerWidth <= 768;
        if (window.scrollY > 50) {
            header.style.top = isMobile ? '0.5rem' : '0.75rem';
            header.style.backgroundColor = 'rgba(251, 244, 236, 0.97)';
            header.style.boxShadow = '0 12px 40px rgba(2, 59, 89, 0.14)';
            header.style.borderColor = 'rgba(2, 59, 89, 0.16)';
        } else {
            header.style.top = isMobile ? '1rem' : '1.5rem';
            header.style.backgroundColor = 'rgba(251, 244, 236, 0.85)';
            header.style.boxShadow = '0 8px 32px rgba(2, 59, 89, 0.08)';
            header.style.borderColor = 'rgba(2, 59, 89, 0.12)';
        }
    });

    // 5. Destination Spotlight Hover Logic
    const countryTags = document.querySelectorAll('.country-tag');
    const spotlight = document.getElementById('destinationSpotlight');
    const placeholder = document.getElementById('spotlightPlaceholder');
    const dataContainer = document.getElementById('spotlightData');
    const flagEl = document.getElementById('spotlightFlag');
    const countryEl = document.getElementById('spotlightCountry');
    const infoEl = document.getElementById('spotlightInfo');
    const salaryEl = document.getElementById('spotlightSalary');

    const countryData = {
        us: {
            name: "United States",
            flag: "🇺🇸",
            info: "Top Hubs: San Francisco, Seattle, New York | Key Focus: AI, SaaS & Big Tech",
            salary: "$120K – $180K"
        },
        ca: {
            name: "Canada",
            flag: "🇨🇦",
            info: "Top Hubs: Toronto, Vancouver, Montreal | Key Focus: FinTech, AI Research & Gaming",
            salary: "$95K – $135K"
        },
        gb: {
            name: "United Kingdom",
            flag: "🇬🇧",
            info: "Top Hubs: London, Cambridge, Manchester | Key Focus: FinTech, BioTech & DeepTech",
            salary: "£75K – £115K"
        },
        au: {
            name: "Australia",
            flag: "🇦🇺",
            info: "Top Hubs: Sydney, Melbourne, Brisbane | Key Focus: Enterprise SaaS, MiningTech & IT",
            salary: "A$110K – A$150K"
        },
        nz: {
            name: "New Zealand",
            flag: "🇳🇿",
            info: "Top Hubs: Auckland, Wellington, Christchurch | Key Focus: AgriTech, CreativeTech & IT Services",
            salary: "NZ$100K – NZ$135K"
        }
    };

    if (countryTags.length > 0 && spotlight) {
        countryTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                const countryKey = tag.getAttribute('data-country');
                const data = countryData[countryKey];
                
                if (data) {
                    // Update content
                    flagEl.textContent = data.flag;
                    countryEl.textContent = data.name;
                    infoEl.textContent = data.info;
                    salaryEl.textContent = data.salary;
                    
                    // Toggle active classes
                    placeholder.style.display = 'none';
                    dataContainer.style.display = 'flex';
                    spotlight.classList.add('active');
                    
                    // Clear other active tags and set this one active
                    countryTags.forEach(t => t.classList.remove('active'));
                    tag.classList.add('active');
                }
            });
        });
    }
});
