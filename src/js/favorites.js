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
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.classList.add('is-exercises');

  grid.innerHTML = favorites.map(ex => `
    <li class="exercise-card">
      <!-- Row 1: WORKOUT pill + rating LEFT, trash + Start → RIGHT -->
      <div class="exercise-card-top">
        <div class="exercise-card-top-left">
          <span class="exercise-card-rating">
            ${Number(ex.rating ?? 0).toFixed(1)}
            <svg class="exercise-card-star" width="13" height="13" aria-hidden="true">
              <use href="./img/sprite.svg#icon-star"></use>
            </svg>
          </span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="exercise-card-remove" data-remove="${escHtml(ex._id)}"
            type="button" aria-label="Remove ${escHtml(ex.name)} from favorites">
            <svg width="16" height="16" aria-hidden="true"><use href="./img/sprite.svg#icon-trash"></use></svg>
          </button>
          <button class="exercise-card-start" data-id="${escHtml(ex._id)}" type="button"
            aria-label="View ${escHtml(ex.name)}">
            Start &rarr;
          </button>
        </div>
      </div>
      <!-- Row 2: name first, category below -->
      <div class="exercise-card-body">
        <h3 class="exercise-card-name">${escHtml(ex.name)}</h3>
        <p class="exercise-card-category">${escHtml(ex.bodyPart || ex.target || '')}</p>
      </div>
    </li>
  `).join('');

  const map = new Map(favorites.map(ex => [ex._id, ex]));

  // Remove buttons
  grid.querySelectorAll('.exercise-card-remove').forEach(btn => {
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
