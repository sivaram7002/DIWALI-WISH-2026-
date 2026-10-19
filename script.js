/**
 * ============================================================================
 * DIWALI WISHES - MAIN PAGE SCRIPT (script.js)
 * Languages: English & Tamil Only
 * Author: Sivaram S K
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Target Diwali Date Constant (IST, UTC+05:30)
     Easily update this single constant for next year's celebrations!
     -------------------------------------------------------------------------- */
  const DIWALI_DATE_IST = '2026-11-08T00:00:00+05:30';

  /* --------------------------------------------------------------------------
     2. Curated Wishes Dataset (English and Tamil Only - 16 Wishes)
     -------------------------------------------------------------------------- */
  const WISHES = [
    {
      text: "இனிய தீபாவளி நல்வாழ்த்துகள்! உங்கள் இல்லத்திலும் உள்ளத்திலும் மகிழ்ச்சி ஒளி என்றும் பிரகாசிக்கட்டும்.",
      lang: "தமிழ்"
    },
    {
      text: "தீபங்களின் ஒளி உங்கள் வாழ்வில் உள்ள இருளை அகற்றி, அமைதியையும் வெற்றியையும் தரட்டும். இனிய தீபாவளி வாழ்த்துகள்!",
      lang: "தமிழ்"
    },
    {
      text: "இந்த தீபாவளித் திருநாள் உங்களுக்கு நல் ஆரோக்கியம், செல்வம் மற்றும் அளவற்ற மகிழ்ச்சியை அள்ளித் தரட்டும்!",
      lang: "தமிழ்"
    },
    {
      text: "அன்பும், அமைதியும், ஆனந்தமும் உங்கள் இல்லத்தில் என்றும் நிலைத்திருக்க இனிய தீபாவளி நல்வாழ்த்துகள்!",
      lang: "தமிழ்"
    },
    {
      text: "மங்களகரமான இந்த தீபத் திருநாளில் அனைத்து நன்மைகளும் உங்களுக்கு என்றென்றும் கிடைக்கட்டும். இனிய தீபாவளி!",
      lang: "தமிழ்"
    },
    {
      text: "புதிய ஆரம்பங்கள், புதுமையான வெற்றிகள், எல்லையற்ற சந்தோஷம் தரட்டும் இந்த தீபாவளி திருநாள். இனிய வாழ்த்துகள்!",
      lang: "தமிழ்"
    },
    {
      text: "வானில் ஒளிரும் வண்ணப் பட்டாசுகள் போல உங்கள் வாழ்வு எப்போதும் பிரகாசமாக அமைய வாழ்த்துகள்! இனிய தீபாவளி!",
      lang: "தமிழ்"
    },
    {
      text: "தீப ஒளி திருநாளில் துன்பங்கள் அனைத்தும் நீங்கி, வாழ்வில் நலமும் வளமும் பெருகட்டும். இனிய தீபாவளி நல்வாழ்த்துகள்!",
      lang: "தமிழ்"
    },
    {
      text: "May the divine light of Diwali bring peace, prosperity, and happiness to you and your loved ones.",
      lang: "English"
    },
    {
      text: "Wishing you a festival full of sweet memories, sky full of fireworks, mouth full of sweets, and heart full of joy. Happy Diwali!",
      lang: "English"
    },
    {
      text: "May this auspicious night bless your home with good health, immense wisdom, and boundless success. Happy Diwali!",
      lang: "English"
    },
    {
      text: "May every glowing diya on this festive night illuminate your journey toward peace, love, and greatness. Happy Deepavali!",
      lang: "English"
    },
    {
      text: "Let each diya you light bring a radiant glow of happiness on your face and enlighten your soul. Have a sparkling Diwali!",
      lang: "English"
    },
    {
      text: "May the warmth and splendor of this festive occasion brighten your life with harmony, hope, and golden opportunities.",
      lang: "English"
    },
    {
      text: "May this Diwali burn away all your worries and brighten your life with good luck and everlasting joy. Happy Diwali!",
      lang: "English"
    },
    {
      text: "Sending you warmest wishes of love, laughter, and light. May your Diwali be as bright and beautiful as your smile!",
      lang: "English"
    }
  ];

  /* --------------------------------------------------------------------------
     3. DOM Elements Selection
     -------------------------------------------------------------------------- */
  const personalizedGreetingEl = document.getElementById('personalized-greeting');
  const createWishForm = document.getElementById('create-wish-form');
  const nameInput = document.getElementById('name-input');
  const generatedLinkInput = document.getElementById('generated-link-input');
  const nativeShareBtn = document.getElementById('native-share-btn');
  const whatsappShareBtn = document.getElementById('whatsapp-share-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const copyBtnText = document.getElementById('copy-btn-text');

  // Countdown Elements
  const countdownGrid = document.getElementById('countdown-grid');
  const diwaliTodayBanner = document.getElementById('diwali-today-banner');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  // Wishes Elements
  const wishQuoteDisplay = document.getElementById('wish-quote-display');
  const wishLangBadge = document.getElementById('wish-lang-badge');
  const wishCounter = document.getElementById('wish-counter');
  const newWishBtn = document.getElementById('new-wish-btn');

  // Interactive Diya
  const interactiveDiya = document.getElementById('interactive-diya');

  // Toast
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  let currentWishIndex = 0;
  let countdownInterval = null;

  /* --------------------------------------------------------------------------
     4. Personalized Greeting & URL Parameters
     -------------------------------------------------------------------------- */
  function getRecipientNameFromUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('to') || urlParams.get('name');
      return name ? name.trim() : null;
    } catch (e) {
      return null;
    }
  }

  function initializeGreeting() {
    const rawName = getRecipientNameFromUrl();
    if (rawName && rawName.length > 0) {
      personalizedGreetingEl.textContent = `Happy Diwali, ${rawName}!`;
      nameInput.value = rawName;
      updateShareLinks(rawName);
    } else {
      personalizedGreetingEl.textContent = 'Happy Diwali to You & Your Family!';
      updateShareLinks('');
    }
  }

  function buildShareableUrl(name) {
    const baseUrl = window.location.origin + window.location.pathname;
    if (name && name.trim().length > 0) {
      return `${baseUrl}?to=${encodeURIComponent(name.trim())}`;
    }
    return baseUrl;
  }

  function updateShareLinks(name) {
    const shareUrl = buildShareableUrl(name);
    generatedLinkInput.value = shareUrl;

    const personName = name && name.trim().length > 0 ? name.trim() : 'Friend';
    const waMessage = `✨ *Happy Diwali!* ✨\n\nWishing you and your family immense happiness, radiant health, and boundless prosperity on this festival of lights! 🪔🎆\n\nOpen your special greeting here:\n${shareUrl}`;
    
    whatsappShareBtn.href = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
  }

  /* --------------------------------------------------------------------------
     5. Countdown to Diwali (Ticking every second)
     -------------------------------------------------------------------------- */
  function startCountdown() {
    const targetTime = new Date(DIWALI_DATE_IST).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const diff = targetTime - now;

      // When the target date is reached or passed
      if (diff <= 0) {
        if (countdownGrid) countdownGrid.style.display = 'none';
        if (diwaliTodayBanner) diwaliTodayBanner.style.display = 'block';
        if (countdownInterval) clearInterval(countdownInterval);
        return;
      }

      // Calculations for days, hours, minutes and seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Pad with leading zeros
      if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
      if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
      if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  }

  /* --------------------------------------------------------------------------
     6. Wishes Carousel & Random Generator
     -------------------------------------------------------------------------- */
  function displayWish(index) {
    const wish = WISHES[index];
    if (!wish) return;

    wishQuoteDisplay.classList.add('fading');

    setTimeout(() => {
      wishQuoteDisplay.textContent = `"${wish.text}"`;
      wishLangBadge.textContent = wish.lang;
      wishCounter.textContent = `Wish ${index + 1} of ${WISHES.length}`;
      wishQuoteDisplay.classList.remove('fading');
    }, 200);
  }

  function getRandomWish() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * WISHES.length);
    } while (nextIndex === currentWishIndex && WISHES.length > 1);

    currentWishIndex = nextIndex;
    displayWish(currentWishIndex);

    // Launch celebratory fireworks on wish change
    if (window.DiwaliFireworks) {
      window.DiwaliFireworks.launchRocket();
    }
  }

  /* --------------------------------------------------------------------------
     7. Toast Notification Helper
     -------------------------------------------------------------------------- */
  let toastTimeout = null;
  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* --------------------------------------------------------------------------
     8. Share Functionality (Web Share API + WhatsApp + Clipboard)
     -------------------------------------------------------------------------- */
  function setupShareHandlers() {
    if (navigator.share) {
      nativeShareBtn.style.display = 'inline-flex';
    } else {
      nativeShareBtn.style.display = 'none';
    }

    nativeShareBtn.addEventListener('click', async () => {
      const shareUrl = generatedLinkInput.value;
      const recipient = nameInput.value.trim() || 'Friend';
      try {
        await navigator.share({
          title: `Happy Diwali Wishes for ${recipient}! 🪔`,
          text: `Wishing you and your family a sparkling and blessed Diwali! 🪔✨ Check out your personalized greeting card:`,
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    });

    copyLinkBtn.addEventListener('click', () => {
      copyToClipboard(generatedLinkInput.value);
    });

    createWishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredName = nameInput.value.trim();
      if (!enteredName) {
        showToast("Please enter a recipient's name");
        nameInput.focus();
        return;
      }

      updateShareLinks(enteredName);
      personalizedGreetingEl.textContent = `Happy Diwali, ${enteredName}!`;
      showToast(`Link created for ${enteredName}!`);

      if (window.DiwaliFireworks) {
        window.DiwaliFireworks.launchRocket();
      }
    });

    nameInput.addEventListener('input', () => {
      updateShareLinks(nameInput.value);
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        onCopySuccess();
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    generatedLinkInput.select();
    generatedLinkInput.setSelectionRange(0, 99999);
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        onCopySuccess();
      } else {
        showToast("Press Ctrl+C to copy the link");
      }
    } catch (err) {
      showToast("Could not copy link automatically");
    }
  }

  function onCopySuccess() {
    copyBtnText.textContent = "Copied!";
    showToast("Greeting link copied to clipboard!");
    setTimeout(() => {
      copyBtnText.textContent = "Copy Link";
    }, 2500);
  }

  /* --------------------------------------------------------------------------
     9. Interactive Diya and Sweets Tap Effects
     -------------------------------------------------------------------------- */
  function setupInteractiveElements() {
    // Diya Sparkles on Tap
    if (interactiveDiya) {
      interactiveDiya.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = interactiveDiya.getBoundingClientRect();
        const flameX = rect.left + rect.width / 2;
        const flameY = rect.top + 28;

        if (window.DiwaliFireworks) {
          window.DiwaliFireworks.burst(flameX, flameY, 32, '#ffd700');
        }
        if (window.DiwaliSound) {
          window.DiwaliSound.playCrackle();
        }
        showToast("Divine blessings and joy upon you! 🪔");
      });

      interactiveDiya.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          interactiveDiya.click();
        }
      });
    }



    // 1000 Wala Frame Cracker Button
    const btn1000Frame = document.getElementById('btn-1000-frame');
    if (btn1000Frame) {
      btn1000Frame.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.DiwaliFireworks && window.DiwaliFireworks.burst1000WalaAroundFrame) {
          window.DiwaliFireworks.burst1000WalaAroundFrame();
          showToast('1000 Wala Crackers Bursting Around Frame! 🧨');
        }
      });
    }

    // New Wish Button
    if (newWishBtn) {
      newWishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        getRandomWish();
      });
    }
  }

  /* --------------------------------------------------------------------------
     Falling Sweets Figures (Falling from Up to Down)
     -------------------------------------------------------------------------- */
  function initFallingSweets() {
    const container = document.getElementById('falling-sweets-container');
    if (!container) return;

    const SWEET_ICONS = ['🟡', '🌀', '🟤', '🧈', '🥮', '🥨', '💎', '🍮'];
    const MAX_CONCURRENT = 12;
    let activeCount = 0;

    function spawnSweet() {
      if (document.hidden || activeCount >= MAX_CONCURRENT) return;

      const sweet = document.createElement('span');
      sweet.className = 'falling-sweet';
      sweet.textContent = SWEET_ICONS[Math.floor(Math.random() * SWEET_ICONS.length)];

      const startLeft = Math.random() * 92 + 2;
      const size = Math.random() * 10 + 20;
      const duration = Math.random() * 3.5 + 4.5;
      const driftX = (Math.random() * 70 - 35) + 'px';
      const spin = (Math.random() * 540 - 270) + 'deg';

      sweet.style.left = startLeft + 'vw';
      sweet.style.fontSize = size + 'px';
      sweet.style.animationDuration = duration + 's';
      sweet.style.setProperty('--drift-x', driftX);
      sweet.style.setProperty('--spin', spin);

      activeCount++;
      container.appendChild(sweet);

      sweet.addEventListener('animationend', () => {
        sweet.remove();
        activeCount--;
      }, { once: true });
    }

    setInterval(spawnSweet, 850);
  }

  /* --------------------------------------------------------------------------
     10. Bootstrapping on DOM Ready
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Canvas Fireworks Engine
    if (window.DiwaliFireworks) {
      window.DiwaliFireworks.init('fireworks-canvas');
      // Denser ambient fireworks: 1.8s cadence with rockets and sky bursts
      window.DiwaliFireworks.startContinuousShow(1800);
    }

    // 2. Initialize Features
    initializeGreeting();
    startCountdown();
    displayWish(0);
    setupShareHandlers();
    setupInteractiveElements();
    initFallingSweets();
  });

})();
