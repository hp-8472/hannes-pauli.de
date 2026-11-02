(() => {
  const pickers = [...document.querySelectorAll('.header-picker')];

  function closePickers(except = null) {
    pickers.forEach(picker => {
      if (picker !== except) picker.open = false;
    });
  }

  pickers.forEach(picker => {
    picker.addEventListener('toggle', () => {
      if (!picker.open) return;
      closePickers(picker);
      document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      document.querySelector('#navigation')?.classList.remove('is-open');
    });
  });

  document.addEventListener('click', event => {
    closePickers(event.target.closest('.header-picker'));
  });

  document.addEventListener('focusin', event => {
    closePickers(event.target.closest('.header-picker'));
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const picker = pickers.find(item => item.open);
    if (!picker) return;
    event.preventDefault();
    picker.open = false;
    picker.querySelector('summary').focus();
  });
})();
