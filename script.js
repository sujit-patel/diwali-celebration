/**
 * HAPPY DIWALI 2026 - INTERACTIVE CELEBRATION & WISHES ENGINE
 * Pure Vanilla JavaScript (ES6+), Canvas Animation, Web Audio API Synthesizer
 * Fully Frontend-Based • Zero External Dependencies • Zero Trackers
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. STATE & CONSTANTS
     ========================================================================== */
  const GREETING_TEMPLATES = {
    traditional: {
      title: "Traditional Blessings",
      subject: "Auspicious Deepavali Blessings",
      getMessage: (to, from) => {
        const recipient = to ? `Dear ${to},` : "Dear Family & Friends,";
        const sender = from ? from : "Your Well Wisher";
        return {
          salutation: recipient,
          body: `Wishing you and your family a very Happy Diwali!

May Goddess Lakshmi and Lord Ganesha bless your home with boundless happiness, prosperity, good health, and eternal peace.

May the divine glow of sacred diyas illuminate your life with joy, wisdom, and auspicious new beginnings!`,
          signature: sender
        };
      }
    },
    family: {
      title: "Family & Love",
      subject: "Diwali Love & Togetherness",
      getMessage: (to, from) => {
        const recipient = to ? `Dearest ${to},` : "Dearest Family & Loved Ones,";
        const sender = from ? from : "With All My Heart";
        return {
          salutation: recipient,
          body: `Diwali is the celebration of warmth, togetherness, and cherished memories.

May our bond grow sweeter with every mithai shared, and brighter with every diya kindled. Wishing everyone at home endless moments of laughter, love, health, and harmony!

May our home always stay blessed with warmth and happiness.`,
          signature: sender
        };
      }
    },
    friends: {
      title: "Friends Special",
      subject: "Festive Sparkles & Fun",
      getMessage: (to, from) => {
        const recipient = to ? `Hey ${to}! 🪔✨` : "Hey Bestie & Friends! 🪔✨";
        const sender = from ? from : "Your Friend";
        return {
          salutation: recipient,
          body: `May your Diwali be as bright as sparklers, full of sweetness like kaju katli, and bursting with unforgettable laughter and celebration!

Here's to making great memories, eating way too many sweets, and shining bright all year round.

Have a sensational, rocking, and joyful Diwali!`,
          signature: sender
        };
      }
    },
    success: {
      title: "Success & Prosperity",
      subject: "Triumph & Abundance",
      getMessage: (to, from) => {
        const recipient = to ? `Dear ${to},` : "Dear Valued Friend & Family,";
        const sender = from ? from : "Warm Regards";
        return {
          salutation: recipient,
          body: `As the golden lamps illuminate this auspicious festive night, may your path to ambition and success be brightly illuminated.

May Goddess Lakshmi shower your endeavors with financial abundance, triumphant breakthroughs, and immense prosperity.

Wishing you a grand, prosperous Diwali and a triumphant year ahead!`,
          signature: sender
        };
      }
    }
  };

  const DIYA_BLESSINGS = [
    "Spread Light, Spread Happiness!",
    "May the sacred flame dispel all darkness from your path!",
    "Goddess Lakshmi's golden grace illuminates your home!",
    "Infinite peace, abundant joy & sweet celebrations!",
    "May your aspirations shine bright like a thousand diyas!",
    "Wishing you prosperity, good health, and endless triumph!"
  ];

  // Application State
  const state = {
    senderName: "",
    recipientName: "",
    style: "traditional",
    customNote: "",
    diyaClicks: 0,
    soundEnabled: false,
    fireworksActive: true,
    audioCtx: null
  };

  /* ==========================================================================
     2. WEB AUDIO API SYNTHESIZER (100% Offline & Zero External Files)
     Authentic Indian Diwali Patakha Sound Suite
     ========================================================================== */
  function initAudioContext() {
    if (!state.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        state.audioCtx = new AudioContextClass();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function ensureSoundEnabled() {
    if (!state.soundEnabled) {
      state.soundEnabled = true;
      initAudioContext();
      const soundBtn = document.getElementById('sound-toggle-btn');
      const soundIcon = document.getElementById('sound-icon');
      const soundStatus = document.getElementById('sound-status');
      const indicatorState = document.getElementById('sound-indicator-state');

      if (soundBtn) soundBtn.setAttribute('aria-pressed', 'true');
      if (soundIcon) soundIcon.textContent = "🔔";
      if (soundStatus) soundStatus.textContent = "On";
      if (indicatorState) indicatorState.textContent = "Active 🔊";

      showToast("🔊 Patakha Sound Enabled! Volume up for Diwali Dhamaka!", "💥");
    }
  }

  // 1. Resonant Brass Temple Bell Chime (when Diya is lit)
  function playDiyaBellSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!state.audioCtx) return;

    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;
      const baseFreq = 587.33; // D5
      const harmonics = [1, 2.02, 2.76, 4.07, 5.43];
      const gains = [0.25, 0.15, 0.1, 0.06, 0.03];

      harmonics.forEach((harmonicRatio, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * harmonicRatio, now);

        gainNode.gain.setValueAtTime(gains[i], now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + i * 0.3);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // 2. Rocket Screaming Whistle (रॉकेट की सीटी)
  function playRocketWhistle() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!state.audioCtx) return;

    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;
      const duration = 0.55;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Screaming ascending whistle frequency
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(2600, now + duration * 0.85);

      // Bandpass resonant peak for iconic whistling motor effect
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + duration * 0.85);
      filter.Q.setValueAtTime(4.5, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.24, now + duration * 0.65);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {
      console.warn("Rocket whistle error", e);
    }
  }

  // 3. Authentic Pataka Explosion / Blast (धमाका)
  function playPatakaExplosion(options = {}) {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!state.audioCtx) return;

    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;
      const isHeavy = options.heavy || false;

      // Part A: Sub-bass Punch (chest-hitting boom)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      const startFreq = isHeavy ? 160 : 130;
      const endFreq = isHeavy ? 24 : 35;
      const duration = isHeavy ? 0.65 : 0.4;

      subOsc.frequency.setValueAtTime(startFreq, now);
      subOsc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      subGain.gain.setValueAtTime(isHeavy ? 0.75 : 0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + duration + 0.05);

      // Part B: Fiery noise explosion body (shockwave blast)
      const bufferSize = Math.floor(ctx.sampleRate * (isHeavy ? 0.55 : 0.35));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * (isHeavy ? 0.09 : 0.06)));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(isHeavy ? 520 : 750, now);
      bandpass.Q.setValueAtTime(1.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isHeavy ? 0.8 : 0.55, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.5 : 0.32));

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Part C: Trailing Crackles (चट-चट)
      const crackleCount = isHeavy ? 5 : 3;
      for (let c = 0; c < crackleCount; c++) {
        const delay = 0.06 + Math.random() * 0.22;
        setTimeout(() => {
          if (state.soundEnabled) playSingleCrackle();
        }, delay * 1000);
      }
    } catch (e) {
      console.warn("Explosion audio error", e);
    }
  }

  // 4. Sutli / Rassi Bomb Blast (भारी सुतली बम धमाका)
  function playSutliBombSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!state.audioCtx) return;

    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;

      // Fuse ignition hiss (tssss...)
      const fuseSize = Math.floor(ctx.sampleRate * 0.18);
      const fuseBuffer = ctx.createBuffer(1, fuseSize, ctx.sampleRate);
      const fuseData = fuseBuffer.getChannelData(0);
      for (let i = 0; i < fuseSize; i++) {
        fuseData[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const fuseSource = ctx.createBufferSource();
      fuseSource.buffer = fuseBuffer;

      const fuseFilter = ctx.createBiquadFilter();
      fuseFilter.type = 'highpass';
      fuseFilter.frequency.setValueAtTime(3500, now);

      const fuseGain = ctx.createGain();
      fuseGain.gain.setValueAtTime(0.18, now);
      fuseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      fuseSource.connect(fuseFilter);
      fuseFilter.connect(fuseGain);
      fuseGain.connect(ctx.destination);
      fuseSource.start(now);

      // Explosive massive boom slightly after fuse
      setTimeout(() => {
        playPatakaExplosion({ heavy: true });
      }, 140);
    } catch (e) {
      console.warn("Sutli bomb error", e);
    }
  }

  // 5. 100-Wala Mirchi Ladi Sequence (तड़ातड़ लड़ी)
  function playLadiSound() {
    if (!state.soundEnabled) return;
    initAudioContext();

    const burstCount = 14;
    for (let i = 0; i < burstCount; i++) {
      const delay = i * 75 + (Math.random() * 25 - 12);
      setTimeout(() => {
        if (!state.soundEnabled) return;
        const isFinal = (i === burstCount - 1);
        if (isFinal) {
          playPatakaExplosion({ heavy: true });
        } else {
          playSnapPop();
        }
      }, delay);
    }
  }

  // Single fast cracker snap for Ladi (पटाखे की तड़ातड़)
  function playSnapPop() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!state.audioCtx) return;

    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;

      // Sharp transient click
      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const randomPitch = 1200 + Math.random() * 1400;
      filter.frequency.setValueAtTime(randomPitch, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45 + Math.random() * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // Low pop body
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220 + Math.random() * 100, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn("Snap pop error", e);
    }
  }

  // Micro crackle
  function playSingleCrackle() {
    if (!state.soundEnabled || !state.audioCtx) return;
    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2400 + Math.random() * 1600, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18 + Math.random() * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {
      // quiet catch
    }
  }

  // 6. Golden Anaar & Chakri Sizzle (अनार व फुलझड़ी की चट-चट)
  function playAnaarSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!state.audioCtx) return;

    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;
      const dur = 2.0;

      const bufferSize = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (0.35 + 0.65 * Math.sin(i * 0.04));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(2800, now);
      highpass.frequency.linearRampToValueAtTime(3800, now + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.42, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(highpass);
      highpass.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // Add frequent micro crackle pops during the fountain
      for (let i = 0; i < 18; i++) {
        setTimeout(() => {
          if (state.soundEnabled) playSingleCrackle();
        }, i * 110 + Math.random() * 40);
      }
    } catch (e) {
      console.warn("Anaar audio error", e);
    }
  }

  // Play celebratory harp / chime fanfare for greeting card generation
  function playCardFanfare() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!state.audioCtx) return;

    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch (e) {
      console.warn("Fanfare error", e);
    }
  }

  /* ==========================================================================
     3. HIGH-PERFORMANCE HTML5 CANVAS FIREWORKS & FLOATING SPARK ENGINE
     ========================================================================== */
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let canvasWidth = 0;
  let canvasHeight = 0;
  let animationFrameId = null;

  const particles = [];
  const fireworksRockets = [];
  const ambientEmbers = [];

  const FESTIVE_PALETTE = [
    '#ffd700', // Gold
    '#ffb703', // Amber
    '#fb8500', // Marigold orange
    '#ff4500', // Fiery orange-red
    '#e63946', // Festive ruby crimson
    '#ffffff', // Pure white core
    '#a7f3d0', // Emerald shimmer
    '#c084fc'  // Royal purple shimmer
  ];

  function resizeCanvas() {
    if (!canvas) return;
    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;
  }

  class Ember {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvasWidth;
      this.y = canvasHeight + Math.random() * 80;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.8 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.color = FESTIVE_PALETTE[Math.floor(Math.random() * 3)]; // Warm golds
      this.alpha = Math.random() * 0.6 + 0.2;
      this.maxLife = Math.random() * 300 + 200;
      this.life = 0;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.life * 0.02) * 0.3;
      this.life++;
      if (this.y < -20 || this.life >= this.maxLife) {
        this.reset();
      }
    }
    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.5 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.friction = 0.95;
      this.gravity = 0.08;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.012;
      this.size = Math.random() * 2.6 + 1.2;
      this.flicker = Math.random() > 0.4;
    }
    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      if (!ctx || this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.flicker && Math.random() > 0.2 ? this.alpha * 0.8 : this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class FireworkRocket {
    constructor(startX, startY, targetX, targetY) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.speed = 4;
      const angle = Math.atan2(targetY - startY, targetX - startX);
      this.vx = Math.cos(angle) * 7.5;
      this.vy = Math.sin(angle) * 7.5;
      this.color = FESTIVE_PALETTE[Math.floor(Math.random() * FESTIVE_PALETTE.length)];
      this.trail = [];
      this.dead = false;

      // Play authentic screaming rocket whistle on ascent
      playRocketWhistle();
    }
    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.8 });
      if (this.trail.length > 5) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;

      // Check distance to target
      const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
      if (dist < 18 || this.vy >= 0 || this.y <= this.targetY) {
        this.dead = true;
        createBurst(this.targetX, this.targetY, this.color);
        playPatakaExplosion({ heavy: false });
      }
    }
    draw() {
      if (!ctx || this.dead) return;
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw rocket trail sparks
      this.trail.forEach(t => {
        ctx.globalAlpha = t.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        t.alpha -= 0.15;
      });
      ctx.restore();
    }
  }

  function createBurst(x, y, primaryColor) {
    const particleCount = 45;
    const secondaryColor = FESTIVE_PALETTE[Math.floor(Math.random() * FESTIVE_PALETTE.length)];
    for (let i = 0; i < particleCount; i++) {
      const color = Math.random() > 0.35 ? primaryColor : secondaryColor;
      particles.push(new Particle(x, y, color));
    }
  }

  function launchCelebrationRocket(targetX, targetY) {
    if (!state.fireworksActive) return;
    const startX = targetX ? targetX + (Math.random() * 80 - 40) : Math.random() * canvasWidth;
    const startY = canvasHeight + 10;
    const destX = targetX || (Math.random() * (canvasWidth * 0.7) + canvasWidth * 0.15);
    const destY = targetY || (Math.random() * (canvasHeight * 0.45) + canvasHeight * 0.1);

    fireworksRockets.push(new FireworkRocket(startX, startY, destX, destY));
  }

  // Initialize background ambient embers
  function initEmbers() {
    ambientEmbers.length = 0;
    const emberCount = window.innerWidth < 768 ? 20 : 38;
    for (let i = 0; i < emberCount; i++) {
      ambientEmbers.push(new Ember());
    }
  }

  // Main Canvas Render Loop
  let lastAutoBurst = 0;
  function renderCanvas(time) {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Render Floating Embers
    for (let i = 0; i < ambientEmbers.length; i++) {
      ambientEmbers[i].update();
      ambientEmbers[i].draw();
    }

    // 2. Render Fireworks Rockets
    for (let i = fireworksRockets.length - 1; i >= 0; i--) {
      fireworksRockets[i].update();
      fireworksRockets[i].draw();
      if (fireworksRockets[i].dead) {
        fireworksRockets.splice(i, 1);
      }
    }

    // 3. Render Particle Sparks
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    // 4. Subtle Intermittent Automatic Fireworks (Every 4.5s)
    if (state.fireworksActive && time - lastAutoBurst > 4500) {
      lastAutoBurst = time;
      // Don't overwhelm, launch 1 subtle burst
      launchCelebrationRocket();
    }

    animationFrameId = requestAnimationFrame(renderCanvas);
  }

  function setupCanvas() {
    if (!canvas) return;
    resizeCanvas();
    initEmbers();
    window.addEventListener('resize', () => {
      resizeCanvas();
      initEmbers();
    });

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      state.fireworksActive = false;
    }

    // Pause when tab is not visible to optimize CPU/Battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        lastAutoBurst = performance.now();
        animationFrameId = requestAnimationFrame(renderCanvas);
      }
    });

    // Interactive Screen Click Launch
    window.addEventListener('click', (e) => {
      // If clicking interactive controls, inputs, or buttons, don't hijack
      if (e.target.closest('button, a, input, select, textarea, .festive-greeting-card, .generator-form-card')) {
        return;
      }
      launchCelebrationRocket(e.clientX, e.clientY);
    });

    animationFrameId = requestAnimationFrame(renderCanvas);
  }

  /* ==========================================================================
     4. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message, icon = "✨") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3400);
  }

  /* ==========================================================================
     5. INTERACTIVE DIYA EXPERIENCE
     ========================================================================== */
  function setupInteractiveDiya() {
    const grandDiyaBtn = document.getElementById('grand-diya-btn');
    const grandFlame = document.getElementById('grand-flame');
    const pedestalGlow = document.getElementById('pedestal-glow');
    const shockwave = document.getElementById('diya-shockwave');
    const messageBox = document.getElementById('diya-message-box');
    const dynamicMessage = document.getElementById('diya-dynamic-message');
    const spawner = document.getElementById('diya-particle-spawner');
    const clickCountEl = document.getElementById('diya-click-count');
    const glowLevelEl = document.getElementById('diya-glow-level');
    const btnIgniteAll = document.getElementById('btn-ignite-all');
    const miniDiyasRow = document.getElementById('mini-diyas-row');

    if (!grandDiyaBtn) return;

    function lightDiya(event) {
      state.diyaClicks++;
      if (clickCountEl) clickCountEl.textContent = state.diyaClicks;

      // Play rich resonant temple bell chime
      playDiyaBellSound();

      // Trigger golden shockwave ripple
      if (shockwave) {
        shockwave.classList.remove('trigger');
        void shockwave.offsetWidth; // Trigger reflow
        shockwave.classList.add('trigger');
      }

      // Flame scale animation
      if (grandFlame) {
        grandFlame.style.transform = 'translateX(-50%) scale(1.35)';
        setTimeout(() => {
          grandFlame.style.transform = 'translateX(-50%) scale(1)';
        }, 400);
      }

      // Intensify Pedestal Glow
      if (pedestalGlow) {
        pedestalGlow.classList.add('glowing-max');
        setTimeout(() => {
          pedestalGlow.classList.remove('glowing-max');
        }, 1200);
      }

      // Spawn floating golden sparks escaping upwards
      if (spawner) {
        for (let i = 0; i < 16; i++) {
          const spark = document.createElement('span');
          spark.className = 'spawner-spark';
          const tx = (Math.random() - 0.5) * 160;
          const ty = -(Math.random() * 120 + 40);
          spark.style.setProperty('--tx', `${tx}px`);
          spark.style.setProperty('--ty', `${ty}px`);
          spawner.appendChild(spark);
          setTimeout(() => spark.remove(), 1200);
        }
      }

      // Cycle Inspirational Message
      const blessingIndex = (state.diyaClicks - 1) % DIYA_BLESSINGS.length;
      if (dynamicMessage) {
        dynamicMessage.textContent = DIYA_BLESSINGS[blessingIndex];
      }

      if (messageBox) {
        messageBox.classList.add('highlight');
        setTimeout(() => messageBox.classList.remove('highlight'), 600);
      }

      // Update Glow Level Description
      if (glowLevelEl) {
        if (state.diyaClicks > 12) {
          glowLevelEl.textContent = "Eternal Deepotsav";
        } else if (state.diyaClicks > 5) {
          glowLevelEl.textContent = "Divine Splendor";
        } else {
          glowLevelEl.textContent = "Radiant & Blessed";
        }
      }

      // Also trigger a celebratory firework in the sky above the diya
      if (event) {
        const rect = grandDiyaBtn.getBoundingClientRect();
        launchCelebrationRocket(rect.left + rect.width / 2, rect.top - 120);
      }
    }

    grandDiyaBtn.addEventListener('click', lightDiya);

    // Ignite Grand Deepotsav Button
    if (btnIgniteAll) {
      btnIgniteAll.addEventListener('click', () => {
        ensureSoundEnabled();
        playDiyaBellSound();
        // Play rapid Diwali Ladi sequence!
        setTimeout(() => playLadiSound(), 300);
        showToast("🌟 Grand Deepotsav Ignited! All sacred diyas are glowing bright.", "🪔");

        if (miniDiyasRow) {
          const diyas = miniDiyasRow.querySelectorAll('.mini-diya');
          diyas.forEach((d, idx) => {
            setTimeout(() => {
              d.style.transform = 'translateY(-8px) scale(1.2)';
              setTimeout(() => {
                d.style.transform = '';
              }, 600);
            }, idx * 100);
          });
        }

        // Launch 4 celebratory fireworks
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            launchCelebrationRocket();
          }, i * 300);
        }
      });
    }
  }

  /* ==========================================================================
     6. PERSONALIZED GREETING CARD GENERATOR & URL SYNC
     ========================================================================== */
  function setupGreetingGenerator() {
    const form = document.getElementById('diwali-wishes-form');
    const senderInput = document.getElementById('sender-name-input');
    const recipientInput = document.getElementById('recipient-name-input');
    const styleSelect = document.getElementById('greeting-style-select');
    const customNoteInput = document.getElementById('custom-note-input');
    const resetWishBtn = document.getElementById('reset-default-wish-btn');
    const charCounter = document.getElementById('char-counter');

    // Card Elements
    const cardSalutation = document.getElementById('card-salutation');
    const cardMessageText = document.getElementById('card-message-text');
    const cardSenderName = document.getElementById('card-sender-name');
    const shareableLinkInput = document.getElementById('shareable-link-input');
    const cardStatusBadge = document.getElementById('card-status-badge');

    // Read URL query parameters (?to=...&from=...&style=...)
    function parseUrlParams() {
      try {
        const params = new URLSearchParams(window.location.search);
        const to = params.get('to');
        const from = params.get('from');
        const style = params.get('style');

        if (to) {
          state.recipientName = to.trim();
          if (recipientInput) recipientInput.value = state.recipientName;
        }

        if (from) {
          state.senderName = from.trim();
          if (senderInput) senderInput.value = state.senderName;
        }

        if (style && GREETING_TEMPLATES[style]) {
          state.style = style;
          if (styleSelect) styleSelect.value = state.style;
        }

        // Show Incoming Greeting Alert Banner if recipient is in URL
        if (to) {
          const banner = document.getElementById('incoming-wish-banner');
          const bannerText = document.getElementById('incoming-wish-text');
          if (banner && bannerText) {
            banner.classList.remove('hidden');
            const senderSnippet = from ? ` from ${from}` : "";
            bannerText.innerHTML = `<strong>✨ A special Diwali blessing has arrived for ${escapeHtml(to)}${escapeHtml(senderSnippet)}!</strong>`;
          }
        }
      } catch (err) {
        console.warn("Could not parse URL params", err);
      }
    }

    // Helper: Escape HTML
    function escapeHtml(str) {
      if (!str) return "";
      return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m]));
    }

    // Update Live Greeting Card
    function updateCard(isExplicitGenerate = false) {
      const template = GREETING_TEMPLATES[state.style] || GREETING_TEMPLATES.traditional;
      const greetingData = template.getMessage(state.recipientName, state.senderName);

      // Salutation
      if (cardSalutation) {
        cardSalutation.textContent = greetingData.salutation;
      }

      // Message Body (Either custom note or template body)
      if (cardMessageText) {
        if (state.customNote.trim()) {
          cardMessageText.textContent = state.customNote.trim();
        } else {
          cardMessageText.textContent = greetingData.body;
        }
      }

      // Sender Name
      if (cardSenderName) {
        cardSenderName.textContent = greetingData.signature;
      }

      // Build & Sync Shareable Personalized URL
      const baseUrl = window.location.origin + window.location.pathname;
      const params = new URLSearchParams();
      if (state.recipientName) params.set('to', state.recipientName);
      if (state.senderName) params.set('from', state.senderName);
      if (state.style) params.set('style', state.style);

      const queryString = params.toString();
      const fullShareUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      if (shareableLinkInput) {
        shareableLinkInput.value = fullShareUrl;
      }

      if (isExplicitGenerate) {
        if (cardStatusBadge) {
          cardStatusBadge.textContent = "Personalized & Ready";
          cardStatusBadge.style.color = "#ffd700";
        }
        playCardFanfare();
        launchCelebrationRocket();
        showToast("✨ Personalized Diwali wishes created! Ready to share.", "🎉");

        // Smooth scroll to card on mobile
        const cardSection = document.getElementById('generated-card-section');
        if (cardSection && window.innerWidth < 820) {
          cardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    // Live Listeners on Form Inputs
    if (senderInput) {
      senderInput.addEventListener('input', (e) => {
        state.senderName = e.target.value.trim();
        updateCard(false);
      });
    }

    if (recipientInput) {
      recipientInput.addEventListener('input', (e) => {
        state.recipientName = e.target.value.trim();
        updateCard(false);
      });
    }

    if (styleSelect) {
      styleSelect.addEventListener('change', (e) => {
        state.style = e.target.value;
        // If custom note was empty, update preview with new style default
        if (!state.customNote) {
          updateCard(false);
        }
      });
    }

    if (customNoteInput) {
      customNoteInput.addEventListener('input', (e) => {
        state.customNote = e.target.value;
        if (charCounter) {
          charCounter.textContent = `${e.target.value.length} / 350`;
        }
        updateCard(false);
      });
    }

    if (resetWishBtn) {
      resetWishBtn.addEventListener('click', () => {
        state.customNote = "";
        if (customNoteInput) customNoteInput.value = "";
        if (charCounter) charCounter.textContent = "0 / 350";
        updateCard(false);
        showToast("Reset to default style message", "🔄");
      });
    }

    // Form Submit (Generate My Wishes)
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.senderName = senderInput ? senderInput.value.trim() : "";
        state.recipientName = recipientInput ? recipientInput.value.trim() : "";
        state.style = styleSelect ? styleSelect.value : "traditional";
        state.customNote = customNoteInput ? customNoteInput.value : "";

        updateCard(true);
      });
    }

    // Initialize from URL or defaults
    parseUrlParams();
    updateCard(false);
  }

  /* ==========================================================================
     7. SHARING FEATURES (WhatsApp, Facebook, Clipboard, Native Web Share)
     ========================================================================== */
  function setupShareFeatures() {
    const btnWhatsapp = document.getElementById('btn-share-whatsapp');
    const btnFacebook = document.getElementById('btn-share-facebook');
    const btnCopy = document.getElementById('btn-copy-greeting');
    const btnNative = document.getElementById('btn-native-share');
    const btnCopyUrl = document.getElementById('btn-copy-url');
    const shareUrlInput = document.getElementById('shareable-link-input');
    const footerShareBtn = document.getElementById('footer-share-site-btn');

    // Build Formatted Greeting Text for Sharing
    function buildShareMessage() {
      const template = GREETING_TEMPLATES[state.style] || GREETING_TEMPLATES.traditional;
      const greetingData = template.getMessage(state.recipientName, state.senderName);
      const siteUrl = shareUrlInput && shareUrlInput.value ? shareUrlInput.value : window.location.href;

      const bodyText = state.customNote.trim() ? state.customNote.trim() : greetingData.body;

      return `🪔 *HAPPY DIWALI 2026* 🪔
${greetingData.salutation}

${bodyText}

Warm regards & love,
*${greetingData.signature}*

━━━━━━━━━━━━━━━━━━━
✨ I am spreading happiness and light this Diwali! Create your own beautiful Diwali wishes here: ${siteUrl}`;
    }

    // 1. WhatsApp Share
    if (btnWhatsapp) {
      btnWhatsapp.addEventListener('click', () => {
        const message = buildShareMessage();
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      });
    }

    // 2. Facebook Share
    if (btnFacebook) {
      btnFacebook.addEventListener('click', () => {
        const siteUrl = shareUrlInput && shareUrlInput.value ? shareUrlInput.value : window.location.href;
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
        window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
      });
    }

    // 3. Copy Greeting to Clipboard
    function copyGreetingText() {
      const message = buildShareMessage();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message)
          .then(() => {
            showToast("🎉 Greeting copied to clipboard! Ready to paste into WhatsApp, Instagram or SMS.", "📋");
          })
          .catch(() => {
            fallbackCopy(message);
          });
      } else {
        fallbackCopy(message);
      }
    }

    function fallbackCopy(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showToast("🎉 Greeting copied to clipboard! Ready to paste.", "📋");
        } else {
          showToast("Please copy the greeting text manually.", "ℹ️");
        }
      } catch (err) {
        showToast("Please copy the greeting text manually.", "ℹ️");
      }
      document.body.removeChild(textArea);
    }

    if (btnCopy) {
      btnCopy.addEventListener('click', copyGreetingText);
    }

    // 4. Native Web Share API
    function executeNativeShare() {
      const message = buildShareMessage();
      const siteUrl = shareUrlInput && shareUrlInput.value ? shareUrlInput.value : window.location.href;

      if (navigator.share) {
        navigator.share({
          title: 'Happy Diwali 2026 Wishes 🪔',
          text: message,
          url: siteUrl
        }).then(() => {
          showToast("Thank you for spreading Diwali joy!", "✨");
        }).catch((error) => {
          // If aborted by user, no error toast needed
          if (error.name !== 'AbortError') {
            copyGreetingText();
          }
        });
      } else {
        // Fallback for browsers without navigator.share
        copyGreetingText();
      }
    }

    if (btnNative) {
      btnNative.addEventListener('click', executeNativeShare);
    }

    // 5. Copy Just the Personalized Link
    if (btnCopyUrl && shareUrlInput) {
      btnCopyUrl.addEventListener('click', () => {
        const urlToCopy = shareUrlInput.value;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(urlToCopy).then(() => {
            showToast("🔗 Personalized link copied! Share this link with your recipient.", "✅");
          }).catch(() => {
            fallbackCopy(urlToCopy);
          });
        } else {
          fallbackCopy(urlToCopy);
        }
      });
    }

    // 6. Footer Share Website
    if (footerShareBtn) {
      footerShareBtn.addEventListener('click', executeNativeShare);
    }
  }

  /* ==========================================================================
     8. DIWALI BLESSING CARDS HOOKUP
     ========================================================================== */
  function setupBlessingCards() {
    const blessingCards = document.querySelectorAll('.blessing-card');
    const styleSelect = document.getElementById('greeting-style-select');
    const generatorSection = document.getElementById('wishes-generator');

    blessingCards.forEach(card => {
      const btn = card.querySelector('.btn-select-wish');
      const targetStyle = btn ? btn.getAttribute('data-target-style') : card.getAttribute('data-style');
      const title = btn ? btn.getAttribute('data-card-title') : "Blessing";

      const handleSelect = () => {
        if (targetStyle && styleSelect) {
          styleSelect.value = targetStyle;
          // Trigger change event to update preview
          styleSelect.dispatchEvent(new Event('change'));

          showToast(`Selected "${title}"! Enter your name and share.`, "✨");

          if (generatorSection) {
            generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Highlight sender input
            const senderInput = document.getElementById('sender-name-input');
            if (senderInput) {
              setTimeout(() => senderInput.focus(), 600);
            }
          }
        }
      };

      if (btn) btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSelect();
      });

      card.addEventListener('click', handleSelect);
    });
  }

  /* ==========================================================================
     9. DIWALI PATAKHA ZONE (AUTHENTIC FIRECRACKER INTERACTION)
     ========================================================================== */
  function setupPatakhaZone() {
    const btnRocket = document.getElementById('btn-patakha-rocket');
    const btnBomb = document.getElementById('btn-patakha-bomb');
    const btnLadi = document.getElementById('btn-patakha-ladi');
    const btnAnaar = document.getElementById('btn-patakha-anaar');

    // 1. Sky Rocket Card
    if (btnRocket) {
      btnRocket.addEventListener('click', () => {
        ensureSoundEnabled();
        showToast("🚀 Sky Rocket ignited! Hear the whistling seeti & blast!", "💥");
        launchCelebrationRocket(window.innerWidth * 0.5, window.innerHeight * 0.22);
        setTimeout(() => {
          launchCelebrationRocket(window.innerWidth * 0.45, window.innerHeight * 0.18);
        }, 320);
      });
    }

    // 2. Sutli / Rassi Bomb Card
    if (btnBomb) {
      btnBomb.addEventListener('click', () => {
        ensureSoundEnabled();
        showToast("💣 Sutli Bomb ignited! Tssss... DHAMAKA!", "💥");
        playSutliBombSound();

        // Screen shake & vibration effect
        document.body.style.transform = 'translateY(4px)';
        setTimeout(() => {
          document.body.style.transform = 'translateY(-4px)';
          setTimeout(() => { document.body.style.transform = ''; }, 70);
        }, 150);

        // Flash blast in center
        setTimeout(() => {
          createBurst(window.innerWidth / 2, window.innerHeight * 0.5, '#ff4500');
        }, 140);
      });
    }

    // 3. 100-Wala Mirchi Ladi Card
    if (btnLadi) {
      btnLadi.addEventListener('click', () => {
        ensureSoundEnabled();
        showToast("🧨 100-Wala Mirchi Ladi ignited! तड़ा-तड़ तड़ा-तड़ धमाका!", "💥");
        playLadiSound();

        // Sequential rapid fireworks bursts
        for (let i = 0; i < 12; i++) {
          setTimeout(() => {
            const rx = window.innerWidth * 0.5 + (Math.random() * 260 - 130);
            const ry = window.innerHeight * 0.55 + (Math.random() * 80 - 40);
            createBurst(rx, ry, i % 2 === 0 ? '#ff0055' : '#ffd700');
          }, i * 85);
        }
      });
    }

    // 4. Golden Anaar Card
    if (btnAnaar) {
      btnAnaar.addEventListener('click', () => {
        ensureSoundEnabled();
        showToast("✨ Golden Anaar ignited! Sizzling fountain of sparks!", "🌟");
        playAnaarSound();

        // Sizzling fountain of golden sparkles
        for (let i = 0; i < 16; i++) {
          setTimeout(() => {
            const rx = window.innerWidth * 0.5 + (Math.random() * 90 - 45);
            const ry = window.innerHeight * 0.62;
            createBurst(rx, ry, '#ffd700');
          }, i * 110);
        }
      });
    }
  }

  /* ==========================================================================
     10. UI CONTROLS & EVENT LISTENERS
     ========================================================================== */
  function setupUiControls() {
    // Sound Toggle Button
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundStatus = document.getElementById('sound-status');
    const indicatorState = document.getElementById('sound-indicator-state');

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundBtn.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');

        if (state.soundEnabled) {
          initAudioContext();
          if (soundIcon) soundIcon.textContent = "🔔";
          if (soundStatus) soundStatus.textContent = "On";
          if (indicatorState) indicatorState.textContent = "Active 🔊";
          playPatakaExplosion({ heavy: false });
          showToast("🔊 Patakha Sound Enabled! Crackers are ready to burst!", "💥");
        } else {
          if (soundIcon) soundIcon.textContent = "🔇";
          if (soundStatus) soundStatus.textContent = "Off";
          if (indicatorState) indicatorState.textContent = "Muted 🔇";
          showToast("Sound muted", "🔇");
        }
      });
    }

    // Launch Firework Floating Button
    const fireworkBtn = document.getElementById('firework-launch-btn');
    if (fireworkBtn) {
      fireworkBtn.addEventListener('click', () => {
        ensureSoundEnabled();
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            launchCelebrationRocket();
          }, i * 220);
        }
        showToast("🎆 Happy Diwali! Sparkling rockets launched with whistle & boom!", "✨");
      });
    }

    // Banner Firework Button
    const bannerFireworkBtn = document.getElementById('banner-firework-btn');
    if (bannerFireworkBtn) {
      bannerFireworkBtn.addEventListener('click', () => {
        ensureSoundEnabled();
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            launchCelebrationRocket();
          }, i * 180);
        }
        playSutliBombSound();
        showToast("🎆 Grand celebration fireworks illuminating the sky!", "✨");
      });
    }

    // Back to top smooth scroll
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     11. INITIALIZATION
     ========================================================================== */
  function init() {
    setupCanvas();
    setupInteractiveDiya();
    setupGreetingGenerator();
    setupShareFeatures();
    setupBlessingCards();
    setupPatakhaZone();
    setupUiControls();

    // Welcome Console Greeting
    console.log("%c🪔 शुभ दीपावली | Happy Diwali 2026 🪔", "font-size: 18px; font-weight: bold; color: #ffd700; text-shadow: 0 0 10px #ff7700;");
    console.log("%cMay the festival of lights bring you boundless happiness, peace, and prosperity!", "font-size: 13px; color: #ffb703;");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
