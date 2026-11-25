import Phaser from 'phaser';
import { COLOR, FONT } from '../config.js';
import { Storage } from '../systems/Storage.js';

// MC: pelajar laki-laki, tampak dari belakang (seragam putih, celana navy, tas royal).
export default class Student extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name) {
    super(scene, x, y);
    this.playerName = name || Storage.getPlayerName();
    this.g = scene.add.graphics();

    // Name tag badge di atas karakter
    this.tag = scene.add.container(0, -188);
    this.tagBg = scene.add.graphics();
    this.tagT = scene.add.text(0, 0, this.playerName, {
      fontFamily: FONT,
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#07142f',
      strokeThickness: 3,
      resolution: 2,
    }).setOrigin(0.5);
    this.tag.add([this.tagBg, this.tagT]);

    this.add([this.g, this.tag]);
    this.t = 0;
    this.flash = 0;
    scene.add.existing(this);
    this.updateNameTag();
    this.draw();
  }

  setName(newName) {
    this.playerName = (newName || 'Siswa').trim();
    this.updateNameTag();
  }

  updateNameTag() {
    this.tagT.setText(this.playerName);
    const tw = Math.max(56, this.tagT.width + 20);
    this.tagBg.clear();
    this.tagBg.fillStyle(COLOR.navy, 0.88).fillRoundedRect(-tw / 2, -13, tw, 26, 8);
    this.tagBg.lineStyle(2, COLOR.sky, 0.95).strokeRoundedRect(-tw / 2, -13, tw, 26, 8);
  }

  tick(dt, rate = 1) {
    this.t += dt * rate;
    this.flash = Math.max(0, this.flash - dt);
    const ph = this.t * 11, a = Math.sin(ph), oy = -Math.abs(a) * 5;
    this.tag.y = -188 + oy;
    this.draw();
  }
  draw() {
    const g = this.g, ph = this.t * 11, a = Math.sin(ph), b = -a, oy = -Math.abs(a) * 5;
    const skin = 0xf1c27d;
    const shirt = this.flash > 0 && Math.floor(this.flash * 20) % 2 === 0 ? COLOR.red : COLOR.white;
    g.clear();
    g.fillStyle(0x000000, 0.25).fillEllipse(0, 2, 62, 12);
    [[-11, a], [11, b]].forEach(([x, s]) => {
      const l = Math.max(0, s) * 15;
      g.fillStyle(COLOR.navy).fillRoundedRect(x - 8, -66, 16, 56 - l, 5);
      g.fillStyle(COLOR.sky).fillRoundedRect(x - 10, -11 - l, 20, 11, 4);
    });
    g.lineStyle(10, shirt).lineBetween(-27, -120 + oy, -33, -84 + oy + a * 7);
    g.lineStyle(10, shirt).lineBetween(27, -120 + oy, 33, -84 + oy + b * 7);
    g.fillStyle(skin).fillCircle(-33, -80 + oy + a * 7, 6).fillCircle(33, -80 + oy + b * 7, 6);
    g.fillStyle(shirt).fillRoundedRect(-26, -130 + oy, 52, 66, 10);
    g.fillStyle(COLOR.royal).fillRoundedRect(-22, -124 + oy, 44, 56, 10);
    g.fillStyle(COLOR.yellow).fillRoundedRect(-15, -92 + oy, 30, 18, 5);
    g.fillStyle(COLOR.navy).fillRect(-2, -122 + oy, 4, 28);
    g.fillStyle(COLOR.yellow).fillRect(-7, -131 + oy, 14, 6);
    g.fillStyle(skin).fillRect(-7, -140 + oy, 14, 12);
    g.fillCircle(-19, -148 + oy, 5).fillCircle(19, -148 + oy, 5);
    g.fillStyle(0x1b1b2f).fillCircle(0, -151 + oy, 20);
  }
}
