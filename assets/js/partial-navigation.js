(function () {
  var SHELL_SELECTOR = '[data-pjax-container]';
  var CONTENT_SELECTOR = '[data-pjax-content]';

  if (!window.history || !window.history.pushState || !window.DOMParser) {
    return;
  }

  function isModifiedClick(event) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
  }

  function isExternalLink(url) {
    return url.origin !== window.location.origin;
  }

  function shouldBypassLink(anchor, event) {
    if (!anchor || !anchor.href) {
      return true;
    }

    if (isModifiedClick(event)) {
      return true;
    }

    if (anchor.target && anchor.target !== '_self') {
      return true;
    }

    if (anchor.hasAttribute('download')) {
      return true;
    }

    if (anchor.dataset.noPjax !== undefined || anchor.closest('[data-no-pjax]')) {
      return true;
    }

    var rel = (anchor.getAttribute('rel') || '').toLowerCase();
    if (rel.indexOf('external') >= 0) {
      return true;
    }

    var url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (error) {
      return true;
    }

    if (isExternalLink(url)) {
      return true;
    }

    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
      return true;
    }

    return false;
  }

  function runScriptsInScope(scope) {
    var scripts = scope.querySelectorAll('script');
    scripts.forEach(function (oldScript) {
      var newScript = document.createElement('script');
      for (var i = 0; i < oldScript.attributes.length; i += 1) {
        var attribute = oldScript.attributes[i];
        newScript.setAttribute(attribute.name, attribute.value);
      }
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  function swapAndRunScripts(newShell) {
    var currentShell = document.querySelector(SHELL_SELECTOR);
    if (!currentShell || !newShell) {
      return false;
    }

    var currentContent = currentShell.querySelector(CONTENT_SELECTOR);
    var newContent = newShell.querySelector(CONTENT_SELECTOR);

    if (currentContent && newContent) {
      currentContent.replaceWith(newContent);
      runScriptsInScope(newContent);
      return true;
    }

    currentShell.replaceWith(newShell);
    runScriptsInScope(newShell);

    return true;
  }

  async function loadPartial(url, options) {
    var config = options || {};
    var replaceState = !!config.replaceState;
    var keepScroll = !!config.keepScroll;

    var response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Accept: 'text/html',
        'X-Requested-With': 'partial-navigation'
      }
    });

    if (!response.ok) {
      window.location.href = url.toString();
      return;
    }

    var contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (contentType.indexOf('text/html') === -1) {
      window.location.href = url.toString();
      return;
    }

    var html = await response.text();
    var parsed = new DOMParser().parseFromString(html, 'text/html');
    var newShell = parsed.querySelector(SHELL_SELECTOR);

    if (!newShell || !swapAndRunScripts(newShell)) {
      window.location.href = url.toString();
      return;
    }

    if (parsed.title) {
      document.title = parsed.title;
    }

    var stateMethod = replaceState ? 'replaceState' : 'pushState';
    window.history[stateMethod]({ url: url.toString() }, '', url.toString());

    if (!keepScroll) {
      if (url.hash) {
        var target = document.querySelector(url.hash);
        if (target) {
          target.scrollIntoView();
        }
      } else {
        window.scrollTo(0, 0);
      }
    }

    document.dispatchEvent(new CustomEvent('partial-navigation:load', { detail: { url: url.toString() } }));
  }

  var isNavigating = false;

  document.addEventListener('click', function (event) {
    var anchor = event.target.closest('a[href]');
    if (shouldBypassLink(anchor, event) || isNavigating) {
      return;
    }

    var url = new URL(anchor.href, window.location.href);
    event.preventDefault();

    isNavigating = true;
    loadPartial(url)
      .catch(function () {
        window.location.href = url.toString();
      })
      .finally(function () {
        isNavigating = false;
      });
  });

  window.addEventListener('popstate', function () {
    if (isNavigating) {
      return;
    }

    isNavigating = true;
    loadPartial(new URL(window.location.href), { replaceState: true, keepScroll: true })
      .catch(function () {
        window.location.reload();
      })
      .finally(function () {
        isNavigating = false;
      });
  });
})();