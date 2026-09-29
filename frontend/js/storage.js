/**
 * storage.js
 * Shared localStorage keys + safe read/write helpers.
 * Handles invalid/corrupted localStorage data gracefully instead
 * of letting a JSON.parse error crash the page.
 */

const STORAGE_KEYS = {
  RESUME: "resumecraft_editor_data",
  TEMPLATE: "resumecraft_selected_template",
  SETTINGS: "resumecraft_settings",
};

/**
 * Safely read and JSON.parse a value from localStorage.
 * Returns `fallback` if the key is missing, storage is unavailable,
 * or the stored value is corrupted / not valid JSON.
 */
function safeGetJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") return fallback;
    return parsed;
  } catch (err) {
    console.warn(`ResumeCraft: could not read "${key}" from storage.`, err);
    return fallback;
  }
}

/** Safely JSON.stringify + write a value to localStorage. */
function safeSetJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`ResumeCraft: could not save "${key}" to storage.`, err);
    return false;
  }
}

/** Safely read a plain string value from localStorage. */
function safeGetString(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : raw;
  } catch (err) {
    console.warn(`ResumeCraft: could not read "${key}" from storage.`, err);
    return fallback;
  }
}

/** Safely write a plain string value to localStorage. */
function safeSetString(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`ResumeCraft: could not save "${key}" to storage.`, err);
    return false;
  }
}

function safeRemove(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`ResumeCraft: could not remove "${key}" from storage.`, err);
    return false;
  }
}

/** Escape text before injecting into innerHTML, to keep rendering safe. */
function escapeHTML(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
