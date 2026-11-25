import Phaser from 'phaser';
import { COLOR, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { Sfx } from '../audio/Sfx.js';

export default class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene'); }
  init(data) { this.level = data.level; }
  create() {
    this.add.rectangle(640, 360, 1280, 720, COLOR.ink, 0.82);

    // Card frame
    const card = this.add.graphics();
    card.fillStyle(COLOR.navy, 0.95).fillRoundedRect(440, 90, 400, 520, 24);
    card.lineStyle(3, COLOR.sky, 0.95).strokeRoundedRect(440, 90, 400, 520, 24);

    text(this, 640, 155, 'GAME DIJEDA', 46, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 4 });
    text(this, 640, 205, 'Pak Tono sedang menunggu jawabanmu...', 16, hex(COLOR.sky));

    button(this, 640, 290, 320, 60, '▶  Lanjutkan', () => this.resume(), { size: 24, fill: COLOR.royal });
    button(this, 640, 375, 320, 60, '🔄  Ulangi Level', () => {
      Sfx.stopBgm();
      this.scene.stop('GameScene');
      this.scene.start('GameScene', { level: this.level });
    }, { size: 22, fill: COLOR.navy });
    button(this, 640, 460, 320, 60, '🏠  Menu Utama', () => {
      Sfx.stopBgm();
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    }, { size: 22, fill: COLOR.navy });

    this.input.keyboard.on('keydown-ESC', () => this.resume());
  }
  resume() {
    Sfx.startBgm();
    this.scene.stop();
    this.scene.resume('GameScene');
  }
}
