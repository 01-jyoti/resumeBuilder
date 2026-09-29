/**
 * settings.js
 * Settings page — profile fields + preference toggles persisted
 * in localStorage, plus a "clear all resume data" danger action.
 */

const defaultSettings = {
  fullName: "",
  email: "",
  emailNotifications: true,
  autoSave: true,
};

function normalizeSettings(saved) {
  if (!saved || typeof saved !== "object") return { ...defaultSettings };
  return {
    fullName: typeof saved.fullName === "string" ? saved.fullName : "",
    email: typeof saved.email === "string" ? saved.email : "",
    emailNotifications:
      typeof saved.emailNotifications === "boolean"
        ? saved.emailNotifications
        : true,
    autoSave: typeof saved.autoSave === "boolean" ? saved.autoSave : true,
  };
}

let settings = normalizeSettings(safeGetJSON(STORAGE_KEYS.SETTINGS, null));
let saveToastTimer = null;
let clearMessageTimer = null;

function handleSave() {
  safeSetJSON(STORAGE_KEYS.SETTINGS, settings);

  const toast = document.getElementById("settings-save-toast");
  if (toast) {
    toast.textContent = "Settings saved!";
    toast.style.display = "inline-block";
    if (saveToastTimer) clearTimeout(saveToastTimer);
    saveToastTimer = setTimeout(() => {
      toast.style.display = "none";
    }, 2000);
  }
}

function handleClearData() {
  const confirmed = window.confirm(
    "This will permanently delete your saved resume content and template selection. Continue?"
  );
  if (!confirmed) return;

  safeRemove(STORAGE_KEYS.RESUME);
  safeRemove(STORAGE_KEYS.TEMPLATE);

  const msgEl = document.getElementById("clear-message");
  if (msgEl) {
    msgEl.textContent = "Resume data cleared.";
    msgEl.style.display = "block";
    if (clearMessageTimer) clearTimeout(clearMessageTimer);
    clearMessageTimer = setTimeout(() => {
      msgEl.style.display = "none";
    }, 2500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const fullNameInput = document.getElementById("settings-fullName");
  const emailInput = document.getElementById("settings-email");
  const notificationsToggle = document.getElementById(
    "settings-emailNotifications"
  );
  const autoSaveToggle = document.getElementById("settings-autoSave");

  const storedUser = getLoggedInUser();
  if (storedUser) {
    if (!settings.fullName && storedUser.fullName) settings.fullName = storedUser.fullName;
    if (!settings.email && storedUser.email) settings.email = storedUser.email;
  }

  if (fullNameInput) {
    fullNameInput.value = settings.fullName;
    fullNameInput.addEventListener("input", (e) => {
      settings.fullName = e.target.value;
      if (storedUser) {
        storedUser.fullName = e.target.value;
        localStorage.setItem("user", JSON.stringify(storedUser));
        updateSidebarUser();
      }
    });
  }

  if (emailInput) {
    emailInput.value = settings.email;
    emailInput.addEventListener("input", (e) => {
      settings.email = e.target.value;
      if (storedUser) {
        storedUser.email = e.target.value;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
    });
  }

  if (notificationsToggle) {
    notificationsToggle.checked = settings.emailNotifications;
    notificationsToggle.addEventListener("change", (e) => {
      settings.emailNotifications = e.target.checked;
    });
  }

  if (autoSaveToggle) {
    autoSaveToggle.checked = settings.autoSave;
    autoSaveToggle.addEventListener("change", (e) => {
      settings.autoSave = e.target.checked;
    });
  }

  const saveBtn = document.getElementById("settings-save-btn");
  if (saveBtn) saveBtn.addEventListener("click", handleSave);

  const clearBtn = document.getElementById("settings-clear-btn");
  if (clearBtn) clearBtn.addEventListener("click", handleClearData);
});
