import { Storage } from '../systems/Storage.js';

let ctx = null;
let bgmTimer = null;
let bgmStep = 0;
let isBgmPlaying = false;

// [frekuensi, mulai, durasi, tipe, gain]
const SOUNDS = {
  click: [[560, 0, 0.06, 'triangle', 0.08]],
  correct: [
    [523, 0, 0.09, 'sine', 0.1],
    [659, 0.08, 0.09, 'sine', 0.1],
    [784, 0.16, 0.12, 'sine', 0.12],
    [1046, 0.24, 0.22, 'sine', 0.14],
  ],
  wrong: [
    [240, 0, 0.12, 'sawtooth', 0.1],
    [170, 0.1, 0.28, 'sawtooth', 0.12],
  ],
  hit: [
    [140, 0, 0.1, 'sawtooth', 0.15],
    [90, 0.06, 0.22, 'sawtooth', 0.18],
    [60, 0.12, 0.25, 'triangle', 0.2],
  ],
  book: [
    [987, 0, 0.06, 'sine', 0.09],
    [1318, 0.06, 0.08, 'sine', 0.11],
    [1975, 0.12, 0.18, 'sine', 0.13],
  ],
  whoosh: [
    [320, 0, 0.08, 'sine', 0.06],
    [480, 0.04, 0.1, 'sine', 0.04],
  ],
  jump: [
    [260, 0, 0.08, 'sine', 0.1],
    [420, 0.05, 0.14, 'sine', 0.12],
  ],
  salto: [
    [350, 0, 0.06, 'triangle', 0.1],
    [520, 0.05, 0.08, 'sine', 0.12],
    [780, 0.1, 0.12, 'sine', 0.14],
    [1040, 0.18, 0.2, 'sine', 0.15],
  ],
  land: [
    [100, 0, 0.08, 'triangle', 0.08],
  ],
  combo: [
    [587, 0, 0.08, 'sine', 0.1],
    [740, 0.07, 0.08, 'sine', 0.11],
    [880, 0.14, 0.09, 'sine', 0.12],
    [1175, 0.21, 0.24, 'sine', 0.15],
  ],
  danger: [
    [220, 0, 0.1, 'triangle', 0.08],
    [180, 0.1, 0.15, 'sawtooth', 0.09],
  ],
  win: [
    [523, 0, 0.14, 'sine', 0.12],
    [659, 0.14, 0.14, 'sine', 0.12],
    [784, 0.28, 0.14, 'sine', 0.14],
    [1047, 0.42, 0.38, 'sine', 0.16],
  ],
  lose: [
    [392, 0, 0.18, 'sawtooth', 0.12],
    [330, 0.18, 0.2, 'sawtooth', 0.12],
    [262, 0.38, 0.45, 'sawtooth', 0.14],
  ],
};

function initCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

function tone(f, t, d, type = 'square', vol = 0.07) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const s = ctx.currentTime + t;
  o.type = type;
  o.frequency.value = f;
  g.gain.setValueAtTime(vol, s);
  g.gain.exponentialRampToValueAtTime(0.0001, s + d);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(s);
  o.stop(s + d + 0.02);
}

// Retro 8-bit upbeat chiptune bass & melody patterns
const BASS_NOTES = [130.81, 130.81, 164.81, 196.00, 146.83, 146.83, 174.61, 220.00, 110.00, 110.00, 130.81, 164.81, 174.61, 196.00, 220.00, 246.94];
const LEAD_NOTES = [523.25, 0, 587.33, 659.25, 0, 784.00, 659.25, 587.33, 523.25, 659.25, 784.00, 0, 880.00, 784.00, 659.25, 587.33];

function scheduleBgmStep() {
  if (!isBgmPlaying || !Storage.isSoundOn()) return;
  try {
    initCtx();
    const now = 0;
    const idx = bgmStep % BASS_NOTES.length;
    
    // Bass note
    const bNote = BASS_NOTES[idx];
    if (bNote) tone(bNote, now, 0.11, 'triangle', 0.035);

    // Lead melody note
    const lNote = LEAD_NOTES[idx];
    if (lNote) tone(lNote, now, 0.13, 'sine', 0.025);

    // Hi-hat / perc click on offbeats
    if (idx % 2 === 1) {
      tone(1200 + Math.random() * 400, now, 0.03, 'square', 0.012);
    }

    bgmStep++;
  } catch {
    // audio context blocked
  }
}

export const Sfx = {
  play(name) {
    if (!Storage.isSoundOn()) return;
    try {
      initCtx();
      (SOUNDS[name] || []).forEach((a) => tone(...a));
    } catch { /* audio tidak tersedia */ }
  },

  startBgm() {
    if (isBgmPlaying) return;
    isBgmPlaying = true;
    if (bgmTimer) clearInterval(bgmTimer);
    bgmTimer = setInterval(scheduleBgmStep, 150);
  },

  stopBgm() {
    isBgmPlaying = false;
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
    }
  },

  toggleSound() {
    const next = !Storage.isSoundOn();
    Storage.setSound(next);
    if (!next) {
      this.stopBgm();
    } else {
      this.startBgm();
      this.play('click');
    }
    return next;
  },
};
