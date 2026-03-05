// ===== Favorites page entry point =====
import { initHeader } from './js/header.js';
import { initFooter } from './js/footer.js';
import { initExerciseModal } from './js/exercise-modal.js';
import { initRatingModal } from './js/rating-modal.js';
import { renderFavorites } from './js/favorites.js';
import { initQuote } from './js/quote.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFooter();
  initRatingModal();
  initQuote();

  // On favorites page the modal's fav button removes the exercise and re-renders the grid
  initExerciseModal(renderFavorites, true);

  // Initial render of saved exercises from localStorage
  renderFavorites();
});
