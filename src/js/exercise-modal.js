// ===== Exercise detail modal =====
import { openModal, closeModal, bindModalClose } from './modal.js';
import { openRatingModal } from './rating-modal.js';
import { addFavorite, removeFavorite, isFavorite } from './storage.js';

let currentExercise = null;
/** Callback invoked after favorites change (so cards list can refresh). */
let onFavoritesChange = null;

/**
 * Initialise the exercise modal — wire up close, rate, and favorite handlers.
 * @param {function} [favChangeCallback] - called when favorites are modified
 * @param {boolean} [isFavoritesPage] - if true, the fav button removes instead of adds
 */
export function initExerciseModal(favChangeCallback, isFavoritesPage = false) {
  onFavoritesChange = favChangeCallback;

  const backdrop = document.getElementById('exerciseModalBackdrop');
  if (!backdrop) return;

  bindModalClose(backdrop, 'exerciseModalClose');

  // Give a rating button — close exercise modal first, then open rating
  document.getElementById('exModalRateBtn')?.addEventListener('click', () => {
    if (!currentExercise) return;
    const exerciseBackdrop = document.getElementById('exerciseModalBackdrop');
    closeModal(exerciseBackdrop);
    openRatingModal(currentExercise._id, currentExercise);
  });

  // Add / remove favorites button
  document.getElementById('exModalFavBtn')?.addEventListener('click', () => {
    if (!currentExercise) return;
    toggleFavorite(isFavoritesPage);
  });
}

/**
 * Open the exercise modal and populate it with exercise data.
 * @param {object} exercise - exercise object from the API
 */
export function openExerciseModal(exercise) {
  currentExercise = exercise;
  populateModal(exercise);
  const backdrop = document.getElementById('exerciseModalBackdrop');
  openModal(backdrop);
}

// ─── Internals ────────────────────────────────────────────────────────────────

/** Fill all modal fields with data from the exercise object. */
function populateModal(ex) {
  setText('exModalTitle', ex.name);
  setText('exModalBodyPart', ex.bodyPart ?? '—');
  setText('exModalTarget', ex.target ?? '—');
  setText('exModalEquipment', ex.equipment ?? '—');
  setText('exModalPopularity', ex.popularity ?? '—');
  setText('exModalCalories', ex.burnedCalories ? `${ex.burnedCalories} kcal / ${ex.time} min` : '—');
  setText('exModalDesc', ex.description ?? '');

  // Rating value + inline star characters
  const rating = ex.rating ?? 0;
  setText('exModalRating', rating.toFixed(1));
  const starsEl = document.getElementById('exModalStars');
  if (starsEl) {
    const filled = Math.round(rating);
    starsEl.textContent = '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }

  const gif = document.getElementById('exModalGif');
  if (gif) {
    gif.src = ex.gifUrl ?? '';
    gif.alt = ex.name ?? 'Exercise animation';
  }

  updateFavButton(ex._id);
}

/** Update the favorites button label, icon, and style based on current state. */
function updateFavButton(id) {
  const btn = document.getElementById('exModalFavBtn');
  if (!btn) return;
  const inFav = isFavorite(id);
  if (inFav) {
    btn.className = 'btn btn-remove';
    btn.innerHTML = `Remove from favorites
      <svg width="16" height="16" aria-hidden="true"><use href="./img/sprite.svg#icon-trash"></use></svg>`;
  } else {
    btn.className = 'btn btn-favorite';
    btn.innerHTML = `Add to favorites
      <svg width="16" height="16" aria-hidden="true"><use href="./img/sprite.svg#icon-heart"></use></svg>`;
  }
}

/** Toggle favorite state for the current exercise. */
function toggleFavorite(isFavoritesPage) {
  if (!currentExercise) return;
  const id = currentExercise._id;

  if (isFavorite(id)) {
    removeFavorite(id);
  } else {
    addFavorite(currentExercise);
  }

  updateFavButton(id);

  // If on favorites page, re-render the grid after removal
  if (isFavoritesPage) {
    const backdrop = document.getElementById('exerciseModalBackdrop');
    closeModal(backdrop);
    onFavoritesChange?.();
  } else {
    onFavoritesChange?.();
  }
}

/** Set textContent of an element by id (safe, no HTML injection). */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
