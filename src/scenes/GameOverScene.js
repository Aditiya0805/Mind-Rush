import Phaser from 'phaser';
import { COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';
import Teacher from '../characters/Teacher.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  init(data) { this.r = data; }
  create() {
    const r = this.r;
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.72);

    // Judul Game Over tebal dramatis
    text(this, 80, 60, r.reason === 'caught' ? 'TERTANGKAP!' : 'NYAWA HABIS!', 84, hex(COLOR.red), { stroke: '#ffffff', strokeThickness: 7 }, [0, 0]);
    text(this, 84, 168, r.reason === 'caught' ? `Pak Tono berhasil menyusul ${Storage.getPlayerName()}!` : 'Ketiga nyawamu sudah terpakai.', 26, hex(COLOR.sky), {}, [0, 0]);

    // Card Statistik Skor
    const card = this.add.graphics();
    card.fillStyle(COLOR.navy, 0.85).fillRoundedRect(76, 230, 480, 240, 18);
    card.lineStyle(2, 0x3b82f6, 0.8).strokeRoundedRect(76, 230, 480, 240, 18);

    text(this, 100, 252, `SKOR AKHIR (${DIFFICULTY[r.level].label})`, 22, hex(COLOR.sky), {}, [0, 0]);
    text(this, 96, 285, String(r.score), 104, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 5 }, [0, 0]);
    text(this, 100, 412, `High Score: ${r.high}${r.isNew ? '  🔥 REKOR BARU!' : ''}`, 24, r.isNew ? hex(COLOR.green) : '#ffffff', {}, [0, 0]);

    button(this, 260, 530, 360, 64, '🔄  Main Lagi', () => this.scene.start('GameScene', { level: r.level }), { size: 26, fill: COLOR.royal });
    button(this, 260, 610, 360, 64, '🏠  Menu Utama', () => this.scene.start('MenuScene'), { fill: COLOR.navy });

    this.teacher = new Teacher(this, 1010, 690).setScale(2.1);
    this.teacher.setAngry(true);
  }
  update(_, delta) { this.teacher.tick(delta / 1000, 1.4); }
}
