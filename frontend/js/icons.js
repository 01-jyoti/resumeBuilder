/**
 * icons.js
 * Small set of inline SVG icons (stroke-based, feather/lucide style)
 * used in place of the lucide-react icon components.
 *
 * Usage: ICONS.save(18) -> returns an <svg> markup string
 */

const ICONS = (() => {
  function wrap(size, inner) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner +
      "</svg>"
    );
  }

  return {
    dashboard: (size = 18) =>
      wrap(
        size,
        '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>'
      ),
    fileText: (size = 18) =>
      wrap(
        size,
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>'
      ),
    template: (size = 18) =>
      wrap(
        size,
        '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
      ),
    edit: (size = 18) =>
      wrap(
        size,
        '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>'
      ),
    settings: (size = 18) =>
      wrap(
        size,
        '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
      ),
    arrowLeft: (size = 18) =>
      wrap(size, '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
    save: (size = 16) =>
      wrap(
        size,
        '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>'
      ),
    plus: (size = 16) =>
      wrap(size, '<path d="M5 12h14"/><path d="M12 5v14"/>'),
    trash: (size = 16) =>
      wrap(
        size,
        '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>'
      ),
    x: (size = 14) => wrap(size, '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    check: (size = 16) => wrap(size, '<path d="M20 6 9 17l-5-5"/>'),
    pencil: (size = 16) =>
      wrap(
        size,
        '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'
      ),
    palette: (size = 16) =>
      wrap(
        size,
        '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>'
      ),
    moreHorizontal: (size = 18) =>
      wrap(
        size,
        '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'
      ),
    printer: (size = 16) =>
      wrap(
        size,
        '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'
      ),
  };
})();

/**
 * Any static element marked with data-icon="name" (optionally
 * data-size="18") gets its icon injected automatically on load.
 * Dynamically generated markup (built in JS template strings) calls
 * ICONS.<name>() directly instead, since it doesn't exist yet at
 * DOMContentLoaded time.
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    const size = parseInt(el.getAttribute("data-size") || "18", 10);
    if (ICONS[name]) {
      el.innerHTML = ICONS[name](size);
    }
  });
});
