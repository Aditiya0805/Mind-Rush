import Phaser from 'phaser';
import { W, COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';
import Student from '../characters/Student.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() { super('VictoryScene'); }
  init(data) { this.r = data; }
  create() {
    const r = this.r;
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.65);

    // Efek partikel konfeti pesta kemenangan
    if (!this.textures.exists('confetti')) {
      const c = this.make.graphics({ x: 0, y: 0, add: false });
      c.fillStyle(0xffffff).fillRect(0, 0, 12, 8);
      c.generateTexture('confetti', 12, 8);
      c.destroy();
    }
    this.add.particles(0, -20, 'confetti', {
      x: { min: 0, max: W }, lifespan: 4500, speedY: { min: 140, max: 320 }, speedX: { min: -60, max: 60 },
      rotate: { start: 0, end: 360 }, frequency: 35, tint: [COLOR.yellow, COLOR.sky, COLOR.white, COLOR.royal, COLOR.green],
    }).setDepth(5);

    text(this, 80, 60, 'KAMU LOLOS!', 90, hex(COLOR.yellow), { stroke: hex(COLOR.royal), strokeThickness: 8 }, [0, 0]);
    text(this, 84, 170, `Hebat, ${Storage.getPlayerName()}! Semua pertanyaan terjawab & Pak Tono tertinggal jauh.`, 25, hex(COLOR.sky), {}, [0, 0]);

    // Card Statistik Skor
    const card = this.add.graphics();
    card.fillStyle(COLOR.navy, 0.85).fillRoundedRect(76, 230, 480, 240, 18);
    card.lineStyle(2, COLOR.yellow, 0.85).strokeRoundedRect(76, 230, 480, 240, 18);

    text(this, 100, 252, `SKOR KEMENANGAN (${DIFFICULTY[r.level].label})`, 22, hex(COLOR.sky), {}, [0, 0]);
    text(this, 96, 285, String(r.score), 104, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 5 }, [0, 0]);
    text(this, 100, 412, `High Score: ${r.high}${r.isNew ? '  🔥 REKOR BARU!' : ''}`, 24, r.isNew ? hex(COLOR.green) : '#ffffff', {}, [0, 0]);

    button(this, 260, 530, 360, 64, '▶  Main Lagi', () => this.scene.start('GameScene', { level: r.level }), { size: 26, fill: COLOR.royal });
    button(this, 260, 610, 360, 64, '🏠  Menu Utama', () => this.scene.start('MenuScene'), { fill: COLOR.navy });

    this.student = new Student(this, 980, 640, { facing: 'front' }).setScale(2.3);
    this.student.updateNameTag(true);
    this.tweens.add({ targets: this.student, y: 535, duration: 420, yoyo: true, repeat: -1, ease: 'Quad.easeOut' });
  }
  update(_, delta) { this.student.tick(delta / 1000, 1.4); }
}
