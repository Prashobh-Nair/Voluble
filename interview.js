// GetVouble - Interview Practice Interactive Module

document.addEventListener('DOMContentLoaded', () => {

  // 1. Fold 2: Choose Your Interview Card Selection & Configurator Handler
  const interviewCards = document.querySelectorAll('.interview-type-card');
  const configPanel = document.getElementById('interviewConfigPanel');
  const configTypeBadge = document.getElementById('configTypeBadge');
  const configForm = document.getElementById('interviewConfigForm');
  const jobRoleInput = document.getElementById('interviewJobRole');
  const companyInput = document.getElementById('interviewCompany');
  const experienceSelect = document.getElementById('interviewExperience');

  let selectedInterviewType = 'Fresher Interview';

  interviewCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      interviewCards.forEach(c => c.classList.remove('selected'));
      
      // Select clicked card
      card.classList.add('selected');
      selectedInterviewType = card.getAttribute('data-type') || 'Fresher Interview';

      // Pre-fill default suggestions based on selection type
      if (selectedInterviewType === 'Fresher Interview') {
        if (jobRoleInput) jobRoleInput.placeholder = 'e.g. Graduate Trainee / Junior Associate';
        if (experienceSelect) experienceSelect.value = 'Fresher';
      } else if (selectedInterviewType === 'Technical Interview') {
        if (jobRoleInput) jobRoleInput.placeholder = 'e.g. Software Engineer / Data Analyst';
        if (experienceSelect) experienceSelect.value = '1–3 Years';
      } else if (selectedInterviewType === 'HR Interview') {
        if (jobRoleInput) jobRoleInput.placeholder = 'e.g. Operations Executive / Manager';
        if (experienceSelect) experienceSelect.value = '0–1 Years';
      } else if (selectedInterviewType === 'Company-Specific Interview') {
        if (jobRoleInput) jobRoleInput.placeholder = 'e.g. Frontend Developer';
        if (companyInput) companyInput.placeholder = 'e.g. Google, TCS, Infosys, Wipro';
      }

      // Update badge text in config panel
      if (configTypeBadge) {
        configTypeBadge.textContent = selectedInterviewType;
      }

      // Show configuration panel with smooth scroll
      if (configPanel) {
        configPanel.classList.add('active');
        configPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Handle Interview Generation & Google Sheets Integration
  if (configForm) {
    configForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const candidateNameInput = document.getElementById('interviewCandidateName');
      const candidateEmailInput = document.getElementById('interviewCandidateEmail');
      const candidatePhoneInput = document.getElementById('interviewCandidatePhone');
      const countryCodeSelect = document.getElementById('interviewCountryCode');

      const name = candidateNameInput ? candidateNameInput.value.trim() : '';
      const email = candidateEmailInput ? candidateEmailInput.value.trim() : '';
      const phone = candidatePhoneInput ? candidatePhoneInput.value.trim() : '';
      const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';

      const role = jobRoleInput ? jobRoleInput.value.trim() || 'Software Developer' : 'Software Developer';
      const company = companyInput ? companyInput.value.trim() || 'Target Company' : 'Target Company';
      const experience = experienceSelect ? experienceSelect.value : 'Fresher';
      const difficultySelect = document.getElementById('interviewDifficulty');
      const difficulty = difficultySelect ? difficultySelect.value : 'Intermediate';
      const jdInput = document.getElementById('interviewJD');
      const jd = jdInput ? jdInput.value.trim() : '';

      // Send Data to Google Sheets Webhook (Targeting the 'Interview' sheet tab)
      const payload = {
        sheet: 'Interview',
        timestamp: new Date().toLocaleString(),
        name: name,
        email: email,
        phone: phone,
        countryCode: countryCode,
        interviewType: selectedInterviewType || 'Fresher Interview',
        jobRole: role,
        company: company,
        experience: experience,
        difficulty: difficulty,
        jobDescription: jd,
        role: `Job Role: ${role} (${company})`,
        goal: `Track: ${selectedInterviewType} | JD: ${jd || 'None'}`
      };

      if (typeof window.sendToGoogleSheets === 'function') {
        window.sendToGoogleSheets(payload);
      } else {
        console.log('Google Sheets Payload:', payload);
      }

      // Visual button feedback
      const submitBtn = configForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const origText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering for Access...';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = origText;
        }, 1500);
      }

      // Update Fold 3 Coach Question dynamically!
      const coachQuestionEl = document.getElementById('coachQuestionText');
      if (coachQuestionEl) {
        coachQuestionEl.textContent = `"Tell me about yourself and why you're interested in the ${role} position at ${company}."`;
      }

      // Smooth scroll to Fold 3
      const fold3 = document.getElementById('fold-3-coach');
      if (fold3) {
        fold3.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // 2. Fold 3: AI Interview Coach Voice Simulator Engine
  const voiceMicBtn = document.getElementById('voiceMicBtn');
  const coachWaveform = document.getElementById('coachWaveform');
  const coachTimer = document.getElementById('coachTimer');
  const coachQuestionText = document.getElementById('coachQuestionText');
  const coachQuestionNum = document.getElementById('coachQuestionNum');
  const coachProgressBar = document.getElementById('coachProgressBar');
  const aiFeedbackText = document.getElementById('aiFeedbackText');
  const btnTryAgain = document.getElementById('btnTryAgain');
  const btnNextQuestion = document.getElementById('btnNextQuestion');

  // Performance metrics elements
  const metricQuality = document.getElementById('metricQuality');
  const metricQualityBar = document.getElementById('metricQualityBar');
  const metricComm = document.getElementById('metricComm');
  const metricCommBar = document.getElementById('metricCommBar');
  const metricConf = document.getElementById('metricConf');
  const metricConfBar = document.getElementById('metricConfBar');
  const metricRel = document.getElementById('metricRel');
  const metricRelBar = document.getElementById('metricRelBar');
  const metricFillers = document.getElementById('metricFillers');
  const metricSpeed = document.getElementById('metricSpeed');

  const practiceScenarios = [
    {
      num: "01 / 10",
      progress: "10%",
      question: "Tell me about yourself and why you're interested in this role.",
      feedback: "Your introduction was structured well and covered your background clearly. To sound even more impressive, highlight your #1 technical accomplishment within the first 30 seconds.",
      quality: "82%",
      comm: "78%",
      conf: "74%",
      rel: "91%",
      fillers: "12",
      speed: "Fast"
    },
    {
      num: "02 / 10",
      progress: "20%",
      question: "Describe a situation where you faced a tough challenge and how you solved it.",
      feedback: "Excellent structure using the STAR method! Your resolution was clear. Try taking a slight pause before answering to show thoughtful composure.",
      quality: "88%",
      comm: "85%",
      conf: "82%",
      rel: "94%",
      fillers: "5",
      speed: "Optimal"
    },
    {
      num: "03 / 10",
      progress: "30%",
      question: "Where do you see yourself professionally in the next 3 to 5 years?",
      feedback: "Very inspiring vision! Connect your future goals explicitly with the long-term growth opportunities of this organization.",
      quality: "92%",
      comm: "90%",
      conf: "89%",
      rel: "95%",
      fillers: "3",
      speed: "Optimal"
    }
  ];

  let currentQuestionIndex = 0;
  let coachState = 'idle'; // 'idle' | 'listening' | 'processing'
  let timerInterval = null;
  let secondsElapsed = 0;

  function startTimer() {
    secondsElapsed = 0;
    if (coachTimer) coachTimer.textContent = "00:00";
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsElapsed++;
      const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
      const secs = String(secondsElapsed % 60).padStart(2, '0');
      if (coachTimer) coachTimer.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  if (voiceMicBtn) {
    voiceMicBtn.addEventListener('click', () => {
      if (coachState === 'idle') {
        // Transition to Listening state
        coachState = 'listening';
        voiceMicBtn.className = 'voice-control-btn listening';
        voiceMicBtn.innerHTML = `
          <span class="live-dot" style="background:#EF4444;"></span>
          <span>Listening... (Click when finished)</span>
        `;
        if (coachWaveform) coachWaveform.style.opacity = '1';
        startTimer();

      } else if (coachState === 'listening') {
        // Transition to Processing state
        coachState = 'processing';
        stopTimer();
        voiceMicBtn.className = 'voice-control-btn processing';
        voiceMicBtn.innerHTML = `
          <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <span>Analyzing your answer...</span>
        `;
        if (coachWaveform) coachWaveform.style.opacity = '0.4';

        // Simulate AI analysis latency
        setTimeout(() => {
          coachState = 'idle';
          voiceMicBtn.className = 'voice-control-btn idle';
          voiceMicBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            <span>🎙 Record Answer Again</span>
          `;
          if (coachWaveform) coachWaveform.style.opacity = '0';

          // Apply scenario metrics
          updateScenarioDisplay();
        }, 1200);
      }
    });
  }

  function updateScenarioDisplay() {
    const sc = practiceScenarios[currentQuestionIndex];
    if (coachQuestionNum) coachQuestionNum.textContent = `Question ${sc.num}`;
    if (coachProgressBar) coachProgressBar.style.width = sc.progress;
    if (aiFeedbackText) aiFeedbackText.textContent = sc.feedback;

    if (metricQuality) metricQuality.textContent = sc.quality;
    if (metricQualityBar) metricQualityBar.style.width = sc.quality;

    if (metricComm) metricComm.textContent = sc.comm;
    if (metricCommBar) metricCommBar.style.width = sc.comm;

    if (metricConf) metricConf.textContent = sc.conf;
    if (metricConfBar) metricConfBar.style.width = sc.conf;

    if (metricRel) metricRel.textContent = sc.rel;
    if (metricRelBar) metricRelBar.style.width = sc.rel;

    if (metricFillers) metricFillers.textContent = sc.fillers;
    if (metricSpeed) metricSpeed.textContent = sc.speed;
  }

  if (btnNextQuestion) {
    btnNextQuestion.addEventListener('click', () => {
      currentQuestionIndex = (currentQuestionIndex + 1) % practiceScenarios.length;
      const sc = practiceScenarios[currentQuestionIndex];
      if (coachQuestionText) coachQuestionText.textContent = `"${sc.question}"`;
      updateScenarioDisplay();
      if (coachTimer) coachTimer.textContent = "00:00";
    });
  }

  if (btnTryAgain) {
    btnTryAgain.addEventListener('click', () => {
      if (voiceMicBtn) voiceMicBtn.click();
    });
  }

  // 3. Fold 4: Intersection Observer Animations for Readiness Meters & Charts
  const fold4Section = document.getElementById('fold-4-readiness');
  const circleFill = document.querySelector('.circle-fill');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const trendPillars = document.querySelectorAll('.trend-bar-pillar');

  if ('IntersectionObserver' in window && fold4Section) {
    const readinessObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate circular meter (84% readiness => strokeDashoffset = 100 - 84 = 16)
          if (circleFill) {
            circleFill.style.strokeDashoffset = '16';
          }

          // Animate Skill Breakdown Progress Bars
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width') || '80%';
            bar.style.width = targetWidth;
          });

          // Animate Trend Chart Pillars
          trendPillars.forEach(pillar => {
            const targetHeight = pillar.getAttribute('data-height') || '50%';
            pillar.style.height = targetHeight;
          });

          readinessObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    readinessObserver.observe(fold4Section);
  }

  // "Practice Confidence" CTA scroll back handler
  const btnPracticeConfidence = document.getElementById('btnPracticeConfidence');
  if (btnPracticeConfidence) {
    btnPracticeConfidence.addEventListener('click', () => {
      const HRCard = document.querySelector('.interview-type-card[data-type="HR Interview"]');
      if (HRCard) HRCard.click();
    });
  }

});
