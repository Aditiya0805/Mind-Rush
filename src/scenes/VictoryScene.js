import Phaser from 'phaser';
import { W, COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import Student from '../characters/Student.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() { super('VictoryScene'); }
  init(data) { this.r = data; }
  create() {
    const r = this.r;
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.55);
    if (!this.textures.exists('confetti')) {
      const c = this.make.graphics({ x: 0, y: 0, add: false });
      c.fillStyle(0xffffff).fillRect(0, 0, 12, 8);
      c.generateTexture('confetti', 12, 8);
      c.destroy();
    }
    this.add.particles(0, -20, 'confetti', {
      x: { min: 0, max: W }, lifespan: 4500, speedY: { min: 140, max: 320 }, speedX: { min: -60, max: 60 },
      rotate: { start: 0, end: 360 }, frequency: 40, tint: [COLOR.yellow, COLOR.sky, COLOR.white, COLOR.royal, COLOR.red],
    }).setDepth(5);
    text(this, 80, 60, 'KAMU LOLOS!', 90, hex(COLOR.yellow), { stroke: hex(COLOR.royal), strokeThickness: 8 }, [0, 0]);
    text(this, 84, 170, 'Semua pertanyaan terjawab dan guru tertinggal jauh.', 26, hex(COLOR.sky), {}, [0, 0]);
    text(this, 84, 245, `Skor akhir (${DIFFICULTY[r.level].label})`, 24, '#ffffff', {}, [0, 0]);
    text(this, 80, 275, String(r.score), 110, hex(COLOR.yellow), {}, [0, 0]);
    text(this, 84, 410, `High score: ${r.high}${r.isNew ? '  — rekor baru!' : ''}`, 28, '#ffffff', {}, [0, 0]);
    button(this, 260, 520, 340, 64, 'Main Lagi', () => this.scene.start('GameScene', { level: r.level }));
    button(this, 260, 600, 340, 64, 'Main Menu', () => this.scene.start('MenuScene'), { fill: COLOR.navy });
    this.student = new Student(this, 1000, 640).setScale(2.4);
    this.tweens.add({ targets: this.student, y: 540, duration: 420, yoyo: true, repeat: -1, ease: 'Quad.easeOut' });
  }
  update(_, delta) { this.student.tick(delta / 1000, 1.4); }
}
