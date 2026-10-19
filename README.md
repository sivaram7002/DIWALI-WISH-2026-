# 🪔 Happy Diwali Wishes | Interactive Two-Page Web Experience

An interactive two-page static Diwali greeting website built with pure vanilla web technologies (**plain HTML5, CSS3, and JavaScript — no frameworks, no build step, zero dependencies**).

Designed to be hosted for free on **GitHub Pages** and shared with friends and family over WhatsApp, SMS, or social media.

---

## 🌟 Live Demo & URL Formats

- **Default Live URL (Page 1 - Cracker Page)**:  
  `https://<username>.github.io/<repo-name>/`

- **Celebration Page (Page 2 - Wishes Page)**:  
  `https://<username>.github.io/<repo-name>/wishes.html`

- **Personalized Greeting Link Example**:  
  `https://<username>.github.io/<repo-name>/wishes.html?to=Sivaram`  
  *(Also works on the home page: `https://<username>.github.io/<repo-name>/?to=Sivaram` and carries the name over to the wishes page)*

---

## 🎨 Architecture & Pages

### Page 1: `index.html` (The Cracker Page)
- **Interactive Firecracker**: Nicely rendered firecracker with ground shadow, festive gold bands, and a visible fuse.
- **Pulsing Glow Hint**: Subtle glow animation invites visitors to touch the cracker.
- **Sparking Fuse & Explosion**:
  - Touching or clicking the cracker ignites the fuse, which sizzles with sparks for ~1 second.
  - The cracker explodes with screen shake, a soft bright flash, a loud synthesized "boom" sound, and an 80+ particle sky burst on the canvas!
- **"Continue to wishes →" Button**: Smoothly fades in after the explosion, leading directly to `wishes.html` while preserving any personalized recipient name.
- **Re-triggerable**: Visitors can tap again for more explosions.

### Page 2: `wishes.html` (The Celebration Page)
1. **Personalized Greeting**:
   - Heading `Happy Diwali` & `இனிய தீபாவளி நல்வாழ்த்துக்கள்` with glowing animation.
   - Reads `?to=Name` (e.g., `?to=Sivaram`) to show *"Happy Diwali, Sivaram!"*. Without a parameter, shows *"Happy Diwali to You & Your Family!"*.
   - Built-in form to create and copy custom links for anyone.
2. **Countdown to Diwali 2026**:
   - Live real-time countdown (Days, Hours, Minutes, Seconds) ticking every second to **8 November 2026, 00:00 IST (Indian Standard Time)**.
   - When the date is reached, switches to *"It's Diwali today! 🪔"*, showing no negative numbers.
   - Controlled by a single constant `DIWALI_DATE_IST` at the top of [script.js](script.js).
3. **Continuous Fireworks Engine ([fireworks.js](fireworks.js))**:
   - Rhythmic ambient sky rockets with subtle rising whistles and soft crackles.
   - Tap or click anywhere on the starry sky to launch custom fireworks bursts.
   - Automatic CPU/battery saver: pauses canvas animation whenever the browser tab is hidden.
4. **Synthesized Web Audio ([sound.js](sound.js))**:
   - 100% Web Audio API: low-frequency boom, rising pitch whistle, crackle, and sizzling fuse.
   - **No external audio files needed**: Zero broken CDN links, zero CORS issues, works completely offline.
   - Visible mute/unmute button that remembers visitor preferences in `localStorage`.
5. **Interactive Crackers Suite (Anar, Chakra, Sutli Bomb & 1000 Wala)**:
   - **Anar (Fountain / பூந்தொட்டி)**: Towering golden fountain spraying glittering gold, amber, and silver sparks upwards from the ground with authentic hissing audio and crown burst finale.
   - **Zameen Chakra (Ground Spinner / சக்கரம்)**: Rapidly spinning wheel of fire on the ground spraying vibrant peacock cyan, gold, and lime sparks with whirling FM synthesizer audio.
   - **Sutli Bomb (Atom Bomb / ஆட்டம் பாம்)**: Sizzling green jute fuse followed by a thunderous detonation, screen flash, body shake, and explosive shockwave particles.
   - **1000 Wala Garland (சரவெடி)**: Rapid perimeter bursts along all 4 screen borders with snappy crackle audio pops.
   - **Dense Background Sky Rockets**: Continuous ambient fireworks launching from the bottom edge and detonating at irregular middle heights (26%–66% screen height) with higher density and frequency.
