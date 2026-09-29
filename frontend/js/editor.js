/**
 * editor.js
 * Resume Editor page logic — loads and saves data from/to Spring Boot backend.
 */

const TABS = [
  { id: "personal", label: "Personal Info" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
];

function createEmptyResume() {
  return {
    title: "My Resume",
    personalInfo: { fullName: "", email: "", phone: "", location: "", summary: "" },
    experience: [],
    education: [],
    skills: []
  };
}

function normalizeResume(saved) {
  const base = createEmptyResume();
  if (!saved || typeof saved !== "object") return base;

  return {
    title: typeof saved.title === "string" ? saved.title : base.title,
    personalInfo: {
      ...base.personalInfo,
      ...(saved.personalInfo && typeof saved.personalInfo === "object"
        ? saved.personalInfo
        : {}),
    },
    experience: Array.isArray(saved.experience) ? saved.experience : [],
    education: Array.isArray(saved.education) ? saved.education : [],
    skills: Array.isArray(saved.skills) ? saved.skills : [],
  };
}

function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

let resumeData = createEmptyResume();
let activeTab = "personal";
let saveToastTimer = null;

/* ---------------------------------------------------------
    Tabs
    --------------------------------------------------------- */

function renderTabs() {
  const tabsEl = document.getElementById("editor-tabs");
  if (!tabsEl) return;

  tabsEl.innerHTML = TABS.map(
    (tab) => `
      <button type="button" class="editor-tab ${
        tab.id === activeTab ? "active" : ""
      }" data-tab="${tab.id}">
        ${escapeHTML(tab.label)}
      </button>
    `
  ).join("");

  tabsEl.querySelectorAll(".editor-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.getAttribute("data-tab");
      renderTabs();
      renderActiveSection();
    });
  });
}

function renderActiveSection() {
  TABS.forEach((tab) => {
    const sectionEl = document.getElementById(`section-${tab.id}`);
    if (sectionEl) {
      sectionEl.classList.toggle("active", tab.id === activeTab);
    }
  });
}

/* ---------------------------------------------------------
    Personal Info
    --------------------------------------------------------- */

function initPersonalInfo() {
  const fields = ["fullName", "email", "phone", "location", "summary"];
  fields.forEach((field) => {
    const el = document.getElementById(`personal-${field}`);
    if (!el) return;
    el.value = resumeData.personalInfo[field] || "";
    el.addEventListener("input", (e) => {
      resumeData.personalInfo[field] = e.target.value;
    });
  });
}

/* ---------------------------------------------------------
    Experience
    --------------------------------------------------------- */

function renderExperience() {
  const listEl = document.getElementById("experience-list");
  const emptyEl = document.getElementById("experience-empty");
  if (!listEl) return;

  if (resumeData.experience.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";

  listEl.innerHTML = resumeData.experience
    .map(
      (entry, index) => `
      <div class="entry-card" data-id="${entry.id}">
        <div class="entry-card-header">
          <span class="entry-label">Experience ${index + 1}</span>
          <button type="button" class="btn-remove" data-remove-experience="${
            entry.id
          }" aria-label="Remove experience">${ICONS.trash(16)}</button>
        </div>
        <div class="form-grid">
          <div class="form-field">
            <label>Company</label>
            <input type="text" data-field="company" data-id="${
              entry.id
            }" value="${escapeHTML(entry.company || "")}" placeholder="e.g. Google" />
          </div>
          <div class="form-field">
            <label>Role</label>
            <input type="text" data-field="role" data-id="${
              entry.id
            }" value="${escapeHTML(
        entry.role || ""
      )}" placeholder="e.g. Software Engineer" />
          </div>
          <div class="form-field">
            <label>Start Date</label>
            <input type="text" data-field="startDate" data-id="${
              entry.id
            }" value="${escapeHTML(
        entry.startDate || ""
      )}" placeholder="e.g. Jan 2024" />
          </div>
          <div class="form-field">
            <label>End Date</label>
            <input type="text" data-field="endDate" data-id="${
              entry.id
            }" value="${escapeHTML(
        entry.endDate || ""
      )}" placeholder="e.g. Present" />
          </div>
        </div>
        <div class="form-field">
          <label>Description</label>
          <textarea rows="4" data-field="description" data-id="${
            entry.id
          }" placeholder="Describe your responsibilities...">${escapeHTML(
        entry.description || ""
      )}</textarea>
        </div>
      </div>
    `
    )
    .join("");

  listEl.querySelectorAll("input[data-field], textarea[data-field]").forEach(
    (input) => {
      input.addEventListener("input", (e) => {
        const id = e.target.getAttribute("data-id");
        const field = e.target.getAttribute("data-field");
        const entry = resumeData.experience.find((item) => item.id === id);
        if (entry) entry[field] = e.target.value;
      });
    }
  );

  listEl.querySelectorAll("[data-remove-experience]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove-experience");
      resumeData.experience = resumeData.experience.filter(
        (entry) => entry.id !== id
      );
      renderExperience();
    });
  });
}

