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
    card.fillStyle(COLOR.navy, 0.95).fillRoundedRect(380, 36, 520, 578, 20);
    card.lineStyle(2.5, COLOR.sky, 0.9).strokeRoundedRect(380, 36, 520, 578, 20);

    text(this, 640, 72, 'PENGATURAN', 40, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 5 });

    this.soundBtn = button(this, 640, 140, 430, 50, '', () => {
      Sfx.toggleSound();
      this.refresh();
    }, { fill: COLOR.royal, size: 21 });

    this.nameBtn = button(this, 640, 202, 430, 50, '', () => showNameModal(this, () => this.refresh()), { fill: COLOR.navy, size: 20 });

    this.genderBtn = button(this, 640, 264, 430, 50, '', () => {
      Storage.setGender(Storage.getGender() === 'male' ? 'female' : 'male');
      this.refresh();
    }, { fill: COLOR.navy, size: 20 });

    this.facingBtn = button(this, 640, 326, 430, 50, '', () => {
      Storage.setFacing(Storage.getFacing() === 'front' ? 'back' : 'front');
      this.refresh();
    }, { fill: COLOR.navy, size: 19 });

    // Rekor Box
    const sBox = this.add.graphics();
    sBox.fillStyle(COLOR.ink, 0.8).fillRoundedRect(425, 372, 430, 110, 14);
    sBox.lineStyle(1.5, 0x38bdf8, 0.7).strokeRoundedRect(425, 372, 430, 110, 14);

    text(this, 640, 396, '🏆 CATATAN REKOR TERTINGGI', 18, hex(COLOR.yellow));
    this.scoreT = text(this, 640, 444, '', 20, '#ffffff', { align: 'center', lineSpacing: 8 });

    button(this, 640, 524, 430, 50, '🗑  Reset Rekor Skor', () => {
      Storage.resetHigh();
      this.refresh();
      this.msg.setText('Semua rekor berhasil direset.');
    }, { fill: COLOR.red, hover: 0xfca5a5, size: 19 });

    this.msg = text(this, 640, 576, '', 18, hex(COLOR.yellow));
    button(this, 640, 656, 240, 54, '⬅  Kembali', () => this.scene.start('MenuScene'), { fill: COLOR.navy, size: 22 });

    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
    this.refresh();
  }

  refresh() {
    this.soundBtn.setLabel(Storage.isSoundOn() ? '🔊  Suara & Musik: ON' : '🔇  Suara & Musik: OFF');
    this.nameBtn.setLabel(`👤  Nama: ${Storage.getPlayerName()} (Ubah)`);
    this.genderBtn.setLabel(Storage.getGender() === 'female' ? '👧  Karakter: Siswi (Wanita)' : '👦  Karakter: Siswa (Pria)');
    this.facingBtn.setLabel(Storage.getFacing() === 'front' ? '👀  Arah di Game: Menghadap Depan' : '🏃  Arah di Game: Menghadap Jalan');
    this.scoreT.setText(Object.entries(DIFFICULTY).map(([k, d]) => `${d.label} : ${Storage.getHigh(k)} Pts`).join('   |   '));
  }
}
