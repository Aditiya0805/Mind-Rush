import Phaser from 'phaser';
import { COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';
import { showNameModal } from '../ui/NameModal.js';
import { Sfx } from '../audio/Sfx.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }
  create() {
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.82);

    const card = this.add.graphics();
    card.fillStyle(COLOR.navy, 0.95).fillRoundedRect(380, 40, 520, 570, 20);
    card.lineStyle(2.5, COLOR.sky, 0.9).strokeRoundedRect(380, 40, 520, 570, 20);

    text(this, 640, 75, 'PENGATURAN', 42, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 5 });

    this.soundBtn = button(this, 640, 160, 420, 58, '', () => {
      Sfx.toggleSound();
      this.refresh();
    }, { fill: COLOR.royal });

    this.nameBtn = button(this, 640, 235, 420, 58, '', () => showNameModal(this, () => this.refresh()), { fill: COLOR.navy });

    // Rekor Box
    const sBox = this.add.graphics();
    sBox.fillStyle(COLOR.ink, 0.8).fillRoundedRect(430, 295, 420, 150, 14);
    sBox.lineStyle(1.5, 0x38bdf8, 0.7).strokeRoundedRect(430, 295, 420, 150, 14);

    text(this, 640, 320, '🏆 CATATAN REKOR TERTINGGI', 20, hex(COLOR.yellow));
    this.scoreT = text(this, 640, 385, '', 22, '#ffffff', { align: 'center', lineSpacing: 8 });

    button(this, 640, 490, 420, 54, '🗑  Reset Rekor Skor', () => {
      Storage.resetHigh();
      this.refresh();
      this.msg.setText('Semua rekor berhasil direset.');
    }, { fill: COLOR.red, hover: 0xfca5a5, size: 20 });

    this.msg = text(this, 640, 545, '', 19, hex(COLOR.yellow));
    button(this, 640, 655, 240, 56, '⬅  Kembali', () => this.scene.start('MenuScene'), { fill: COLOR.navy, size: 22 });

    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
    this.refresh();
  }

  refresh() {
    this.soundBtn.setLabel(Storage.isSoundOn() ? '🔊  Suara & Musik: ON' : '🔇  Suara & Musik: OFF');
    this.nameBtn.setLabel(`👤  Nama: ${Storage.getPlayerName()} (Ubah)`);
    this.scoreT.setText(Object.entries(DIFFICULTY).map(([k, d]) => `${d.label} : ${Storage.getHigh(k)} Pts`).join('   |   '));
  }
}
