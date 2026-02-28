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
  grid.innerHTML = favorites.map(ex => `
    <li class="exercise-card">
      <div class="exercise-card-top">
        <span class="exercise-card-badge">Workout</span>
        <span class="exercise-card-rating">
          ${Number(ex.rating ?? 0).toFixed(1)}
          <svg class="exercise-card-star" width="14" height="14" aria-hidden="true">
            <use href="./img/sprite.svg#icon-star"></use>
          </svg>
        </span>
      </div>
      <h3 class="exercise-card-name">${escHtml(ex.name)}</h3>
      <div class="exercise-card-meta">
        <div class="exercise-card-meta-item">
          <span class="exercise-card-meta-label">Body part</span>
          <span class="exercise-card-meta-val">${escHtml(ex.bodyPart ?? '—')}</span>
        </div>
        <div class="exercise-card-meta-item">
          <span class="exercise-card-meta-label">Target</span>
          <span class="exercise-card-meta-val">${escHtml(ex.target ?? '—')}</span>
        </div>
      </div>
      <div class="exercise-card-bottom">
        <div class="exercise-card-stats">
          <span class="exercise-card-stat">
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-fire"></use></svg>
            ${ex.burnedCalories ?? 0} kcal
          </span>
          <span class="exercise-card-stat">
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-clock"></use></svg>
            ${ex.time ?? 0} min
          </span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="exercise-card-remove" data-remove="${escHtml(ex._id)}"
            type="button" aria-label="Remove ${escHtml(ex.name)} from favorites">
            <svg width="16" height="16" aria-hidden="true"><use href="./img/sprite.svg#icon-trash"></use></svg>
          </button>
          <button class="exercise-card-start" data-id="${escHtml(ex._id)}" type="button"
            aria-label="View details of ${escHtml(ex.name)}">
            Start
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-right"></use></svg>
          </button>
        </div>
      </div>
    </li>
  `).join('');

  // Build id→exercise map for quick access
  const map = new Map(favorites.map(ex => [ex._id, ex]));

  // Remove buttons
  grid.querySelectorAll('.exercise-card-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFavorite(btn.dataset.remove);
      renderFavorites(); // re-render after removal
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
