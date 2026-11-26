import Phaser from 'phaser';
import { COLOR, FONT } from '../config.js';
import { Storage } from '../systems/Storage.js';

const poly = (g, c, pts, a = 1) => {
  g.fillStyle(c, a);
  g.fillPoints(pts.map(([x, y]) => ({ x, y })), true);
};

// MC: pelajar pria/wanita, mendukung tampak depan (menghadap kamera) & tampak belakang (menghadap jalan).
export default class Student extends Phaser.GameObjects.Container {
  constructor(scene, x, y, nameOrOpts, opts = {}) {
    super(scene, x, y);
    const cfg = typeof nameOrOpts === 'object' && nameOrOpts !== null
      ? nameOrOpts
      : { ...opts, name: nameOrOpts };

    this.playerName = cfg.name || Storage.getPlayerName();
    this.gender = cfg.gender || Storage.getGender();
    this.facing = cfg.facing || 'back';
    this.nameGlow = false;

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
    this.tagT = scene.add.text(0, 0, '', {
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
    this.updateNameTag(false);
    this.draw();
  }

  setName(newName) {
    this.playerName = (newName || 'Siswa').trim();
    this.updateNameTag(this.nameGlow);
  }

  setGender(gender) {
    this.gender = gender === 'female' ? 'female' : 'male';
    this.updateNameTag(this.nameGlow);
    this.draw();
  }

  setFacing(facing) {
    this.facing = facing === 'front' ? 'front' : 'back';
    this.draw();
  }

  toggleFacing() {
    this.setFacing(this.facing === 'front' ? 'back' : 'front');
    return this.facing;
  }

  setTilt(deg) {
    this.targetTilt = deg;
  }

  jump() {
    if (!this.isJumping) {
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
      this.jumpVy = -400;
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
        color: i % 2 === 0 ? COLOR.yellow : (this.gender === 'female' ? 0xf472b6 : COLOR.sky),
      });
    }
  }

  updateNameTag(glow = false) {
    this.nameGlow = glow;
    const icon = this.gender === 'female' ? '👧' : '👦';
    this.tagT.setText(`${icon} ${this.playerName}`);
    const tw = Math.max(72, this.tagT.width + 22);
    const borderCol = glow ? COLOR.yellow : (this.gender === 'female' ? 0xf472b6 : COLOR.sky);
    this.tagBg.clear();
    this.tagBg.fillStyle(COLOR.navy, 0.9).fillRoundedRect(-tw / 2, -14, tw, 28, 9);
    this.tagBg.lineStyle(2.5, borderCol, 0.95).strokeRoundedRect(-tw / 2, -14, tw, 28, 9);
  }

