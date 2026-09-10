import "./styles/global.css";
import "./styles/login.css";
import "./styles/intro.css";
import "./styles/celebration.css";
import "./styles/home.css";
import confetti from "canvas-confetti";

import gsap from "gsap";
import { siteData } from "./data/siteData";
document.querySelector("#app").innerHTML = `
<section class="login-screen">
  <div class="stars"></div>
  <div class="overlay"></div>
  <div class="login-card">
    <div class="moon"></div>
    <h1>${siteData.greeting}</h1>
    <p>${siteData.subtitle}</p>

    <input
      id="password"
      type="password"
      placeholder="Enter Secret Word"
    >
    <button id="unlockBtn" class="login-btn">
      ${siteData.buttonText}
    </button>
    <p id="message"></p>
  </div>
</section>
`;

gsap.from(".login-card", {
  y: 80,
  opacity: 0,
  duration: 1.4,
  ease: "power4.out",
});

gsap.from(".moon", {
  scale: 0,
  duration: 1.5,
  delay: 0.3,
  ease: "elastic.out(1, 0.4)",
});

gsap.from(".login-card h1", {
  opacity: 0,
  y: 40,
  delay: 0.8,
  duration: 1,
});

gsap.from("input", {
  opacity: 0,
  delay: 1.1,
  duration: 0.8,
});

gsap.from("button", {
  opacity: 0,
  delay: 1.3,
  duration: 0.8,
});

const password = document.querySelector("#password");
const button = document.querySelector("#unlockBtn");
const message = document.querySelector("#message");
const starsContainer = document.querySelector(".stars");

const demoBirthdayNow = false;
const birthdayEventTime = demoBirthdayNow
  ? new Date()
  : new Date(2026, 6, 25, 0, 0, 0);
const birthdayEventWindowMs = 5 * 60 * 1000;

function createShootingStar() {
  const shooting = document.createElement("div");
  shooting.className = "shooting-star";
  shooting.style.left = Math.random() * 100 + "vw";
  shooting.style.top = Math.random() * 40 + "vh";
  starsContainer.appendChild(shooting);
  setTimeout(() => {
    shooting.remove();
  }, 1500);
}

setInterval(createShootingStar, 8000);

function createHeart() {
  const heart = document.createElement("div");
  heart.innerHTML = "❤️";
  heart.className = "heart";
  heart.style.left = Math.random() * 100 + "vw";
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 7000);
}

setInterval(createHeart, 900);

for (let i = 0; i < 180; i++) {
  const star = document.createElement("span");
  star.classList.add("star");
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 4 + "s";
  star.style.animationDuration = Math.random() * 3 + 2 + "s";
  star.style.opacity = Math.random();
  starsContainer.appendChild(star);
}

button.addEventListener("click", checkPassword);

password.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkPassword();
  }
});

scheduleBirthdayEvent();

function scheduleBirthdayEvent() {
  const now = new Date();
  const startTime = birthdayEventTime.getTime();
  const endTime = startTime + birthdayEventWindowMs;
  const delay = startTime - now.getTime();

  if (now.getTime() >= startTime && now.getTime() <= endTime) {
    showBirthdayEvent();
    return;
  }

  // Only schedule the event if it's in the future.
  if (delay > 0) {
    setTimeout(showBirthdayEvent, delay);
  }
}

function showBirthdayEvent() {
  if (document.querySelector(".birthday-event")) {
    return;
  }

  const dancingVideoUrl = new URL(
    "./assets/images/dancingcats.mp4",
    import.meta.url,
  ).href;

  document.querySelector("#app").innerHTML = `
    <section class="birthday-event">
      <div class="event-card">
        <h1>Happy Birthday!</h1>
        <p class="event-subtitle">The celebration begins now.</p>
        <video id="birthdayVideo" class="birthday-video" autoplay muted loop playsinline>
          <source src="${dancingVideoUrl}" type="video/mp4" />
          Your browser does not support embedded videos.
        </video>
        <audio id="birthdayAudio" loop></audio>
      </div>
    </section>
  `;

  const audio = document.getElementById("birthdayAudio");

  audio.src = new URL(
    "./assets/images/happybirthdaysong.mp3",
    import.meta.url,
  ).href;
  audio.volume = 0.7;
  audio.loop = true;

  let playbackTimeoutId = null;
  function scheduleReturnToHome() {
    if (playbackTimeoutId) clearTimeout(playbackTimeoutId);
    playbackTimeoutId = setTimeout(() => {
      try {
        audio.pause();
      } catch (e) {
        /* ignore */
      }
      showHome();
    }, birthdayEventWindowMs);
  }

  audio
    .play()
    .then(() => scheduleReturnToHome())
    .catch(() => scheduleReturnToHome());
}

