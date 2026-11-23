import Phaser from 'phaser';
import { COLOR } from '../config.js';
import { text, button } from '../ui/UI.js';

export default class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene'); }
  init(data) { this.level = data.level; }
  create() {
    this.add.rectangle(640, 360, 1280, 720, COLOR.ink, 0.75);
    text(this, 640, 150, 'Jeda', 64);
    button(this, 640, 280, 340, 64, 'Resume', () => this.resume());
    button(this, 640, 370, 340, 64, 'Restart', () => {
      this.scene.stop('GameScene');
      this.scene.start('GameScene', { level: this.level });
    }, { fill: COLOR.navy });
    button(this, 640, 460, 340, 64, 'Main Menu', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    }, { fill: COLOR.navy });
    this.input.keyboard.on('keydown-ESC', () => this.resume());
  }
  resume() {
    this.scene.stop();
    this.scene.resume('GameScene');
  }
}
