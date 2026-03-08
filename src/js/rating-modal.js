// ===== Rating modal =====
import { openModal, closeModal, bindModalClose } from './modal.js';
import { rateExercise } from './api.js';

const EMAIL_REGEX = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

let currentExerciseId = null;
/** Full exercise object stored so we can re-open the exercise modal after rating. */
let currentExercise = null;

/**
 * Initialise rating modal — set up close handlers and form submit.
 * Called once from main.js / page-2.js.
 */
export function initRatingModal() {
  const backdrop = document.getElementById('ratingModalBackdrop');
  if (!backdrop) return;

  bindModalClose(backdrop, 'ratingModalClose', resetForm);

  const form = document.getElementById('ratingForm');
  form?.addEventListener('submit', handleSubmit);
}

/**
 * Open the rating modal for the given exercise.
 * @param {string} exerciseId
 * @param {object} [exercise] - full exercise object; if provided, exercise modal re-opens on success
 */
export function openRatingModal(exerciseId, exercise = null) {
  currentExerciseId = exerciseId;
  currentExercise = exercise;
  resetForm();
  initStarInteraction(); // re-init each open so listeners are clean
  const backdrop = document.getElementById('ratingModalBackdrop');
  openModal(backdrop);
}

// ─── Star interaction ─────────────────────────────────────────────────────────

/**
 * Re-initialises star interaction on every modal open.
 * Clones the fieldset to remove any previously bound listeners (no memory leaks).
 */
function initStarInteraction() {
  const oldFieldset = document.getElementById('ratingStars');
  if (!oldFieldset) return;

  // Clone to wipe old event listeners
  const fieldset = oldFieldset.cloneNode(true);
  oldFieldset.parentNode.replaceChild(fieldset, oldFieldset);

  const labels = Array.from(fieldset.querySelectorAll('.star-label'));

  // Ensure all stars start grey (score already set to 0.0 by resetForm)
  setActiveStars(labels, 0);

  labels.forEach((label, idx) => {
    const starValue = idx + 1; // 1-based

    // Hover preview
    label.addEventListener('mouseenter', () => {
      setHoverStars(labels, starValue);
    });

    // Restore to selected on leave
    label.addEventListener('mouseleave', () => {
      const selected = getSelectedValue(fieldset);
      setActiveStars(labels, selected);
    });

    // Click — select this star
    label.addEventListener('click', () => {
      const input = label.querySelector('.star-input');
      if (input) input.checked = true;
      setActiveStars(labels, starValue);
      updateScore(starValue);
    });
  });

  // Safety: mouseleave from the whole fieldset restores selection
  fieldset.addEventListener('mouseleave', () => {
    const selected = getSelectedValue(fieldset);
    setActiveStars(labels, selected);
  });
}

/** Highlight stars 1..n as active (yellow), rest as inactive (grey). */
function setActiveStars(labels, n) {
  labels.forEach((label, i) => {
    label.classList.remove('star-hover');
    label.classList.toggle('lit', i < n);
  });
}

/** Highlight stars 1..n as hovered (preview), clear active classes. */
function setHoverStars(labels, n) {
  labels.forEach((label, i) => {
    label.classList.remove('lit');
    label.classList.toggle('star-hover', i < n);
  });
}

/** Returns the currently selected star value (1-5), or 0 if none selected. */
function getSelectedValue(fieldset) {
  const checked = fieldset.querySelector('.star-input:checked');
  return checked ? parseInt(checked.value, 10) : 0;
}

/** Update the numeric score display. */
function updateScore(value) {
  const scoreEl = document.getElementById('ratingModalScore');
  if (scoreEl) scoreEl.textContent = `${value}.0`;
}

// ─── Form submit ──────────────────────────────────────────────────────────────

/** Validate and submit the rating form. */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const fieldset = document.getElementById('ratingStars');
  const rateInput = fieldset?.querySelector('.star-input:checked');
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
    // Re-open exercise modal per spec
    if (currentExercise) {
      const { openExerciseModal } = await import('./exercise-modal.js');
      openExerciseModal(currentExercise);
    }
  } catch (err) {
    console.error('Rating error:', err);
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Reset form fields, star highlights, score display and error messages. */
function resetForm() {
  const form = document.getElementById('ratingForm');
  form?.reset();

  // Reset all star visuals
  document.querySelectorAll('#ratingStars .star-label').forEach(l => {
    l.classList.remove('lit', 'star-hover');
  });

  // Reset score to 0.0
  const scoreEl = document.getElementById('ratingModalScore');
  if (scoreEl) scoreEl.textContent = '0.0';

  // Clear errors
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