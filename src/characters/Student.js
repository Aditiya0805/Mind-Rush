import Phaser from 'phaser';
import { COLOR, FONT } from '../config.js';
import { Storage } from '../systems/Storage.js';

// MC: pelajar laki-laki, tampak dari belakang (seragam putih, celana navy, tas royal).
export default class Student extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name) {
    super(scene, x, y);
    this.playerName = name || Storage.getPlayerName();

    // 1. Lapisan Bayangan di atas aspal (tetap di ground y = 0)
    this.shadowG = scene.add.graphics();

    // 2. Lapisan Efek Debu & Percikan Salto
    this.dustG = scene.add.graphics();
    this.sparkG = scene.add.graphics();

    // 3. Container Karakter (berputar saat salto & naik saat melompat)
    // Pivot diatur di tengah badan (y = -82)
    this.charContainer = scene.add.container(0, -82);
    this.g = scene.add.graphics();
    this.charContainer.add(this.g);

    // 4. Name Tag Badge di atas kepala (tetap tegak)
    this.tag = scene.add.container(0, -188);
    this.tagBg = scene.add.graphics();
    this.tagT = scene.add.text(0, 0, `🎓 ${this.playerName}`, {
      fontFamily: FONT,
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#07142f',
      strokeThickness: 3,
      resolution: 2,
    }).setOrigin(0.5);
    this.tag.add([this.tagBg, this.tagT]);

    this.add([this.shadowG, this.dustG, this.sparkG, this.charContainer, this.tag]);

    this.t = 0;
    this.flash = 0;
    this.sweating = false;
    this.targetTilt = 0;
    this.currentTilt = 0;

    // Fisika Lompat & Salto
    this.isJumping = false;
    this.isSalto = false;
    this.jumpY = 0;
    this.jumpVy = 0;
    this.flipAngle = 0;

    this.dusts = [];
    this.saltoSparks = [];

