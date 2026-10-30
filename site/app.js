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

window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

// Erschwert einfaches Auslesen, ist kein vollstaendiger Spamschutz.
const mailbox = ['mail', 'hannes-pauli', 'de'];
const emailAddress = () => `${mailbox[0]}@${mailbox[1]}.${mailbox[2]}`;
const revealEmail = document.querySelector('[data-reveal-email]');
const copyEmail = document.querySelector('[data-copy-email]');

revealEmail?.addEventListener('click', () => {
  const details = document.querySelector('#email-details');
  const link = document.createElement('a');
  link.className = 'email-link';
  link.href = `mailto:${emailAddress()}?subject=${encodeURIComponent('Anfrage zu Embedded Systems Development')}`;
  link.append(document.createTextNode(emailAddress() + ' '));
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  link.append(arrow);
  details.append(link);
  details.hidden = false;
  revealEmail.hidden = true;
  copyEmail.hidden = false;
  document.querySelector('.copy-feedback').textContent = 'E-Mail-Adresse eingeblendet.';
  link.focus();
});

copyEmail?.addEventListener('click', async () => {
  const feedback = document.querySelector('.copy-feedback');
  try {
    await navigator.clipboard.writeText(emailAddress());
    feedback.textContent = 'E-Mail-Adresse kopiert.';
  } catch {
    feedback.textContent = `Bitte kopieren Sie die Adresse direkt: ${emailAddress()}`;
  }
});

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = contactForm.querySelector('[type="submit"]');
  const status = contactForm.querySelector('.form-status');
  if (submit.disabled) return;
  submit.disabled = true;
  status.textContent = 'Ihre Anfrage wird übertragen.';
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Accept': 'application/json' },
      body: new URLSearchParams(new FormData(contactForm)),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errors = Array.isArray(result.errors) ? result.errors.map((error) => error.message).filter(Boolean).join(' ') : '';
      status.textContent = errors || result.error || 'Die Anfrage konnte nicht übertragen werden. Bitte versuchen Sie es erneut.';
      return;
    }
    contactForm.reset();
    status.textContent = 'Vielen Dank. Ihre Anfrage wurde übermittelt.';
  } catch {
    status.textContent = 'Die Verbindung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut oder nutzen Sie die E-Mail-Adresse.';
  } finally {
    window.clearTimeout(timeout);
    submit.disabled = false;
  }
});
