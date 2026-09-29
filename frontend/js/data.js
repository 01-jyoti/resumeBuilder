/**
 * data.js
 * Central data definitions and helper functions for ResumeCraft.
 * Connects frontend pages to the Spring Boot REST backend.
 */

// 1. Available Resume Templates
const templates = [
  {
    id: "templateTest",
    name: "ATS Classic",
    subtitle: "Software Developer ATS Format",
    badge: "Recommended",
    description: "Clean single-column ATS-compliant layout with structured sections for technical skills, projects, and work experience. (templateTest.html)",
    file: "templateTest.html"
  },
  {
    id: "template2",
    name: "Modern Indigo",
    subtitle: "Indigo Header Accent",
    badge: "Popular",
    description: "Contemporary layout with stylish indigo headers, clear item dates, and pill badge skill tags. (template2.html)",
    file: "template2.html"
  },
  {
    id: "modern",
    name: "Modern Purple",
    subtitle: "Executive Violet",
    badge: "Modern",
    description: "Clean modern design with subtle violet accents and pill skill chips.",
    file: "my-resume.html"
  },
  {
    id: "professional",
    name: "Corporate Executive",
    subtitle: "Traditional Serif",
    badge: "Corporate",
    description: "Classic serif typography and high contrast divider lines for corporate, finance, and legal roles.",
    file: "my-resume.html"
  },
  {
    id: "minimal",
    name: "Minimal Monochrome",
    subtitle: "Minimalist Clean",
    badge: "Minimal",
    description: "Stripped-down, distraction-free monochrome layout that emphasizes clarity and impact.",
    file: "my-resume.html"
  }
];

// 2. Helper: Get logged-in user safely from localStorage
function getLoggedInUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// 3. Helper: Update sidebar user name and avatar
function updateSidebarUser() {
  const storedUser = getLoggedInUser();
  if (!storedUser) return;

  const nameEl = document.querySelector(".sidebar-user-name");
  if (nameEl && storedUser.fullName) {
    nameEl.textContent = storedUser.fullName;
  }

  const avatarEl = document.querySelector(".sidebar-avatar");
  if (avatarEl && storedUser.fullName) {
    avatarEl.textContent = storedUser.fullName.charAt(0).toUpperCase();
  }
}

