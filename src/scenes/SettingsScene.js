import Phaser from 'phaser';
import { COLOR, DIFFICULTY, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }
  create() {
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.8);
    text(this, 640, 80, 'Settings', 46);
    this.soundBtn = button(this, 640, 190, 420, 64, '', () => { Storage.setSound(!Storage.isSoundOn()); this.refresh(); });
    this.scoreT = text(this, 640, 330, '', 26, '#ffffff', { align: 'center', lineSpacing: 10 });
    button(this, 640, 470, 420, 64, 'Reset high score', () => { Storage.resetHigh(); this.refresh(); this.msg.setText('High score sudah direset.'); }, { fill: COLOR.red, hover: 0xfca5a5 });
    this.msg = text(this, 640, 535, '', 20, hex(COLOR.yellow));
    button(this, 150, 650, 220, 56, 'Kembali', () => this.scene.start('MenuScene'), { fill: COLOR.navy, size: 22 });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
    this.refresh();
  }
  refresh() {
    this.soundBtn.setLabel(`Suara: ${Storage.isSoundOn() ? 'ON' : 'OFF'}`);
    this.scoreT.setText(Object.entries(DIFFICULTY).map(([k, d]) => `${d.label}: ${Storage.getHigh(k)}`).join('\n'));
  }
}
