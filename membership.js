"use strict";

/* ====== DATA (Arrays) ====== */
const programs = [
  { value: "king-kong-dad", label: "King Kong Dad Protocol (Beginner)" },
  { value: "spartan-strength", label: "Spartan Strength (Intermediate)" },
  { value: "godslayer", label: "Godslayer Combat Conditioning (Pro)" },
  { value: "legend-protocol", label: "Legend Protocol (Special)" },
  { value: "forced-motivation", label: "Forced Motivation Plan (Special)" },
];

const genders = ["Man", "Machine", "Demigod"];

/* ====== DOM ====== */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const form = document.getElementById("regForm");
const alertBox = document.getElementById("formAlert");
const summary = document.getElementById("summary");
const summaryBody = document.getElementById("summaryBody");

const fields = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  dob: document.getElementById("dob"),
  program: document.getElementById("program"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  email: document.getElementById("email"),
  gender: document.getElementById("gender"),
  physics: document.getElementById("physics"),
};

const errorEls = {
  firstName: document.getElementById("err-firstName"),
  lastName: document.getElementById("err-lastName"),
  dob: document.getElementById("err-dob"),
  program: document.getElementById("err-program"),
  password: document.getElementById("err-password"),
  confirmPassword: document.getElementById("err-confirmPassword"),
  email: document.getElementById("err-email"),
  gender: document.getElementById("err-gender"),
  physics: document.getElementById("err-physics"),
};

/* ====== INIT: inject select options ====== */
function fillSelectOptions(selectEl, items) {
  // Loop requirement
  for (let i = 0; i < items.length; i++) {
    const opt = document.createElement("option");
    opt.value = items[i].value;
    opt.textContent = items[i].label;
    selectEl.appendChild(opt);
  }
}

function fillGenderOptions(selectEl, items) {
  for (let i = 0; i < items.length; i++) {
    const opt = document.createElement("option");
    opt.value = items[i];
    opt.textContent = items[i];
    selectEl.appendChild(opt);
  }
}

fillSelectOptions(fields.program, programs);
fillGenderOptions(fields.gender, genders);

/* ====== UI helpers ====== */
function showAlert(message, type) {
  // type: "success" | "error" | ""
  alertBox.textContent = message;
  alertBox.classList.remove("is-success", "is-error");
  if (type === "success") alertBox.classList.add("is-success");
  if (type === "error") alertBox.classList.add("is-error");
}

function setError(fieldKey, message) {
  errorEls[fieldKey].textContent = message;
  const el = fields[fieldKey];
  if (el && el.classList) el.classList.add("input-error");
}

function clearError(fieldKey) {
  errorEls[fieldKey].textContent = "";
  const el = fields[fieldKey];
  if (el && el.classList) el.classList.remove("input-error");
}

function clearAllErrors() {
  // Loop requirement
  Object.keys(errorEls).forEach((k) => clearError(k));
  showAlert("", "");
}

/* ====== Validators (Functions + selection statements) ====== */
function isNonEmpty(value) {
  return value.trim().length > 0;
}

function validateEmail(email) {
  // Basic, acceptable email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email.trim());
}

function validatePassword(pw) {
  // At least 8 chars, 1 uppercase, 1 number
  const longEnough = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);

  // selection statements
  if (!longEnough) return "Password must be at least 8 characters.";
  if (!hasUpper) return "Password must include at least 1 uppercase letter.";
  if (!hasNumber) return "Password must include at least 1 number.";
  return ""; // OK
}

function getAgeFromDOB(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  return age;
}

function validateDOB(dobStr) {
  const age = getAgeFromDOB(dobStr);
  if (age === null) return "Please enter a valid date of birth.";
  if (age < 13) return "You must be at least 13 years old to register.";
  if (age > 100) return "Please enter a reasonable age (≤ 100).";
  return "";
}

/* ====== Main validation (Arrays + loops) ====== */
function validateForm() {
  clearAllErrors();
  summary.setAttribute("hidden", "");

  const errors = []; // array requirement

  // Required text/date/select fields list
  const required = ["firstName", "lastName", "dob", "program", "password", "confirmPassword", "email", "gender"];

  // Check required fields via loop
  required.forEach((key) => {
    const val = (fields[key].value || "").trim();
    if (!isNonEmpty(val)) {
      setError(key, "This field is required.");
      errors.push(`${key}: required`);
    }
  });

  // Email format
  if (isNonEmpty(fields.email.value) && !validateEmail(fields.email.value)) {
    setError("email", "Please enter a valid email address.");
    errors.push("email: invalid");
  }

  // DOB range
  if (isNonEmpty(fields.dob.value)) {
    const dobMsg = validateDOB(fields.dob.value);
    if (dobMsg) {
      setError("dob", dobMsg);
      errors.push("dob: invalid");
    }
  }

  // Password rules
  if (isNonEmpty(fields.password.value)) {
    const pwMsg = validatePassword(fields.password.value);
    if (pwMsg) {
      setError("password", pwMsg);
      errors.push("password: weak");
    }
  }

  // Confirm password match
  if (isNonEmpty(fields.password.value) && isNonEmpty(fields.confirmPassword.value)) {
    if (fields.password.value !== fields.confirmPassword.value) {
      setError("confirmPassword", "Passwords do not match.");
      errors.push("confirmPassword: mismatch");
    }
  }

  // Required checkbox
  if (!fields.physics.checked) {
    setError("physics", "You must check this box to proceed.");
    errors.push("physics: unchecked");
  }

  // Selection statements: final decision
  if (errors.length > 0) {
    showAlert("Please fix the highlighted fields and try again.", "error");
    return false;
  }

  showAlert("Registration looks good. Welcome to the myth (responsibly).", "success");
  renderSummary();
  return true;
}

/* ====== DOM manipulation: summary ====== */
function getProgramLabel(value) {
  const match = programs.find((p) => p.value === value);
  return match ? match.label : value;
}

function renderSummary() {
  const age = getAgeFromDOB(fields.dob.value);

  const items = [
    ["First Name", fields.firstName.value.trim()],
    ["Last Name", fields.lastName.value.trim()],
    ["Date of Birth", fields.dob.value],
    ["Age", age !== null ? String(age) : "—"],
    ["Program", getProgramLabel(fields.program.value)],
    ["Email", fields.email.value.trim()],
    ["Gender", fields.gender.value],
    ["Physics Laws", "Not familiar (confirmed)"],
  ];

  // build HTML list
  summaryBody.innerHTML = "";
  const ul = document.createElement("ul");
  ul.className = "summary-list";

  for (let i = 0; i < items.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="k">${items[i][0]}</span><span class="v">${items[i][1]}</span>`;
    ul.appendChild(li);
  }

  summaryBody.appendChild(ul);
  summary.removeAttribute("hidden");
}

/* ====== Events (event handling) ====== */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  validateForm();
});

form.addEventListener("reset", () => {
  clearAllErrors();
  summary.setAttribute("hidden", "");
  showAlert("Form cleared.", "");
});

// Live validation: clear errors as user edits
const liveClear = ["firstName", "lastName", "dob", "program", "password", "confirmPassword", "email", "gender"];
liveClear.forEach((key) => {
  fields[key].addEventListener("input", () => clearError(key));
  fields[key].addEventListener("change", () => clearError(key));
});

fields.physics.addEventListener("change", () => clearError("physics"));
