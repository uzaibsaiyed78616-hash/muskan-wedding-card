const stageEnvelope = document.getElementById("stageEnvelope");
const envelopeBox = document.getElementById("envelopeBox");
const stageDoors = document.getElementById("stageDoors");
const websiteContainer = document.getElementById("websiteContainer");
const transitionOverlay = document.getElementById("pageTransitionOverlay");
const pageDots = document.getElementById("pageDots");
const petalsContainer = document.getElementById("petals-container");

let petalInterval = null;

// ================= ROYAL SOUND EFFECT =================
function playRoyalSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const notes = [523.25, 554.37, 659.25, 698.46, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(
        0.12,
        ctx.currentTime + i * 0.14 + 0.05,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + i * 0.14 + 1.3,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.14);
      osc.stop(ctx.currentTime + i * 0.14 + 1.35);
    });
  } catch (e) {}
}

// ================= FLOWERS SHOWER =================
function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  const size = Math.random() * 14 + 10 + "px";
  petal.style.width = size;
  petal.style.height = size;
  petal.style.left = Math.random() * 100 + "vw";
  const duration = Math.random() * 4 + 4;
  petal.style.animationDuration = duration + "s";
  const colors = [
    "radial-gradient(circle at 30% 30%, #fffdf9, #f5d0a9)",
    "radial-gradient(circle at 30% 30%, #fff0f3, #f497b6)",
    "radial-gradient(circle at 30% 30%, #fff9db, #e0b84c)",
    "radial-gradient(circle at 30% 30%, #ffe3e3, #d64550)",
  ];
  petal.style.background = colors[Math.floor(Math.random() * colors.length)];
  petalsContainer.appendChild(petal);
  setTimeout(() => petal.remove(), duration * 1000);
}

function burstFlowers(count = 50) {
  for (let i = 0; i < count; i++) {
    setTimeout(createPetal, i * 40);
  }
}

function startContinuousFlowers() {
  if (!petalInterval) {
    petalInterval = setInterval(createPetal, 380);
  }
}

function stopFlowers() {
  clearInterval(petalInterval);
  petalInterval = null;
}

// ================= START STORY SEQUENCE =================
function startStorySequence() {
  playRoyalSound();
  envelopeBox.classList.add("open");

  setTimeout(() => {
    burstFlowers(50);
    startContinuousFlowers();
  }, 450);

  setTimeout(() => {
    stageEnvelope.classList.add("hide");
    stageDoors.classList.add("active");
  }, 1700);

  setTimeout(() => {
    stageDoors.classList.add("opened");
    websiteContainer.classList.add("visible");
    pageDots.style.display = "flex";
  }, 2800);
}

// ================= CINEMATIC PAGE TRANSITION (BLACKOUT EFFECT) =================
function goToPage(pageNum) {
  playRoyalSound();
  transitionOverlay.classList.add("active");

  setTimeout(() => {
    const targetPage = document.getElementById(`page${pageNum}`);
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: "instant" });
    }
    updateDots(pageNum);
  }, 500);

  setTimeout(() => {
    transitionOverlay.classList.remove("active");
  }, 850);
}

// Update Dots Indicator based on scroll position
websiteContainer.addEventListener("scroll", () => {
  const scrollPos = websiteContainer.scrollTop;
  const pageHeight = window.innerHeight;
  const currentIndex = Math.round(scrollPos / pageHeight) + 1;
  updateDots(currentIndex);
});

function updateDots(activeNum) {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    if (idx + 1 === activeNum) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// ================= REPLAY INVITATION =================
function replayAll() {
  websiteContainer.scrollTo({ top: 0, behavior: "instant" });
  stopFlowers();
  websiteContainer.classList.remove("visible");
  pageDots.style.display = "none";
  stageDoors.classList.remove("opened", "active");
  envelopeBox.classList.remove("open");
  stageEnvelope.classList.remove("hide");
}

// ================= LIVE COUNTDOWN =================
const targetDate = new Date("December 10, 2026 11:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;
  if (diff <= 0) return;

  document.getElementById("days").innerText = String(
    Math.floor(diff / (1000 * 60 * 60 * 24)),
  ).padStart(2, "0");
  document.getElementById("hours").innerText = String(
    Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  ).padStart(2, "0");
  document.getElementById("mins").innerText = String(
    Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  ).padStart(2, "0");
  document.getElementById("secs").innerText = String(
    Math.floor((diff % (1000 * 60)) / 1000),
  ).padStart(2, "0");
}, 1000);

// ================= SPARKLES CANVAS =================
const canvas = document.getElementById("sparkleCanvas");
const ctx = canvas.getContext("2d");
let sparkles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

for (let i = 0; i < 40; i++) {
  sparkles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.6,
    dy: -Math.random() * 0.5 - 0.2,
    alpha: Math.random(),
  });
}

function drawSparkles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparkles.forEach((s) => {
    s.y += s.dy;
    if (s.y < 0) s.y = canvas.height;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 228, 132, ${s.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawSparkles);
}
drawSparkles();
