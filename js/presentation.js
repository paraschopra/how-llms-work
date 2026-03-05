/* ============================================
   HOW LLMs WORK — Presentation Engine
   Navigation: Right arrow advances steps then slides
   Left arrow goes back through steps then slides
   F key toggles fullscreen
   ============================================ */

(function () {
  'use strict';

  let currentSlide = 0;
  let currentStep = 0;
  let slides = [];
  let totalSlides = 0;

  // --- Initialize ---
  function init() {
    slides = Array.from(document.querySelectorAll('.slide'));
    totalSlides = slides.length;
    if (totalSlides === 0) return;

    // Check URL hash for initial slide/step (e.g., #slide=3&step=2)
    let initSlide = 0, initStep = 0;
    const hash = window.location.hash.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      if (params.has('slide')) initSlide = Math.max(0, Math.min(parseInt(params.get('slide')) || 0, totalSlides - 1));
      if (params.has('step')) initStep = parseInt(params.get('step')) || 0;
    }

    // Show initial slide
    showSlide(initSlide, initStep);
    updateUI();

    // Hide nav hint after 4 seconds
    const hint = document.querySelector('.nav-hint');
    if (hint) {
      setTimeout(() => hint.classList.add('hidden'), 4000);
    }
  }

  // --- Get animation steps for a slide ---
  function getSteps(slideEl) {
    return Array.from(slideEl.querySelectorAll(':scope > .slide-content .anim-step, :scope > .anim-step, :scope .slide-text .anim-step, :scope .slide-visual .anim-step'));
  }

  // Deduplicate steps (avoid nested duplicates)
  function getUniqueSteps(slideEl) {
    const allSteps = slideEl.querySelectorAll('.anim-step');
    // Filter out steps that are children of other anim-steps
    return Array.from(allSteps).filter(step => {
      let parent = step.parentElement;
      while (parent && parent !== slideEl) {
        if (parent.classList && parent.classList.contains('anim-step')) {
          return false; // This step is nested inside another anim-step
        }
        parent = parent.parentElement;
      }
      return true;
    });
  }

  // --- Show a specific slide at a specific step ---
  function showSlide(index, step) {
    if (index < 0 || index >= totalSlides) return;

    // Hide all slides
    slides.forEach(s => s.classList.remove('active'));

    // Show target slide
    slides[index].classList.add('active');
    currentSlide = index;

    // Handle animation steps
    const steps = getUniqueSteps(slides[index]);
    steps.forEach((s, i) => {
      if (i < step) {
        s.classList.add('visible');
      } else {
        s.classList.remove('visible');
      }
    });
    currentStep = step;

    updateUI();
  }

  // --- Advance (right arrow) ---
  function advance() {
    const steps = getUniqueSteps(slides[currentSlide]);

    if (currentStep < steps.length) {
      // Reveal next animation step
      steps[currentStep].classList.add('visible');
      currentStep++;
      updateUI();
    } else if (currentSlide < totalSlides - 1) {
      // Move to next slide
      showSlide(currentSlide + 1, 0);
    }
  }

  // --- Go back (left arrow) ---
  function goBack() {
    if (currentStep > 0) {
      // Hide current animation step
      currentStep--;
      const steps = getUniqueSteps(slides[currentSlide]);
      steps[currentStep].classList.remove('visible');
      updateUI();
    } else if (currentSlide > 0) {
      // Go to previous slide, show all steps
      const prevSteps = getUniqueSteps(slides[currentSlide - 1]);
      showSlide(currentSlide - 1, prevSteps.length);
    }
  }

  // --- Update progress bar, counter, step indicator ---
  function updateUI() {
    // Progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      const steps = getUniqueSteps(slides[currentSlide]);
      const totalStepsAllSlides = slides.reduce((sum, s) => sum + getUniqueSteps(s).length + 1, 0);
      let completedSteps = 0;
      for (let i = 0; i < currentSlide; i++) {
        completedSteps += getUniqueSteps(slides[i]).length + 1;
      }
      completedSteps += currentStep;
      const progress = (completedSteps / totalStepsAllSlides) * 100;
      progressBar.style.width = progress + '%';
    }

    // Slide counter
    const counter = document.querySelector('.slide-counter');
    if (counter) {
      counter.textContent = (currentSlide + 1) + ' / ' + totalSlides;
    }

    // Step indicator dots
    const stepIndicator = document.querySelector('.step-indicator');
    if (stepIndicator) {
      const steps = getUniqueSteps(slides[currentSlide]);
      if (steps.length > 0) {
        stepIndicator.innerHTML = '';
        for (let i = 0; i < steps.length; i++) {
          const dot = document.createElement('div');
          dot.className = 'dot' + (i < currentStep ? ' active' : '');
          stepIndicator.appendChild(dot);
        }
        stepIndicator.style.display = 'flex';
      } else {
        stepIndicator.style.display = 'none';
      }
    }
  }

  // --- Toggle fullscreen ---
  function toggleFullscreen() {
    const el = document.querySelector('.presentation');
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen).call(document);
    }
  }

  // --- Keyboard events ---
  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        advance();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goBack();
        break;
      case 'f':
      case 'F':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          toggleFullscreen();
        }
        break;
      case 'Home':
        e.preventDefault();
        showSlide(0, 0);
        break;
      case 'End':
        e.preventDefault();
        const lastSteps = getUniqueSteps(slides[totalSlides - 1]);
        showSlide(totalSlides - 1, lastSteps.length);
        break;
    }
  });

  // --- Touch support ---
  let touchStartX = 0;
  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) advance();
      else goBack();
    }
  }, { passive: true });

  // --- Public API (for screenshot script) ---
  window.presentationAPI = {
    advance: advance,
    goBack: goBack,
    showSlide: showSlide,
    getCurrentSlide: () => currentSlide,
    getCurrentStep: () => currentStep,
    getTotalSlides: () => totalSlides,
    getStepCount: (slideIndex) => getUniqueSteps(slides[slideIndex]).length,
    getAllStepCounts: () => slides.map(s => getUniqueSteps(s).length),
  };

  // --- Init on DOM ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