function addExperience() {
  resumeData.experience.push({
    id: uid(),
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  renderExperience();
}

/* ---------------------------------------------------------
    Education
    --------------------------------------------------------- */

function renderEducation() {
  const listEl = document.getElementById("education-list");
  const emptyEl = document.getElementById("education-empty");
  if (!listEl) return;

  if (resumeData.education.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";

  listEl.innerHTML = resumeData.education
    .map(
      (entry, index) => `
      <div class="entry-card" data-id="${entry.id}">
        <div class="entry-card-header">
          <span class="entry-label">Education ${index + 1}</span>
          <button type="button" class="btn-remove" data-remove-education="${
            entry.id
          }" aria-label="Remove education">${ICONS.trash(16)}</button>
        </div>
        <div class="form-grid">
          <div class="form-field">
            <label>School / College</label>
            <input type="text" data-field="school" data-id="${
              entry.id
            }" value="${escapeHTML(
        entry.school || ""
      )}" placeholder="e.g. University of Mumbai" />
          </div>
          <div class="form-field">
            <label>Degree</label>
            <input type="text" data-field="degree" data-id="${
              entry.id
            }" value="${escapeHTML(
        entry.degree || ""
      )}" placeholder="e.g. B.Tech Computer Science" />
          </div>
          <div class="form-field">
            <label>Start Date</label>
            <input type="text" data-field="startDate" data-id="${
              entry.id
            }" value="${escapeHTML(entry.startDate || "")}" placeholder="e.g. 2022" />
          </div>
          <div class="form-field">
            <label>End Date</label>
            <input type="text" data-field="endDate" data-id="${
              entry.id
            }" value="${escapeHTML(entry.endDate || "")}" placeholder="e.g. 2026" />
          </div>
        </div>
      </div>
    `
    )
    .join("");

  listEl.querySelectorAll("input[data-field]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const entry = resumeData.education.find((item) => item.id === id);
      if (entry) entry[field] = e.target.value;
    });
  });

  listEl.querySelectorAll("[data-remove-education]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove-education");
      resumeData.education = resumeData.education.filter(
        (entry) => entry.id !== id
      );
      renderEducation();
    });
  });
}

function addEducation() {
  resumeData.education.push({
    id: uid(),
    school: "",
    degree: "",
    startDate: "",
    endDate: "",
  });
  renderEducation();
}

/* ---------------------------------------------------------
    Skills
    --------------------------------------------------------- */

function renderSkills() {
  const tagsEl = document.getElementById("skill-tags");
  const emptyEl = document.getElementById("skills-empty");
  if (!tagsEl) return;

  if (resumeData.skills.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    tagsEl.innerHTML = "";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";

  tagsEl.innerHTML = resumeData.skills
    .map(
      (skill) => `
      <div class="skill-tag">
        <span>${escapeHTML(skill)}</span>
        <button type="button" data-remove-skill="${escapeHTML(
          skill
        )}" aria-label="Remove ${escapeHTML(skill)}">${ICONS.x(14)}</button>
      </div>
    `
    )
    .join("");

  tagsEl.querySelectorAll("[data-remove-skill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const skill = btn.getAttribute("data-remove-skill");
      resumeData.skills = resumeData.skills.filter((s) => s !== skill);
      renderSkills();
    });
  });
}

function addSkillFromInput() {
  const input = document.getElementById("skill-input");
  if (!input) return;
  const skill = input.value.trim();
  if (!skill || resumeData.skills.includes(skill)) return;
  resumeData.skills.push(skill);
  input.value = "";
  renderSkills();
}

/* ---------------------------------------------------------
    Save to Backend API
    --------------------------------------------------------- */

