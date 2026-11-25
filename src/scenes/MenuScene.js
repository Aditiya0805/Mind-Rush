import Phaser from 'phaser';
import { COLOR, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';
import { showNameModal } from '../ui/NameModal.js';
import { Sfx } from '../audio/Sfx.js';
import Student from '../characters/Student.js';
import Teacher from '../characters/Teacher.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    drawCityBackdrop(this);

    // Partikel kunang-kunang / debu bercahaya di udara
    this.particles = [];
    this.sparkG = this.add.graphics().setDepth(5);
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 560,
        vx: (Math.random() - 0.5) * 18,
        vy: -10 - Math.random() * 16,
        r: 1.5 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.7,
      });
    }

    // Judul MIND RUSH dengan bayangan neon & efek animasi melayang
    const sh1 = { shadow: { offsetX: 0, offsetY: 0, color: hex(COLOR.royal), blur: 18, fill: true } };
    const tMind = text(this, 80, 26, 'MIND', 140, '#ffffff', sh1, [0, 0]);
    const sh2 = { shadow: { offsetX: 0, offsetY: 0, color: hex(COLOR.yellow), blur: 20, fill: true } };
    const tRush = text(this, 80, 156, 'RUSH', 140, hex(COLOR.yellow), sh2, [0, 0]);

    this.tweens.add({
      targets: [tMind, tRush],
      y: '+=8',
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Tagline Badge
    const tagBg = this.add.graphics();
    tagBg.fillStyle(COLOR.navy, 0.85).fillRoundedRect(80, 335, 390, 42, 10);
    tagBg.lineStyle(2, COLOR.sky, 0.9).strokeRoundedRect(80, 335, 390, 42, 10);
    text(this, 94, 344, '⚡ THINK FAST. ANSWER SMART.', 22, hex(COLOR.sky), {}, [0, 0]);

    // Trophy Best Score
    const bestScore = Math.max(Storage.getHigh('easy'), Storage.getHigh('medium'), Storage.getHigh('hard'));
    if (bestScore > 0) {
      const troG = this.add.graphics();
      troG.fillStyle(COLOR.navy, 0.8).fillRoundedRect(80, 390, 390, 36, 8);
      troG.lineStyle(1.5, COLOR.yellow, 0.8).strokeRoundedRect(80, 390, 390, 36, 8);
      text(this, 275, 408, `🏆 Rekor Tertinggi: ${bestScore} Poin`, 18, hex(COLOR.yellow), {}, [0.5, 0.5]);
    }

    // Tombol Menu Utama
    this.startBtn = button(this, 275, 470, 370, 68, '▶  Start Game', () => this.scene.start('LevelScene'), { size: 28 });
    button(this, 275, 550, 370, 60, '⚙  Settings', () => this.scene.start('SettingsScene'), { fill: COLOR.navy });
    button(this, 275, 622, 370, 60, 'ℹ  About Game', () => this.scene.start('AboutScene'), { fill: COLOR.navy });

    // Tombol Cepat Mute / Unmute Suara di Pojok Kanan Atas
    this.soundBtn = button(this, 1220, 44, 60, 60, Storage.isSoundOn() ? '🔊' : '🔇', () => {
      const state = Sfx.toggleSound();
      this.soundBtn.setLabel(state ? '🔊' : '🔇');
    }, { fill: COLOR.navy, size: 24 });

    // Karakter Siswa & Pak Tono
    this.student = new Student(this, 920, 580).setScale(1.7);
    this.teacher = new Teacher(this, 1100, 710).setScale(1.9);

    // Tombol Ganti Nama di Bawah Siswa
    this.nameBtn = button(this, 920, 665, 250, 48, `👤 ${Storage.getPlayerName()} (Ganti)`, () => this.openNameDialog(), { size: 17, fill: COLOR.navy });

    this.student.setInteractive(new Phaser.Geom.Rectangle(-40, -180, 80, 180), Phaser.Geom.Rectangle.Contains).on('pointerup', () => this.openNameDialog());

    // Interaksi klik Pak Tono yang lucu
    this.teacher.setInteractive(new Phaser.Geom.Rectangle(-45, -220, 90, 220), Phaser.Geom.Rectangle.Contains).on('pointerup', () => {
      Sfx.play('click');
      this.teacher.setAngry(true);
      const bubble = text(this, 1080, 430, 'Pak Tono: "Ayo belajar, jangan lari!"', 20, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 4 }).setDepth(50);
      this.tweens.add({
        targets: bubble,
        y: 400,
        alpha: 0,
        duration: 1500,
        ease: 'Quad.easeOut',
        onComplete: () => {
          bubble.destroy();
          this.teacher.setAngry(false);
        },
      });
    });
  }

  openNameDialog() {
    showNameModal(this, (newName) => {
      this.student.setName(newName);
      this.nameBtn.setLabel(`👤 ${newName} (Ganti)`);
    });
  }

  update(_, delta) {
    const dt = delta / 1000;
    this.student.tick(dt, 1.2);
    this.teacher.tick(dt, 1.2);

    // Partikel melayang di latar belakang
    const sG = this.sparkG;
    sG.clear();
    this.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < 0) { p.y = 600; p.x = Math.random() * 1280; }
      if (p.x < 0) p.x = 1280;
      if (p.x > 1280) p.x = 0;
      sG.fillStyle(COLOR.yellow, p.alpha).fillCircle(p.x, p.y, p.r);
    });
  }
}
