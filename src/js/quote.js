// ===== Quote of the day =====
import { fetchQuote } from './api.js';
import { getCachedQuote, cacheQuote } from './storage.js';

/**
 * Render quote data into #quoteBlock.
 * @param {{ author: string, quote: string }} data
 */
function renderQuote({ author, quote }) {
  const block = document.getElementById('quoteBlock');
  if (!block) return;

  block.innerHTML = `
    <p class="quote-text">${escapeHtml(quote)}</p>
    <p class="quote-author">— ${escapeHtml(author)}</p>
  `;
}

/** Load and display the daily quote (with localStorage cache). */
export async function initQuote() {
  const cached = getCachedQuote();
  if (cached) {
    renderQuote(cached);
    return;
  }

  try {
    const data = await fetchQuote();
    cacheQuote(data);
    renderQuote(data);
  } catch (err) {
    console.error('Failed to load quote:', err);
    const block = document.getElementById('quoteBlock');
    if (block) {
      block.innerHTML = `<p class="quote-text" style="font-style:normal;color:var(--color-text-muted)">
        "The secret of getting ahead is getting started."</p>
        <p class="quote-author">— Mark Twain</p>`;
    }
  }
}

/** Simple HTML escape to prevent XSS from API data. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
