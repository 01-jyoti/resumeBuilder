/**
 * templates.js
 * Templates gallery page — select a template, persist choice to localStorage,
 * and redirect to My Resume ("my-resume.html") to see the actual database data rendered!
 */

let selectedTemplateId = safeGetString(STORAGE_KEYS.TEMPLATE, "templateTest");

function renderTemplateCards() {
  const gridEl = document.getElementById("templates-grid");
  if (!gridEl) return;

  gridEl.innerHTML = templates
    .map((template) => {
      const isSelected = selectedTemplateId === template.id;
      const badgeHtml = template.badge
        ? `<span class="template-badge-pill" style="background: rgba(139, 92, 246, 0.2); color: #c084fc; font-size: 11px; padding: 2px 8px; border-radius: 999px; border: 1px solid rgba(139, 92, 246, 0.4);">${escapeHTML(template.badge)}</span>`
        : "";

      return `
        <div class="template-card ${isSelected ? "selected" : ""}" data-template-id="${template.id}">
          <div class="template-thumbnail">
            <div class="wireframe-preview">
              <div class="wire-header"></div>
              <div class="wire-line short"></div>
              <div class="wire-section"></div>
              <div class="wire-line"></div>
              <div class="wire-line mid"></div>
            </div>
            <span class="template-thumb-title">${escapeHTML(template.name)}</span>
          </div>

          <div class="template-info">
            <div class="template-name-row">
              <strong style="font-size: 15px;">${escapeHTML(template.name)}</strong>
              ${badgeHtml}
            </div>
            ${template.subtitle ? `<div style="font-size: 12px; color: #a78bfa; margin-top: 2px;">${escapeHTML(template.subtitle)}</div>` : ""}
            <span class="template-category" style="margin-top: 6px; line-height: 1.4;">${escapeHTML(template.description)}</span>
          </div>

          <div class="template-card-actions" style="display: flex; gap: 8px; margin-top: 14px;">
            <button type="button" class="btn-select ${isSelected ? "selected" : ""}" data-select-template="${template.id}" style="flex: 1;">
              ${isSelected ? "✓ Active Template" : "Select & View Resume"}
            </button>
            ${template.file ? `
            <a href="${template.file}" target="_blank" class="btn-preview-link" title="Open full standalone page" style="background: #252538; color: #c9d1d9; border: 1px solid #3c3c52; border-radius: 8px; padding: 8px 12px; font-size: 12px; text-decoration: none; display: flex; align-items: center; justify-content: center;">
              Demo
            </a>
            ` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  // Attach card select handler
  gridEl.querySelectorAll("[data-select-template]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-select-template");
      handleSelect(id);
    });
  });

  // Clicking anywhere on card selects and opens resume
  gridEl.querySelectorAll(".template-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-template-id");
      handleSelect(id);
    });
  });
}

function handleSelect(id) {
  selectedTemplateId = id;
  safeSetString(STORAGE_KEYS.TEMPLATE, id);
  
  // Directly navigate to my-resume.html to display resume populated with database data!
  window.location.href = "my-resume.html";
}

document.addEventListener("DOMContentLoaded", () => {
  renderTemplateCards();
});
