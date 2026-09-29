/**
 * dashboard.js
 * Renders the Dashboard page: Profile Completeness, Active Resume,
 * Recent Resumes (left) and Recommended Templates (right).
 */

function renderResumeCard(resume) {
  const resumeTitle = resume.resumeName || resume.title || resume.jobTitle || "My Resume";
  const subtitle = resume.jobTitle ? `${resume.jobTitle} • Active` : "Updated Active Resume";

  return `
    <a href="my-resume.html" style="text-decoration: none; color: inherit;">
      <div class="resume-card">
        <div class="resume-card-icon">${ICONS.fileText(20)}</div>
        <div class="resume-card-content">
          <h3>${escapeHTML(resumeTitle)}</h3>
          <p>${escapeHTML(subtitle)}</p>
        </div>
        <button class="resume-card-menu" type="button" aria-label="View Resume" title="View Resume">
          ${ICONS.arrowLeft ? ICONS.arrowLeft(16) : "→"}
        </button>
      </div>
    </a>
  `;
}

function renderTemplateMiniCard(template) {
  return `
    <a href="templates.html" style="text-decoration: none; color: inherit;">
      <div class="template-mini-card">
        <div class="template-mini-preview">${ICONS.template(22)}</div>
        <div class="template-mini-info">
          <h3>${escapeHTML(template.name)}</h3>
          <p>${escapeHTML(template.description)}</p>
        </div>
      </div>
    </a>
  `;
}

function calculateCompleteness(data) {
  if (!data) return 0;
  
  let completedSections = 0;
  let totalSections = 5;

  // 1. Personal Info
  if ((data.jobTitle && data.jobTitle.trim() !== "") || 
      (data.phone && data.phone.trim() !== "") || 
      (data.location && data.location.trim() !== "")) {
    completedSections++;
  }

  // 2. Summary
  if (data.summary && data.summary.trim() !== "") {
    completedSections++;
  }

  // 3. Education
  if (data.degree && data.degree.trim() !== "") {
    completedSections++;
  }

  // 4. Skills
  if (data.skills && data.skills.trim() !== "") {
    completedSections++;
  }

  // 5. Projects or Experience
  if ((data.projectName && data.projectName.trim() !== "") || (data.company && data.company.trim() !== "")) {
    completedSections++;
  }

  return Math.round((completedSections / totalSections) * 100);
}

document.addEventListener("DOMContentLoaded", async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  let resumeData = null;

  // Fetch real resume data from the backend database
  if (storedUser && storedUser.userId) {
    try {
      const response = await fetch(`http://localhost:8080/api/resumes/user/${storedUser.userId}`);
      if (response.ok) {
        resumeData = await response.json();
      }
    } catch (err) {
      console.warn("Could not fetch resume data for dashboard:", err);
    }
  }

  // 1. Profile completeness stat
  const completionEl = document.getElementById("stat-completion-value");
  if (completionEl) {
    const percent = calculateCompleteness(resumeData);
    completionEl.textContent = `${percent}%`;
  }

  // 2. Active resume card
  const activeResumeEl = document.getElementById("active-resume-card");
  if (activeResumeEl) {
    if (resumeData) {
      activeResumeEl.innerHTML = renderResumeCard(resumeData);
    } else {
      activeResumeEl.innerHTML = `
        <div style="background: var(--color-surface, #1e1e2d); border: 1px dashed var(--color-border, #2e2e42); padding: 24px; border-radius: 8px; text-align: center;">
          <p class="empty-hint" style="margin-bottom: 12px;">No active resume found.</p>
          <a href="enterInfo.html" class="btn btn-primary" style="display: inline-block; padding: 8px 18px; border-radius: 6px; text-decoration: none; font-size: 13px;">Create Your Resume</a>
        </div>
      `;
    }
  }

  // 3. Recent resumes
  const recentListEl = document.getElementById("recent-resumes-list");
  const recentBadgeEl = document.getElementById("recent-resumes-badge");
  const recentResumesArray = resumeData ? [resumeData] : [];
  
  if (recentBadgeEl) {
    recentBadgeEl.textContent = `${recentResumesArray.length} total`;
  }
  if (recentListEl) {
    recentListEl.innerHTML = recentResumesArray.length
      ? recentResumesArray.map(renderResumeCard).join("")
      : '<p class="empty-hint">No resumes yet. <a href="enterInfo.html" style="color: #a78bfa;">Enter your details</a> to get started.</p>';
  }

  // 4. Recommended templates
  const templatesListEl = document.getElementById("recommended-templates-list");
  if (templatesListEl) {
    templatesListEl.innerHTML = typeof templates !== "undefined" && templates.length
      ? templates.slice(0, 3).map(renderTemplateMiniCard).join("")
      : '<p class="empty-hint">No templates available.</p>';
  }
});
