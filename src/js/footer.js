// ===== Footer — email subscription + copyright year =====
import { subscribe } from './api.js';

const EMAIL_REGEX = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

/** Initialise footer: subscription form and dynamic year. */
export function initFooter() {
  // Set current year in copyright line
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Subscription form
  const form = document.getElementById('subscribeForm');
  form?.addEventListener('submit', handleSubscribe);
}

async function handleSubscribe(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const msgEl = document.getElementById('subscribeMsg');
  const btn = form.querySelector('.subscribe-btn');

  // Client-side email validation
  if (!EMAIL_REGEX.test(email)) {
    if (msgEl) {
      msgEl.textContent = 'Please enter a valid email address.';
      msgEl.classList.add('error');
    }
    return;
  }

  btn.disabled = true;
  btn.textContent = '…';

  try {
    await subscribe(email);
    form.reset();
    if (msgEl) {
      msgEl.textContent = 'You are subscribed! Thank you.';
      msgEl.classList.remove('error');
    }
    // Clear success message after 5 s
    setTimeout(() => { if (msgEl) msgEl.textContent = ''; }, 5000);
  } catch (err) {
    console.error('Subscription error:', err);
    if (msgEl) {
      // 409 = already subscribed
      msgEl.textContent = err.message.includes('409')
        ? 'This email is already subscribed.'
        : 'Something went wrong. Please try again.';
      msgEl.classList.add('error');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send';
  }
}
