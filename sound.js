/**
 * ============================================================================
 * DIWALI WISHES - SOUND ENGINE (sound.js)
 * Pure Web Audio API Sound Synthesizer (No external audio files needed)
 * English & Tamil site audio support
 * Author: Sivaram S K
 * ============================================================================
 */

(function () {
  'use strict';

  // Sound state with localStorage persistence
  const STORAGE_KEY = 'diwali_sound_muted';
  let isMuted = localStorage.getItem(STORAGE_KEY) === 'true';
  let audioCtx = null;

  // Initialize or resume the Web Audio Context on user interaction
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play Sizzling / Crackling Fuse Sound
  function playFuseSpark(durationMs) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = (durationMs || 1000) / 1000;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise with random crackle spikes
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const spike = Math.random() > 0.96 ? (Math.random() * 2 - 1) * 2 : 0;
      data[i] = (white * 0.4 + spike * 0.6);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // High-pass filter to sound like a hissing fuse
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2500, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + duration * 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  // Play Loud Boom Explosion Sound
  function playBoom(intensity) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const level = intensity || 1.0;

    // 1. Low Frequency Sub-bass Oscillator (Impact Thump)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    // Downward pitch drop
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    oscGain.gain.setValueAtTime(0.7 * level, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);

    // 2. Low-pass Filtered Noise (Debris & Air Shockwave)
    const noiseDuration = 0.85;
    const bufferSize = ctx.sampleRate * noiseDuration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + noiseDuration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6 * level, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDuration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + noiseDuration);
  }

  // Play Subtle Rocket Whistle Sound (Rising Pitch)
  function playWhistle(durationSeconds) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = durationSeconds || 0.7;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Soft sine wave with rising whistle pitch
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + duration);

    // Keep it subtle, not piercing
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + duration * 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Play Soft Crackle for Firework Bursts
  function playCrackle() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const popsCount = 6;

    for (let i = 0; i < popsCount; i++) {
      const delay = Math.random() * 0.35;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 1200, now + delay);

      gain.gain.setValueAtTime(0.05, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.05);
    }
  }

  // Toggle Mute State
  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem(STORAGE_KEY, String(isMuted));
    updateMuteButtonsUI();
    return isMuted;
  }

  function getMuted() {
    return isMuted;
  }

  // Synchronize UI buttons across pages
  function updateMuteButtonsUI() {
    const buttons = document.querySelectorAll('.sound-toggle-btn');
    buttons.forEach((btn) => {
      const icon = btn.querySelector('.sound-icon');
      const label = btn.querySelector('.sound-label');

      if (isMuted) {
        btn.classList.add('muted');
        btn.setAttribute('aria-label', 'Sound is muted. Click to turn sound on.');
        if (icon) icon.textContent = '🔇';
        if (label) label.textContent = 'Sound Off';
      } else {
        btn.classList.remove('muted');
        btn.setAttribute('aria-label', 'Sound is on. Click to mute.');
        if (icon) icon.textContent = '🔊';
        if (label) label.textContent = 'Sound On';
      }
    });
  }

  // Setup sound toggle click handlers on DOM Ready
  function setupSoundToggleUI() {
    updateMuteButtonsUI();
    document.querySelectorAll('.sound-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        getAudioContext(); // Resume audio context on user gesture
        toggleMute();
      });
    });

    // Resume audio context on first user click anywhere
    document.addEventListener('pointerdown', () => {
      getAudioContext();
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSoundToggleUI);
  } else {
    setupSoundToggleUI();
  }

  // Play Crisp Snappy 1000 Wala Cracker Pop
  function play1000WalaPop() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = Math.random() > 0.5 ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 450, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.04);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Play Heavy Thunderous Sutli Bomb Detonation
  function playSutliBomb() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Deep Sub-bass Thump
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.6);
    oscGain.gain.setValueAtTime(0.95, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.72);

    // 2. Heavy Blast Shockwave Noise
    const noiseDuration = 0.95;
    const bufferSize = ctx.sampleRate * noiseDuration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + noiseDuration);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDuration);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + noiseDuration);
  }

  // Play Sizzling Golden Anar Fountain Sound
  function playAnarSound(durationSeconds) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = durationSeconds || 1.8;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (0.5 + Math.random() * 0.5);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, now);
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.3);
    gainNode.gain.linearRampToValueAtTime(0.32, now + duration * 0.75);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  }

  // Play Whirling Zameen Chakra Sound
  function playChakraSound(durationSeconds) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = durationSeconds || 1.6;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const masterGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(560, now + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(280, now + duration);

    // Whirling modulation
    lfo.frequency.setValueAtTime(14, now);
    lfoGain.gain.setValueAtTime(90, now);
    lfo.connect(osc.frequency);

    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(masterGain);
    masterGain.connect(ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + duration);
    osc.stop(now + duration);
  }

  // Export global sound API
  window.DiwaliSound = {
    init: getAudioContext,
    isMuted: getMuted,
    toggleMute: toggleMute,
    playFuseSpark: playFuseSpark,
    playBoom: playBoom,
    playWhistle: playWhistle,
    playCrackle: playCrackle,
    play1000WalaPop: play1000WalaPop,
    playSutliBomb: playSutliBomb,
    playAnarSound: playAnarSound,
    playChakraSound: playChakraSound,
    updateUI: updateMuteButtonsUI
  };

})();
