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
});
