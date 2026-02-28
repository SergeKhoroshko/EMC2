// ===== Home page entry point =====
import { initHeader } from './js/header.js';
import { initQuote } from './js/quote.js';
import { initHome } from './js/home.js';
import { initExerciseModal } from './js/exercise-modal.js';
import { initRatingModal } from './js/rating-modal.js';
import { initFooter } from './js/footer.js';

// Boot all modules on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  initHeader();
  initFooter();
  initRatingModal();

  // Exercise modal — pass callback to re-render nothing on home (categories stay)
  initExerciseModal(null, false);

  // Load quote of the day (cached in localStorage)
  initQuote();

  // Home workout section: categories + exercises
  await initHome();
});
