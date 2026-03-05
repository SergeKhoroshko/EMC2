// ===== Rating modal =====
import { openModal, closeModal, bindModalClose } from './modal.js';
import { rateExercise } from './api.js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

let currentExerciseId = null;

/**
 * Initialise rating modal — set up close handlers and star interaction.
 * Called once from main.js / page-2.js.
 */
export function initRatingModal() {
  const backdrop = document.getElementById('ratingModalBackdrop');
  if (!backdrop) return;

  bindModalClose(backdrop, 'ratingModalClose', resetForm);

  initStarInteraction();

  const form = document.getElementById('ratingForm');
  form?.addEventListener('submit', handleSubmit);
}

/**
 * Open the rating modal for the given exercise id.
 * @param {string} exerciseId
 */
export function openRatingModal(exerciseId) {
  currentExerciseId = exerciseId;
  resetForm();
  const backdrop = document.getElementById('ratingModalBackdrop');
  openModal(backdrop);
}

// ─── Internals ────────────────────────────────────────────────────────────────

/** Make the 5 star buttons interactive (highlight on hover/select, update score). */
function initStarInteraction() {
  const labels = [...document.querySelectorAll('#ratingStars .star-label')];

  labels.forEach((label, idx) => {
    const input = label.querySelector('.star-input');

    // On radio change (click), permanently highlight stars and update score
    input?.addEventListener('change', () => {
      highlightStars(idx, labels);
      updateScore(idx + 1);
    });

    // On hover, preview highlight
    label.addEventListener('mouseenter', () => highlightStars(idx, labels));

    // On leave, restore to the currently selected radio value
    label.addEventListener('mouseleave', () => {
      const checkedIdx = labels.findIndex(l => l.querySelector('.star-input:checked'));
      highlightStars(checkedIdx, labels);
    });
  });
}

/** Update the numeric score display in the rating modal header. */
function updateScore(value) {
  const scoreEl = document.getElementById('ratingModalScore');
  if (scoreEl) scoreEl.textContent = `${value}.0`;
}

/**
 * Light up stars from index 0 up to and including `idx`.
 * Stars are in DOM order: index 0 = star 1 (lowest), index 4 = star 5 (highest).
 * @param {number} idx - 0-based index of the selected/hovered star (-1 clears all)
 * @param {HTMLElement[]} labels - all star label elements
 */
function highlightStars(idx, labels) {
  labels.forEach((label, i) => {
    label.classList.toggle('lit', i <= idx);
  });
}

/** Validate and submit the rating form. */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const rateInput = form.querySelector('.star-input:checked');
  const errorEl = document.getElementById('ratingEmailError');

  // Validate email
  if (!EMAIL_REGEX.test(email)) {
    form.querySelector('#ratingEmail').classList.add('invalid');
    if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
    return;
  }
  form.querySelector('#ratingEmail').classList.remove('invalid');
  if (errorEl) errorEl.textContent = '';

  // Validate rating selected
  if (!rateInput) {
    alert('Please select a star rating.');
    return;
  }

  const body = {
    rate: Number(rateInput.value),
    email,
    review: form.review?.value?.trim() || undefined,
  };

  const submitBtn = form.querySelector('.rating-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    await rateExercise(currentExerciseId, body);
    const backdrop = document.getElementById('ratingModalBackdrop');
    closeModal(backdrop);
    resetForm();
    showToast('Thank you for your rating!');
  } catch (err) {
    console.error('Rating error:', err);
    // 409 = email already used for this exercise
    if (err.message.includes('409')) {
      if (errorEl) errorEl.textContent = 'You have already rated this exercise with this email.';
    } else {
      alert('Failed to submit rating. Please try again.');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send';
  }
}

/** Reset form fields and star highlights. */
function resetForm() {
  const form = document.getElementById('ratingForm');
  form?.reset();
  document.querySelectorAll('#ratingStars .star-label').forEach(l => l.classList.remove('lit'));
  const errorEl = document.getElementById('ratingEmailError');
  if (errorEl) errorEl.textContent = '';
  form?.querySelector('#ratingEmail')?.classList.remove('invalid');
}

/** Show a brief toast notification. */
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--color-accent)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: '9999',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    transition: 'opacity 0.3s ease',
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}
