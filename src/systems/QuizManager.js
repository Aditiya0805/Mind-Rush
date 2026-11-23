import { QUESTIONS } from '../data/questions.js';
import { DIFFICULTY } from '../config.js';

const shuffle = (arr) => {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

// Satu sesi = satu antrian soal acak tanpa pengulangan.
export default class QuizManager {
  constructor(levelKey) {
    const d = DIFFICULTY[levelKey];
    this.queue = shuffle(QUESTIONS.filter((q) => d.levels.includes(q.lv))).slice(0, d.questions);
    this.total = this.queue.length;
    this.index = 0;
  }
  get done() { return this.index >= this.total; }
  next() {
    const q = this.queue[this.index++];
    const opts = shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer })));
    return { text: q.text, options: opts.map((o) => o.t), answer: opts.findIndex((o) => o.ok), number: this.index, total: this.total };
  }
}
