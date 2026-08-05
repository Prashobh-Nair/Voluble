// Voluble Interactive Functionality & Animations

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navHeader = document.querySelector('.nav-header');

  if (mobileBtn && navHeader) {
    mobileBtn.addEventListener('click', () => {
      navHeader.classList.toggle('mobile-nav-active');
    });
  }

  // Floating Navbar Scroll Shadow Effect
  const navContainer = document.querySelector('.nav-container');
  if (navContainer) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navContainer.classList.add('scrolled');
      } else {
        navContainer.classList.remove('scrolled');
      }
    });
  }

  // 2. Intersection Observer for Scroll Animations (.fade-in-up)
  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // 3. Stat Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          const suffix = entry.target.getAttribute('data-suffix') || '%';
          animateCounter(entry.target, target, suffix);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(stat => statObserver.observe(stat));
  }

  function animateCounter(el, target, suffix) {
    let current = 0;
    const duration = 1500;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current) + suffix;
    }, stepTime);
  }

  // 4. FAQ Accordion Handler
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all accordions in same group
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. Interactive AI Voice Coach Simulator
  const simMicBtn = document.getElementById('simMicBtn');
  const simWaveform = document.getElementById('simWaveform');
  const simStatus = document.getElementById('simStatus');
  const simDialogueText = document.getElementById('simDialogueText');
  const simFeedbackContainer = document.getElementById('simFeedbackContainer');

  const demoScenarios = [
    {
      user: "Good morning. I am applying for the Senior Analyst position because I have 4 years experience in data modeling.",
      ai: "Great confidence! Try replacing '4 years experience' with '4 years of proven hands-on experience'.",
      grammarScore: "98%",
      vocabScore: "Advanced",
      pronunciation: "Clear & Crisp"
    },
    {
      user: "In my previous project, I managed a team of 5 people and delivered the client presentation on time.",
      ai: "Excellent tone structure. Note on pronunciation: emphasis on 'delivered' was very natural.",
      grammarScore: "100%",
      vocabScore: "Executive",
      pronunciation: "96% Natural"
    },
    {
      user: "I want to explain why our strategy will increase Q3 revenue by 25 percent.",
      ai: "Strong phrasing! Consider adding a pause after '25 percent' for emphasis.",
      grammarScore: "97%",
      vocabScore: "Strategic",
      pronunciation: "98% Natural"
    }
  ];

  let currentScenarioIndex = 0;
  let isSimulating = false;

  if (simMicBtn) {
    simMicBtn.addEventListener('click', () => {
      if (isSimulating) return;
      isSimulating = true;
      
      // Active Listening State
      simMicBtn.classList.add('btn-secondary');
      simMicBtn.classList.remove('btn-primary');
      simMicBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Listening...
      `;
      
      if (simStatus) simStatus.textContent = "AI Listening & Analyzing Tone...";
      if (simWaveform) simWaveform.style.opacity = "1";

      setTimeout(() => {
        // Display user input
        const scenario = demoScenarios[currentScenarioIndex];
        if (simDialogueText) {
          simDialogueText.innerHTML = `
            <div style="margin-bottom: 0.75rem; color: var(--text-primary); font-weight: 500;">
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary); display: block; margin-bottom: 0.25rem;">You Said:</span>
              "${scenario.user}"
            </div>
            <div style="padding: 0.75rem; background-color: var(--primary-light); border-radius: 0.625rem; border: 1px solid rgba(37, 99, 235, 0.2); color: var(--text-primary); font-size: 0.875rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary); display: block; margin-bottom: 0.25rem;">AI Coach Instant Feedback:</span>
              ${scenario.ai}
            </div>
          `;
        }

        if (simFeedbackContainer) {
          simFeedbackContainer.innerHTML = `
            <div style="display: flex; gap: 1rem; margin-top: 1rem; justify-content: space-between; text-align: center;">
              <div style="flex: 1; padding: 0.5rem; background: #F8FAFC; border-radius: 0.5rem; border: 1px solid #E5E7EB;">
                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Grammar</span>
                <strong style="color: var(--success); font-size: 0.9375rem;">${scenario.grammarScore}</strong>
              </div>
              <div style="flex: 1; padding: 0.5rem; background: #F8FAFC; border-radius: 0.5rem; border: 1px solid #E5E7EB;">
                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Vocabulary</span>
                <strong style="color: var(--primary); font-size: 0.9375rem;">${scenario.vocabScore}</strong>
              </div>
              <div style="flex: 1; padding: 0.5rem; background: #F8FAFC; border-radius: 0.5rem; border: 1px solid #E5E7EB;">
                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Pronunciation</span>
                <strong style="color: var(--text-primary); font-size: 0.9375rem;">${scenario.pronunciation}</strong>
              </div>
            </div>
          `;
        }

        // Reset button
        simMicBtn.classList.remove('btn-secondary');
        simMicBtn.classList.add('btn-primary');
        simMicBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          Try Next Practice Scenario
        `;
        if (simStatus) simStatus.textContent = "AI Analysis Ready!";
        
        currentScenarioIndex = (currentScenarioIndex + 1) % demoScenarios.length;
        isSimulating = false;
      }, 1400);
    });
  }

  // 6. Early Access Modal Handling
  const modalBackdrop = document.getElementById('earlyAccessModal');
  const openModalBtns = document.querySelectorAll('.open-early-access-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const waitlistForm = document.getElementById('waitlistForm');
  const formSuccess = document.getElementById('formSuccess');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalBackdrop) {
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      setTimeout(() => {
        if (waitlistForm) waitlistForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }, 800);
    });
  }

  // ── Google Sheets Webhook Integration ──
  window.VOLUBLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbydHBo57NDP73utCZAzksf5WhksB_jvM8ayZB9eEImwULU5PTY-mHHg1KN9W26po6c/exec';

  function sendToGoogleSheets(data) {
    if (!window.VOLUBLE_SHEETS_WEBHOOK_URL) {
      console.log('Voluble Form Submitted:', data);
      return;
    }
    fetch(window.VOLUBLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(err => console.error('Google Sheets Error:', err));
  }

  const inlineWaitlistForm = document.getElementById('inlineWaitlistForm');
  const inlineFormSuccess = document.getElementById('inlineFormSuccess');

  if (inlineWaitlistForm) {
    inlineWaitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inlineWaitlistForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Application...';
      }

      const sheetTarget = inlineWaitlistForm.getAttribute('data-sheet') || 'English';
      const name = (document.getElementById('inlineUserName') || document.getElementById('formFullName') || {}).value || '';
      const email = (document.getElementById('inlineUserEmail') || document.getElementById('formEmail') || {}).value || '';
      const countryCode = (document.getElementById('inlineCountryCode') || document.getElementById('formCountryCode') || {}).value || '+91';
      const phone = (document.getElementById('inlineUserPhone') || document.getElementById('formPhone') || {}).value || '';

      const payload = {
        sheet: sheetTarget,
        timestamp: new Date().toLocaleString(),
        name: name,
        countryCode: countryCode,
        phone: phone,
        email: email
      };

      sendToGoogleSheets(payload);

      setTimeout(() => {
        if (inlineWaitlistForm) inlineWaitlistForm.style.display = 'none';
        if (inlineFormSuccess) inlineFormSuccess.style.display = 'block';
      }, 800);
    });
  }

  // ── Swipe Carousel Dot Indicators (mobile only) ──
  function initCarouselDots() {
    if (window.innerWidth > 768) return;

    // Handle both .swipe-carousel (direct children) and .swipe-carousel-inner
    const carousels = [
      ...document.querySelectorAll('.swipe-carousel:not([style*="display: contents"])'),
      ...document.querySelectorAll('.swipe-carousel-inner')
    ];

    carousels.forEach(carousel => {
      const cards = [...carousel.children].filter(el => el.tagName !== 'STYLE');
      if (cards.length <= 1) return;

      // Create dots container
      const dotsWrapper = document.createElement('div');
      dotsWrapper.className = 'swipe-carousel-dots';
      cards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'swipe-carousel-dot' + (i === 0 ? ' active' : '');
        dotsWrapper.appendChild(dot);
      });

      // Insert dots after carousel
      carousel.parentNode.insertBefore(dotsWrapper, carousel.nextSibling);

      // Update active dot on scroll
      const dots = dotsWrapper.querySelectorAll('.swipe-carousel-dot');
      carousel.addEventListener('scroll', () => {
        const cardWidth = cards[0].offsetWidth + 16; // gap ~1rem
        const activeIndex = Math.round(carousel.scrollLeft / cardWidth);
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      }, { passive: true });
    });
  }

  initCarouselDots();
});
