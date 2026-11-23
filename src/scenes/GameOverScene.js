import Phaser from 'phaser';
import { COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import Teacher from '../characters/Teacher.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  init(data) { this.r = data; }
  create() {
    const r = this.r;
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.6);
    text(this, 80, 60, r.reason === 'caught' ? 'TERTANGKAP!' : 'NYAWA HABIS', 84, hex(COLOR.red), { stroke: '#ffffff', strokeThickness: 6 }, [0, 0]);
    text(this, 84, 165, r.reason === 'caught' ? 'Guru berhasil menyusulmu.' : 'Ketiga nyawamu sudah terpakai.', 28, hex(COLOR.sky), {}, [0, 0]);
    text(this, 84, 245, `Skor akhir (${DIFFICULTY[r.level].label})`, 24, '#ffffff', {}, [0, 0]);
    text(this, 80, 275, String(r.score), 110, hex(COLOR.yellow), {}, [0, 0]);
    text(this, 84, 410, `High score: ${r.high}${r.isNew ? '  — rekor baru!' : ''}`, 28, '#ffffff', {}, [0, 0]);
    button(this, 260, 520, 340, 64, 'Main Lagi', () => this.scene.start('GameScene', { level: r.level }));
    button(this, 260, 600, 340, 64, 'Main Menu', () => this.scene.start('MenuScene'), { fill: COLOR.navy });
    this.teacher = new Teacher(this, 1010, 700).setScale(2.2);
  }
  update(_, delta) { this.teacher.tick(delta / 1000, 1.6); }
}
