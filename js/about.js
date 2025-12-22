"use strict";

// footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// No-op social links (click does nothing)
document.querySelectorAll('a[data-noop="true"]').forEach((a) => {
  a.addEventListener("click", (e) => e.preventDefault());
});
