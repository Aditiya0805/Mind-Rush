import Phaser from 'phaser';
import { COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';
import { showNameModal } from '../ui/NameModal.js';

export default class LevelScene extends Phaser.Scene {
  constructor() { super('LevelScene'); }
  create() {
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.78);

    text(this, 640, 68, 'PILIH TINGKAT KESULITAN', 44, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 5 });
    text(this, 640, 114, 'Seberapa cepat kamu bisa berpikir dan menghindari kejaran Pak Tono?', 18, hex(COLOR.sky));

    const CARD_THEMES = {
      easy: { border: COLOR.green, fill: 0x064e3b, icon: '🟢' },
      medium: { border: COLOR.yellow, fill: 0x78350f, icon: '🟡' },
      hard: { border: COLOR.red, fill: 0x7f1d1d, icon: '🔴' },
    };

    Object.entries(DIFFICULTY).forEach(([key, d], i) => {
      const x = 240 + i * 400, y = 330, w = 340, h = 330;
      const theme = CARD_THEMES[key];

      // Card frame
      const card = this.add.graphics();
      card.fillStyle(COLOR.navy, 0.95).fillRoundedRect(x - w / 2, y - h / 2, w, h, 20);
      card.fillStyle(theme.fill, 0.35).fillRoundedRect(x - w / 2 + 4, y - h / 2 + 4, w - 8, 70, 16);
      card.lineStyle(3, theme.border, 0.95).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 20);

      text(this, x, y - 110, `${theme.icon} ${d.label}`, 30, '#ffffff');

      // Info deskripsi
      text(this, x, y - 20, d.info.map(line => `• ${line}`).join('\n\n'), 19, '#e2e8f0', { align: 'center', lineSpacing: 6 });

      // Rekor badge
      const record = Storage.getHigh(key);
      const recG = this.add.graphics();
      recG.fillStyle(COLOR.ink, 0.85).fillRoundedRect(x - 110, y + 45, 220, 32, 10);
      recG.lineStyle(1.5, COLOR.yellow, 0.8).strokeRoundedRect(x - 110, y + 45, 220, 32, 10);
      text(this, x, y + 61, `🏆 Rekor: ${record} Pts`, 16, hex(COLOR.yellow));

      // Tombol Mainkan
      button(this, x, y + 115, 260, 52, 'Mainkan Sekarang ▶', () => this.scene.start('GameScene', { level: key }), {
        size: 19,
        fill: theme.border,
      });
    });

    button(this, 160, 650, 240, 56, '⬅  Kembali', () => this.scene.start('MenuScene'), { fill: COLOR.navy, size: 20 });

    const genderLabel = () => (Storage.getGender() === 'female' ? '👧 Siswi (Wanita)' : '👦 Siswa (Pria)');
    this.genderBtn = button(this, 760, 650, 250, 56, genderLabel(), () => {
      const next = Storage.getGender() === 'male' ? 'female' : 'male';
      Storage.setGender(next);
      this.genderBtn.setLabel(genderLabel());
    }, { fill: COLOR.navy, size: 19 });

    this.nameBtn = button(this, 1100, 650, 280, 56, `👤 ${Storage.getPlayerName()} (Ganti)`, () => {
      showNameModal(this, (n) => {
        this.nameBtn.setLabel(`👤 ${n} (Ganti)`);
        this.genderBtn.setLabel(genderLabel());
      });
    }, { fill: COLOR.navy, size: 20 });

    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
