(() => {
  const storageKey = 'hp-color-mode';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const validMode = value => ['system', 'dark', 'light'].includes(value) ? value : 'system';
  let mode = 'system';

  try {
    mode = validMode(window.localStorage.getItem(storageKey));
  } catch {
    // Die Auswahl bleibt auch ohne Browser-Speicher bedienbar.
  }

  function updateBrowserColor() {
    const dark = mode === 'dark' || (mode === 'system' && systemTheme.matches);
    const color = dark ? '#101010' : '#f8f8f5';
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = color;
    });
  }

  function applyMode(value, persist = false) {
    mode = validMode(value);
    document.documentElement.dataset.theme = mode;
    document.querySelectorAll('[data-theme-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeMode === mode));
    });
    updateBrowserColor();

    if (persist) {
      try {
        if (mode === 'system') window.localStorage.removeItem(storageKey);
        else window.localStorage.setItem(storageKey, mode);
      } catch {
        // Bei gesperrtem Speicher gilt die Auswahl fuer diese Seite.
      }
    }
  }

  // Vor dem Laden der Styles ausfuehren, um einen Farbwechsel beim Start zu vermeiden.
  applyMode(mode);

  function bindControls() {
    document.querySelectorAll('[data-theme-mode]').forEach(button => {
      button.addEventListener('click', () => {
        applyMode(button.dataset.themeMode, true);
        const picker = button.closest('.theme-control');
        picker.open = false;
        picker.querySelector('summary').focus();
      });
    });
    applyMode(mode);
    document.querySelectorAll('.theme-control').forEach(control => {
      control.hidden = false;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindControls, { once: true });
  } else {
    bindControls();
  }

  function handleSystemThemeChange() {
    if (mode === 'system') updateBrowserColor();
  }

  if (typeof systemTheme.addEventListener === 'function') {
    systemTheme.addEventListener('change', handleSystemThemeChange);
  } else if (typeof systemTheme.addListener === 'function') {
    // Aeltere Safari-Versionen verwenden noch diese MediaQueryList-Schnittstelle.
    systemTheme.addListener(handleSystemThemeChange);
  }

  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) applyMode(event.newValue);
  });
})();
