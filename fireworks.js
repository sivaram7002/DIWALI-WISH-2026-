/**
 * ============================================================================
 * DIWALI WISHES - FIREWORKS CANVAS ENGINE (fireworks.js)
 * Ultra-Lightweight, GPU-Optimized (Zero ShadowBlur, Capped Particles)
 * Author: Sivaram S K
 * ============================================================================
 */

(function () {
  'use strict';

  // Vibrant Festive Color Palette
  const PALETTES = [
    '#ffd700', // Gold
    '#ff9100', // Amber Orange
    '#ff1744', // Festive Red
    '#e91e63', // Magenta
    '#00e5ff', // Peacock Cyan
    '#76ff03', // Lime Spark
    '#ffffff'  // White
  ];

  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;
  let particles = [];
  let rockets = [];
  let animationFrameId = null;
  let isRunning = false;
  let isPaused = false;
  let continuousTimer = null;

  // Higher active particle ceiling for dense, vibrant Diwali celebration
  const MAX_ACTIVE_PARTICLES = 280;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Particle {
    constructor(x, y, color, velocity, customDecay, customGravity) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = prefersReducedMotion ? 1.5 : (Math.random() * 1.8 + 1.2);
      this.vx = velocity.x;
      this.vy = velocity.y;
      this.gravity = typeof customGravity === 'number' ? customGravity : 0.044;
      this.friction = 0.958;
      this.alpha = 1;
      this.decay = typeof customDecay === 'number' ? customDecay : (Math.random() * 0.018 + 0.013);
    }

    draw(context) {
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
  }

  class Rocket {
    constructor(startX, startY, targetX, targetY, color, onDetonate) {
      this.x = startX;
      this.y = startY;
      this.targetY = targetY;
      this.color = color || '#ffd700';
      this.onDetonate = onDetonate;

      const dx = targetX - startX;
      const dy = targetY - startY;
      const distance = Math.hypot(dx, dy);
      const speed = Math.random() * 2.5 + 8.8;

      this.vx = (dx / distance) * speed;
      this.vy = (dy / distance) * speed;
      this.isDead = false;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (Math.random() > 0.22) {
        particles.push(new Particle(
          this.x + (Math.random() * 2 - 1),
          this.y + (Math.random() * 2 - 1),
          Math.random() > 0.4 ? '#ffd700' : '#ff9100',
          { x: (Math.random() - 0.5) * 0.7, y: Math.random() * 1.8 + 1 },
          0.04,
          0.02
        ));
      }

      if (this.vy < 0 && this.y <= this.targetY) {
        this.explode();
      } else if (this.y < 30) {
        this.explode();
      }
    }

    draw(context) {
      context.save();
      context.fillStyle = '#ffffff';
      context.beginPath();
      context.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y + 2, 2, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    explode() {
      this.isDead = true;
      if (typeof this.onDetonate === 'function') {
        this.onDetonate(this.x, this.y, this.color);
      }
    }
  }

  function burst(x, y, countOverride, colorOverride) {
    const count = countOverride || (prefersReducedMotion ? 16 : (Math.floor(Math.random() * 12) + 36));
    const baseColor = colorOverride || PALETTES[Math.floor(Math.random() * PALETTES.length)];

    if (particles.length + count > MAX_ACTIVE_PARTICLES) {
      particles.splice(0, (particles.length + count) - MAX_ACTIVE_PARTICLES);
    }

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.25 - 0.125);
      const speed = Math.random() * 4.2 + 1.6;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };
      const sparkColor = Math.random() > 0.25 ? baseColor : '#ffffff';
      particles.push(new Particle(x, y, sparkColor, velocity));
    }

    startAnimationIfNeeded();
  }

  function launchRocket(startX, targetX, targetY, colorOverride) {
    if (rockets.length >= 8) return;

    const fromX = typeof startX === 'number' ? startX : width * (0.08 + Math.random() * 0.84);
    const toX = typeof targetX === 'number' ? targetX : fromX + (Math.random() * 100 - 50);

    const irregularMiddleHeight = height * (0.26 + Math.random() * 0.40);
    const toY = typeof targetY === 'number' ? targetY : irregularMiddleHeight;
    const rocketColor = colorOverride || PALETTES[Math.floor(Math.random() * PALETTES.length)];

    if (window.DiwaliSound) {
      window.DiwaliSound.playWhistle(0.4);
    }

    rockets.push(new Rocket(fromX, height + 10, toX, toY, rocketColor, (detX, detY, col) => {
      burst(detX, detY, prefersReducedMotion ? 16 : (Math.floor(Math.random() * 14) + 36), col);
      if (window.DiwaliSound) {
        window.DiwaliSound.playBoom(0.35);
        window.DiwaliSound.playCrackle();
      }
    }));

    startAnimationIfNeeded();
  }

  function renderLoop() {
    if (isPaused) {
      isRunning = false;
      return;
    }

    ctx.fillStyle = 'rgba(6, 8, 23, 0.24)';
    ctx.fillRect(0, 0, width, height);

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.update();
      r.draw(ctx);
      if (r.isDead) {
        rockets.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0.03) {
        particles.splice(i, 1);
      }
    }

    if (particles.length === 0 && rockets.length === 0) {
      ctx.clearRect(0, 0, width, height);
      isRunning = false;
      return;
    }

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  function startAnimationIfNeeded() {
    if (!isRunning && !isPaused) {
      isRunning = true;
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      isPaused = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    } else {
      isPaused = false;
      startAnimationIfNeeded();
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // 1. Anar Fountain Effect (Golden Spire Shooting from Ground)
  function launchAnar(customX, customY) {
    const startX = typeof customX === 'number' ? customX : width * (0.2 + Math.random() * 0.6);
    const groundY = typeof customY === 'number' ? customY : height - 12;
    const duration = 2200;
    const intervalTime = 40;
    let elapsed = 0;

    if (window.DiwaliSound) {
      window.DiwaliSound.playAnarSound(2.2);
    }

    const fountainTimer = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min(1, elapsed / (duration * 0.65));
      const sparkCount = prefersReducedMotion ? 3 : (4 + Math.floor(progress * 7));
      const power = 3.6 + progress * 5.6;

      for (let i = 0; i < sparkCount; i++) {
        const spreadAngle = -Math.PI / 2 + (Math.random() * 0.55 - 0.275);
        const speed = Math.random() * power + 3.2;
        const colorPool = ['#ffd700', '#ffb300', '#ffffff', '#ff9100', '#ff1744'];
        const color = colorPool[Math.floor(Math.random() * colorPool.length)];
        const velocity = {
          x: Math.cos(spreadAngle) * speed + (Math.random() - 0.5) * 1.6,
          y: Math.sin(spreadAngle) * speed
        };
        const p = new Particle(startX + (Math.random() * 8 - 4), groundY, color, velocity, 0.022, 0.088);
        particles.push(p);
      }

      if (particles.length > MAX_ACTIVE_PARTICLES) {
        particles.splice(0, particles.length - MAX_ACTIVE_PARTICLES);
      }

      startAnimationIfNeeded();
    }, intervalTime);

    setTimeout(() => {
      clearInterval(fountainTimer);
      // Grand finale crown burst
      burst(startX, groundY - 140, 36, '#ffd700');
      if (window.DiwaliSound) {
        window.DiwaliSound.playCrackle();
      }
    }, duration);
  }

  // 2. Zameen Chakra Effect (Whirling Spiral Ground Wheel)
  function launchChakra(customX, customY) {
    const startX = typeof customX === 'number' ? customX : width * (0.25 + Math.random() * 0.5);
    const groundY = typeof customY === 'number' ? customY : height - 22;
    const duration = 2000;
    let angleOffset = 0;

    if (window.DiwaliSound) {
      window.DiwaliSound.playChakraSound(2.0);
    }

    const chakraColors = ['#00e5ff', '#ffd700', '#ff1744', '#76ff03', '#ffffff'];

    const chakraTimer = setInterval(() => {
      angleOffset += 0.52;
      const arms = 4;
      for (let i = 0; i < arms; i++) {
        const angle = angleOffset + (Math.PI * 2 / arms) * i;
        const speed = Math.random() * 4.4 + 2.8;
        const color = chakraColors[i % chakraColors.length];
        const velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed * 0.36
        };
        const p = new Particle(startX, groundY, color, velocity, 0.026, 0.012);
        particles.push(p);
      }

      // Center glowing spark
      particles.push(new Particle(
        startX + (Math.random() * 6 - 3),
        groundY + (Math.random() * 4 - 2),
        '#ffffff',
        { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 },
        0.05,
        0
      ));

      if (particles.length > MAX_ACTIVE_PARTICLES) {
        particles.splice(0, particles.length - MAX_ACTIVE_PARTICLES);
      }

      startAnimationIfNeeded();
    }, 40);

    setTimeout(() => {
      clearInterval(chakraTimer);
      burst(startX, groundY, 36, '#ffd700');
      if (window.DiwaliSound) {
        window.DiwaliSound.playBoom(0.38);
        window.DiwaliSound.playCrackle();
      }
    }, duration);
  }

  // 3. Sutli Bomb Effect (Green Twine Atom Bomb Explosion)
  function launchSutliBomb(customX, customY) {
    const bombX = typeof customX === 'number' ? customX : width * (0.35 + Math.random() * 0.3);
    const bombY = typeof customY === 'number' ? customY : height * (0.45 + Math.random() * 0.18);

    if (window.DiwaliSound) {
      window.DiwaliSound.playFuseSpark(450);
    }

    // Sparking fuse trail
    for (let i = 0; i < 16; i++) {
      particles.push(new Particle(
        bombX + (Math.random() * 6 - 3),
        bombY - 14 + (Math.random() * 6 - 3),
        Math.random() > 0.4 ? '#ffd700' : '#ff3d00',
        { x: (Math.random() - 0.5) * 1.8, y: -(Math.random() * 1.5 + 0.5) },
        0.04,
        0.03
      ));
    }
    startAnimationIfNeeded();

    setTimeout(() => {
      if (window.DiwaliSound) {
        window.DiwaliSound.playSutliBomb();
      }

      const screenFlash = document.getElementById('screen-flash');
      if (screenFlash) {
        screenFlash.classList.add('active');
        setTimeout(() => screenFlash.classList.remove('active'), 160);
      }
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 480);

      // Multi-stage massive blast
      // Stage 1: Central fiery red-gold core
      burst(bombX, bombY, prefersReducedMotion ? 20 : 48, '#ff1744');
      
      // Stage 2: Green jute twine shrapnel sparks
      const juteCount = prefersReducedMotion ? 12 : 30;
      for (let i = 0; i < juteCount; i++) {
        const angle = (Math.PI * 2 / juteCount) * i + (Math.random() * 0.2 - 0.1);
        const speed = Math.random() * 5.2 + 2.5;
        const color = Math.random() > 0.5 ? '#00e676' : '#ffd700';
        particles.push(new Particle(bombX, bombY, color, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        }, 0.016, 0.048));
      }

      // Stage 3: Secondary delayed shockwave burst
      setTimeout(() => {
        burst(bombX + (Math.random() * 30 - 15), bombY + (Math.random() * 30 - 15), 32, '#ffd700');
        if (window.DiwaliSound) {
          window.DiwaliSound.playCrackle();
        }
      }, 90);
    }, 450);
  }

  // Slightly higher density & frequency continuous background crackers
  function startContinuousShow(intervalMs) {
    if (prefersReducedMotion) return;
    const interval = intervalMs || 850; // High frequency festive cadence

    stopContinuousShow();
    let tick = 0;
    continuousTimer = setInterval(() => {
      if (document.hidden) return;

      tick++;
      // Launch rocket from bottom edge
      launchRocket();

      // High density: launch second staggered rocket on even ticks
      if (tick % 2 === 0) {
        setTimeout(() => {
          if (!document.hidden) launchRocket();
        }, 220);
      }

      // Burst of celebration: launch 3rd sky rocket periodically
      if (tick % 5 === 0) {
        setTimeout(() => {
          if (!document.hidden) launchRocket();
        }, 440);
      }

      // Ground crackers: periodic Anar fountain shooting up from bottom
      if (tick % 6 === 0) {
        const randomX = width * (0.15 + Math.random() * 0.7);
        launchAnar(randomX);
      }

      // Ground crackers: periodic Zameen Chakra spinning on bottom
      if (tick % 9 === 0) {
        const randomX = width * (0.2 + Math.random() * 0.6);
        launchChakra(randomX);
      }
    }, interval);
  }

  function stopContinuousShow() {
    if (continuousTimer) {
      clearInterval(continuousTimer);
      continuousTimer = null;
    }
  }

  // 1000 Wala Firecracker Garland Bursting Around the Screen Frame
  function burst1000WalaAroundFrame(onComplete) {
    const margin = 24;
    const w = width;
    const h = height;

    const points = [];
    const stepsPerEdge = 7;

    for (let i = 0; i <= stepsPerEdge; i++) {
      points.push({ x: margin + (i / stepsPerEdge) * (w - 2 * margin), y: margin + (Math.random() * 8 - 4) });
    }
    for (let i = 1; i <= stepsPerEdge; i++) {
      points.push({ x: w - margin + (Math.random() * 8 - 4), y: margin + (i / stepsPerEdge) * (h - 2 * margin) });
    }
    for (let i = stepsPerEdge - 1; i >= 0; i--) {
      points.push({ x: margin + (i / stepsPerEdge) * (w - 2 * margin), y: h - margin + (Math.random() * 8 - 4) });
    }
    for (let i = stepsPerEdge - 1; i >= 1; i--) {
      points.push({ x: margin + (Math.random() * 8 - 4), y: margin + (i / stepsPerEdge) * (h - 2 * margin) });
    }

    let currentIndex = 0;
    const intervalTime = 50;

    const timer = setInterval(() => {
      if (currentIndex >= points.length) {
        clearInterval(timer);
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      const pt = points[currentIndex];
      const sparkColor = Math.random() > 0.4 ? '#ff1744' : '#ffd700';
      burst(pt.x, pt.y, 10, sparkColor);

      if (window.DiwaliSound) {
        window.DiwaliSound.play1000WalaPop();
      }

      currentIndex++;
    }, intervalTime);
  }

  function initFireworks(canvasId) {
    canvas = document.getElementById(canvasId || 'fireworks-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d', { alpha: true });
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    document.addEventListener('pointerdown', (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, input, textarea, a, select, [role="button"]');
      if (!isInteractive) {
        burst(e.clientX, e.clientY, 28);
        if (window.DiwaliSound) {
          window.DiwaliSound.playBoom(0.4);
          window.DiwaliSound.playCrackle();
        }
      }
    });

    isPaused = false;
  }

  window.DiwaliFireworks = {
    init: initFireworks,
    burst: burst,
    launchRocket: launchRocket,
    launchAnar: launchAnar,
    launchChakra: launchChakra,
    launchSutliBomb: launchSutliBomb,
    startContinuousShow: startContinuousShow,
    stopContinuousShow: stopContinuousShow,
    burst1000WalaAroundFrame: burst1000WalaAroundFrame
  };

})();