// 4. Helper: Fetch resume data from Spring Boot API
async function fetchUserResume(userId) {
  if (!userId) {
    const user = getLoggedInUser();
    userId = user && user.userId ? user.userId : 1;
  }
  const apiUrl = `http://localhost:8080/api/resumes/user/${userId}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`API returned HTTP ${response.status}`);
  }
  return await response.json();
}

// 5. Helper: Populate DOM elements safely with database resume data
function populateData(d) {
  if (!d) return;

  const storedUser = getLoggedInUser();
  const fullName = d.fullName || (d.user && d.user.fullName) || (storedUser && storedUser.fullName) || "John Doe";
  const email = d.email || (d.user && d.user.email) || (storedUser && storedUser.email) || "";
  const jobTitle = d.jobTitle || "";
  const phone = d.phone || "";
  const location = d.location || "";
  const summary = d.summary || "";
  const linkedin = d.linkedin || "";
  const github = d.github || "";
  const portfolio = d.portfolio || "";

  // Safe setText
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text !== null && text !== undefined ? text : "";
    }
  };

  // Safe setLink
  const setLink = (id, url, defaultLabel) => {
    const el = document.getElementById(id);
    const sep = document.getElementById(id + "-separator");
    if (!el) return;
    if (url && url.trim()) {
      el.href = url.startsWith("http://") || url.startsWith("https://") ? url : "https://" + url;
      el.style.display = "inline";
      if (defaultLabel && (!el.textContent || el.textContent.trim() === "")) {
        el.textContent = defaultLabel;
      }
      if (sep) sep.style.display = "inline";
    } else {
      el.style.display = "none";
      if (sep) sep.style.display = "none";
    }
  };

  // -------------------------------------------------------------
  // Template 1 / templateTest.html IDs
  // -------------------------------------------------------------
  setText("fullName", fullName);
  setText("jobTitle", jobTitle);
  setText("summary", summary);
  setText("phone", phone);
  setText("email", email);
  setText("location", location);

  setLink("linkedin", linkedin, "LinkedIn");
  setLink("github", github, "GitHub");
  setLink("portfolio", portfolio, "Portfolio");

  // Education
  setText("eduDegree", d.degree || "");
  setText("eduInstitution", d.institution || "");
  setText("eduStart", d.startYear != null ? d.startYear : "");
  setText("eduEnd", d.endYear != null ? d.endYear : "");
  setText("eduGrade", d.grade || "");

  // Skills for templateTest (skillsContainer)
  const skillsContainer = document.getElementById("skillsContainer");
  if (skillsContainer) {
    skillsContainer.innerHTML = "";
    if (d.skills) {
      let skillsArray = [];
      if (Array.isArray(d.skills)) {
        skillsArray = d.skills;
      } else if (typeof d.skills === "string") {
        skillsArray = d.skills.split(",").map(s => s.trim()).filter(Boolean);
      }
      skillsArray.forEach(skill => {
        if (skill) {
          const span = document.createElement("span");
          span.className = "skill-tag";
          span.textContent = skill;
          skillsContainer.appendChild(span);
        }
      });
    }
  }

  // Projects
  setText("projectName", d.projectName || "");
  setText("projectTech", d.technologies ? `Technologies: ${d.technologies}` : "");
  setText("projectDesc", d.projectDescription || "");
  setLink("projectGithub", d.projectGithub, "GitHub");
  setLink("projectLive", d.projectLive, "Live Demo");

  // Experience
  setText("expTitle", d.experienceTitle || "");
  setText("expCompany", d.company || "");
  setText("expStart", d.experienceStart || "");
  setText("expEnd", d.experienceEnd || "");
  setText("expDesc", d.experienceDescription || "");

  // -------------------------------------------------------------
  // Template 2 / template2.html IDs (cv-*)
  // -------------------------------------------------------------
  setText("cv-name", fullName);
  setText("cv-job-title", jobTitle);
  setText("cv-summary", summary);

  const cvPhoneEl = document.getElementById("cv-phone");
  if (cvPhoneEl) {
    cvPhoneEl.textContent = phone ? `📱 ${phone}` : "";
    cvPhoneEl.style.display = phone ? "inline-flex" : "none";
  }

  const cvLocEl = document.getElementById("cv-location");
  if (cvLocEl) {
    cvLocEl.textContent = location ? `📍 ${location}` : "";
    cvLocEl.style.display = location ? "inline-flex" : "none";
  }

  setLink("cv-linkedin", linkedin, "LinkedIn");
  setLink("cv-github", github, "GitHub");

  setText("cv-exp-title", d.experienceTitle || "");
  const expDates = (d.experienceStart || d.experienceEnd)
    ? `${d.experienceStart || ""} – ${d.experienceEnd || "Present"}`
    : "";
  setText("cv-exp-dates", expDates);
  setText("cv-company", d.company || "");
  setText("cv-exp-desc", d.experienceDescription || "");

  setText("cv-degree", d.degree || "");
  const eduDates = (d.startYear || d.endYear)
    ? `${d.startYear || ""} – ${d.endYear || ""}`
    : "";
  setText("cv-edu-dates", eduDates);
  setText("cv-institution", d.institution || "");

  setText("cv-project-name", d.projectName || "");
  setText("cv-project-tech", d.technologies || "");
  setText("cv-project-desc", d.projectDescription || "");

  const cvSkillsList = document.getElementById("cv-skills-list");
  if (cvSkillsList) {
    cvSkillsList.innerHTML = "";
    if (d.skills) {
      let skillsArray = [];
      if (Array.isArray(d.skills)) {
        skillsArray = d.skills;
      } else if (typeof d.skills === "string") {
        skillsArray = d.skills.split(",").map(s => s.trim()).filter(Boolean);
      }
      skillsArray.forEach(skill => {
        if (skill) {
          const badge = document.createElement("span");
          badge.className = "skill-badge";
          badge.textContent = skill;
          cvSkillsList.appendChild(badge);
        }
      });
    }
  }
}

// 6. Automated loader for standalone template pages (e.g. templateTest.html or template2.html)
async function loadResumeData() {
  // Only execute if page has resume-specific elements
  const isResumePage = document.getElementById("fullName") || 
                       document.getElementById("cv-name") || 
                       document.getElementById("resume-content") ||
                       document.querySelector(".resume") ||
                       document.querySelector(".resume-container");
  
  // Also avoid interfering on my-resume.html where preview.js manages the document lifecycle
  if (!isResumePage || document.getElementById("resume-document")) {
    return;
  }

  const user = getLoggedInUser();
  const userId = user && user.userId ? user.userId : 1; // Fallback to 1 for standalone direct testing

  const loadingEl = document.getElementById("loading-message");
  const contentEl = document.getElementById("resume-content");

  try {
    const data = await fetchUserResume(userId);
    if (!data) {
      if (loadingEl) {
        loadingEl.textContent = "No resume found. Please enter your information first.";
      }
      return;
    }

    populateData(data);

    if (loadingEl) loadingEl.style.display = "none";
    if (contentEl) contentEl.style.display = "block";
  } catch (error) {
    console.warn("Could not fetch resume from Spring Boot backend:", error);
    if (loadingEl) {
      loadingEl.textContent = "Could not connect to Spring Boot backend (localhost:8080).";
      loadingEl.style.color = "#ef4444";
    }
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  updateSidebarUser();
  loadResumeData();
});