function startIntro() {
  document.querySelector(".login-screen").remove();
  document.querySelector("#app").innerHTML = `
   <section class="intro-screen">
      <div class="intro-text"></div>
    </section> 
  `;
  const text = document.querySelector(".intro-text");
  const messages = [
    "My Dearest Husband,",
    "I made this little surprise to celebrate you and the love you bring to our family.",
    "Every moment with you and our chotu is precious to me.",
    "Happy Birthday, my love. ❤️",
  ];
  let i = 0;
  function nextMessage() {
    if (i === messages.length) {
      setTimeout(openHome, 1000);
      return;
    }
    text.textContent = messages[i];
    gsap.fromTo(
      text,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
      },
    );
    gsap.to(text, {
      opacity: 0,
      delay: 2,
      duration: 1,
      onComplete: () => {
        i++;
        nextMessage();
      },
    });
  }
  nextMessage();
}

function openHome() {
  celebration();
}

function celebration() {
  document.querySelector("#app").innerHTML = `

        <section class="celebration">

            <h1 class="birthday-title">
                🎉 Happy Birthday 🎉
            </h1>

            <h1 class="birthday-title">
                ${siteData.name}
            </h1>

            <button id="continue">
                Open My Surprise ❤️
            </button>

        </section>

    `;

  launchConfetti();

  animateCelebration();

  document.querySelector("#continue").addEventListener("click", showHome);
}

function checkPassword() {
  if (password.value.trim() === siteData.secretWord) {
    message.textContent = "✨ Welcome...";
    message.className = "success";
    setTimeout(startIntro, 1000);
  } else {
    message.textContent = "🌸 That's not the magic word.";
    message.className = "error";
  }
}

function animateCelebration() {
  gsap.to(".birthday-title", {
    opacity: 1,

    y: -20,

    duration: 1,
  });

  gsap.to(".birthday-name", {
    opacity: 1,

    delay: 0.6,

    y: -15,

    duration: 1,
  });

  gsap.to("#continue", {
    opacity: 1,

    delay: 1.5,

    duration: 1,
  });
}

