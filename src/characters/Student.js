import Phaser from 'phaser';
import { COLOR } from '../config.js';

// MC: pelajar laki-laki, tampak dari belakang (seragam putih, celana navy, tas royal).
export default class Student extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.g = scene.add.graphics();
    this.add(this.g);
    this.t = 0;
    this.flash = 0;
    scene.add.existing(this);
    this.draw();
  }
  tick(dt, rate = 1) {
    this.t += dt * rate;
    this.flash = Math.max(0, this.flash - dt);
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
