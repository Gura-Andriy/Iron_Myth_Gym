"use strict";

// footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Toggle details on Special Programs cards
const buttons = document.querySelectorAll(".details-btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const panel = document.getElementById(targetId);
    if (!panel) return;

    const isHidden = panel.hasAttribute("hidden");

    // Close other panels (nice UX)
    document.querySelectorAll(".details").forEach((d) => d.setAttribute("hidden", ""));

    if (isHidden) {
      panel.removeAttribute("hidden");
      // optional: change button text a bit
      btn.textContent = "Hide";
    } else {
      panel.setAttribute("hidden", "");
    }

    // Reset other buttons text
    document.querySelectorAll(".details-btn").forEach((b) => {
      if (b !== btn) {
        const t = b.getAttribute("data-target");
        b.textContent = (t === "legendDetails") ? "View Terms" : "How It Works";
      }
    });

    // restore own label when closing
    if (!isHidden) {
      btn.textContent = (targetId === "legendDetails") ? "View Terms" : "How It Works";
    }
  });
});
