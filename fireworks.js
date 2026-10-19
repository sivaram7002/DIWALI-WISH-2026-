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

  // Higher active particle ceiling for rich, dense Diwali sky crackers
  const MAX_ACTIVE_PARTICLES = 160;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Particle {
    constructor(x, y, color, velocity) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = prefersReducedMotion ? 1.5 : (Math.random() * 1.6 + 1.2);
      this.vx = velocity.x;
      this.vy = velocity.y;
      this.gravity = 0.042;
      this.friction = 0.955;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.014;
    }

    draw(context) {
      context.save();
      context.globalAlpha = this.alpha;
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
      const speed = Math.random() * 2.2 + 8.4;

      this.vx = (dx / distance) * speed;
      this.vy = (dy / distance) * speed;
      this.isDead = false;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (Math.random() > 0.28) {
        particles.push(new Particle(
          this.x + (Math.random() * 2 - 1),
          this.y + (Math.random() * 2 - 1),
          Math.random() > 0.5 ? '#ffd700' : '#ff6d00',
          { x: (Math.random() - 0.5) * 0.7, y: Math.random() * 1.8 + 1 }
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
    const count = countOverride || (prefersReducedMotion ? 14 : 30);
    const baseColor = colorOverride || PALETTES[Math.floor(Math.random() * PALETTES.length)];

    if (particles.length + count > MAX_ACTIVE_PARTICLES) {
      particles.splice(0, (particles.length + count) - MAX_ACTIVE_PARTICLES);
    }

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.2 - 0.1);
      const speed = Math.random() * 3.6 + 1.4;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };
      const sparkColor = Math.random() > 0.3 ? baseColor : '#ffffff';
      particles.push(new Particle(x, y, sparkColor, velocity));
    }

    startAnimationIfNeeded();
  }

  function launchRocket(startX, targetX, targetY, colorOverride) {
    if (rockets.length >= 5) return;

    const fromX = typeof startX === 'number' ? startX : width * (0.12 + Math.random() * 0.76);
    const toX = typeof targetX === 'number' ? targetX : fromX + (Math.random() * 90 - 45);

    const irregularMiddleHeight = height * (0.30 + Math.random() * 0.35);
    const toY = typeof targetY === 'number' ? targetY : irregularMiddleHeight;
    const rocketColor = colorOverride || PALETTES[Math.floor(Math.random() * PALETTES.length)];

    if (window.DiwaliSound) {
      window.DiwaliSound.playWhistle(0.5);
    }

    rockets.push(new Rocket(fromX, height + 10, toX, toY, rocketColor, (detX, detY, col) => {
      burst(detX, detY, prefersReducedMotion ? 14 : 32, col);
      if (window.DiwaliSound) {
        window.DiwaliSound.playBoom(0.38);
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
    const startX = typeof customX === 'number' ? customX : width * 0.5;
    const groundY = typeof customY === 'number' ? customY : height - 10;
    const duration = 1800;
    const intervalTime = 50;

    if (window.DiwaliSound) {
      window.DiwaliSound.playAnarSound(1.8);
    }

    const fountainTimer = setInterval(() => {
      const sparkCount = prefersReducedMotion ? 4 : 8;
      for (let i = 0; i < sparkCount; i++) {
        const angle = -Math.PI / 2 + (Math.random() * 0.5 - 0.25);
        const speed = Math.random() * 5.5 + 3.8;
        const color = Math.random() > 0.4 ? '#ffd700' : (Math.random() > 0.5 ? '#ff9100' : '#ffffff');
        const velocity = {
          x: Math.cos(angle) * speed + (Math.random() * 1.2 - 0.6),
          y: Math.sin(angle) * speed
        };
        const p = new Particle(startX, groundY, color, velocity);
        p.gravity = 0.085;
        p.decay = 0.024;
        particles.push(p);
      }
      startAnimationIfNeeded();
    }, intervalTime);

    setTimeout(() => {
      clearInterval(fountainTimer);
      burst(startX, groundY - 80, 24, '#ffd700');
    }, duration);
  }

  // 2. Zameen Chakra Effect (Whirling Spiral Ground Wheel)
  function launchChakra(customX, customY) {
    const startX = typeof customX === 'number' ? customX : width * 0.5;
    const groundY = typeof customY === 'number' ? customY : height - 20;
    const duration = 1600;
    let angleOffset = 0;

    if (window.DiwaliSound) {
      window.DiwaliSound.playChakraSound(1.6);
    }

    const chakraTimer = setInterval(() => {
      angleOffset += 0.45;
      for (let i = 0; i < 4; i++) {
        const angle = angleOffset + (Math.PI / 2) * i;
        const speed = Math.random() * 3.8 + 2.5;
        const color = i % 2 === 0 ? '#00e5ff' : '#ffd700';
        const velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed * 0.38
        };
        const p = new Particle(startX, groundY, color, velocity);
        p.gravity = 0.015;
        p.decay = 0.028;
        particles.push(p);
      }
      startAnimationIfNeeded();
    }, 45);

    setTimeout(() => {
      clearInterval(chakraTimer);
      burst(startX, groundY, 32, '#ffd700');
      if (window.DiwaliSound) {
        window.DiwaliSound.playBoom(0.4);
      }
    }, duration);
  }

  // 3. Sutli Bomb Effect (Green Twine Atom Bomb Explosion)
  function launchSutliBomb(customX, customY) {
    const bombX = typeof customX === 'number' ? customX : width * 0.5;
    const bombY = typeof customY === 'number' ? customY : height * 0.5;

    if (window.DiwaliSound) {
      window.DiwaliSound.playFuseSpark(400);
    }

    for (let i = 0; i < 12; i++) {
      particles.push(new Particle(bombX, bombY, '#ffd700', {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5
      }));
    }
    startAnimationIfNeeded();

    setTimeout(() => {
      if (window.DiwaliSound) {
        window.DiwaliSound.playSutliBomb();
      }

      const screenFlash = document.getElementById('screen-flash');
      if (screenFlash) {
        screenFlash.classList.add('active');
        setTimeout(() => screenFlash.classList.remove('active'), 140);
      }
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 450);

      burst(bombX, bombY, prefersReducedMotion ? 18 : 45, '#ff1744');
      setTimeout(() => {
        burst(bombX, bombY, 28, '#ffd700');
      }, 100);
    }, 400);
  }

  // Higher frequency continuous background crackers with rockets, fountains & chakras
  function startContinuousShow(intervalMs) {
    if (prefersReducedMotion) return;
    const interval = intervalMs || 1200; // Fast 1.2s cadence for rich, high-density festive sky!

    stopContinuousShow();
    let tick = 0;
    continuousTimer = setInterval(() => {
      if (document.hidden) return;

      tick++;
      // Launch rocket from bottom
      launchRocket();

      // Frequently launch second rocket from another spot at an irregular middle height
      if (tick % 2 === 0) {
        setTimeout(() => {
          if (!document.hidden) launchRocket();
        }, 280);
      }

      // Periodically trigger ambient Anar or atmospheric bursts
      if (tick % 7 === 0) {
        const randomX = width * (0.2 + Math.random() * 0.6);
        launchAnar(randomX);
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
