// ===== Home page — categories, exercises, search, pagination =====
import { fetchFilters, fetchExercises } from './api.js';
import { renderPagination } from './pagination.js';
import { openExerciseModal } from './exercise-modal.js';
import { isFavorite } from './storage.js';

// ─── Shared state ─────────────────────────────────────────────────────────────
const state = {
  filter: 'Muscles',      // active filter tab
  category: null,         // selected category { filter, name } or null
  categoryPage: 1,
  exercisePage: 1,
  keyword: '',
  totalCategoryPages: 0,
  totalExercisePages: 0,
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const cardsGrid = document.getElementById('cardsGrid');
const cardsEmpty = document.getElementById('cardsEmpty');
const workoutControls = document.getElementById('workoutControls');
const workoutBreadcrumb = document.querySelector('.workout-breadcrumb');
const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
const backBtn = document.getElementById('backBtn');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// ─── Public init ──────────────────────────────────────────────────────────────

/** Boot the home-page workout section. */
export async function initHome() {
  // Filter tab clicks
  document.getElementById('filterTabs')?.addEventListener('click', onFilterTabClick);

  // Back button
  backBtn?.addEventListener('click', showCategories);

  // Search form — works with or without a selected category
  searchForm?.addEventListener('submit', e => {
    e.preventDefault();
    const keyword = searchInput?.value.trim() ?? '';
    state.keyword = keyword;
    state.exercisePage = 1;

    if (!keyword) {
      // Empty search: return to the category grid
      showCategories();
      return;
    }

    if (!state.category) {
      // No category selected: show controls but hide the breadcrumb row,
      // then fetch exercises by keyword only (no filter param sent)
      workoutControls.hidden = false;
      showBreadcrumb(false);
    }

    loadExercises();
  });

  // Load initial category grid
  await loadCategories();
}

// ─── Event handlers ──────────────────────────────────────────────────────────

function onFilterTabClick(e) {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;

  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');

  state.filter = tab.dataset.filter;
  state.category = null;
  state.categoryPage = 1;
  state.keyword = '';

  showCategories();
}

// ─── Loaders ─────────────────────────────────────────────────────────────────

/** Load and render category cards for the selected filter. */
async function loadCategories() {
  // Keep workoutControls visible so the search bar stays reachable from the categories view
  showBreadcrumb(false);
  showLoader();

  try {
    const limit = getGridLimit();
    const data = await fetchFilters({
      filter: state.filter,
      page: state.categoryPage,
      limit,
    });

    state.totalCategoryPages = data.totalPages;
    renderCategoryCards(data.results);
    renderPagination({
      currentPage: state.categoryPage,
      totalPages: state.totalCategoryPages,
      onPageChange: page => {
        state.categoryPage = page;
        loadCategories();
        scrollToWorkout();
      },
    });
  } catch (err) {
    console.error('Failed to load categories:', err);
    showError('Could not load categories. Please try again later.');
  }
}

/** Load and render exercise cards for the current state (category and/or keyword). */
async function loadExercises() {
  showLoader();

  try {
    const limit = getGridLimit();

    // Base params: keyword + pagination (no filter required for keyword-only search)
    const params = {
      keyword: state.keyword || undefined,
      page: state.exercisePage,
      limit,
    };

    // Only add the category filter when a category is actually selected
    if (state.category) {
      params[filterToParam(state.filter)] = state.category.name;
    }

    const data = await fetchExercises(params);

    state.totalExercisePages = data.totalPages;

    if (data.results.length === 0) {
      cardsGrid.innerHTML = '';
      cardsEmpty.hidden = false;
    } else {
      cardsEmpty.hidden = true;
      renderExerciseCards(data.results);
    }

    renderPagination({
      currentPage: state.exercisePage,
      totalPages: state.totalExercisePages,
      onPageChange: page => {
        state.exercisePage = page;
        loadExercises();
        scrollToWorkout();
      },
    });
  } catch (err) {
    console.error('Failed to load exercises:', err);
    showError('Could not load exercises. Please try again.');
  }
}

// ─── Renderers ───────────────────────────────────────────────────────────────

/** Render category card list items. */
function renderCategoryCards(results) {
  cardsEmpty.hidden = true;
  cardsGrid.innerHTML = results.map((item, idx) => `
    <li class="category-card" tabindex="0"
        data-name="${escHtml(item.name)}"
        data-filter="${escHtml(item.filter)}"
        role="button"
        aria-label="Filter by ${escHtml(item.name)}">
      ${item.imgURL
        // width/height attributes give the browser an aspect-ratio hint before CSS loads (prevents CLS).
        // The first card is the LCP candidate: skip lazy-loading and boost fetch priority.
        ? `<img class="category-card-img"
               src="${escHtml(item.imgURL)}"
               alt="${escHtml(item.name)}"
               width="640" height="480"
               sizes="(min-width: 1200px) 368px, (min-width: 768px) calc(50vw - 30px), calc(100vw - 32px)"
               ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />`
        : `<div class="category-card-img" style="background:var(--color-surface-2)"></div>`
      }
      <div class="category-card-overlay">
        <span class="category-card-filter">${escHtml(item.filter)}</span>
        <span class="category-card-name">${escHtml(item.name)}</span>
      </div>
    </li>
  `).join('');

  // Click / keyboard on category cards
  cardsGrid.querySelectorAll('.category-card').forEach(card => {
    const activate = () => {
      state.category = { filter: card.dataset.filter, name: card.dataset.name };
      state.exercisePage = 1;
      state.keyword = '';
      if (searchInput) searchInput.value = '';
      showExercises();
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
  });
}

/** Render exercise card list items. */
function renderExerciseCards(exercises) {
  cardsGrid.innerHTML = exercises.map(ex => `
    <li class="exercise-card">
      <div class="exercise-card-top">
        <span class="exercise-card-badge">Workout</span>
        <span class="exercise-card-rating">
          ${Number(ex.rating).toFixed(1)}
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
        <button class="exercise-card-start" data-id="${escHtml(ex._id)}" type="button"
          aria-label="Start ${escHtml(ex.name)}">
          Start
          <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-right"></use></svg>
        </button>
      </div>
    </li>
  `).join('');

  // Store full exercise objects keyed by id for quick lookup
  const map = new Map(exercises.map(ex => [ex._id, ex]));

  cardsGrid.querySelectorAll('.exercise-card-start').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = map.get(btn.dataset.id);
      if (ex) openExerciseModal(ex);
    });
  });
}

