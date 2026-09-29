/**
 * preview.js
 * Renders the Resume Preview page ("my-resume.html") using real data
 * fetched from the Spring Boot backend database, styled according to
 * the selected template (e.g. templateTest, template2, modern, etc.).
 */

let currentResumeData = null;
let currentTemplateId = "templateTest";

/** Helper to render skills as tags */
function renderSkillsHtml(skills, tagClass = "skill-tag") {
  if (!skills) return "";
  let skillsArray = [];
  if (Array.isArray(skills)) {
    skillsArray = skills;
  } else if (typeof skills === "string") {
    skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return skillsArray
    .map((skill) => `<span class="${tagClass}">${escapeHTML(skill)}</span>`)
    .join(" ");
}

/** Format safe external link */
function formatUrl(url) {
  if (!url || !url.trim()) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : "https://" + url;
}

// -------------------------------------------------------------
// Template Renderers
// -------------------------------------------------------------

/**
 * 1. Template: templateTest (ATS Classic / Software Developer)
 * Matches the layout and classes in templateTest.html
 */
function renderTemplateTest(d) {
  const storedUser = getLoggedInUser();
  const fullName = d.fullName || (d.user && d.user.fullName) || (storedUser && storedUser.fullName) || "John Doe";
  const email = d.email || (d.user && d.user.email) || (storedUser && storedUser.email) || "";
  const jobTitle = d.jobTitle || "Software Developer";
  const phone = d.phone || "";
  const location = d.location || "";
  const summary = d.summary || "";

  // Contact items
  const contactParts = [];
  if (phone) contactParts.push(`<span>${escapeHTML(phone)}</span>`);
  if (email) contactParts.push(`<span>${escapeHTML(email)}</span>`);
  if (location) contactParts.push(`<span>${escapeHTML(location)}</span>`);

  const links = [];
  if (d.linkedin) links.push(`<a href="${formatUrl(d.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (d.github) links.push(`<a href="${formatUrl(d.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (d.portfolio) links.push(`<a href="${formatUrl(d.portfolio)}" target="_blank" rel="noopener">Portfolio</a>`);

  return `
    <div class="resume template-test-view">
      <!-- HEADER -->
      <header class="header">
        <h1 class="name">${escapeHTML(fullName)}</h1>
        <div class="job-title">${escapeHTML(jobTitle)}</div>
        <div class="contact">
          ${contactParts.join(" &bull; ")}
          ${links.length ? `<br>${links.join(" &bull; ")}` : ""}
        </div>
      </header>

      <!-- SUMMARY -->
      ${summary ? `
      <section class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${escapeHTML(summary)}</div>
      </section>
      ` : ""}

      <!-- EDUCATION -->
      ${(d.degree || d.institution) ? `
      <section class="section">
        <div class="section-title">Education</div>
        <div class="item">
          <div class="item-header">
            <div>
              <div class="item-title">${escapeHTML(d.degree || "Degree")}</div>
              <div class="item-subtitle">${escapeHTML(d.institution || "Institution")}</div>
            </div>
            <div class="date">
              <span>${escapeHTML(d.startYear || "")}</span> - <span>${escapeHTML(d.endYear || "")}</span>
            </div>
          </div>
          ${d.grade ? `<div class="description">Grade / CGPA: <strong>${escapeHTML(d.grade)}</strong></div>` : ""}
        </div>
      </section>
      ` : ""}

      <!-- SKILLS -->
      ${d.skills ? `
      <section class="section">
        <div class="section-title">Technical Skills</div>
        <div class="skills">
          ${renderSkillsHtml(d.skills, "skill-tag")}
        </div>
      </section>
      ` : ""}

      <!-- PROJECTS -->
      ${d.projectName ? `
      <section class="section">
        <div class="section-title">Projects</div>
        <div class="item">
          <div class="item-title">${escapeHTML(d.projectName)}</div>
          ${d.technologies ? `<div class="item-subtitle">Technologies: ${escapeHTML(d.technologies)}</div>` : ""}
          ${d.projectDescription ? `<div class="description">${escapeHTML(d.projectDescription)}</div>` : ""}
          <div class="project-links">
            ${d.projectGithub ? `<a href="${formatUrl(d.projectGithub)}" target="_blank" rel="noopener">GitHub</a>` : ""}
            ${d.projectLive ? `<a href="${formatUrl(d.projectLive)}" target="_blank" rel="noopener">Live Demo</a>` : ""}
          </div>
        </div>
      </section>
      ` : ""}

      <!-- EXPERIENCE -->
      ${(d.company || d.experienceTitle) ? `
      <section class="section">
        <div class="section-title">Work Experience</div>
        <div class="item">
          <div class="item-header">
            <div>
              <div class="item-title">${escapeHTML(d.experienceTitle || "Role")}</div>
              <div class="item-subtitle">${escapeHTML(d.company || "Company")}</div>
            </div>
            <div class="date">
              <span>${escapeHTML(d.experienceStart || "")}</span> - <span>${escapeHTML(d.experienceEnd || "Present")}</span>
            </div>
          </div>
          ${d.experienceDescription ? `<div class="description">${escapeHTML(d.experienceDescription)}</div>` : ""}
        </div>
      </section>
      ` : ""}
    </div>
  `;
}

/**
 * 2. Template: template2 (Modern Indigo)
 * Matches the layout and classes in template2.html
 */
function renderTemplate2(d) {
  const storedUser = getLoggedInUser();
  const fullName = d.fullName || (d.user && d.user.fullName) || (storedUser && storedUser.fullName) || "John Doe";
  const email = d.email || (d.user && d.user.email) || (storedUser && storedUser.email) || "";
  const jobTitle = d.jobTitle || "Software Developer";
  const phone = d.phone || "";
  const location = d.location || "";
  const summary = d.summary || "";

  return `
    <div class="resume-container template2-view">
      <header class="resume-header">
        <h1>${escapeHTML(fullName)}</h1>
        <h2>${escapeHTML(jobTitle)}</h2>
        <div class="contact-info">
          ${phone ? `<span>📱 ${escapeHTML(phone)}</span>` : ""}
          ${email ? `<span>✉️ ${escapeHTML(email)}</span>` : ""}
          ${location ? `<span>📍 ${escapeHTML(location)}</span>` : ""}
          ${d.linkedin ? `<span>🔗 <a href="${formatUrl(d.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></span>` : ""}
          ${d.github ? `<span>💻 <a href="${formatUrl(d.github)}" target="_blank" rel="noopener">GitHub</a></span>` : ""}
          ${d.portfolio ? `<span>🌐 <a href="${formatUrl(d.portfolio)}" target="_blank" rel="noopener">Portfolio</a></span>` : ""}
        </div>
      </header>

      ${summary ? `
      <section class="resume-section">
        <h3>Professional Summary</h3>
        <p>${escapeHTML(summary)}</p>
      </section>
      ` : ""}

      ${(d.company || d.experienceTitle) ? `
      <section class="resume-section">
        <h3>Work Experience</h3>
        <div class="item-block">
          <div class="item-header">
            <span class="item-title">${escapeHTML(d.experienceTitle || "Role")}</span>
            <span class="item-date">${escapeHTML(d.experienceStart || "")} – ${escapeHTML(d.experienceEnd || "Present")}</span>
          </div>
          <div class="item-subtitle">${escapeHTML(d.company || "")}</div>
          ${d.experienceDescription ? `<p style="margin-top: 6px;">${escapeHTML(d.experienceDescription)}</p>` : ""}
        </div>
      </section>
      ` : ""}

      ${(d.degree || d.institution) ? `
      <section class="resume-section">
        <h3>Education</h3>
        <div class="item-block">
          <div class="item-header">
            <span class="item-title">${escapeHTML(d.degree || "Degree")}</span>
            <span class="item-date">${escapeHTML(d.startYear || "")} – ${escapeHTML(d.endYear || "")}</span>
          </div>
          <div class="item-subtitle">${escapeHTML(d.institution || "")}</div>
          ${d.grade ? `<p style="margin-top: 4px;">Grade / GPA: <strong>${escapeHTML(d.grade)}</strong></p>` : ""}
        </div>
      </section>
      ` : ""}

      ${d.projectName ? `
      <section class="resume-section">
        <h3>Projects</h3>
        <div class="item-block">
          <div class="item-header">
            <span class="item-title">${escapeHTML(d.projectName)}</span>
            ${d.technologies ? `<span class="item-date">${escapeHTML(d.technologies)}</span>` : ""}
          </div>
          ${d.projectDescription ? `<p style="margin-top: 4px;">${escapeHTML(d.projectDescription)}</p>` : ""}
          <div style="margin-top: 6px; font-size: 13px;">
            ${d.projectGithub ? `<a href="${formatUrl(d.projectGithub)}" target="_blank" rel="noopener" style="color: #6366f1; margin-right: 12px;">GitHub</a>` : ""}
            ${d.projectLive ? `<a href="${formatUrl(d.projectLive)}" target="_blank" rel="noopener" style="color: #6366f1;">Live Demo</a>` : ""}
          </div>
        </div>
      </section>
      ` : ""}

      ${d.skills ? `
      <section class="resume-section">
        <h3>Technical Skills</h3>
        <div class="skills-list">
          ${renderSkillsHtml(d.skills, "skill-badge")}
        </div>
      </section>
      ` : ""}
    </div>
  `;
}

/**
 * 3. General theme templates (modern, professional, minimal)
 */
function renderThemeTemplate(d, themeId) {
  const storedUser = getLoggedInUser();
  const fullName = d.fullName || (d.user && d.user.fullName) || (storedUser && storedUser.fullName) || "John Doe";
  const email = d.email || (d.user && d.user.email) || (storedUser && storedUser.email) || "";
  const jobTitle = d.jobTitle || "Software Developer";
  const phone = d.phone || "";
  const location = d.location || "";
  const summary = d.summary || "";

  const contactList = [email, phone, location].filter(Boolean);

  return `
    <div class="resume-doc-inner template-${escapeHTML(themeId)}">
      <div class="resume-header">
        <h1>${escapeHTML(fullName)}</h1>
        <div class="theme-job-title" style="font-size: 16px; margin-bottom: 8px; color: #6366f1; font-weight: 500;">
          ${escapeHTML(jobTitle)}
        </div>
        <div class="contact-row">
          ${contactList.map((c) => `<span>${escapeHTML(c)}</span>`).join("")}
          ${d.linkedin ? `<a href="${formatUrl(d.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
          ${d.github ? `<a href="${formatUrl(d.github)}" target="_blank" rel="noopener">GitHub</a>` : ""}
        </div>
      </div>

      ${summary ? `
      <div class="resume-block">
        <h2>Summary</h2>
        <p>${escapeHTML(summary)}</p>
      </div>
      ` : ""}

      ${(d.company || d.experienceTitle) ? `
      <div class="resume-block">
        <h2>Experience</h2>
        <div class="resume-entry">
          <div class="resume-entry-header">
            <strong>${escapeHTML(d.experienceTitle || "Role")}</strong>
            <span>${escapeHTML(d.experienceStart || "")} - ${escapeHTML(d.experienceEnd || "Present")}</span>
          </div>
          <div class="resume-entry-sub">${escapeHTML(d.company || "")}</div>
          ${d.experienceDescription ? `<p>${escapeHTML(d.experienceDescription)}</p>` : ""}
        </div>
      </div>
      ` : ""}

      ${(d.degree || d.institution) ? `
      <div class="resume-block">
        <h2>Education</h2>
        <div class="resume-entry">
          <div class="resume-entry-header">
            <strong>${escapeHTML(d.degree || "Degree")}</strong>
            <span>${escapeHTML(d.startYear || "")} - ${escapeHTML(d.endYear || "")}</span>
          </div>
          <div class="resume-entry-sub">${escapeHTML(d.institution || "")}</div>
          ${d.grade ? `<p>Grade / CGPA: <strong>${escapeHTML(d.grade)}</strong></p>` : ""}
        </div>
      </div>
      ` : ""}

      ${d.projectName ? `
      <div class="resume-block">
        <h2>Projects</h2>
        <div class="resume-entry">
          <div class="resume-entry-header">
            <strong>${escapeHTML(d.projectName)}</strong>
            ${d.technologies ? `<span>${escapeHTML(d.technologies)}</span>` : ""}
          </div>
          ${d.projectDescription ? `<p>${escapeHTML(d.projectDescription)}</p>` : ""}
        </div>
      </div>
      ` : ""}

      ${d.skills ? `
      <div class="resume-block">
        <h2>Skills</h2>
        <div class="resume-skills">
          ${renderSkillsHtml(d.skills, "resume-skill-chip")}
        </div>
      </div>
      ` : ""}
    </div>
  `;
}

// -------------------------------------------------------------
// Core Page Controller
// -------------------------------------------------------------

function renderCurrentResume() {
  const docEl = document.getElementById("resume-document");
  if (!docEl) return;

  if (!currentResumeData) {
    docEl.innerHTML = `
      <div class="empty-resume-state" style="text-align: center; padding: 48px 24px;">
        <h2 style="font-size: 22px; color: #1f2937; margin-bottom: 10px;">No Resume Data Found</h2>
        <p style="color: #6b7280; max-width: 480px; margin: 0 auto 24px; font-size: 14px;">
          You haven't entered your information into the system yet. Fill in your details once, then easily choose templates!
        </p>
        <a href="enterInfo.html" class="btn-primary" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          ✍️ Enter Your Information Now
        </a>
      </div>
    `;
    return;
  }

  // Render according to template choice
  if (currentTemplateId === "templateTest") {
    docEl.className = "resume-document-wrapper template-test-wrapper";
    docEl.innerHTML = renderTemplateTest(currentResumeData);
  } else if (currentTemplateId === "template2") {
    docEl.className = "resume-document-wrapper template2-wrapper";
    docEl.innerHTML = renderTemplate2(currentResumeData);
  } else {
    docEl.className = `resume-document-wrapper template-${currentTemplateId}-wrapper`;
    docEl.innerHTML = renderThemeTemplate(currentResumeData, currentTemplateId);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Read chosen template or default to templateTest
  currentTemplateId = safeGetString(STORAGE_KEYS.TEMPLATE, "templateTest");

  // Sync quick template dropdown selector
  const quickSelect = document.getElementById("quick-template-select");
  if (quickSelect) {
    quickSelect.value = currentTemplateId;
    quickSelect.addEventListener("change", (e) => {
      currentTemplateId = e.target.value;
      safeSetString(STORAGE_KEYS.TEMPLATE, currentTemplateId);
      renderCurrentResume();
    });
  }

  // Fetch real data from backend
  const loadingEl = document.getElementById("resume-loading");
  if (loadingEl) loadingEl.style.display = "block";

  const user = getLoggedInUser();
  const userId = user && user.userId ? user.userId : 1;

  try {
    currentResumeData = await fetchUserResume(userId);
    if (loadingEl) loadingEl.style.display = "none";
  } catch (err) {
    console.warn("Could not fetch resume from Spring Boot backend:", err);
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; color: #b91c1c;">
          <strong>Notice:</strong> Unable to connect to Spring Boot backend at <code>localhost:8080</code>.
          Displaying demo/saved cached view.
        </div>
      `;
    }
  }

  renderCurrentResume();
});
