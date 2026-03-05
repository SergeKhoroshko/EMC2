// ===== Quote of the day =====
import { fetchQuote } from './api.js';
import { getCachedQuote, cacheQuote } from './storage.js';

/**
 * Render quote data into #quoteBlock (sidebar card).
 * Keeps the icon and label already in the HTML, appends quote text + author.
 * @param {{ author: string, quote: string }} data
 */
function renderQuote({ author, quote }) {
  const loader = document.getElementById('quoteLoader');
  const block = document.getElementById('quoteBlock');
  if (!block) return;

  // Hide the spinner
  if (loader) loader.remove();

  // Append quote text and author without replacing the icon/label
  const textEl = document.createElement('p');
  textEl.className = 'quote-text';
  textEl.textContent = quote;

  const authorEl = document.createElement('p');
  authorEl.className = 'quote-author';
  authorEl.textContent = `— ${author}`;

  block.appendChild(textEl);
  block.appendChild(authorEl);
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
    renderQuote({
      quote: 'The secret of getting ahead is getting started.',
      author: 'Mark Twain',
    });
  }
}
