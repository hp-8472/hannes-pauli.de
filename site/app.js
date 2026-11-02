const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  navigation.classList.toggle('is-open', opening);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const desktopLayout = window.matchMedia('(min-width: 1025px)');
if (typeof desktopLayout.addEventListener === 'function') {
  desktopLayout.addEventListener('change', closeMenu);
} else if (typeof desktopLayout.addListener === 'function') {
  desktopLayout.addListener(closeMenu);
}

const messages = document.documentElement.lang === 'en' ? {
  subject: 'Enquiry about Embedded Systems Development',
  fallback: 'If your email app does not open, you can copy the address.',
  copied: 'Email address copied.',
  copyManually: 'Please copy the address directly: '
} : {
  subject: 'Anfrage zu Embedded Systems Development',
  fallback: 'Falls sich kein E-Mail-Programm öffnet, können Sie die Adresse kopieren.',
  copied: 'E-Mail-Adresse kopiert.',
  copyManually: 'Bitte kopieren Sie die Adresse direkt: '
};

// Erschwert einfaches Auslesen, ist kein vollstaendiger Spamschutz.
const mailbox = ['mail', 'hannes-pauli', 'de'];
const emailAddress = () => `${mailbox[0]}@${mailbox[1]}.${mailbox[2]}`;
const emailLink = document.querySelector('[data-email-link]');
const copyEmail = document.querySelector('[data-copy-email]');

if (emailLink) {
  emailLink.href = `mailto:${emailAddress()}?subject=${encodeURIComponent(messages.subject)}`;
  emailLink.addEventListener('click', () => {
    const details = document.querySelector('#email-details');
    details.textContent = emailAddress();
    details.hidden = false;
    copyEmail.hidden = false;
    document.querySelector('.copy-feedback').textContent = messages.fallback;
  });
}

copyEmail?.addEventListener('click', async () => {
  const feedback = document.querySelector('.copy-feedback');
  try {
    await navigator.clipboard.writeText(emailAddress());
    feedback.textContent = messages.copied;
  } catch {
    feedback.textContent = `${messages.copyManually}${emailAddress()}`;
  }
});
