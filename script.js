// Autopsy & HxD Setup Interactive Script

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initProgressTracker();
  initTabs();
  initCopyButtons();
});

/* Theme Management */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  if (sunIcon && moonIcon) {
    if (theme === 'dark') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }
}

/* Progress Tracker & Step Checkboxes */
function initProgressTracker() {
  const checkboxes = document.querySelectorAll('.step-checkbox');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const completedCountEl = document.getElementById('completed-count');
  const totalCountEl = document.getElementById('total-count');
  const resetBtn = document.getElementById('reset-progress');

  const totalSteps = checkboxes.length;
  if (totalCountEl) totalCountEl.textContent = totalSteps;

  // Load saved state
  const savedState = JSON.parse(localStorage.getItem('autopsy_setup_progress') || '{}');
  
  checkboxes.forEach((cb) => {
    const stepId = cb.dataset.stepId;
    if (savedState[stepId]) {
      cb.checked = true;
      cb.closest('.step-item')?.classList.add('completed');
    }

    cb.addEventListener('change', () => {
      savedState[stepId] = cb.checked;
      localStorage.setItem('autopsy_setup_progress', JSON.stringify(savedState));
      
      const stepItem = cb.closest('.step-item');
      if (cb.checked) {
        stepItem?.classList.add('completed');
      } else {
        stepItem?.classList.remove('completed');
      }
      
      updateProgressDisplay();
    });
  });

  function updateProgressDisplay() {
    const completedSteps = document.querySelectorAll('.step-checkbox:checked').length;
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    if (completedCountEl) completedCountEl.textContent = completedSteps;
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      checkboxes.forEach((cb) => {
        cb.checked = false;
        cb.closest('.step-item')?.classList.remove('completed');
      });
      localStorage.removeItem('autopsy_setup_progress');
      updateProgressDisplay();
    });
  }

  updateProgressDisplay();
}

/* Tab Switching */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.guide-section');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      sections.forEach((sec) => {
        if (target === 'all' || sec.id === target) {
          sec.classList.remove('hidden');
          sec.classList.add('animate-fade-in');
        } else {
          sec.classList.add('hidden');
          sec.classList.remove('animate-fade-in');
        }
      });
    });
  });
}

/* Copy to Clipboard */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.dataset.copyText;
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg class="w-4 h-4 text-emerald-500 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-xs text-emerald-500 font-medium">Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    });
  });
}
