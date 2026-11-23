const KEY = 'mindrush.v1';
const base = () => ({ high: { easy: 0, medium: 0, hard: 0 }, sound: true });

function read() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || '{}');
    const b = base();
    return { sound: d.sound ?? b.sound, high: { ...b.high, ...(d.high || {}) } };
  } catch { return base(); }
}
function write(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage penuh / diblokir */ } }

export const Storage = {
  getHigh: (level) => read().high[level] || 0,
  setHigh(level, score) {
    const d = read();
    if (score > d.high[level]) { d.high[level] = score; write(d); return true; }
    return false;
  },
  isSoundOn: () => read().sound,
  setSound(v) { const d = read(); d.sound = !!v; write(d); },
  resetHigh() { const d = read(); d.high = base().high; write(d); },
};