  tick(dt, rate = 1) {
    this.t += dt * rate;
    this.flash = Math.max(0, this.flash - dt);

    if (this.isJumping) {
      this.jumpVy += 1150 * dt;
      this.jumpY += this.jumpVy * dt;

      if (this.isSalto) {
        this.flipAngle += dt * 820;
        if (this.flipAngle >= 360) this.flipAngle = 360;

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

    this.currentTilt += (this.targetTilt - this.currentTilt) * Math.min(1, dt * 10);
    this.targetTilt += (0 - this.targetTilt) * Math.min(1, dt * 6);

    this.charContainer.y = -82 + this.jumpY;
    this.charContainer.angle = this.isSalto ? -this.flipAngle : this.currentTilt;

    const ph = this.t * 11, a = Math.sin(ph), oy = -Math.abs(a) * 5;
    this.tag.y = -192 + (this.isJumping ? this.jumpY : oy);

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

  drawLegs(g, cy, a, b, skin, isFemale) {
    const legA = this.isSalto ? -20 : a;
    const legB = this.isSalto ? -20 : b;
    const tuck = this.isSalto ? 10 : 0;
    const shoeCol = isFemale ? 0xbe185d : COLOR.sky;

    [[-11, legA], [11, legB]].forEach(([x, s]) => {
      const l = Math.max(0, s) * (this.isSalto ? 22 : 16);
      if (isFemale) {
        // Kaki jenjang & kaus kaki putih untuk siswi
        g.fillStyle(skin).fillRoundedRect(x - 7, cy - 52 - tuck, 14, 28 - l * 0.5, 4);
        g.fillStyle(COLOR.white).fillRoundedRect(x - 7, cy - 28 - l * 0.7 - tuck, 14, 18 - l * 0.3, 3);
      } else {
        // Celana panjang navy untuk siswa
        g.fillStyle(COLOR.navy).fillRoundedRect(x - 8, cy - 66 - tuck, 16, 56 - l, 5);
      }
      g.fillStyle(shoeCol).fillRoundedRect(x - 10, cy - 11 - l - tuck, 20, 12, 4);
      g.fillStyle(COLOR.white).fillRect(x - 9, cy - 5 - l - tuck, 18, 3);
    });
  }

  drawSkirt(g, cy, runOy) {
    // Rok lipit navy untuk siswi
    const topY = cy - 76 + runOy;
    const botY = cy - 42 + runOy;
    poly(g, COLOR.navy, [
      [-25, topY], [25, topY],
      [33, botY], [-33, botY],
    ]);
    g.lineStyle(2, 0x07142f, 0.75);
    [-12, 0, 12].forEach((px) => {
      g.lineBetween(px * 0.85, topY + 2, px * 1.15, botY - 1);
    });
  }

  drawFemaleHairBack(g, cy, runOy, a) {
    const sway = a * 4;
    const hair = 0x1b1b2f;
    // Kuncir dua kiri & kanan dengan pita merah muda
    [[-1, -24], [1, 24]].forEach(([dir, hx]) => {
      const tailX = hx + dir * 4 + sway;
      g.fillStyle(hair).fillEllipse(tailX, cy - 134 + runOy, 14, 34);
      g.fillStyle(0x2d2d48).fillEllipse(tailX - dir * 2, cy - 136 + runOy, 6, 20);
      // Pita rambut merah/pink
      g.fillStyle(0xf43f5e).fillCircle(hx, cy - 148 + runOy, 5.5);
      g.fillStyle(COLOR.yellow).fillCircle(hx, cy - 148 + runOy, 2);
    });
  }

  draw() {
    const ph = this.t * 11, a = Math.sin(ph), b = -a, oy = -Math.abs(a) * 5;
    const skin = 0xf1c27d;
    const ink = 0x111827;
    const hair = 0x1b1b2f;
    const hairHi = 0x2d2d48;
    const isFemale = this.gender === 'female';
    const shirt = this.flash > 0 && Math.floor(this.flash * 20) % 2 === 0 ? COLOR.red : COLOR.white;

    // 1. Bayangan di Aspal
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

    // 4. Gambar Tubuh Karakter (offset cy = 82 relatif terhadap pivot)
    const g = this.g;
    g.clear();
    const cy = 82;
    const runOy = this.isJumping ? 0 : oy;
    const armA = this.isJumping ? -22 : a * 7;
    const armB = this.isJumping ? -22 : b * 7;
    const bagMain = isFemale ? 0xec4899 : COLOR.royal;
    const bagAccent = isFemale ? 0xfce7f3 : COLOR.sky;

    if (this.facing === 'front') {
      // --- TAMPAK DEPAN (MENGHADAP PENGGUNA) ---
      if (isFemale) {
        // Rambut belakang & kuncir di belakang kepala/bahu
        g.fillStyle(hair).fillRoundedRect(-22, cy - 154 + runOy, 44, 34, 12);
        this.drawFemaleHairBack(g, cy, runOy, a);
      }

      // Kaki & Sepatu
      this.drawLegs(g, cy, a, b, skin, isFemale);

      // Lengan
      g.lineStyle(10, shirt).lineBetween(-27, cy - 120 + runOy, -33, cy - 84 + runOy + armA);
      g.lineStyle(10, shirt).lineBetween(27, cy - 120 + runOy, 33, cy - 84 + runOy + armB);
      g.fillStyle(skin).fillCircle(-33, cy - 80 + runOy + armA, 6).fillCircle(33, cy - 80 + runOy + armB, 6);

      // Badan & Seragam Putih
      g.fillStyle(shirt).fillRoundedRect(-26, cy - 130 + runOy, 52, 66, 10);

      // Rok untuk siswi
      if (isFemale) this.drawSkirt(g, cy, runOy);

      // Tali Tas Ransel di Bahu Depan
      g.fillStyle(bagMain).fillRoundedRect(-19, cy - 130 + runOy, 7, 52, 3);
      g.fillStyle(bagMain).fillRoundedRect(12, cy - 130 + runOy, 7, 52, 3);
      g.fillStyle(COLOR.yellow).fillRect(-18, cy - 92 + runOy, 5, 4).fillRect(13, cy - 92 + runOy, 5, 4);

      // Kerah V & Dasi / Pita Sekolah
      g.fillStyle(COLOR.sky, 0.35).fillTriangle(-10, cy - 130 + runOy, 10, cy - 130 + runOy, 0, cy - 114 + runOy);
      if (isFemale) {
        // Pita kupu-kupu merah muda/merah
        g.fillStyle(0xf43f5e).fillTriangle(-12, cy - 127 + runOy, -12, cy - 115 + runOy, 0, cy - 121 + runOy);
        g.fillStyle(0xf43f5e).fillTriangle(12, cy - 127 + runOy, 12, cy - 115 + runOy, 0, cy - 121 + runOy);
        g.fillStyle(COLOR.yellow).fillCircle(0, cy - 121 + runOy, 3.5);
      } else {
        // Dasi sekolah biru/merah
        g.fillStyle(COLOR.royal).fillRect(-3.5, cy - 124 + runOy, 7, 30);
        g.fillStyle(COLOR.royal).fillTriangle(-3.5, cy - 94 + runOy, 3.5, cy - 94 + runOy, 0, cy - 87 + runOy);
        g.fillStyle(COLOR.yellow).fillCircle(0, cy - 124 + runOy, 3.5);
      }

      // Saku & Badge OSIS kecil di dada kiri
      g.fillStyle(COLOR.navy, 0.25).fillRoundedRect(8, cy - 112 + runOy, 12, 14, 2);
      g.fillStyle(COLOR.yellow).fillCircle(14, cy - 108 + runOy, 3);

      // Leher, Telinga, & Wajah
      g.fillStyle(skin).fillRect(-7, cy - 140 + runOy, 14, 12);
      g.fillStyle(skin).fillCircle(-20, cy - 149 + runOy, 5).fillCircle(20, cy - 149 + runOy, 5);
      g.fillStyle(skin).fillCircle(0, cy - 151 + runOy, 21);

      // Pipi merona
      g.fillStyle(0xf472b6, isFemale ? 0.45 : 0.25)
        .fillEllipse(-12, cy - 143 + runOy, 7, 4)
        .fillEllipse(12, cy - 143 + runOy, 7, 4);

      // Mata Ekspresif
      [-8, 8].forEach((ex) => {
        g.fillStyle(COLOR.white).fillEllipse(ex, cy - 149 + runOy, 8.5, 9.5);
        g.fillStyle(ink).fillCircle(ex, cy - 149 + runOy, isFemale ? 3.8 : 3.4);
        g.fillStyle(COLOR.white).fillCircle(ex - 1.3, cy - 150.5 + runOy, 1.4);
        if (isFemale) {
          g.lineStyle(2, ink).lineBetween(ex - 4, cy - 153 + runOy, ex + 4, cy - 153 + runOy);
        }
      });

      // Alis
      if (this.sweating) {
        g.lineStyle(2.5, ink)
          .lineBetween(-13, cy - 156 + runOy, -4, cy - 158 + runOy)
          .lineBetween(13, cy - 156 + runOy, 4, cy - 158 + runOy);
      } else {
        g.lineStyle(2.5, ink)
          .lineBetween(-12, cy - 157 + runOy, -4, cy - 157 + runOy)
          .lineBetween(4, cy - 157 + runOy, 12, cy - 157 + runOy);
      }

      // Mulut (senyum ceria vs cemas)
      if (this.sweating) {
        g.fillStyle(0x991b1b).fillEllipse(0, cy - 138 + runOy, 7, 8);
      } else {
        g.fillStyle(0x991b1b).fillEllipse(0, cy - 138 + runOy, 10, 6);
        g.fillStyle(skin).fillRect(-6, cy - 142 + runOy, 12, 4);
      }

      // Rambut Depan & Poni
      g.fillStyle(hair).fillEllipse(0, cy - 166 + runOy, 42, 18);
      if (isFemale) {
        // Poni siswi lembut + jepit rambut kuning
        g.fillStyle(hair).fillEllipse(-16, cy - 158 + runOy, 12, 16);
        g.fillStyle(hair).fillEllipse(16, cy - 158 + runOy, 12, 16);
        g.fillStyle(hair).fillTriangle(-14, cy - 166 + runOy, -2, cy - 166 + runOy, -7, cy - 155 + runOy);
        g.fillStyle(hair).fillTriangle(2, cy - 166 + runOy, 14, cy - 166 + runOy, 8, cy - 155 + runOy);
        g.fillStyle(COLOR.yellow).fillRoundedRect(10, cy - 163 + runOy, 9, 4, 2);
      } else {
        // Poni siswa rapi bertekstur
        g.fillStyle(hair).fillTriangle(-16, cy - 164 + runOy, -4, cy - 164 + runOy, -10, cy - 154 + runOy);
        g.fillStyle(hair).fillTriangle(-4, cy - 165 + runOy, 8, cy - 165 + runOy, 2, cy - 153 + runOy);
        g.fillStyle(hair).fillTriangle(6, cy - 164 + runOy, 18, cy - 164 + runOy, 12, cy - 155 + runOy);
      }
      g.fillStyle(hairHi).fillEllipse(-6, cy - 168 + runOy, 16, 6);
    } else {
      // --- TAMPAK BELAKANG (MENGHADAP JALAN) ---
      this.drawLegs(g, cy, a, b, skin, isFemale);

      // Lengan
      g.lineStyle(10, shirt).lineBetween(-27, cy - 120 + runOy, -33, cy - 84 + runOy + armA);
      g.lineStyle(10, shirt).lineBetween(27, cy - 120 + runOy, 33, cy - 84 + runOy + armB);
      g.fillStyle(skin).fillCircle(-33, cy - 80 + runOy + armA, 6).fillCircle(33, cy - 80 + runOy + armB, 6);

      // Badan & Kemeja
      g.fillStyle(shirt).fillRoundedRect(-26, cy - 130 + runOy, 52, 66, 10);

      // Rok untuk siswi
      if (isFemale) this.drawSkirt(g, cy, runOy);

      // Tas Ransel
      g.fillStyle(bagMain).fillRoundedRect(-23, cy - 125 + runOy, 46, 56, 10);
      g.fillStyle(bagAccent).fillRect(-20, cy - 120 + runOy, 40, 4);
      g.fillStyle(COLOR.yellow).fillRoundedRect(-15, cy - 92 + runOy, 30, 18, 5);
      g.fillStyle(COLOR.navy).fillRect(-2, cy - 122 + runOy, 4, 28);
      g.fillStyle(COLOR.yellow).fillRect(-7, cy - 131 + runOy, 14, 6);

      // Leher & Kepala (belakang)
      g.fillStyle(skin).fillRect(-7, cy - 140 + runOy, 14, 12);
      g.fillStyle(skin).fillCircle(-19, cy - 148 + runOy, 5).fillCircle(19, cy - 148 + runOy, 5);

      if (isFemale) this.drawFemaleHairBack(g, cy, runOy, a);
      g.fillStyle(hair).fillCircle(0, cy - 151 + runOy, 21);
      g.fillStyle(hairHi).fillCircle(-6, cy - 155 + runOy, 11);
      if (isFemale) {
        // Tambahan rambut belakang menutup tengkuk
        g.fillStyle(hair).fillRoundedRect(-18, cy - 144 + runOy, 36, 16, 6);
      }
    }

    // Keringat dingin jika tegang (hanya saat tidak salto)
    if (this.sweating && !this.isSalto) {
      const swY = cy - 158 + runOy + Math.sin(this.t * 14) * 4;
      g.fillStyle(COLOR.sky, 0.9).fillCircle(24, swY, 5).fillTriangle(24, swY - 7, 21, swY, 27, swY);
    }
  }
}