function showSaveToast() {
  const toast = document.getElementById("editor-save-toast");
  if (!toast) return;
  toast.textContent = "Saved!";
  toast.style.display = "inline-block";
  if (saveToastTimer) clearTimeout(saveToastTimer);
  saveToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

async function handleSave() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser.userId) {
    alert("Session expired. Please log in again.");
    window.location.href = "login.html";
    return;
  }

  // Flatten/map frontend state to your backend fields if necessary
  const backendPayload = {
    // Grab the title from the input field, fallback to "My Resume"
    resumeName: document.getElementById("resume-title-input")?.value || "My Resume",
    
    jobTitle: resumeData.personalInfo.jobTitle || "Software Developer",
    phone: resumeData.personalInfo.phone,
    location: resumeData.personalInfo.location,
    summary: resumeData.personalInfo.summary,
    
    // Grab first item from array if available, or empty
    degree: resumeData.education[0]?.degree || "",
    institution: resumeData.education[0]?.school || "",
    startYear: Number(resumeData.education[0]?.startDate) || 2020,
    endYear: Number(resumeData.education[0]?.endDate) || 2024,
    grade: "3.8 GPA",

    skills: resumeData.skills.join(", "),

    projectName: "Resume Builder",
    technologies: "Spring Boot, MySQL",
    projectDescription: "Full stack web app",
    projectGithub: "",
    projectLive: "",

    company: resumeData.experience[0]?.company || "",
    experienceTitle: resumeData.experience[0]?.role || "",
    experienceStart: resumeData.experience[0]?.startDate || "",
    experienceEnd: resumeData.experience[0]?.endDate || "",
    experienceDescription: resumeData.experience[0]?.description || ""
  };

  try {
    const response = await fetch(`http://localhost:8080/api/resumes/save/${storedUser.userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload)
    });

    if (response.ok) {
      showSaveToast();
    } else {
      alert("Failed to save changes.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error while saving.");
  }
}

/* ---------------------------------------------------------
    Init & Fetch Data from Backend
    --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  let fetchedData = null; // Declare outside try block so it's accessible

  if (storedUser && storedUser.userId) {
    try {
      const response = await fetch(`http://localhost:8080/api/resumes/user/${storedUser.userId}`);
      if (response.ok) {
        fetchedData = await response.json();
        // If your backend returns a resume object, map it back to the editor format
        if (fetchedData) {
          resumeData = {
            title: fetchedData.resumeName || "My Resume",
            personalInfo: {
              fullName: storedUser.fullName || "",
              email: storedUser.email || "",
              phone: fetchedData.phone || "",
              location: fetchedData.location || "",
              summary: fetchedData.summary || ""
            },
            experience: fetchedData.company ? [{
              id: uid(),
              company: fetchedData.company,
              role: fetchedData.experienceTitle,
              startDate: fetchedData.experienceStart,
              endDate: fetchedData.experienceEnd,
              description: fetchedData.experienceDescription
            }] : [],
            education: fetchedData.degree ? [{
              id: uid(),
              school: fetchedData.institution,
              degree: fetchedData.degree,
              startDate: fetchedData.startYear ? String(fetchedData.startYear) : "",
              endDate: fetchedData.endYear ? String(fetchedData.endYear) : ""
            }] : [],
            skills: fetchedData.skills ? fetchedData.skills.split(",").map(s => s.trim()).filter(Boolean) : []
          };
        }
      }
    } catch (err) {
      console.error("Could not fetch resume data:", err);
    }
  }

  const titleInput = document.getElementById("resume-title-input");
  if (titleInput) {
    // Now 'fetchedData' is in scope and accessible here
    titleInput.value = fetchedData?.resumeName || resumeData.title || "My Resume";
    titleInput.addEventListener("input", (e) => {
      resumeData.title = e.target.value;
    });
  }

  renderTabs();
  renderActiveSection();
  initPersonalInfo();
  renderExperience();
  renderEducation();
  renderSkills();

  const saveBtn = document.getElementById("editor-save-btn");
  if (saveBtn) saveBtn.addEventListener("click", handleSave);

  const addExperienceBtn = document.getElementById("add-experience-btn");
  if (addExperienceBtn) addExperienceBtn.addEventListener("click", addExperience);

  const addEducationBtn = document.getElementById("add-education-btn");
  if (addEducationBtn) addEducationBtn.addEventListener("click", addEducation);

  const addSkillBtn = document.getElementById("add-skill-btn");
  if (addSkillBtn) addSkillBtn.addEventListener("click", addSkillFromInput);

  const skillInput = document.getElementById("skill-input");
  if (skillInput) {
    skillInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkillFromInput();
      }
    });
  }
});