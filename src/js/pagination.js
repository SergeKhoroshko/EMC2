// ===== Pagination renderer =====

/**
 * Render pagination buttons into the #pagination element.
 *
 * @param {{ currentPage: number, totalPages: number, onPageChange: function }} opts
 */
export function renderPagination({ currentPage, totalPages, onPageChange }) {
  const nav = document.getElementById('pagination');
  if (!nav) return;

  if (totalPages <= 1) {
    nav.hidden = true;
    nav.innerHTML = '';
    return;
  }

  nav.hidden = false;
  nav.innerHTML = buildPaginationHTML(currentPage, totalPages);

  nav.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page, 10);
      if (!isNaN(page) && page !== currentPage) {
        onPageChange(page);
      }
    });
  });
}

/**
 * Build the inner HTML for pagination controls.
 * Shows prev/next arrows and a window of page number buttons.
 */
function buildPaginationHTML(current, total) {
  const pages = getPageRange(current, total);
  let html = '';

  // Previous arrow
  html += `<button class="pagination-btn" data-page="${current - 1}"
    aria-label="Previous page" ${current === 1 ? 'disabled' : ''}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-left"></use></svg>
  </button>`;

  // Page numbers with optional ellipsis
  for (const page of pages) {
    if (page === '...') {
      html += `<span class="pagination-ellipsis" aria-hidden="true">…</span>`;
    } else {
      html += `<button class="pagination-btn ${page === current ? 'active' : ''}"
        data-page="${page}" aria-label="Page ${page}" aria-current="${page === current ? 'page' : 'false'}">
        ${page}
      </button>`;
    }
  }

  // Next arrow
  html += `<button class="pagination-btn" data-page="${current + 1}"
    aria-label="Next page" ${current === total ? 'disabled' : ''}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-right"></use></svg>
  </button>`;

  return html;
}

/**
 * Compute the array of pages to display (numbers + '...' placeholders).
 * Keeps at most 7 items visible.
 */
function getPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  const delta = 1; // siblings around current

  // Always show first and last; fill middle with window around current
  const range = new Set([1, total]);
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.add(i);
  }

  const sorted = [...range].sort((a, b) => a - b);
  let prev = 0;
  for (const page of sorted) {
    if (page - prev > 1) pages.push('...');
    pages.push(page);
    prev = page;
  }

  return pages;
}
