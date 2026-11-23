import { Storage } from '../systems/Storage.js';

let ctx;
// [frekuensi, mulai, durasi, tipe]
const SOUNDS = {
  click: [[560, 0, 0.07]],
  correct: [[660, 0, 0.1], [880, 0.1, 0.16]],
  wrong: [[180, 0, 0.25, 'sawtooth']],
  hit: [[110, 0, 0.18, 'sawtooth'], [80, 0.06, 0.2]],
  book: [[990, 0, 0.08], [1320, 0.07, 0.1]],
  win: [[523, 0, 0.14], [659, 0.14, 0.14], [784, 0.28, 0.14], [1047, 0.42, 0.35]],
  lose: [[392, 0, 0.2], [330, 0.2, 0.2], [262, 0.4, 0.4, 'sawtooth']],
};

function tone(f, t, d, type = 'square') {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const s = ctx.currentTime + t;
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0.07, s);
  g.gain.exponentialRampToValueAtTime(0.0001, s + d);
  o.connect(g).connect(ctx.destination);
  o.start(s); o.stop(s + d + 0.02);
}

export const Sfx = {
  play(name) {
    if (!Storage.isSoundOn()) return;
    try {
      ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      (SOUNDS[name] || []).forEach((a) => tone(...a));
    } catch { /* audio tidak tersedia */ }
  },
};
