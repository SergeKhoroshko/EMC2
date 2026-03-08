import spriteUrl from './sprite.js';
// ===== Favorites page — render saved exercises from localStorage =====
import { getFavorites, removeFavorite } from './storage.js';
import { openExerciseModal } from './exercise-modal.js';

/** Render the favorites grid. Called on page load and after each removal. */
export function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  const empty = document.getElementById('favoritesEmpty');
  if (!grid || !empty) return;

  const favorites = getFavorites();

  if (favorites.length === 0) {
    grid.innerHTML = '';
    grid.classList.remove('is-exercises');
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.classList.add('is-exercises');

  grid.innerHTML = favorites.map(ex => `
    <li class="exercise-card fav-card">
      <!-- Row 1: WORKOUT badge + trash icon LEFT, Start → RIGHT -->
      <div class="exercise-card-top">
        <div class="exercise-card-top-left">
          <span class="exercise-card-badge">WORKOUT</span>
          <button
            class="fav-card-remove"
            data-remove="${escHtml(ex._id)}"
            type="button"
            aria-label="Remove ${escHtml(ex.name)} from favorites"
          >
            <svg width="16" height="16" aria-hidden="true">
              <use href="${spriteUrl}#icon-trash"></use>
            </svg>
          </button>
        </div>
        <button
          class="exercise-card-start"
          data-id="${escHtml(ex._id)}"
          type="button"
          aria-label="View details of ${escHtml(ex.name)}"
        >
          Start &rarr;
        </button>
      </div>

      <!-- Row 2: runner icon + exercise name -->
      <div class="fav-card-name-row">
        <svg class="fav-card-icon" width="24" height="24" aria-hidden="true">
          <use href="${spriteUrl}#icon-runner"></use>
        </svg>
        <h3 class="exercise-card-name">${escHtml(ex.name)}</h3>
      </div>

      <!-- Row 3: meta info -->
      <p class="fav-card-meta">
        <span>Burned calories: <strong>${escHtml(String(ex.burnedCalories ?? ex.calories ?? '—'))}</strong> / 3 min</span>
        <span>Body part: <strong>${escHtml(capitalize(ex.bodyPart ?? '—'))}</strong></span>
        <span>Target: <strong>${escHtml(capitalize(ex.target ?? '—'))}</strong></span>
      </p>
    </li>
  `).join('');

  const map = new Map(favorites.map(ex => [ex._id, ex]));

  // Remove buttons
  grid.querySelectorAll('.fav-card-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFavorite(btn.dataset.remove);
      renderFavorites();
    });
  });

  // Start (open modal) buttons
  grid.querySelectorAll('.exercise-card-start').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = map.get(btn.dataset.id);
      if (ex) openExerciseModal(ex);
    });
  });
}

/** Simple HTML escape. */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Capitalize first letter. */
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