// ─── View transitions ─────────────────────────────────────────────────────────

/** Switch to the exercise list view for the selected category. */
function showExercises() {
  workoutControls.hidden = false;
  showBreadcrumb(true);
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = state.category?.name ?? '';
  loadExercises();
}

/** Switch back to the category grid and reset keyword search state. */
function showCategories() {
  state.category = null;
  state.keyword = '';
  state.exercisePage = 1;
  if (searchInput) searchInput.value = '';
  // Keep workoutControls visible so the search bar stays accessible
  showBreadcrumb(false);
  loadCategories();
}

/**
 * Show or hide the breadcrumb row (back button + category label).
 * The search bar stays visible either way.
 * @param {boolean} visible
 */
function showBreadcrumb(visible) {
  if (!workoutBreadcrumb) return;
  if (visible) {
    workoutBreadcrumb.removeAttribute('hidden');
  } else {
    workoutBreadcrumb.setAttribute('hidden', '');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Show skeleton loader cards while fetching. */
function showLoader() {
  const n = getGridLimit();
  cardsGrid.innerHTML = Array.from({ length: n }, () => `
    <li class="card-skeleton">
      <div class="skeleton-line short"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line long"></div>
    </li>
  `).join('');
  cardsEmpty.hidden = true;
}

/** Show an error message in the grid area. */
function showError(msg) {
  cardsGrid.innerHTML = '';
  cardsEmpty.hidden = false;
  cardsEmpty.textContent = msg;
}

/** Scroll to the workout section smoothly. */
function scrollToWorkout() {
  document.getElementById('workoutSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Determine the number of cards to request based on viewport width.
 * Matches the CSS grid columns: 1 col mobile, 2 tablet, 3 desktop.
 */
function getGridLimit() {
  const w = window.innerWidth;
  if (w >= 1200) return 9;
  if (w >= 768) return 8;
  return 4;
}

/**
 * Map the UI filter tab name to the correct API query parameter key.
 * @param {string} filter
 */
function filterToParam(filter) {
  const map = {
    'Muscles': 'muscles',
    'Body parts': 'bodypart',
    'Equipment': 'equipment',
  };
  return map[filter] ?? 'muscles';
}

/** Simple HTML escape to prevent XSS from API data. */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
