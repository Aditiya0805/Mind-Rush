import Phaser from 'phaser';
import { COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';

export default class LevelScene extends Phaser.Scene {
  constructor() { super('LevelScene'); }
  create() {
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.8);
    text(this, 640, 80, 'Pilih tingkat kesulitan', 46);
    Object.entries(DIFFICULTY).forEach(([key, d], i) => {
      const x = 240 + i * 400;
      button(this, x, 320, 340, 280, `${d.label}\n\n${d.info.join('\n')}`, () => this.scene.start('GameScene', { level: key }), { size: 27 });
      text(this, x, 500, `Rekor: ${Storage.getHigh(key)}`, 24, hex(COLOR.yellow));
    });
    button(this, 150, 650, 220, 56, 'Kembali', () => this.scene.start('MenuScene'), { fill: COLOR.navy, size: 22 });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
