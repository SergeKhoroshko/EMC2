// ===== localStorage helpers =====

const FAVORITES_KEY = 'ye_favorites';
const QUOTE_KEY = 'ye_quote';

// ─── Favorites ────────────────────────────────────────────────────────────────

/** Return the saved favorites array (never null). */
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
  } catch {
    return [];
  }
}

/** Save the full favorites array. */
function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

/** Add an exercise object to favorites (ignore duplicates). */
export function addFavorite(exercise) {
  const list = getFavorites();
  if (!list.some(ex => ex._id === exercise._id)) {
    saveFavorites([...list, exercise]);
    return true; // added
  }
  return false; // already present
}

/** Remove an exercise by _id from favorites. */
export function removeFavorite(id) {
  saveFavorites(getFavorites().filter(ex => ex._id !== id));
}

/** Check whether an exercise is already in favorites. */
export function isFavorite(id) {
  return getFavorites().some(ex => ex._id === id);
}

// ─── Quote cache ──────────────────────────────────────────────────────────────

/**
 * Load a cached quote.  Returns null if no cache or cache is from a previous day.
 * @returns {{ author: string, quote: string } | null}
 */
export function getCachedQuote() {
  try {
    const raw = localStorage.getItem(QUOTE_KEY);
    if (!raw) return null;
    const { date, data } = JSON.parse(raw);
    const today = new Date().toDateString();
    return date === today ? data : null;
  } catch {
    return null;
  }
}

/**
 * Save quote with today's date so it is valid for this calendar day only.
 * @param {{ author: string, quote: string }} data
 */
export function cacheQuote(data) {
  localStorage.setItem(
    QUOTE_KEY,
    JSON.stringify({ date: new Date().toDateString(), data })
  );
}
