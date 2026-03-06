// ===== Quote of the day =====
import { fetchQuote } from './api.js';
import { getCachedQuote, cacheQuote } from './storage.js';

/**
 * Build the quote card inner HTML matching the Figma design.
 * @param {{ author: string, quote: string }} quote
 * @returns {string} HTML string
 */
function renderQuote(quote) {
  return `
    <div class="quote-card">
      <div class="quote-card-header">
        <div class="quote-icon-wrap">
          <svg width="22" height="22" aria-hidden="true">
            <use href="./img/sprite.svg#icon-runner"></use>
          </svg>
        </div>
        <span class="quote-label">Quote of the day</span>
        <svg class="quote-marks" width="24" height="18" aria-hidden="true">
          <use href="./img/sprite.svg#icon-quotes"></use>
        </svg>
      </div>
      <p class="quote-text">${quote.quote}</p>
      <p class="quote-author">${quote.author}</p>
    </div>
  `;
}

/** Load and display the daily quote (with localStorage cache). */
export async function initQuote() {
  const block = document.getElementById('quoteBlock');
  if (!block) return;

  const inject = data => {
    block.innerHTML = renderQuote(data);
  };

  const cached = getCachedQuote();
  if (cached) {
    inject(cached);
    return;
  }

  try {
    const data = await fetchQuote();
    cacheQuote(data);
    inject(data);
  } catch (err) {
    console.error('Failed to load quote:', err);
    inject({
      quote: 'The secret of getting ahead is getting started.',
      author: 'Mark Twain',
    });
  }
}
