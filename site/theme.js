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
    const color = dark ? '#121715' : '#f7f7f0';
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = color;
    });
  }

  function applyMode(value, persist = false) {
    mode = validMode(value);
    document.documentElement.dataset.theme = mode;
    document.querySelectorAll('[data-theme-select]').forEach(select => {
      select.value = mode;
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

  function bindSelects() {
    document.querySelectorAll('[data-theme-select]').forEach(select => {
      select.value = mode;
      select.addEventListener('change', () => applyMode(select.value, true));
      const control = select.closest('.theme-control');
      if (control) control.hidden = false;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSelects, { once: true });
  } else {
    bindSelects();
  }

  systemTheme.addEventListener('change', () => {
    if (mode === 'system') updateBrowserColor();
  });

  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) applyMode(event.newValue);
  });
})();
