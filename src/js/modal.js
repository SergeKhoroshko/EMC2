// ===== Generic modal helpers =====

/**
 * Open a modal by setting its `hidden` attribute to false
 * and preventing body scroll.
 * @param {HTMLElement} backdrop
 */
export function openModal(backdrop) {
  if (!backdrop) return;
  backdrop.hidden = false;
  document.body.classList.add('modal-open');
  // Focus the first focusable element inside the modal
  const focusable = backdrop.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusable?.focus();
}

/**
 * Close a modal backdrop.
 * @param {HTMLElement} backdrop
 */
export function closeModal(backdrop) {
  if (!backdrop) return;
  backdrop.hidden = true;
  // Only remove body lock if no other modals are open
  const anyOpen = document.querySelectorAll('.modal-backdrop:not([hidden])').length > 0;
  if (!anyOpen) document.body.classList.remove('modal-open');
}

/**
 * Attach close behaviour to a modal:
 *  - X button (#closeId)
 *  - clicking the backdrop itself
 *  - Escape key
 * @param {HTMLElement} backdrop
 * @param {string} closeBtnId - id of the close button
 * @param {function} [onClose] - optional callback after close
 */
export function bindModalClose(backdrop, closeBtnId, onClose) {
  const closeBtn = document.getElementById(closeBtnId);

  const doClose = () => {
    closeModal(backdrop);
    onClose?.();
  };

  closeBtn?.addEventListener('click', doClose);

  // Click on dark backdrop area (not the modal box itself)
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) doClose();
  });

  // Global Escape listener (only fires when modal is visible)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !backdrop.hidden) doClose();
  });
}
