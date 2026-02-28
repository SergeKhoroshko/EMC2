// ===== API service module =====
// All requests to https://your-energy.b.goit.study/api

const BASE_URL = 'https://your-energy.b.goit.study/api';

/**
 * Generic fetch wrapper — throws on non-ok HTTP status.
 * @param {string} path - API path (e.g. '/exercises')
 * @param {object} [options] - fetch options
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`API error ${response.status}: ${text || response.statusText}`);
  }

  // 204 No Content — return null
  if (response.status === 204) return null;
  return response.json();
}

/**
 * Build a query string from a plain object, omitting falsy/undefined values.
 * @param {object} params
 */
function buildQuery(params) {
  const query = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== null && val !== undefined && val !== '') {
      query.set(key, val);
    }
  }
  const str = query.toString();
  return str ? `?${str}` : '';
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/**
 * GET /quote — quote of the day
 * @returns {{ author: string, quote: string }}
 */
export function fetchQuote() {
  return request('/quote');
}

/**
 * GET /filters — category cards for a given filter type.
 * @param {{ filter: string, page?: number, limit?: number }} params
 * @returns {{ page, perPage, totalPages, results: Array<{filter, name, imgURL}> }}
 */
export function fetchFilters(params = {}) {
  return request(`/filters${buildQuery(params)}`);
}

/**
 * GET /exercises — exercise list with optional filters.
 * @param {{ bodypart?, muscles?, equipment?, keyword?, page?, limit? }} params
 * @returns {{ page, perPage, totalPages, results: Array<Exercise> }}
 */
export function fetchExercises(params = {}) {
  return request(`/exercises${buildQuery(params)}`);
}

/**
 * PATCH /exercises/{id}/rating — submit a rating for an exercise.
 * @param {string} id - exercise _id
 * @param {{ rate: number, email: string, review?: string }} body
 * @returns {Exercise}
 */
export function rateExercise(id, body) {
  return request(`/exercises/${id}/rating`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * POST /subscription — subscribe email to updates.
 * @param {string} email
 */
export function subscribe(email) {
  return request('/subscription', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