6. **16 Curated Wishes (English & Tamil Only)**:
   - "New wish" button displays random blessings with a smooth fade animation.
   - Language rules: **Strictly English and Tamil only**.
7. **Decorations**:
   - Animated terracotta brass Diya with realistic multi-layered flickering flame (click for blessing sparks!).
   - Rangoli-style SVG geometric divider.
   - String of glowing festive fairy lights along the top edge of both pages.
8. **Sharing Tools**:
   - Native **Web Share API** on mobile devices.
   - Direct **WhatsApp Share** (`wa.me`) with pre-formatted greeting text and link.
   - One-click **Copy Link** button with toast notification.
9. **Footer**:
   - *"Made with love ✨"*

---

## 📁 File Structure

```text
├── index.html       # Page 1: Cracker interactive landing page
├── wishes.html      # Page 2: Celebration page (greeting, countdown, 1000-wala, wishes)
├── style.css        # Unified responsive stylesheet, night-sky theme & animations
├── sound.js         # Web Audio API sound synthesizer (boom, whistle, crackle, fuse)
├── fireworks.js     # Canvas particle physics engine with auto-pause on tab hide
├── script.js        # Celebration page logic (countdown, URL parser, wishes, sharing)
└── README.md        # Documentation and GitHub Pages deployment guide
```

> **Relative Paths**: All scripts, stylesheets, and links use relative paths without leading `/` (e.g., `style.css`, `sound.js`, `wishes.html`). This ensures compatibility with GitHub Pages project subdirectories and local `file://` opening.

---

## 🚀 How to Host Free on GitHub Pages (Step-by-Step)

Deploy your two-page Diwali website in under 2 minutes:

### Step 1: Initialize Git and Commit

Open your terminal or command prompt inside the project folder (`d:\diwali wish`):

```bash
# 1. Initialize git repository
git init

# 2. Stage all files
git add .

# 3. Commit your code
git commit -m "Initial commit: Two-page Diwali wishes website"
```

### Step 2: Create a New GitHub Repository

1. Visit [GitHub.com](https://github.com) and log in.
2. Click the **`+`** icon in the top right and choose **New repository**.
3. Name your repository (e.g. `diwali-wishes` or `happy-diwali`).
4. Select **Public**.
5. Do **not** check "Initialize this repository with a README" (you already have one).
6. Click **Create repository**.

### Step 3: Push Your Code to GitHub

Run the following commands in your terminal (replace `<username>` and `<repo-name>` with your actual GitHub username and repository name):

```bash
# Rename branch to main
git branch -M main

# Link local repo to your GitHub remote
git remote add origin https://github.com/<username>/<repo-name>.git

# Push to main branch
git push -u origin main
```

### Step 4: Turn on GitHub Pages

1. In your GitHub repository, click on the **Settings** tab.
2. On the left sidebar under *Code and automation*, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main`.
   - **Folder**: Select `/(root)`.
4. Click **Save**.

### Step 5: Test Your Live Site

Within 1–2 minutes, your site will be live:
- Home / Cracker Page: `https://<username>.github.io/<repo-name>/`
- Celebration Page: `https://<username>.github.io/<repo-name>/wishes.html`
- Personalized Wish: `https://<username>.github.io/<repo-name>/wishes.html?to=Sivaram`

---

## 💡 Local Testing

You can test both pages locally without any local server:
1. Double-click [index.html](index.html) to open Page 1 in any modern browser.
2. Click or tap the firecracker, watch the explosion, and click **"Continue to wishes →"** to visit [wishes.html](wishes.html).
3. Test personalized links by appending `?to=Sivaram` in your address bar:  
   `file:///.../wishes.html?to=Sivaram`

---

## ⚡ Quality & Performance
- **Zero Heavy Assets**: Total combined project size is under **120 KB**, well within the 1 MB budget.
- **Accessible & Motion-Safe**: Full support for `prefers-reduced-motion` to keep animations comfortable for all visitors.
- **Battery-Friendly**: Canvas physics automatically pause when the tab is hidden.

---

## 📜 Credits
Made with love ✨.
