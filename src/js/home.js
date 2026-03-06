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
const workoutBreadcrumb = document.getElementById('workoutBreadcrumb');
const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const workoutHeader = document.getElementById('workoutHeader');

// ─── Public init ──────────────────────────────────────────────────────────────

// Tracks last known per-page value to detect breakpoint crossings on resize
let lastPerPage = getPerPage();

/** Boot the home-page workout section. */
export async function initHome() {
  // Filter tab clicks
  document.getElementById('filterTabs')?.addEventListener('click', onFilterTabClick);

  // Re-render grid when crossing the 768px breakpoint
  window.addEventListener('resize', () => {
    const newPerPage = getPerPage();
    if (newPerPage !== lastPerPage) {
      lastPerPage = newPerPage;
      if (state.category !== null || state.keyword) {
        state.exercisePage = 1;
        loadExercises();
      } else {
        state.categoryPage = 1;
        loadCategories();
      }
    }
  });

  // Search form
  searchForm?.addEventListener('submit', e => {
    e.preventDefault();
    const keyword = searchInput?.value.trim() ?? '';
    state.keyword = keyword;
    state.exercisePage = 1;

    if (!keyword) {
      showCategories();
      return;
    }

    if (!state.category) {
      workoutControls.hidden = false;
      showBreadcrumb(false);
    }

    loadExercises();
  });

  // Load initial category grid
  await loadCategories();
}

// ─── Event handlers ───────────────────────────────────────────────────────────

function onFilterTabClick(e) {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;

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

// ─── Loaders ──────────────────────────────────────────────────────────────────

/** Load and render category cards for the selected filter. */
async function loadCategories() {
  showBreadcrumb(false);
  showLoader();
  setGridMode('categories');

  try {
    const limit = getPerPage();
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

/** Load and render exercise cards for the current state. */
async function loadExercises() {
  showLoader();
  setGridMode('exercises');

  try {
    const limit = getPerPage();
    const params = {
      keyword: state.keyword || undefined,
      page: state.exercisePage,
      limit,
    };

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

// ─── Renderers ────────────────────────────────────────────────────────────────

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
        ? `<img class="category-card-img"
               src="${escHtml(item.imgURL)}"
               alt="${escHtml(item.name)}"
               width="640" height="480"
               sizes="(min-width: 1200px) 280px, (min-width: 768px) calc(50vw - 30px), calc(100vw - 32px)"
               ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />`
        : `<div class="category-card-img" style="background:var(--color-surface-2)"></div>`
      }
      <div class="category-card-overlay">
        <span class="category-card-filter">${escHtml(item.filter)}</span>
        <span class="category-card-name">${escHtml(item.name)}</span>
      </div>
    </li>
  `).join('');

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

/** Render exercise card list items — new Figma layout. */
function renderExerciseCards(exercises) {
  cardsGrid.innerHTML = exercises.map(ex => `
    <li class="exercise-card">
      <!-- Row 1: WORKOUT pill + rating LEFT, Start → RIGHT -->
      <div class="exercise-card-top">
        <div class="exercise-card-top-left">
          <span class="exercise-card-rating">
            ${Number(ex.rating).toFixed(1)}
            <svg class="exercise-card-star" width="13" height="13" aria-hidden="true">
              <use href="./img/sprite.svg#icon-star"></use>
            </svg>
          </span>
        </div>
        <button class="exercise-card-start" data-id="${escHtml(ex._id)}" type="button"
          aria-label="Start ${escHtml(ex.name)}">
          Start &rarr;
        </button>
      </div>
      <!-- Row 2: name first, category below -->
      <div class="exercise-card-body">
        <h3 class="exercise-card-name">${escHtml(ex.name)}</h3>
        <p class="exercise-card-category">${escHtml(ex.bodyPart || ex.target || '')}</p>
      </div>
    </li>
  `).join('');

  const map = new Map(exercises.map(ex => [ex._id, ex]));
  cardsGrid.querySelectorAll('.exercise-card-start').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = map.get(btn.dataset.id);
      if (ex) openExerciseModal(ex);
    });
  });
}

// ─── View transitions ─────────────────────────────────────────────────────────

/** Switch to the exercise list view for the selected category.
 *  Hides the filter tabs row, shows "Exercises / CategoryName" breadcrumb. */
function showExercises() {
  // Hide the section header (Exercises title + filter tabs)
  if (workoutHeader) workoutHeader.hidden = true;
  workoutControls.hidden = false;
  showBreadcrumb(true);
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = state.category?.name ?? '';
  loadExercises();
}

/** Switch back to the category grid. */
function showCategories() {
  state.category = null;
  state.keyword = '';
  state.exercisePage = 1;
  if (searchInput) searchInput.value = '';
  // Restore filter tabs header
  if (workoutHeader) workoutHeader.hidden = false;
  workoutControls.hidden = true;
  showBreadcrumb(false);
  loadCategories();
}

/**
 * Show or hide the breadcrumb row.
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

/** Set grid mode class for correct column count (categories: 3-col, exercises: 2-col). */
function setGridMode(mode) {
  if (!cardsGrid) return;
  cardsGrid.classList.remove('is-categories', 'is-exercises');
  cardsGrid.classList.add(`is-${mode}`);
}

/** Show skeleton loader cards while fetching. */
function showLoader() {
  const n = getPerPage();
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

/** Items per page: 9 on mobile (< 768px), 12 on tablet and above. */
function getPerPage() {
  return window.innerWidth < 768 ? 9 : 12;
}

/**
 * Map filter tab name to API query parameter key.
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
