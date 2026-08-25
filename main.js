document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeNavBtn = document.getElementById('closeNavBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.add('active');
    });
  }

  if (closeNavBtn && mobileNavDrawer) {
    closeNavBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('active');
    });
  }

  // Close mobile drawer when clicking nav links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    });
  });

  // Early Access Form Validation & Submission (Desktop and Mobile)
  function handleFormSubmit(formId, nameId, mobileId, emailId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById(nameId);
      const mobileInput = document.getElementById(mobileId);
      const emailInput = document.getElementById(emailId);

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

      // Success feedback
      showToast(`🎉 Thank you ${name}! You're registered for Early Access!`);
      form.reset();
    });
  }

  handleFormSubmit('earlyAccessForm', 'userName', 'userMobile', 'userEmail');
  handleFormSubmit('earlyAccessFormMobile', 'userNameMob', 'userMobileMob', 'userEmailMob');

  function showToast(message) {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 4000);
  }
});
