// ===== Pagination renderer =====

/**
 * Render pagination buttons into the #pagination element.
 * Shows: first «  prev ‹  page numbers  next ›  last »
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

function buildPaginationHTML(current, total) {
  const pages = getPageRange(current, total);
  let html = '';

  // First page «
  html += `<button class="pagination-btn pagination-btn--nav" data-page="1"
    aria-label="First page" ${current === 1 ? 'disabled' : ''}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-chevron-double-left"></use></svg>
  </button>`;

  // Previous page ‹
  html += `<button class="pagination-btn pagination-btn--nav" data-page="${current - 1}"
    aria-label="Previous page" ${current === 1 ? 'disabled' : ''}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-chevron-left"></use></svg>
  </button>`;

  // Page numbers
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

  // Next page ›
  html += `<button class="pagination-btn pagination-btn--nav" data-page="${current + 1}"
    aria-label="Next page" ${current === total ? 'disabled' : ''}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-chevron-right"></use></svg>
  </button>`;

  // Last page »
  html += `<button class="pagination-btn pagination-btn--nav" data-page="${total}"
    aria-label="Last page" ${current === total ? 'disabled' : ''}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-chevron-double-right"></use></svg>
  </button>`;

  return html;
}

function getPageRange(current, total) {
  // Show all pages if 7 or fewer
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  const delta = 1;
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
