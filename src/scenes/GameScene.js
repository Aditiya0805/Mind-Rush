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
    this.combo = 0;

    this.teacherSide = 0.72;
    this.world = new RoadWorld(this, this.cfg);

    // Speed Lines Effect
    this.speedLinesG = this.add.graphics().setDepth(15);
    this.speedLines = [];
    for (let i = 0; i < 18; i++) {
      this.speedLines.push({
        s: Math.random() > 0.5 ? 1 : -1,
        p: Math.random(),
        len: 40 + Math.random() * 60,
      });
    }

    // Partikel pecahan / percikan
    this.particles = [];
    this.partG = this.add.graphics().setDepth(28);

    // Karakter Guru Pak Tono & Siswa
    this.teacher = new Teacher(this, CX + laneW(1.1) * 0.72, lineY(1.1)).setDepth(11);
    this.student = new Student(this, laneX(1, MC_Q), lineY(MC_Q), Storage.getPlayerName()).setDepth(10).setScale(scaleAt(MC_Q) * 1.1);

    this.buildHud();
    this.buildQuizPanel();

    const kb = this.input.keyboard;
    this.keys = kb.addKeys({ left: 'LEFT', right: 'RIGHT' });
    kb.on('keydown-ESC', () => this.pauseGame());

    kb.on('keydown', (event) => {
      if (this.scene.isPaused() || this.state !== 'asking' || event.repeat) return;
      const k = event.key ? event.key.toUpperCase() : '';
      const code = event.code || '';
      let idx = -1;
      if (k === 'A' || k === '1' || code === 'KeyA' || code === 'Digit1' || code === 'Numpad1') idx = 0;
      else if (k === 'B' || k === '2' || code === 'KeyB' || code === 'Digit2' || code === 'Numpad2') idx = 1;
      else if (k === 'C' || k === '3' || code === 'KeyC' || code === 'Digit3' || code === 'Numpad3') idx = 2;
      else if (k === 'D' || k === '4' || code === 'KeyD' || code === 'Digit4' || code === 'Numpad4') idx = 3;

      if (idx !== -1) {
        this.answer(idx);
      }
    });

    this.events.once('shutdown', () => {
      kb.off('keydown');
      kb.off('keydown-ESC');
    });

    // Mulai BGM
    Sfx.startBgm();

    this.nextQuestion();
  }

  // ---------- UI & HUD ----------
  buildHud() {
    const g = this.add.graphics().setDepth(20);
    // Background glassmorphism HUD
    g.fillStyle(COLOR.navy, 0.92).fillRoundedRect(16, 12, 440, 185, 18);
    g.lineStyle(2.5, COLOR.sky, 0.95).strokeRoundedRect(16, 12, 440, 185, 18);
    g.fillStyle(0x1d4ed8, 0.25).fillRoundedRect(20, 16, 432, 48, 12);

    this.scoreT = text(this, 36, 26, 'SKOR 0', 30, '#ffffff', {}, [0, 0]).setDepth(21);
    this.comboT = text(this, 230, 28, '', 20, hex(COLOR.yellow), {}, [0, 0]).setDepth(21);
    text(this, 436, 36, this.cfg.label, 20, hex(COLOR.yellow), {}, [1, 0]).setDepth(21);

    this.heartG = this.add.graphics().setDepth(21);
    this.distT = text(this, 36, 118, 'Jarak Pak Tono: 80 m', 17, hex(COLOR.sky), {}, [0, 0]).setDepth(21);
    this.radarG = this.add.graphics().setDepth(21);

    this.pauseBtn = button(this, 836, 44, 56, 56, 'II', () => this.pauseGame(), { size: 24, fill: COLOR.navy }).setDepth(21);

    // Vignette bahaya merah
    this.vignette = this.add.graphics().setDepth(19).setAlpha(0);
    this.vignette.lineStyle(18, COLOR.red, 1).strokeRect(6, 6, 868, 708);
    this.refreshHud();
  }

  buildQuizPanel() {
    const x0 = 880;
    // Panel Kuis Cyber Navy
    const pG = this.add.graphics().setDepth(20);
    pG.fillStyle(COLOR.navy, 0.96).fillRect(x0, 0, 400, H);
    pG.fillStyle(COLOR.ink, 0.5).fillRect(x0, 0, 400, 95);
    pG.lineStyle(4, COLOR.yellow, 1).lineBetween(x0 + 2, 0, x0 + 2, H);

    this.qNumT = text(this, x0 + 30, 24, '', 20, hex(COLOR.sky), {}, [0, 0]).setDepth(21);
    this.timeT = text(this, x0 + 374, 20, '15', 34, '#ffffff', {}, [1, 0]).setDepth(21);
    this.timeG = this.add.graphics().setDepth(21);

    // Kotak teks pertanyaan
    this.qBoxG = this.add.graphics().setDepth(20);
    this.qBoxG.fillStyle(0x0f2a63, 0.65).fillRoundedRect(x0 + 20, 96, 360, 160, 14);
    this.qBoxG.lineStyle(2, 0x38bdf8, 0.7).strokeRoundedRect(x0 + 20, 96, 360, 160, 14);

    this.qT = text(this, x0 + 34, 110, '', 22, '#ffffff', { wordWrap: { width: 332 }, lineSpacing: 5 }, [0, 0]).setDepth(21);
    text(this, x0 + 200, 276, '⌨ Tekan A, B, C, D atau 1 - 4 di keyboard', 15, hex(COLOR.sky), {}, [0.5, 0.5]).setDepth(21);

    this.btns = [0, 1, 2, 3].map((i) => button(this, x0 + 200, 336 + i * 88, 356, 76, '', () => this.answer(i), { size: 19 }).setDepth(21));
    this.fbT = text(this, x0 + 200, H - 34, '', 22, '#ffffff', { wordWrap: { width: 360 }, align: 'center' }).setDepth(21);
  }

  refreshHud() {
    this.scoreT.setText(`SKOR ${this.score}`);
    if (this.combo >= 2) {
      this.comboT.setText(`🔥 COMBO x${this.combo}`);
    } else {
      this.comboT.setText('');
    }

    const g = this.heartG;
    g.clear();
    for (let i = 0; i < MAX_LIVES; i++) {
      const x = 56 + i * 46, y = 84;
      g.fillStyle(i < this.lives ? COLOR.red : 0x24355a, i < this.lives ? 1 : 0.6);
      g.fillCircle(x - 8, y, 10).fillCircle(x + 8, y, 10).fillTriangle(x - 17, y + 4, x + 17, y + 4, x, y + 26);
      if (i < this.lives) {
        g.fillStyle(0xffffff, 0.6).fillCircle(x - 9, y - 3, 3);
      }
    }
  }

  drawBars() {
    const d = this.chase.dist;
    const col = d > 50 ? COLOR.sky : d > 25 ? COLOR.yellow : COLOR.red;

    // Mini-map Radar Pengejaran
    const rG = this.radarG;
    rG.clear();
    const bx = 36, by = 146, bw = 390, bh = 22;
    rG.fillStyle(0x0f172a, 0.95).fillRoundedRect(bx, by, bw, bh, 11);
    rG.lineStyle(2, col, 0.85).strokeRoundedRect(bx, by, bw, bh, 11);

    // Garis progres pengejaran
    const fillW = Math.max(8, (bw * d) / 100);
    rG.fillStyle(col, 0.35).fillRoundedRect(bx, by, fillW, bh, 11);

    // Posisi Ikon Siswa (Kanan) dan Guru (Kiri bergerak mendekat ke kanan)
    const teacherX = bx + bw - (bw * d) / 100;
    const studentX = bx + bw - 14;

    // Ikon Siswa 🎓
    rG.fillStyle(COLOR.sky, 1).fillCircle(studentX, by + bh / 2, 8);
    // Ikon Pak Tono 👨‍🏫 (Mendekati Siswa saat jarak mengecil)
    rG.fillStyle(COLOR.red, 1).fillCircle(Math.max(bx + 12, teacherX), by + bh / 2, 8);

    this.distT.setText(`Jarak Pak Tono: ${Math.ceil(d)} m`);

    // Timer Kuis
    const t = Math.max(0, this.timeLeft);
    const tc = t > 5 ? COLOR.sky : COLOR.red;
    const pulse = t <= 5 ? Math.abs(Math.sin(this.time.now / 100)) * 4 : 0;

    this.timeG.clear();
    this.timeG.fillStyle(0x1e293b).fillRoundedRect(900, 62, 360, 14, 7);
    this.timeG.fillStyle(tc, 0.95).fillRoundedRect(900, 62 - pulse / 2, Math.max(6, (360 * t) / QUIZ_TIME), 14 + pulse, 7);
    this.timeT.setText(String(Math.ceil(t))).setColor(hex(tc));
  }

  createBurst(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const spd = 60 + Math.random() * 120;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 30,
        r: 3 + Math.random() * 4,
        color,
        alpha: 1,
      });
    }
  }

  floatText(x, y, str, color) {
    const t = text(this, x, y, str, 28, color, { stroke: '#07142f', strokeThickness: 5 }).setDepth(30);
    this.tweens.add({ targets: t, y: y - 65, scale: 1.15, alpha: 0, duration: 950, ease: 'Quad.easeOut', onComplete: () => t.destroy() });
  }

  // ---------- Kuis ----------
  nextQuestion() {
    const q = this.quiz.next();
    this.current = q; this.timeLeft = QUIZ_TIME; this.state = 'asking';
    this.qNumT.setText(`Pertanyaan ${q.number}/${q.total}`);
    this.qT.setText(q.text);
    this.fbT.setText('');
    this.btns.forEach((b, i) => { b.setLabel(`[${'ABCD'[i]}]  ${q.options[i]}`); b.unlock(); });
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
      this.combo++;
      const bonus = this.combo >= 2 ? (this.combo - 1) * 30 : 0;
      const pts = 100 + bonus;
      this.score += pts;
      this.chase.push(this.cfg.push);

      if (this.combo >= 2) {
        Sfx.play('combo');
        this.floatText(x0 => 1080, 290, `🔥 STREAK x${this.combo}! (+${pts})`, hex(COLOR.yellow));
        this.fbT.setText(`Sempurna! +${pts} poin (Streak x${this.combo})`).setColor(hex(COLOR.green));
        this.student.updateNameTag(true);
      } else {
        Sfx.play('correct');
        this.fbT.setText('Benar! +100 poin').setColor(hex(COLOR.green));
      }

      this.createBurst(1080, 336 + i * 88, COLOR.green, 16);
    } else {
      this.combo = 0;
      this.student.updateNameTag(false);
      this.lives = Math.max(0, this.lives - 1);
      this.chase.pull(this.cfg.pull);
      this.fbT.setText(`${i < 0 ? 'Waktu habis!' : 'Salah!'} Jawaban: ${q.options[q.answer]}`).setColor(hex(COLOR.red));
      Sfx.play('wrong');
      this.cameras.main.shake(200, 0.01);
      if (i >= 0) this.createBurst(1080, 336 + i * 88, COLOR.red, 16);
    }

    this.refreshHud();
    if (this.lives <= 0) return this.finish('lives');
    if (this.quiz.done) return this.finish('win', 1600);
    this.time.delayedCall(1500, () => { if (this.state === 'feedback') this.nextQuestion(); });
  }

  // ---------- Alur Permainan ----------
  pauseGame() {
    if (this.state === 'ending' || this.scene.isPaused()) return;
    Sfx.stopBgm();
    this.scene.launch('PauseScene', { level: this.levelKey });
    this.scene.pause();
  }

  finish(reason, delay = 1300) {
    if (this.state === 'ending') return;
    this.state = 'ending';
    Sfx.stopBgm();
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

    // Kontrol jalur dengan efek kemiringan karakter & suara whoosh
    const J = Phaser.Input.Keyboard.JustDown;
    if (J(this.keys.left)) {
      if (this.lane > 0) {
        this.lane--;
        this.student.setTilt(-14);
        Sfx.play('whoosh');
      }
    }
    if (J(this.keys.right)) {
      if (this.lane < 2) {
        this.lane++;
        this.student.setTilt(14);
        Sfx.play('whoosh');
      }
    }

    const currentSpeed = Math.min(0.5 + this.elapsed * 0.003, 0.85);
    this.world.update(dt, currentSpeed);

    // Posisi siswa
    const target = laneX(this.lane, MC_Q);
    this.student.x += (target - this.student.x) * Math.min(1, dt * 14);
    const rate = 1 + Math.min(this.elapsed * 0.004, 0.55);

    // Keringat dingin jika bahaya atau nyawa tersisa 1
    this.student.sweating = this.chase.danger || this.lives <= 1;
    this.student.tick(dt, rate);

    // Pak Tono mengejar di sisi samping belakang MC agar tidak bertumpukan
    if (this.lane === 0) this.teacherSide = 0.72;
    else if (this.lane === 2) this.teacherSide = -0.72;
    const targetOffset = (this.student.x - CX) / laneW(MC_Q) + this.teacherSide;
    const tq = Phaser.Math.Linear(0.88, 1.18, this.chase.dist / 100);
    this.laneOffset += (targetOffset - this.laneOffset) * Math.min(1, dt * 3.5);
    this.teacher.setPosition(CX + this.laneOffset * laneW(tq), lineY(tq)).setScale(scaleAt(tq) * 1.15);

    // Pak Tono marah berapi-api jika jarak dekat (< 25m)
    this.teacher.setAngry(this.chase.danger);
    this.teacher.tick(dt, rate);

    // Cek tabrakan item rintangan / buku
    for (const type of this.world.check(this.lane)) {
      const hx = this.student.x, hy = this.student.y - 140 * this.student.scaleX;
      if (type === 'obs') {
        this.chase.pull(this.cfg.hitPenalty);
        this.student.flash = 0.5;
        this.combo = 0;
        this.student.updateNameTag(false);
        this.cameras.main.shake(160, 0.008);
        Sfx.play('hit');
        this.createBurst(hx, hy, COLOR.red, 15);
        this.floatText(hx, hy, 'Tersandung!', hex(COLOR.red));
      } else {
        this.score += 10;
        Sfx.play('book');
        this.createBurst(hx, hy, COLOR.yellow, 12);
        this.floatText(hx, hy, '+10 Buku', hex(COLOR.yellow));
        this.refreshHud();
      }
    }

    // Update anime speed lines
    const slG = this.speedLinesG;
    slG.clear();
    const isFast = this.chase.danger || this.elapsed > 20;
    slG.lineStyle(2, 0xffffff, isFast ? 0.35 : 0.15);
    this.speedLines.forEach((l) => {
      l.p += dt * (isFast ? 2.8 : 1.8);
      if (l.p > 1.2) l.p = 0.1;
      const q = l.p * l.p;
      const lx = CX + l.s * (laneW(q) * 1.52 + 10);
      const ly = lineY(q);
      slG.lineBetween(lx, ly, lx, ly - l.len * scaleAt(q));
    });

    // Update partikel ledakan / percikan
    const pG = this.partG;
    pG.clear();
    this.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 220 * dt; // gravitasi
      p.alpha -= dt * 1.4;
      if (p.alpha > 0) {
        pG.fillStyle(p.color, p.alpha).fillCircle(p.x, p.y, p.r);
      }
    });
    this.particles = this.particles.filter((p) => p.alpha > 0);

    // Timer kuis countdown
    if (this.state === 'asking') {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.answer(-1); }
    }

    this.drawBars();

    // Efek vignette deg-degan saat Pak Tono dekat
    this.vignette.setAlpha(this.chase.danger ? 0.35 + 0.3 * Math.abs(Math.sin(this.time.now / 120)) : 0);

    if (this.chase.caught) this.finish('caught', 1100);
  }
}
