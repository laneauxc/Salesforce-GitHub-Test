// Dark mode initialization script
// This should be included in the head of all pages to prevent flash
(function() {
  try {
    const stored = localStorage.getItem('salesforce-github-test-data');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.settings && data.settings.darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  } catch (e) {
    console.error('Error initializing dark mode:', e);
  }
})();
