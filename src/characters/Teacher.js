import Phaser from 'phaser';
import { COLOR, FONT, hex } from '../config.js';

// Guru: Pak Tono, ekspresi tegas komikal, memegang penggaris kuning.
export default class Teacher extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name = 'Pak Tono') {
    super(scene, x, y);
    this.teacherName = name;
    this.g = scene.add.graphics();
    this.mark = scene.add.text(42, -265, '!', { fontFamily: FONT, fontSize: '42px', fontStyle: 'bold', color: hex(COLOR.red), resolution: 2 }).setOrigin(0.5);

    // Name tag badge Pak Tono
    this.tag = scene.add.container(0, -218);
    this.tagBg = scene.add.graphics();
    this.tagT = scene.add.text(0, 0, this.teacherName, {
      fontFamily: FONT,
      fontSize: '15px',
      fontStyle: 'bold',
      color: hex(COLOR.yellow),
      stroke: '#07142f',
      strokeThickness: 3,
      resolution: 2,
    }).setOrigin(0.5);
    this.tag.add([this.tagBg, this.tagT]);

    this.add([this.g, this.mark, this.tag]);
    this.t = 0;
    scene.add.existing(this);
    this.updateNameTag();
    this.draw();
  }

  updateNameTag() {
    this.tagT.setText(this.teacherName);
    const tw = Math.max(68, this.tagT.width + 22);
    this.tagBg.clear();
    this.tagBg.fillStyle(0x7f1d1d, 0.92).fillRoundedRect(-tw / 2, -13, tw, 26, 8);
    this.tagBg.lineStyle(2, COLOR.yellow, 0.95).strokeRoundedRect(-tw / 2, -13, tw, 26, 8);
  }

  tick(dt, rate = 1) {
    this.t += dt * rate;
    const a = Math.sin(this.t * 9), oy = -Math.abs(a) * 6;
    this.mark.y = -265 + oy + Math.sin(this.t * 10) * 5;
    this.tag.y = -218 + oy;
    this.draw();
  }
  draw() {
    const g = this.g, a = Math.sin(this.t * 9), b = -a, oy = -Math.abs(a) * 6;
    const suit = 0x475569, skin = 0xf1c27d, ink = 0x111827;
    g.clear();
    g.fillStyle(0x000000, 0.25).fillEllipse(0, 2, 84, 14);
    [[-14, a], [14, b]].forEach(([x, s]) => {
      const l = Math.max(0, s) * 18;
      g.fillStyle(0x1e293b).fillRoundedRect(x - 9, -72, 18, 62 - l, 6);
      g.fillStyle(0x0f172a).fillRoundedRect(x - 11, -12 - l, 24, 12, 5);
    });
    g.lineStyle(13, suit).lineBetween(-32, -126 + oy, -46, -86 + oy + a * 8);
    g.fillStyle(skin).fillCircle(-46, -82 + oy + a * 8, 8);
    g.fillStyle(suit).fillRoundedRect(-34, -138 + oy, 68, 80, 14);
    g.fillStyle(COLOR.white).fillTriangle(-11, -138 + oy, 11, -138 + oy, 0, -104 + oy);
    g.fillStyle(COLOR.red).fillRect(-4, -130 + oy, 8, 38);
    g.lineStyle(13, suit).lineBetween(32, -126 + oy, 54, -168 + oy);
    g.fillStyle(skin).fillCircle(54, -170 + oy, 8);
    g.lineStyle(7, COLOR.yellow).lineBetween(54, -170 + oy, 68 + Math.sin(this.t * 14) * 10, -226 + oy);
    g.fillStyle(0x9ca3af).fillCircle(-25, -166 + oy, 9).fillCircle(25, -166 + oy, 9);
    g.fillStyle(skin).fillCircle(0, -162 + oy, 27);
    g.fillStyle(COLOR.white).lineStyle(3, ink).fillCircle(-11, -164 + oy, 9).strokeCircle(-11, -164 + oy, 9)
      .fillCircle(11, -164 + oy, 9).strokeCircle(11, -164 + oy, 9).lineBetween(-2, -164 + oy, 2, -164 + oy);
    g.fillStyle(ink).fillCircle(-11, -163 + oy, 3.5).fillCircle(11, -163 + oy, 3.5);
    g.lineStyle(5, ink).lineBetween(-22, -179 + oy, -5, -172 + oy).lineBetween(22, -179 + oy, 5, -172 + oy);
    g.fillStyle(0x7f1d1d).fillEllipse(0, -143 + oy, 18, 13 + Math.abs(a) * 4);
    g.fillStyle(COLOR.white).fillRect(-6, -149 + oy, 12, 4);
    g.fillStyle(0x9ca3af).fillEllipse(0, -152 + oy, 28, 7);
  }
}
