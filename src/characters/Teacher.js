import Phaser from 'phaser';
import { COLOR, FONT, hex } from '../config.js';

// Guru: Pak Tono, ekspresi tegas komikal, memegang penggaris kuning.
export default class Teacher extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name = 'Pak Tono') {
    super(scene, x, y);
    this.teacherName = name;
    this.g = scene.add.graphics();
    this.auraG = scene.add.graphics();
    this.dustG = scene.add.graphics();
    this.mark = scene.add.text(42, -265, '!', { fontFamily: FONT, fontSize: '42px', fontStyle: 'bold', color: hex(COLOR.red), resolution: 2 }).setOrigin(0.5);

    // Name tag badge Pak Tono
    this.tag = scene.add.container(0, -218);
    this.tagBg = scene.add.graphics();
    this.tagT = scene.add.text(0, 0, `👨‍🏫 ${this.teacherName}`, {
      fontFamily: FONT,
      fontSize: '15px',
      fontStyle: 'bold',
      color: hex(COLOR.yellow),
      stroke: '#07142f',
      strokeThickness: 3,
      resolution: 2,
    }).setOrigin(0.5);
    this.tag.add([this.tagBg, this.tagT]);

    this.add([this.dustG, this.auraG, this.g, this.mark, this.tag]);
    this.t = 0;
    this.isAngry = false;
    this.dusts = [];

    scene.add.existing(this);
    this.updateNameTag();
    this.draw();
  }

  setAngry(val) {
    this.isAngry = val;
  }

  updateNameTag() {
    this.tagT.setText(`👨‍🏫 ${this.teacherName}`);
    const tw = Math.max(76, this.tagT.width + 24);
    this.tagBg.clear();
    this.tagBg.fillStyle(0x7f1d1d, 0.94).fillRoundedRect(-tw / 2, -14, tw, 28, 9);
    this.tagBg.lineStyle(2.5, COLOR.yellow, 0.95).strokeRoundedRect(-tw / 2, -14, tw, 28, 9);
  }

  tick(dt, rate = 1) {
    const angerMult = this.isAngry ? 1.4 : 1.0;
    this.t += dt * rate * angerMult;

    const a = Math.sin(this.t * 9), oy = -Math.abs(a) * 6;
    this.mark.y = -265 + oy + Math.sin(this.t * 12) * 6;
    this.tag.y = -218 + oy;

    // Dust particles
    if (Math.random() < dt * 18 * rate) {
      this.dusts.push({
        x: (Math.random() - 0.5) * 44,
        y: 4,
        vx: (Math.random() - 0.5) * 24,
        vy: -9 - Math.random() * 14,
        r: 5 + Math.random() * 5,
        alpha: 0.65,
      });
    }

    this.dusts.forEach((d) => {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.r += dt * 7;
      d.alpha -= dt * 1.5;
    });
    this.dusts = this.dusts.filter((d) => d.alpha > 0);

    this.draw();
  }

  draw() {
    const g = this.g;
    const a = Math.sin(this.t * 9), b = -a, oy = -Math.abs(a) * 6;
    const suit = 0x475569, skin = 0xf1c27d, ink = 0x111827;

    // Gambar debu kaki
    this.dustG.clear();
    for (const d of this.dusts) {
      this.dustG.fillStyle(0xd5e2f7, d.alpha).fillCircle(d.x, d.y, d.r);
    }

    // Aura marah berapi-api jika Pak Tono dekat / marah
    this.auraG.clear();
    if (this.isAngry) {
      const flW = 75 + Math.sin(this.t * 22) * 12;
      const flH = 160 + Math.cos(this.t * 20) * 15;
      this.auraG.fillStyle(COLOR.red, 0.28).fillEllipse(0, -90 + oy, flW, flH);
      this.auraG.fillStyle(COLOR.yellow, 0.18).fillEllipse(0, -85 + oy, flW * 0.75, flH * 0.75);

      // Simbol urat marah anime 💢
      this.auraG.lineStyle(4, COLOR.red, 0.95);
      const vx = -42, vy = -195 + oy;
      this.auraG.lineBetween(vx - 8, vy - 8, vx + 8, vy + 8);
      this.auraG.lineBetween(vx + 8, vy - 8, vx - 8, vy + 8);
      this.auraG.lineBetween(vx - 10, vy, vx + 10, vy);
      this.auraG.lineBetween(vx, vy - 10, vx, vy + 10);
    }

    g.clear();
    // Bayangan
    g.fillStyle(0x000000, 0.35).fillEllipse(0, 3, 90, 16);

    // Kaki & Celana Formal
    [[-14, a], [14, b]].forEach(([x, s]) => {
      const l = Math.max(0, s) * 18;
      g.fillStyle(0x1e293b).fillRoundedRect(x - 9, -72, 18, 62 - l, 6);
      g.fillStyle(0x0f172a).fillRoundedRect(x - 11, -12 - l, 24, 12, 5);
      g.fillStyle(0x334155).fillRect(x - 9, -6 - l, 20, 2);
    });

    // Lengan Kiri
    g.lineStyle(13, suit).lineBetween(-32, -126 + oy, -46, -86 + oy + a * 8);
    g.fillStyle(skin).fillCircle(-46, -82 + oy + a * 8, 8);

    // Jas Guru & Kemeja
    g.fillStyle(suit).fillRoundedRect(-34, -138 + oy, 68, 80, 14);
    g.fillStyle(COLOR.white).fillTriangle(-11, -138 + oy, 11, -138 + oy, 0, -104 + oy);
    g.fillStyle(COLOR.red).fillRect(-4, -130 + oy, 8, 38);

    // Lengan Kanan Memegang Penggaris
    g.lineStyle(13, suit).lineBetween(32, -126 + oy, 54, -168 + oy);
    g.fillStyle(skin).fillCircle(54, -170 + oy, 8);
    // Penggaris Kuning mengancam
    g.lineStyle(7, COLOR.yellow).lineBetween(54, -170 + oy, 68 + Math.sin(this.t * 14) * 12, -230 + oy);

    // Kepala, Rambut Beruban & Kacamata
    g.fillStyle(0x9ca3af).fillCircle(-25, -166 + oy, 9).fillCircle(25, -166 + oy, 9);
    g.fillStyle(skin).fillCircle(0, -162 + oy, 27);

    // Kacamata bingkai tegas
    g.fillStyle(COLOR.white).lineStyle(3, ink).fillCircle(-11, -164 + oy, 9).strokeCircle(-11, -164 + oy, 9)
      .fillCircle(11, -164 + oy, 9).strokeCircle(11, -164 + oy, 9).lineBetween(-2, -164 + oy, 2, -164 + oy);
    // Bola mata (merah menyala jika marah!)
    g.fillStyle(this.isAngry ? COLOR.red : ink).fillCircle(-11, -163 + oy, 3.8).fillCircle(11, -163 + oy, 3.8);

    // Alis marah tebal
    g.lineStyle(5, ink).lineBetween(-22, -179 + oy, -5, -172 + oy).lineBetween(22, -179 + oy, 5, -172 + oy);

    // Mulut berteriak
    g.fillStyle(0x7f1d1d).fillEllipse(0, -143 + oy, 18, 13 + Math.abs(a) * 4);
    g.fillStyle(COLOR.white).fillRect(-6, -149 + oy, 12, 4);

    // Kumis khas Pak Tono
    g.fillStyle(0x4b5563).fillEllipse(0, -153 + oy, 26, 7);
  }
}
