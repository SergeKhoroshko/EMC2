// ===== Mobile burger menu =====

export function initHeader() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');

  if (!burgerBtn || !mobileMenu) return;

  /** Open the mobile menu. */
  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.removeAttribute('aria-hidden');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('modal-open');
  }

  /** Close the mobile menu. */
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('modal-open');
  }

  burgerBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close when clicking outside the inner panel
  mobileMenu.addEventListener('click', e => {
    if (e.target === mobileMenu) closeMenu();
  });
}
