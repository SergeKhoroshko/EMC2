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
          <span class="exercise-card-badge">Workout</span>
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
      <!-- Row 2: runner icon + exercise name -->
      <div class="exercise-card-title-row">
        <svg class="exercise-card-runner" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="11" cy="3.5" r="1.5" fill="currentColor"/>
          <path d="M8 6.5l-2 5h2l1-3 2 2v4h2v-5l-2-2 1-2h3v-2h-4l-1.5 2.5L8 6.5z" fill="currentColor"/>
        </svg>
        <h3 class="exercise-card-name">${escHtml(ex.name)}</h3>
      </div>
      <!-- Row 3: inline meta info -->
      <p class="exercise-card-meta-row">
        Burned calories: ${ex.burnedCalories ?? 0} / ${ex.time ?? 0} min
        <span class="exercise-card-meta-sep">|</span>
        Body part: ${escHtml(ex.bodyPart ?? '—')}
        <span class="exercise-card-meta-sep">|</span>
        Target: ${escHtml(ex.target ?? '—')}
      </p>
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
