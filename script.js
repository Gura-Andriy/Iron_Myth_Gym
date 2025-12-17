"use strict";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Testimonials (Array)
const testimonials = [
  {
    name: "Chuck Norris",
    tag: "Gravity Consultant",
    quote: "They say nothing is heavier than a black hole. You just haven’t tried their barbells."
  },
  {
    name: "Saitama",
    tag: "One-Punch Intern",
    quote: "I thought I was strong. Then I trained here."
  },
  {
    name: "Vasyl Virastyuk",
    tag: "Locomotive Replacement",
    quote: "After this gym, I was offered a job replacing a locomotive. I declined. Too easy."
  },
  {
    name: "Superman",
    tag: "Kryptonite Survivor",
    quote: "I used to fear kryptonite. Now it avoids me."
  },
  {
    name: "Hercules",
    tag: "12-Labors Veteran",
    quote: "Compared to their training, my twelve labors were a vacation."
  },
  {
    name: "Physics",
    tag: "Law Enforcement",
    quote: "I thought my laws couldn’t be broken — until I walked into this gym."
  },
  {
    name: "Atlas",
    tag: "Planet Holder",
    quote: "I used to hold the Earth. After training here, my job said they’ll upgrade me to Jupiter."
  },
  {
    name: "Kratos",
    tag: "Olympus Trainer",
    quote: "I used to train on Olympus — Olympus is not worthy of this gym."
  }
];

// DOM
const quoteText = document.getElementById("quoteText");
const quoteName = document.getElementById("quoteName");
const quoteTag = document.getElementById("quoteTag");
const btnNewQuote = document.getElementById("btnNewQuote");

// Parallax bg DOM
const bg = document.getElementById("bg");

// State
let lastIndex = -1;
let autoTimer = null;
let ticking = false;

// Helpers
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function renderTestimonial(t) {
  quoteText.textContent = t.quote;
  quoteName.textContent = `— ${t.name}`;
  quoteTag.textContent = t.tag ? t.tag : "";
}

function pickNewTestimonial() {
  // Loop to avoid repeating the same review twice in a row
  let idx = getRandomIndex(testimonials.length);
  while (idx === lastIndex && testimonials.length > 1) {
    idx = getRandomIndex(testimonials.length);
  }
  lastIndex = idx;
  renderTestimonial(testimonials[idx]);
}

function startAutoRotation() {
  // Auto rotate every ~5 seconds (as requested earlier)
  autoTimer = setInterval(pickNewTestimonial, 7000);
}

// Event handling
btnNewQuote.addEventListener("click", () => {
  pickNewTestimonial();
});

// ===== Parallax + blur on scroll =====
function updateParallax() {
  const y = window.scrollY || 0;

  // background moves upward slower than scroll
  const speed = 0.25; // tweak 0.18..0.35
  const translateY = -(y * speed);

  // blur increases with scroll (cap)
  const blur = Math.min(12, y / 220); // max 12px

  // optional slight dim as you scroll (keeps readability)
  const dim = Math.min(0.22, y / 4500);

  if (bg) {
    bg.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.06)`;
    bg.style.filter = `blur(${blur}px) brightness(${1 - dim})`;
  }

  ticking = false;
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateParallax);
  }
}

updateParallax();
window.addEventListener("scroll", onScroll, { passive: true });

// Initial
pickNewTestimonial();
startAutoRotation();
