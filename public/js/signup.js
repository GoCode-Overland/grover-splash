/**
 * Grover owned signup component.
 *
 * Dependency-free, owned replacement for the old third-party form embeds.
 * Mounts an email capture form into any element carrying `data-grover-signup`.
 *
 * Usage (drop this fragment anywhere on the site):
 *
 *   <div
 *     class="grover-signup"
 *     data-grover-signup
 *     data-endpoint="https://ops.getgrover.ai/api/public/contacts/subscribe"
 *   ></div>
 *   <script src="/js/signup.js" defer></script>
 *
 * `data-endpoint` is optional and defaults to the production grover-chat
 * subscribe endpoint below. Point it at a local grover-chat instance during
 * development, e.g. data-endpoint="http://localhost:5173/api/public/contacts/subscribe".
 *
 * Contract: POST JSON { email } to the endpoint, expect { ok: true } on success.
 * A honeypot field ("company") is included and never surfaced to real users;
 * bots that fill it in get a fake success with no request sent.
 */
(function () {
  'use strict';

  var DEFAULT_ENDPOINT = 'https://ops.getgrover.ai/api/public/contacts/subscribe';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var STYLE_ID = 'grover-signup-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.grover-signup { font-family: var(--body-font-stack, "Avenir", "Avenir Book", Figtree, Montserrat, sans-serif); }',
      '.grover-signup__row { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }',
      '.grover-signup__field { position: relative; flex: 1 1 260px; }',
      '.grover-signup__input {',
      '  width: 100%;',
      '  box-sizing: border-box;',
      '  padding: 0.75rem 1.25rem;',
      '  border-radius: 9999px;',
      '  border: 1px solid rgba(55, 65, 81, 0.15);',
      '  font-size: 1rem;',
      '  font-family: inherit;',
      '  color: #374151;',
      '  background-color: #fff;',
      '}',
      '.grover-signup__input:focus {',
      '  outline: none;',
      '  border-color: var(--primary-color, #66AEC0);',
      '  box-shadow: 0 0 0 3px rgba(102, 174, 192, 0.25);',
      '}',
      '.grover-signup__submit {',
      '  flex: 0 0 auto;',
      '  padding: 0.75rem 2rem;',
      '  border-radius: 9999px;',
      '  border: none;',
      '  font-weight: 700;',
      '  font-size: 1rem;',
      '  cursor: pointer;',
      '  background-color: var(--yellow-accent-color, #F8E5C1);',
      '  color: var(--primary-color, #66AEC0);',
      '  transition: background-color 0.2s ease, transform 0.2s ease;',
      '}',
      '.grover-signup__submit:hover:not(:disabled) { background-color: #f5d99a; transform: translateY(-1px); }',
      '.grover-signup__submit:disabled { opacity: 0.6; cursor: not-allowed; }',
      '.grover-signup__message {',
      '  margin: 0.75rem 0 0;',
      '  font-size: 0.9rem;',
      '  min-height: 1.2em;',
      '}',
      '.grover-signup__message--success,',
      '.grover-signup__message--error {',
      '  display: inline-block;',
      '  padding: 0.35rem 0.9rem;',
      '  border-radius: 9999px;',
      '  background-color: rgba(255, 255, 255, 0.92);',
      '}',
      '.grover-signup__message--success { color: #1f7a3d; }',
      '.grover-signup__message--error { color: #c0392b; }',
      '.grover-signup__hp {',
      '  position: absolute !important;',
      '  left: -9999px !important;',
      '  width: 1px !important;',
      '  height: 1px !important;',
      '  overflow: hidden !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildForm(container) {
    var endpoint = container.getAttribute('data-endpoint') || DEFAULT_ENDPOINT;

    var form = document.createElement('form');
    form.className = 'grover-signup__form';
    form.noValidate = true;

    var row = document.createElement('div');
    row.className = 'grover-signup__row';

    var field = document.createElement('div');
    field.className = 'grover-signup__field';

    var input = document.createElement('input');
    input.type = 'email';
    input.name = 'email';
    input.required = true;
    input.autocomplete = 'email';
    input.placeholder = 'you@example.com';
    input.setAttribute('aria-label', 'Email address');
    input.className = 'grover-signup__input';
    field.appendChild(input);

    // Honeypot: real users never see or fill this in.
    var honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'company';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.className = 'grover-signup__hp';
    field.appendChild(honeypot);

    var submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'grover-signup__submit font-body';
    submit.textContent = container.getAttribute('data-button-label') || 'Sign up';

    row.appendChild(field);
    row.appendChild(submit);

    var message = document.createElement('p');
    message.className = 'grover-signup__message';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');

    form.appendChild(row);
    form.appendChild(message);
    container.appendChild(form);

    var submitting = false;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (submitting) return;

      var email = input.value.trim();

      // Honeypot tripped: pretend success, send nothing.
      if (honeypot.value) {
        message.textContent = "You're on the list.";
        message.className = 'grover-signup__message grover-signup__message--success';
        form.reset();
        return;
      }

      if (!EMAIL_RE.test(email)) {
        message.textContent = 'Enter a valid email address.';
        message.className = 'grover-signup__message grover-signup__message--error';
        input.focus();
        return;
      }

      submitting = true;
      submit.disabled = true;
      message.textContent = 'Submitting...';
      message.className = 'grover-signup__message';

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
        .then(function (response) {
          if (!response.ok) throw new Error('request failed');
          return response.json();
        })
        .then(function (data) {
          if (!data || !data.ok) throw new Error('unexpected response');
          message.textContent = "You're on the list. Welcome aboard.";
          message.className = 'grover-signup__message grover-signup__message--success';
          form.reset();
          // Push straight to dataLayer rather than calling gtag() directly:
          // this component mounts on pages (blog posts, landing pages,
          // tutorials) that don't all carry the GA4 inline snippet, so
          // gtag may not be defined yet or at all. dataLayer is just an
          // array gtag.js drains once it loads, so this can't throw.
          (window.dataLayer = window.dataLayer || []).push(['event', 'sign_up', {
            method: 'newsletter',
            cta_label: submit.textContent,
            page_path: window.location.pathname
          }]);
        })
        .catch(function () {
          message.textContent = 'Something went wrong. Please try again in a moment.';
          message.className = 'grover-signup__message grover-signup__message--error';
        })
        .finally(function () {
          submitting = false;
          submit.disabled = false;
        });
    });
  }

  function mountAll() {
    injectStyles();
    var containers = document.querySelectorAll('[data-grover-signup]');
    for (var i = 0; i < containers.length; i++) {
      var el = containers[i];
      if (el.getAttribute('data-grover-signup-mounted') === 'true') continue;
      el.setAttribute('data-grover-signup-mounted', 'true');
      buildForm(el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }
})();
