/**
 * Grover cookie consent banner and Google Consent Mode v2 wiring.
 *
 * Loads after the inline GA4 snippet on every page, which sets consent
 * defaults to denied and defines window.gtag. This script reads any stored
 * choice from localStorage and applies it, or renders a small banner when
 * no choice has been made yet.
 *
 * Usage (place directly after the inline GA4 snippet, same order every time):
 *
 *   <script src="/js/consent.js"></script>
 *
 * Storage: a single localStorage key holds 'accepted' or 'declined'. Nothing
 * is written until the visitor makes a choice.
 *
 * Accept: grants analytics_storage only. ad_storage, ad_user_data, and
 * ad_personalization stay denied, there is no ads pixel on this site.
 * Decline: persists the choice and does nothing further, the default-denied
 * consent state already blocks storage.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'grover-consent';
  var STYLE_ID = 'grover-consent-styles';
  var ACCEPTED = 'accepted';
  var DECLINED = 'declined';

  function readStoredChoice() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeChoice(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch (e) {
      // Storage unavailable (private browsing, blocked cookies, etc). The
      // banner is dismissed for this page view either way.
    }
  }

  function applyChoice(choice) {
    if (typeof window.gtag !== 'function') return;
    if (choice === ACCEPTED) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    // Declined: default-denied state already blocks storage, nothing to do.
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.grover-consent {',
      '  position: fixed;',
      '  left: 1rem;',
      '  right: 1rem;',
      '  bottom: 1rem;',
      '  z-index: 9999;',
      '  max-width: 640px;',
      '  margin: 0 auto;',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  align-items: center;',
      '  gap: 0.75rem 1.5rem;',
      '  padding: 1.1rem 1.35rem;',
      '  border-radius: 0.75rem;',
      '  border: 1px solid rgba(55, 65, 81, 0.12);',
      '  border-top: 3px solid var(--primary-color, #66AEC0);',
      '  background-color: #fff;',
      '  color: #374151;',
      '  font-family: var(--body-font-stack, "Avenir", "Avenir Book", Figtree, Montserrat, sans-serif);',
      '  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);',
      '}',
      '.grover-consent__text {',
      '  flex: 1 1 260px;',
      '  margin: 0;',
      '  font-size: 0.9rem;',
      '  line-height: 1.5;',
      '}',
      '.grover-consent__actions {',
      '  display: flex;',
      '  gap: 0.6rem;',
      '  flex: 0 0 auto;',
      '}',
      '.grover-consent__button {',
      '  padding: 0.6rem 1.35rem;',
      '  border-radius: 9999px;',
      '  border: 1px solid transparent;',
      '  font-weight: 700;',
      '  font-size: 0.9rem;',
      '  font-family: inherit;',
      '  cursor: pointer;',
      '  line-height: 1.2;',
      '}',
      '.grover-consent__button--accept {',
      '  background-color: #374151;',
      '  color: #fff;',
      '}',
      '.grover-consent__button--accept:hover { background-color: #4b5563; }',
      '.grover-consent__button--decline {',
      '  background-color: transparent;',
      '  color: #374151;',
      '  border-color: rgba(55, 65, 81, 0.35);',
      '}',
      '.grover-consent__button--decline:hover { background-color: rgba(55, 65, 81, 0.06); }',
      '.grover-consent__button:focus-visible {',
      '  outline: 2px solid currentColor;',
      '  outline-offset: 2px;',
      '}',
      '@media (max-width: 480px) {',
      '  .grover-consent { flex-direction: column; align-items: stretch; }',
      '  .grover-consent__actions { justify-content: flex-end; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function removeBanner(banner) {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
  }

  function showBanner() {
    injectStyles();

    var banner = document.createElement('div');
    banner.className = 'grover-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');

    var text = document.createElement('p');
    text.className = 'grover-consent__text';
    text.textContent = 'We use cookies to understand how people use Grover, and you can accept or decline them below.';

    var actions = document.createElement('div');
    actions.className = 'grover-consent__actions';

    var declineButton = document.createElement('button');
    declineButton.type = 'button';
    declineButton.className = 'grover-consent__button grover-consent__button--decline';
    declineButton.textContent = 'Decline';

    var acceptButton = document.createElement('button');
    acceptButton.type = 'button';
    acceptButton.className = 'grover-consent__button grover-consent__button--accept';
    acceptButton.textContent = 'Accept';

    declineButton.addEventListener('click', function () {
      storeChoice(DECLINED);
      removeBanner(banner);
    });

    acceptButton.addEventListener('click', function () {
      storeChoice(ACCEPTED);
      applyChoice(ACCEPTED);
      removeBanner(banner);
    });

    actions.appendChild(declineButton);
    actions.appendChild(acceptButton);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }

  function init() {
    var stored = readStoredChoice();

    if (stored === ACCEPTED || stored === DECLINED) {
      applyChoice(stored);
      return;
    }

    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