    scene.add.existing(this);
    this.updateNameTag();
    this.draw();
  }

  setName(newName) {
    this.playerName = (newName || 'Siswa').trim();
    this.updateNameTag();
  }

  setTilt(deg) {
    this.targetTilt = deg;
  }

  jump() {
    if (!this.isJumping) {
      // Lompatan awal
      this.isJumping = true;
      this.isSalto = false;
      this.jumpVy = -500;
      this.jumpY = 0;
      this.flipAngle = 0;
      this.createJumpDust();
      return 'jump';
    } else if (this.isJumping && !this.isSalto && this.jumpY < -25) {
      // Double tap di udara: SALTO / FLIP AKROBATIK 360°!
      this.isSalto = true;
      this.jumpVy = -400; // Dorongan ekstra saat salto
      this.flipAngle = 0;
      this.createSaltoBurst();
      return 'salto';
    }
    return null;
  }

  createJumpDust() {
    for (let i = 0; i < 6; i++) {
      this.dusts.push({
        x: (Math.random() - 0.5) * 32,
        y: 2,
        vx: (Math.random() - 0.5) * 35,
        vy: -15 - Math.random() * 15,
        r: 5 + Math.random() * 4,
        alpha: 0.75,
      });
    }
  }

  createLandDust() {
    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * i) / 4.5;
      this.dusts.push({
        x: Math.cos(angle) * 16,
        y: 2,
        vx: Math.cos(angle) * 60,
        vy: -12 - Math.random() * 10,
        r: 6 + Math.random() * 4,
        alpha: 0.8,
      });
    }
  }

  createSaltoBurst() {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const spd = 70 + Math.random() * 50;
      this.saltoSparks.push({
        x: 0,
        y: this.jumpY - 82,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        r: 3.5 + Math.random() * 3,
        alpha: 1,
        color: i % 2 === 0 ? COLOR.yellow : COLOR.sky,
      });
    }
  }

  updateNameTag(glow = false) {
    this.tagT.setText(`🎓 ${this.playerName}`);
    const tw = Math.max(68, this.tagT.width + 22);
    this.tagBg.clear();
    this.tagBg.fillStyle(COLOR.navy, 0.9).fillRoundedRect(-tw / 2, -14, tw, 28, 9);
    this.tagBg.lineStyle(2.5, glow ? COLOR.yellow : COLOR.sky, 0.95).strokeRoundedRect(-tw / 2, -14, tw, 28, 9);
  }

  tick(dt, rate = 1) {
    this.t += dt * rate;
    this.flash = Math.max(0, this.flash - dt);

    // Fisika lompat & salto
    if (this.isJumping) {
      this.jumpVy += 1150 * dt; // Gravitasi
      this.jumpY += this.jumpVy * dt;

      if (this.isSalto) {
        this.flipAngle += dt * 820; // Putaran penuh 360 derajat
        if (this.flipAngle >= 360) {
          this.flipAngle = 360;
        }

        // Jejak kilau emas saat berputar salto
        if (Math.random() < dt * 28) {
          this.saltoSparks.push({
            x: (Math.random() - 0.5) * 36,
            y: this.jumpY - 82 + (Math.random() - 0.5) * 36,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            r: 3 + Math.random() * 3,
            alpha: 1,
            color: Math.random() > 0.5 ? COLOR.yellow : COLOR.white,
          });
        }
      }

      if (this.jumpY >= 0) {
        this.jumpY = 0;
        this.jumpVy = 0;
        this.isJumping = false;
        this.isSalto = false;
        this.flipAngle = 0;
        this.createLandDust();
      }
    }

    // Smooth tilt lerp saat belok
    this.currentTilt += (this.targetTilt - this.currentTilt) * Math.min(1, dt * 10);
    this.targetTilt += (0 - this.targetTilt) * Math.min(1, dt * 6);

    // Update posisi container karakter
    this.charContainer.y = -82 + this.jumpY;
    this.charContainer.angle = this.isSalto ? -this.flipAngle : this.currentTilt;

    const ph = this.t * 11, a = Math.sin(ph), oy = -Math.abs(a) * 5;
    this.tag.y = -188 + (this.isJumping ? this.jumpY : oy);

    // Debu lari saat di tanah
    if (!this.isJumping && Math.random() < dt * 16 * rate) {
      this.dusts.push({
        x: (Math.random() - 0.5) * 36,
        y: 4,
        vx: (Math.random() - 0.5) * 20,
        vy: -8 - Math.random() * 12,
        r: 4 + Math.random() * 5,
        alpha: 0.65,
      });
    }

    this.dusts.forEach((d) => {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.r += dt * 6;
      d.alpha -= dt * 1.5;
    });
    this.dusts = this.dusts.filter((d) => d.alpha > 0);

    this.saltoSparks.forEach((s) => {
      s.x += (s.vx || 0) * dt;
      s.y += (s.vy || 0) * dt;
      s.alpha -= dt * 2.2;
    });
    this.saltoSparks = this.saltoSparks.filter((s) => s.alpha > 0);

    this.draw();
  }

  draw() {
    const ph = this.t * 11, a = Math.sin(ph), b = -a, oy = -Math.abs(a) * 5;
    const skin = 0xf1c27d;
    const shirt = this.flash > 0 && Math.floor(this.flash * 20) % 2 === 0 ? COLOR.red : COLOR.white;

    // 1. Bayangan di Aspal (mengecil saat melompat tinggi)
    const shadowScale = Math.max(0.25, 1 - Math.abs(this.jumpY) / 190);
    this.shadowG.clear();
    this.shadowG.fillStyle(0x000000, 0.32 * shadowScale).fillEllipse(0, 3, 66 * shadowScale, 14 * shadowScale);

    // 2. Gambar Debu
    this.dustG.clear();
    for (const d of this.dusts) {
      this.dustG.fillStyle(0xd5e2f7, d.alpha).fillCircle(d.x, d.y, d.r);
    }

    // 3. Gambar Percikan Salto
    this.sparkG.clear();
    for (const s of this.saltoSparks) {
      this.sparkG.fillStyle(s.color, s.alpha).fillCircle(s.x, s.y, s.r);
    }

    // 4. Gambar Tubuh Karakter di dalam charContainer (offset +82 relatif terhadap pivot)
    const g = this.g;
    g.clear();

    const cy = 82; // Titik pusat tubuh

    // Posisi kaki saat salto (menekuk akrobatik) vs saat berlari
    const legA = this.isSalto ? -20 : a;
    const legB = this.isSalto ? -20 : b;
    const runOy = this.isJumping ? 0 : oy;

    // Kaki & Sepatu
    [[-11, legA], [11, legB]].forEach(([x, s]) => {
      const l = Math.max(0, s) * (this.isSalto ? 22 : 16);
      g.fillStyle(COLOR.navy).fillRoundedRect(x - 8, cy - 66 - (this.isSalto ? 10 : 0), 16, 56 - l, 5);
      g.fillStyle(COLOR.sky).fillRoundedRect(x - 10, cy - 11 - l - (this.isSalto ? 10 : 0), 20, 12, 4);
      g.fillStyle(COLOR.white).fillRect(x - 9, cy - 5 - l - (this.isSalto ? 10 : 0), 18, 3);
    });

    // Lengan
    const armA = this.isSalto ? 24 : a * 7;
    const armB = this.isSalto ? 24 : b * 7;
    g.lineStyle(10, shirt).lineBetween(-27, cy - 120 + runOy, -33, cy - 84 + runOy + armA);
    g.lineStyle(10, shirt).lineBetween(27, cy - 120 + runOy, 33, cy - 84 + runOy + armB);
    g.fillStyle(skin).fillCircle(-33, cy - 80 + runOy + armA, 6).fillCircle(33, cy - 80 + runOy + armB, 6);

    // Badan & Kemeja
    g.fillStyle(shirt).fillRoundedRect(-26, cy - 130 + runOy, 52, 66, 10);

    // Tas Ransel
    g.fillStyle(COLOR.royal).fillRoundedRect(-23, cy - 125 + runOy, 46, 58, 10);
    g.fillStyle(COLOR.sky).fillRect(-20, cy - 120 + runOy, 40, 4);
    g.fillStyle(COLOR.yellow).fillRoundedRect(-15, cy - 92 + runOy, 30, 18, 5);
    g.fillStyle(COLOR.navy).fillRect(-2, cy - 122 + runOy, 4, 28);
    g.fillStyle(COLOR.yellow).fillRect(-7, cy - 131 + runOy, 14, 6);

    // Leher & Kepala
    g.fillStyle(skin).fillRect(-7, cy - 140 + runOy, 14, 12);
    g.fillStyle(skin).fillCircle(-19, cy - 148 + runOy, 5).fillCircle(19, cy - 148 + runOy, 5);
    // Rambut hitam
    g.fillStyle(0x1b1b2f).fillCircle(0, cy - 151 + runOy, 21);
    g.fillStyle(0x2d2d48).fillCircle(-6, cy - 155 + runOy, 11);

    // Keringat dingin jika tegang (hanya saat tidak salto)
    if (this.sweating && !this.isSalto) {
      const swY = cy - 158 + runOy + Math.sin(this.t * 14) * 4;
      g.fillStyle(COLOR.sky, 0.9).fillCircle(24, swY, 5).fillTriangle(24, swY - 7, 21, swY, 27, swY);
    }
  }
}