function launchConfetti() {
  const end = Date.now() + 5000;

  (function frame() {
    confetti({
      particleCount: 4,

      angle: 60,

      spread: 70,

      origin: { x: 0 },
    });

    confetti({
      particleCount: 4,

      angle: 120,

      spread: 70,

      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

const surpriseMessage = siteData.message;
let typingTimer = null;
let typingIndex = 0;

function showHome() {
  const giftSvgUrl = new URL("./assets/images/gift-box.svg", import.meta.url)
    .href;
  const messageBackgroundUrl = new URL(
    "./assets/images/background.png",
    import.meta.url,
  ).href;
  document.querySelector("#app").innerHTML = `

    <section class="home">

        <div class="hero">

            <h1 class="hero-title">
                Happy Birthday, ${siteData.name} ❤️
            </h1>

            <p class="hero-subtitle">
                Today is all about you ✨
            </p>

        </div>

        <div class="surprise-overlay">
          <div class="surprise-card">
            <button id="closeSurprise" class="close-surprise-btn" aria-label="Close surprise card">&times;</button>
            <div class="letter-body">
              <h2>Dear ${siteData.name},</h2>
              <p class="typing-text"></p>
              <p class="letter-sign">With all my love,<br/>Your wife ❤️</p>
            </div>
          </div>
        </div>

        <section class="gift-area">
          <div class="gift-container">
            <img id="giftSvg" class="gift-svg" src="${giftSvgUrl}" alt="Gift box" title="Click to open" />
            <img id="giftImage" class="gift-image" src="" alt="Birthday gift" />
            <button id="closeGiftBtn" class="gift-close-btn" aria-label="Close gift">Close</button>
          </div>
        </section>

        <section class="message-window" style="background-image: url('${messageBackgroundUrl}');">
            <div class="letter-body letter-body-large">
              <h2>For You, ${siteData.name}</h2>
              <p class="typing-text-2"></p>
            </div>
        </section>

        <div class="gallery-link-wrap">
          <button id="viewGalleryBtn" class="gallery-view-btn">
            View Our Memories ❤️
          </button>
        </div>
    </section>

    `;

  animateHome();
  createBalloons();
  startTypingMessage();
  startTypingMessage2();

  document
    .getElementById("closeSurprise")
    .addEventListener("click", closeSurpriseCard);
  document
    .getElementById("viewGalleryBtn")
    .addEventListener("click", showGalleryPage);
  // attach gift handlers now that DOM exists
  setupGiftInteractions();
}

function showGalleryPage() {
  const photo1Url = new URL("./assets/images/Bday1.jpeg", import.meta.url).href;
  const photo2Url = new URL("./assets/images/Bday2.jpeg", import.meta.url).href;
  const photo3Url = new URL("./assets/images/Bday3.jpeg", import.meta.url).href;
  const photo4Url = new URL("./assets/images/Bday4.jpeg", import.meta.url).href;

  document.querySelector("#app").innerHTML = `
    <section class="gallery-page">
      <button id="backHomeBtn" class="gallery-back-btn">Back</button>

      <div class="gallery-layout">
        <div class="gallery-card">
          <div class="gallery-header">
            <div>
              <h1>Our Memories</h1>
              <p class="gallery-intro">Some of my favorite moments with you.</p>
            </div>
          </div>

          <div class="gallery-grid">
            <div class="photo-card">
              <img src="${photo1Url}" alt="Our memory 1" />
            </div>
            <div class="photo-card">
              <img src="${photo2Url}" alt="Our memory 2" />
            </div>
            <div class="photo-card">
              <img src="${photo3Url}" alt="Our memory 3" />
            </div>
            <div class="photo-card">
              <img src="${photo4Url}" alt="Our memory 4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("backHomeBtn").addEventListener("click", showHome);
}

function closeSurpriseCard() {
  const overlay = document.querySelector(".surprise-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
    typingIndex = 0;
  }
}

// Setup gift interactions after DOM exists
function setupGiftInteractions() {
  const giftUrl = new URL("./assets/images/Gift.jpeg", import.meta.url).href;
  const giftSvg = document.getElementById("giftSvg");
  const giftImg = document.getElementById("giftImage");
  const closeBtn = document.getElementById("closeGiftBtn");

  if (!giftSvg || !giftImg || !closeBtn) return;

  giftImg.src = giftUrl;
  giftImg.style.display = "none";
  closeBtn.style.display = "none";
  giftSvg.style.cursor = "pointer";

  let clicks = 0;
  const required = 3;

  function resetGift() {
    giftImg.classList.remove("escape");
    setTimeout(() => (giftImg.style.display = "none"), 300);
    closeBtn.style.display = "none";
    giftSvg.classList.remove("disable-click");
    giftSvg.classList.add("closed-pop");
    setTimeout(() => giftSvg.classList.remove("closed-pop"), 450);
    clicks = 0;
  }

  giftSvg.addEventListener("click", () => {
    if (giftSvg.classList.contains("disable-click")) return;
    clicks += 1;
    giftSvg.classList.add("shake-once");
    setTimeout(() => giftSvg.classList.remove("shake-once"), 500);

    if (clicks >= required) {
      giftImg.style.display = "block";
      void giftImg.offsetWidth;
      giftImg.classList.add("escape");
      closeBtn.style.display = "block";
      giftSvg.classList.add("disable-click");
    }
  });

  closeBtn.addEventListener("click", resetGift);
}

function formatTypingHtml(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function startTypingMessage() {
  const textEl = document.querySelector(".typing-text");
  if (!textEl) return;

  textEl.innerHTML = "";
  typingIndex = 0;

  function type() {
    if (typingIndex < surpriseMessage.length) {
      typingIndex += 1;
      textEl.innerHTML = formatTypingHtml(
        surpriseMessage.slice(0, typingIndex),
      );
      typingTimer = setTimeout(type, 35 + Math.random() * 25);
    } else {
      typingTimer = null;
    }
  }

  type();
}

function startTypingMessage2() {
  const textEl = document.querySelector(".typing-text-2");
  if (!textEl) return;

  textEl.innerHTML = "";
  let index = 0;
  const message = siteData.message;

  function type() {
    if (index < message.length) {
      index += 1;
      textEl.innerHTML = formatTypingHtml(message.slice(0, index));
      setTimeout(type, 30 + Math.random() * 20);
    }
  }

  type();
}

function animateHome() {
  gsap.to(".hero-title", {
    opacity: 1,
    y: -20,
    duration: 1,
  });

  gsap.to(".hero-subtitle", {
    opacity: 1,
    delay: 0.5,
    y: -15,
    duration: 1,
  });
}

function createBalloons() {
  for (let i = 0; i < 8; i++) {
    const balloon = document.createElement("div");

    balloon.className = "balloon";

    balloon.innerHTML = "🎈";

    balloon.style.left = Math.random() * 100 + "vw";

    balloon.style.animationDelay = Math.random() * 10 + "s";

    document.body.appendChild(balloon);
  }
}
