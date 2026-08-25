document.addEventListener('DOMContentLoaded', () => {
  // Deployed Google Apps Script Web App URL
  const GOOGLE_SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9M8RwFLOqz9i3aIXtfVsG3WJdvcBWLSSsk2zkGyvciGYfgEUcZJ_WyYS3J168Cu8lMg/exec';

  const toastMsg = document.getElementById('toastMsg');

  // Early Access Form Validation & Submission
  function handleFormSubmit(formId, nameId, mobileId, emailId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById(nameId);
      const mobileInput = document.getElementById(mobileId);
      const emailInput = document.getElementById(emailId);
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const mobile = mobileInput ? mobileInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (!name) {
        showToast('Please enter your full name');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        showToast('Please enter a valid 10-digit mobile number');
        if (mobileInput) mobileInput.focus();
        return;
      }

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        showToast('Please enter a valid email address');
        if (emailInput) emailInput.focus();
        return;
      }

      // Indicate loading
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Registering...';
      }

      try {
        if (GOOGLE_SHEET_SCRIPT_URL) {
          const params = new URLSearchParams();
          params.append('name', name);
          params.append('mobile', mobile);
          params.append('email', email);

          await fetch(GOOGLE_SHEET_SCRIPT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
          });
        }

        // Success feedback
        showToast(`🎉 Thank you ${name}! You're registered for Early Access!`);
        form.reset();
      } catch (error) {
        console.error('Error submitting form:', error);
        showToast('⚠️ Something went wrong. Please try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  handleFormSubmit('earlyAccessForm', 'userName', 'userMobile', 'userEmail');

  function showToast(message) {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 4000);
  }
});
