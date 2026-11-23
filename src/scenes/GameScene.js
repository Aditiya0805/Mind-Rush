import Phaser from 'phaser';
import { W, H, COLOR, DIFFICULTY, QUIZ_TIME, MAX_LIVES, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { Sfx } from '../audio/Sfx.js';
import { Storage } from '../systems/Storage.js';
import QuizManager from '../systems/QuizManager.js';
import ChaseSystem from '../systems/ChaseSystem.js';
import RoadWorld, { CX, laneW, lineY, scaleAt, laneX } from '../systems/RoadWorld.js';
import Student from '../characters/Student.js';
import Teacher from '../characters/Teacher.js';

const MC_Q = 0.8; // posisi MC pada proyeksi jalan

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  init(data) { this.levelKey = data.level || 'easy'; }

  create() {
    this.cfg = DIFFICULTY[this.levelKey];
    this.quiz = new QuizManager(this.levelKey);
    this.chase = new ChaseSystem(this.cfg);
    this.score = 0; this.lives = MAX_LIVES; this.lane = 1; this.elapsed = 0;
    this.timeLeft = QUIZ_TIME; this.state = 'idle'; this.current = null; this.laneOffset = 0;

    this.world = new RoadWorld(this, this.cfg);
    this.teacher = new Teacher(this, CX, lineY(1.1)).setDepth(8);
    this.student = new Student(this, laneX(1, MC_Q), lineY(MC_Q)).setDepth(10).setScale(scaleAt(MC_Q) * 1.1);

    this.buildHud();
    this.buildQuizPanel();
    const kb = this.input.keyboard;
    this.keys = kb.addKeys({ left: 'LEFT', right: 'RIGHT', a: 'A', d: 'D' });
    kb.on('keydown-ESC', () => this.pauseGame());
    this.nextQuestion();
  }

  // ---------- UI ----------
  buildHud() {
    const g = this.add.graphics().setDepth(20);
    g.fillStyle(COLOR.navy, 0.9).fillRoundedRect(16, 12, 420, 176, 16);
    g.lineStyle(3, COLOR.sky, 0.9).strokeRoundedRect(16, 12, 420, 176, 16);
    this.scoreT = text(this, 36, 26, '', 32, '#ffffff', {}, [0, 0]).setDepth(21);
    text(this, 416, 36, this.cfg.label, 22, hex(COLOR.yellow), {}, [1, 0]).setDepth(21);
    this.heartG = this.add.graphics().setDepth(21);
    this.distT = text(this, 36, 120, '', 18, hex(COLOR.sky), {}, [0, 0]).setDepth(21);
    this.barG = this.add.graphics().setDepth(21);
    this.pauseBtn = button(this, 836, 44, 56, 56, 'II', () => this.pauseGame(), { size: 24, fill: COLOR.navy }).setDepth(21);
    this.vignette = this.add.graphics().setDepth(19).setAlpha(0);
    this.vignette.lineStyle(16, COLOR.red, 1).strokeRect(8, 8, 864, 704);
    this.refreshHud();
  }

  buildQuizPanel() {
    const x0 = 880;
    this.add.rectangle(x0 + 200, H / 2, 400, H, COLOR.navy).setDepth(20);
    this.add.rectangle(x0 + 3, H / 2, 6, H, COLOR.yellow).setDepth(21);
    this.qNumT = text(this, x0 + 30, 26, '', 20, hex(COLOR.sky), {}, [0, 0]).setDepth(21);
    this.timeT = text(this, x0 + 376, 20, '15', 32, '#ffffff', {}, [1, 0]).setDepth(21);
    this.timeG = this.add.graphics().setDepth(21);
    this.qT = text(this, x0 + 30, 104, '', 23, '#ffffff', { wordWrap: { width: 340 }, lineSpacing: 6 }, [0, 0]).setDepth(21);
    this.btns = [0, 1, 2, 3].map((i) => button(this, x0 + 203, 336 + i * 88, 350, 76, '', () => this.answer(i), { size: 19 }).setDepth(21));
    this.fbT = text(this, x0 + 203, H - 34, '', 22, '#ffffff', { wordWrap: { width: 360 }, align: 'center' }).setDepth(21);
  }

  refreshHud() {
    this.scoreT.setText(`SKOR ${this.score}`);
    const g = this.heartG;
    g.clear();
    for (let i = 0; i < MAX_LIVES; i++) {
      const x = 56 + i * 48, y = 84;
      g.fillStyle(i < this.lives ? COLOR.red : 0x2a3f73);
      g.fillCircle(x - 8, y, 10).fillCircle(x + 8, y, 10).fillTriangle(x - 17, y + 4, x + 17, y + 4, x, y + 26);
    }
  }

  drawBars() {
    const d = this.chase.dist, col = d > 50 ? COLOR.sky : d > 25 ? COLOR.yellow : COLOR.red;
    this.barG.clear();
    this.barG.fillStyle(0x2a3f73).fillRoundedRect(36, 150, 380, 18, 9);
    this.barG.fillStyle(col).fillRoundedRect(36, 150, Math.max(6, (380 * d) / 100), 18, 9);
    this.distT.setText(`Jarak guru: ${Math.ceil(d)} m`);
    const t = Math.max(0, this.timeLeft), tc = t > 5 ? COLOR.sky : COLOR.red;
    this.timeG.clear();
    this.timeG.fillStyle(0x2a3f73).fillRoundedRect(910, 64, 340, 12, 6);
    this.timeG.fillStyle(tc).fillRoundedRect(910, 64, Math.max(4, (340 * t) / QUIZ_TIME), 12, 6);
    this.timeT.setText(String(Math.ceil(t))).setColor(hex(tc));
  }

  floatText(x, y, str, color) {
    const t = text(this, x, y, str, 28, color, { stroke: '#0b1f4d', strokeThickness: 5 }).setDepth(30);
    this.tweens.add({ targets: t, y: y - 60, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  }

  // ---------- Quiz ----------
  nextQuestion() {
    const q = this.quiz.next();
    this.current = q; this.timeLeft = QUIZ_TIME; this.state = 'asking';
    this.qNumT.setText(`Pertanyaan ${q.number}/${q.total}`);
    this.qT.setText(q.text);
    this.fbT.setText('');
    this.btns.forEach((b, i) => { b.setLabel(`${'ABCD'[i]}. ${q.options[i]}`); b.unlock(); });
  }

  answer(i) {
    if (this.state !== 'asking') return;
    this.state = 'feedback';
    const q = this.current, ok = i === q.answer;
    this.btns.forEach((b, k) => {
      b.lock();
      if (k === q.answer) b.paint(COLOR.green);
      else if (k === i) b.paint(COLOR.red);
    });
    if (ok) {
      this.score += 100; this.chase.push(this.cfg.push);
      this.fbT.setText('Benar! +100 poin').setColor(hex(COLOR.green));
      Sfx.play('correct');
    } else {
      this.lives = Math.max(0, this.lives - 1); this.chase.pull(this.cfg.pull);
      this.fbT.setText(`${i < 0 ? 'Waktu habis!' : 'Salah!'} Jawaban: ${q.options[q.answer]}`).setColor(hex(COLOR.red));
      Sfx.play('wrong');
      this.cameras.main.shake(180, 0.008);
    }
    this.refreshHud();
    if (this.lives <= 0) return this.finish('lives');
    if (this.quiz.done) return this.finish('win', 1600);
    this.time.delayedCall(1500, () => { if (this.state === 'feedback') this.nextQuestion(); });
  }

  // ---------- Alur permainan ----------
  pauseGame() {
    if (this.state === 'ending' || this.scene.isPaused()) return;
    this.scene.launch('PauseScene', { level: this.levelKey });
    this.scene.pause();
  }

  finish(reason, delay = 1300) {
    if (this.state === 'ending') return;
    this.state = 'ending';
    this.chase.stop();
    this.btns.forEach((b) => b.lock());
    const isNew = Storage.setHigh(this.levelKey, this.score);
    Sfx.play(reason === 'win' ? 'win' : 'lose');
    const data = { level: this.levelKey, score: this.score, high: Storage.getHigh(this.levelKey), isNew, reason };
    this.time.delayedCall(delay, () => this.scene.start(reason === 'win' ? 'VictoryScene' : 'GameOverScene', data));
  }

  update(_, delta) {
    const dt = Math.min(delta / 1000, 0.05);
    if (this.state === 'ending') return;
    this.elapsed += dt;
    this.chase.update(dt);

    const J = Phaser.Input.Keyboard.JustDown;
    if (J(this.keys.left) || J(this.keys.a)) this.lane = Math.max(0, this.lane - 1);
    if (J(this.keys.right) || J(this.keys.d)) this.lane = Math.min(2, this.lane + 1);

    this.world.update(dt, Math.min(0.5 + this.elapsed * 0.003, 0.8));

    const target = laneX(this.lane, MC_Q);
    this.student.x += (target - this.student.x) * Math.min(1, dt * 14);
    const rate = 1 + Math.min(this.elapsed * 0.004, 0.5);
    this.student.tick(dt, rate);

    const tq = Phaser.Math.Linear(0.84, 1.14, this.chase.dist / 100);
    this.laneOffset += ((this.student.x - CX) / laneW(MC_Q) - this.laneOffset) * Math.min(1, dt * 3);
    this.teacher.setPosition(CX + this.laneOffset * laneW(tq), lineY(tq)).setScale(scaleAt(tq) * 1.15);
    this.teacher.tick(dt, rate);

    for (const type of this.world.check(this.lane)) {
      const hx = this.student.x, hy = this.student.y - 160 * this.student.scaleX;
      if (type === 'obs') {
        this.chase.pull(this.cfg.hitPenalty); this.student.flash = 0.5;
        this.cameras.main.shake(140, 0.006); Sfx.play('hit');
        this.floatText(hx, hy, 'Tersandung!', hex(COLOR.red));
      } else {
        this.score += 10; Sfx.play('book');
        this.floatText(hx, hy, '+10', hex(COLOR.yellow));
        this.refreshHud();
      }
    }

    if (this.state === 'asking') {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.answer(-1); }
    }
    this.drawBars();
    this.vignette.setAlpha(this.chase.danger ? 0.3 + 0.3 * Math.abs(Math.sin(this.time.now / 140)) : 0);
    if (this.chase.caught) this.finish('caught', 1100);
  }
}
