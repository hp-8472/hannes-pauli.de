(() => {
  const storageKey = 'hp-language';
  const url = new URL(window.location.href);
  const validLanguage = value => ['de', 'en'].includes(value) ? value : null;
  const explicitLanguage = validLanguage(url.searchParams.get('lang'));
  let savedLanguage = null;

  try {
    savedLanguage = validLanguage(window.localStorage.getItem(storageKey));
    if (explicitLanguage === document.documentElement.lang) {
      window.localStorage.setItem(storageKey, explicitLanguage);
    }
  } catch {
    // Der Sprachparameter haelt die manuelle Wahl auch ohne Browser-Speicher fest.
  }

  // Nur der deutsche Portfolio-Einstieg waehlt automatisch eine Sprache.
  // Direkte englische Links und die Rechtstexte behalten ihre eigene Sprache.
  if (!document.currentScript.hasAttribute('data-language-entry')) return;

  const browserLanguage = navigator.languages?.[0] || navigator.language || '';
  const browserDefault = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(browserLanguage)
    && !/^de(?:-|$)/i.test(browserLanguage) ? 'en' : 'de';
  const language = explicitLanguage || savedLanguage || browserDefault;

  if (language === 'en') {
    const target = new URL('./en.html', url);
    target.search = url.search;
    target.hash = url.hash;
    window.location.replace(target.href);
  }
})();
