export const W = 1280;
export const H = 720;
export const QUIZ_TIME = 15; // detik per pertanyaan
export const MAX_LIVES = 3;

export const COLOR = {
  navy: 0x0b1f4d, royal: 0x1d4ed8, sky: 0x7dd3fc, white: 0xffffff,
  yellow: 0xfacc15, red: 0xef4444, green: 0x22c55e, ink: 0x07142f,
};
export const hex = (n) => '#' + n.toString(16).padStart(6, '0');
export const FONT = '"Trebuchet MS", "Segoe UI", Verdana, sans-serif';

// dist = jarak guru (0-100). speed = pengurangan jarak per detik, ramp = tambahan per detik permainan.
export const DIFFICULTY = {
  easy: {
    label: 'EASY', levels: [1], questions: 10, start: 80, speed: 0.9, ramp: 0.010,
    push: 14, pull: 12, hitPenalty: 5, spawn: 2.6, double: 0,
    info: ['10 pertanyaan', 'Guru lambat', 'Jarak awal jauh'],
  },
  medium: {
    label: 'MEDIUM', levels: [1, 2], questions: 12, start: 65, speed: 1.4, ramp: 0.020,
    push: 12, pull: 14, hitPenalty: 7, spawn: 2.0, double: 0.15,
    info: ['12 pertanyaan', 'Guru sedang', 'Rintangan lebih banyak'],
  },
  hard: {
    label: 'HARD', levels: [2, 3], questions: 14, start: 55, speed: 1.7, ramp: 0.020,
    push: 10, pull: 16, hitPenalty: 9, spawn: 1.6, double: 0.3,
    info: ['14 pertanyaan', 'Guru agresif', 'Soal lebih sulit'],
  },
};
