import { W, COLOR } from '../config.js';

// Proyeksi jalan 3 jalur dengan titik hilang. p = progres 0 (jauh) -> 1 (dekat), q = p*p memberi efek perspektif.
export const CX = 430, HY = 215, BY = 720;
const lerp = (a, b, t) => a + (b - a) * t;
export const laneW = (q) => lerp(34, 235, q);
export const lineY = (q) => lerp(HY, BY, q);
export const scaleAt = (q) => lerp(0.06, 1, q);
export const laneX = (lane, q) => CX + (lane - 1) * laneW(q);

const BUILD = [0x1e3a8a, 0x2563eb, 0x38bdf8, 0x1d4ed8];
const SKYLINE_FAR = [[0, 70, 90], [70, 60, 115], [130, 90, 75], [220, 50, 105], [270, 80, 65], [350, 65, 110], [415, 60, 85], [475, 100, 60], [575, 70, 95], [645, 80, 70], [725, 65, 120], [790, 100, 85]];
const SKYLINE_NEAR = [[20, 45, 60], [100, 65, 45], [190, 40, 70], [300, 55, 50], [380, 45, 65], [510, 60, 40], [610, 50, 55], [700, 40, 75], [820, 60, 50]];

const poly = (g, c, pts, a = 1) => { g.fillStyle(c, a); g.fillPoints(pts.map(([x, y]) => ({ x, y })), true); };

export default class RoadWorld {
  constructor(scene, diff) {
    this.d = diff;
    this.g = scene.add.graphics().setDepth(0);
    this.off = 0; this.time = 0; this.sideDist = 0; this.itemTimer = 1.6;
    this.side = []; this.items = [];
    this.sideStep = 0.16;
    this.sideCount = 0;

    // Awan dinamis melayang
    this.clouds = [
      { x: 80, y: 55, w: 90, h: 26, s: 8 },
      { x: 340, y: 80, w: 130, h: 32, s: 12 },
      { x: 620, y: 45, w: 110, h: 28, s: 10 },
      { x: 810, y: 95, w: 100, h: 25, s: 7 },
    ];

    for (let p = 0.04; p < 1.15; p += this.sideStep) this.spawnSide(p);
  }

  spawnSide(p) {
    const isBuilding = (this.sideCount++ % 2 === 0);
    for (const s of [-1, 1]) {
      const r = Math.random();
      let kind;
      if (isBuilding) {
        kind = r < 0.18 ? 4 : 0; // 4 = sekolah, 0 = gedung bertingkat
      } else {
        kind = r < 0.55 ? 1 : r < 0.8 ? 2 : 3; // 1 = pohon rindang, 2 = papan info, 3 = lampu jalan
      }
      this.side.push({
        s, p,
        kind,
        h: kind === 0 ? 170 + Math.random() * 80 : 180,
        ci: Math.floor(Math.random() * BUILD.length),
        seed: Math.floor(Math.random() * 9),
        sign: ['KANTIN', 'BUKU', 'SDG 4', 'CAFE', 'LAB'][Math.floor(Math.random() * 5)],
      });
    }
  }

  spawnItem() {
    const lanes = [0, 1, 2].sort(() => Math.random() - 0.5);
    const mk = (lane, type) => ({ lane, type, p: 0, alive: true, spin: 0 });
    if (Math.random() < this.d.double) this.items.push(mk(lanes[0], 'obs'), mk(lanes[1], 'obs'));
    else this.items.push(mk(lanes[0], Math.random() < 0.58 ? 'obs' : 'book'));
  }

  check(lane) {
    const hit = [];
    for (const o of this.items) {
      if (o.alive && o.lane === lane && o.p > 0.84 && o.p < 0.96) { o.alive = false; hit.push(o.type); }
    }
    return hit;
  }

  update(dt, speed) {
    this.time += dt;
    this.off = (this.off + speed * dt) % 0.1;

    // Gerakkan awan
    this.clouds.forEach((c) => {
      c.x += c.s * dt;
      if (c.x - c.w > 880) c.x = -c.w - 20;
    });

    this.sideDist += speed * dt;
    if (this.sideDist >= this.sideStep) { this.sideDist -= this.sideStep; this.spawnSide(0); }
    this.side.forEach((o) => { o.p += speed * dt; });
    this.side = this.side.filter((o) => o.p < 1.25);

    this.itemTimer -= dt;
    if (this.itemTimer <= 0) { this.itemTimer = this.d.spawn * (0.8 + Math.random() * 0.5); this.spawnItem(); }
    this.items.forEach((o) => { o.p += speed * dt; o.spin += dt * 5; });
    this.items = this.items.filter((o) => o.alive && o.p < 1.15);

    this.draw();
  }

  draw() {
    const g = this.g;
    g.clear();

    // 1. Langit Gradasi Senja - Siang yang Menawan
    const skyTones = [0x0b1f4d, 0x133e87, 0x1d63b8, 0x38bdf8, 0x93c5fd, 0xfde047];
    const sh = HY / skyTones.length;
    skyTones.forEach((col, idx) => {
      g.fillStyle(col, 0.98).fillRect(0, idx * sh, 880, sh + 2);
    });

    // Matahari bersinar lembut di atas cakrawala
    g.fillStyle(0xfef08a, 0.45).fillCircle(CX, HY - 10, 48);
    g.fillStyle(0xfffbeb, 0.85).fillCircle(CX, HY - 10, 26);
    g.fillStyle(0xffffff, 0.95).fillCircle(CX, HY - 10, 14);

    // Awan melayang
    this.clouds.forEach((c) => {
      g.fillStyle(0xffffff, 0.75);
      g.fillRoundedRect(c.x, c.y, c.w, c.h, c.h / 2);
      g.fillCircle(c.x + c.w * 0.35, c.y - c.h * 0.25, c.h * 0.65);
      g.fillCircle(c.x + c.w * 0.65, c.y - c.h * 0.15, c.h * 0.5);
    });

    // Siluet Kota Jauh & Dekat
    g.fillStyle(0x0f2a63, 0.65);
    SKYLINE_FAR.forEach(([x, w, h]) => {
      g.fillRect(x, HY - h, w, h);
      // Antena dengan lampu berkedip
      g.lineStyle(1.5, 0x64748b, 0.8).lineBetween(x + w / 2, HY - h, x + w / 2, HY - h - 18);
      if (Math.floor(this.time * 2 + x) % 2 === 0) {
        g.fillStyle(COLOR.red, 0.9).fillCircle(x + w / 2, HY - h - 18, 2.5);
        g.fillStyle(0x0f2a63, 0.65);
      }
    });

    g.fillStyle(0x1e3a8a, 0.85);
    SKYLINE_NEAR.forEach(([x, w, h]) => {
      g.fillRect(x, HY - h, w, h);
      // Jendela gedung siluet kota
      for (let wy = HY - h + 8; wy < HY - 6; wy += 14) {
        for (let wx = x + 6; wx < x + w - 6; wx += 10) {
          if ((wx * 3 + wy * 5) % 4 === 0) {
            g.fillStyle(COLOR.yellow, 0.8).fillRect(wx, wy, 4, 6);
            g.fillStyle(0x1e3a8a, 0.85);
          }
        }
      }
    });

    // 2. Daratan & Trotoar
    g.fillStyle(0x1e293b).fillRect(0, HY, 880, BY - HY);
    const e = (m, q) => laneW(q) * m;

    // Trotoar kiri & kanan (paving block bersih)
    for (const s of [-1, 1]) {
      poly(g, 0x94a3b8, [[CX + s * e(2.5, 0), HY], [CX + s * e(1.5, 0), HY], [CX + s * e(1.5, 1), BY], [CX + s * e(2.5, 1), BY]]);
      // Kerb batu tepi jalan
      poly(g, 0xcbd5e1, [[CX + s * e(1.54, 0), HY], [CX + s * e(1.5, 0), HY], [CX + s * e(1.5, 1), BY], [CX + s * e(1.54, 1), BY]]);
    }

    // 3. Aspal Jalanan
    poly(g, 0x0f172a, [[CX - e(1.5, 0), HY], [CX + e(1.5, 0), HY], [CX + e(1.5, 1), BY], [CX - e(1.5, 1), BY]]);

    // Garis Batas Jalan Neon Bercahaya (Garis Kuning & Biru)
    g.lineStyle(5, COLOR.yellow, 0.95);
    for (const s of [-1, 1]) g.lineBetween(CX + s * e(1.5, 0), HY, CX + s * e(1.5, 1), BY);

    // Garis Putus-putus Marka Jalan (dengan efek perspektif tebal)
    for (let k = -1; k < 11; k++) {
      const p0 = k * 0.1 + this.off, p1 = p0 + 0.048;
      if (p1 <= 0.02) continue;
      const q0 = Math.max(0, p0) ** 2, q1 = p1 ** 2;
      for (const b of [-0.5, 0.5]) {
        const w0 = laneW(q0) * 0.055, w1 = laneW(q1) * 0.055, x0 = CX + b * laneW(q0), x1 = CX + b * laneW(q1);
        poly(g, 0xf8fafc, [[x0 - w0, lineY(q0)], [x0 + w0, lineY(q0)], [x1 + w1, lineY(q1)], [x1 - w1, lineY(q1)]], 0.95);
      }
    }

    // 4. Gambar Aset Samping (Gedung, Pohon, Lampu) & Item Kuis/Rintangan
    [...this.side].sort((a, b) => a.p - b.p).forEach((o) => this.drawSide(g, o));
    [...this.items].sort((a, b) => a.p - b.p).forEach((o) => this.drawItem(g, o));
  }

  drawSide(g, o) {
    const q = o.p * o.p, y = lineY(q), s = scaleAt(q), lw = laneW(q);

    if (o.kind === 0) { // Gedung bertingkat modern
      const w = 185 * s, h = o.h * s;
      const x0 = o.s === 1 ? CX + 2.5 * lw : CX - 2.5 * lw - w;

      // Bayangan gedung ke trotoar
      g.fillStyle(0x000000, 0.25).fillRect(x0 - 2, y, w + 4, 6 * s);

      // Dinding Gedung
      g.fillStyle(BUILD[o.ci]).fillRect(x0, y - h, w, h);
      g.fillStyle(COLOR.navy, 0.9).fillRect(x0 - 3 * s, y - h - 7 * s, w + 6 * s, 8 * s);

      // Papan Nama Toko / Spanduk warna-warni di dinding
      if (o.seed % 2 === 0) {
        const signH = 22 * s, signY = y - h + 18 * s;
        g.fillStyle(COLOR.yellow).fillRect(x0 + 8 * s, signY, w - 16 * s, signH);
        g.fillStyle(COLOR.navy).fillRect(x0 + 12 * s, signY + 4 * s, w - 24 * s, signH - 8 * s);
      }

      // Jendela-jendela bercahaya
      const rows = Math.max(2, Math.floor(o.h / 50)), rh = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 3; c++) {
          const lit = (r * 7 + c * 3 + o.seed) % 3 !== 0;
          g.fillStyle(lit ? COLOR.yellow : 0x0f2a63, lit ? 0.95 : 0.6)
            .fillRect(x0 + w * (0.12 + c * 0.3), y - h + (r + 0.38) * rh, w * 0.17, rh * 0.4);
        }
      }

      // Antena atap gedung dengan lampu kedip
      g.lineStyle(2 * s, 0x64748b).lineBetween(x0 + w * 0.5, y - h - 7 * s, x0 + w * 0.5, y - h - 28 * s);
      if (Math.floor(this.time * 3 + o.seed) % 2 === 0) {
        g.fillStyle(COLOR.red, 0.9).fillCircle(x0 + w * 0.5, y - h - 28 * s, 3.5 * s);
      }
    } else if (o.kind === 4) { // Gedung Sekolah Megah
      const w = 260 * s, h = 145 * s;
      const x0 = o.s === 1 ? CX + 2.5 * lw : CX - 2.5 * lw - w;

      g.fillStyle(0xf8fafc).fillRect(x0, y - h, w, h);
      g.fillStyle(COLOR.navy).fillTriangle(x0 - 6 * s, y - h, x0 + w + 6 * s, y - h, x0 + w / 2, y - h - 55 * s);

      // Kaca-kaca jendela sekolah
      g.fillStyle(COLOR.sky, 0.95);
      for (let c = 0; c < 4; c++) {
        g.fillRect(x0 + w * (0.08 + c * 0.23), y - h + 45 * s, w * 0.14, 34 * s);
      }

      // Pintu masuk & bendera merah putih
      g.fillStyle(COLOR.yellow).fillRect(x0 + w * 0.42, y - 56 * s, w * 0.16, 56 * s);
      g.fillStyle(COLOR.royal).fillRect(x0 + w * 0.22, y - h + 12 * s, w * 0.56, 24 * s);
      g.lineStyle(2.5 * s, 0x94a3b8).lineBetween(x0 + w / 2, y - h - 55 * s, x0 + w / 2, y - h - 95 * s);
      // Bendera Indonesia
      g.fillStyle(COLOR.red).fillRect(x0 + w / 2, y - h - 95 * s, 26 * s, 10 * s);
      g.fillStyle(COLOR.white).fillRect(x0 + w / 2, y - h - 85 * s, 26 * s, 10 * s);
    } else if (o.kind === 1) { // Pohon Rindang
      const x = o.s === 1 ? CX + 2.0 * lw : CX - 2.0 * lw;
      // Batang
      g.fillStyle(0x78350f).fillRect(x - 6 * s, y - 68 * s, 12 * s, 68 * s);
      // Ranting & daun lebat gradasi
      g.fillStyle(0x15803d).fillCircle(x, y - 96 * s, 42 * s)
        .fillCircle(x - 26 * s, y - 80 * s, 28 * s)
        .fillCircle(x + 26 * s, y - 80 * s, 28 * s);
      g.fillStyle(0x22c55e).fillCircle(x - 8 * s, y - 108 * s, 26 * s);
      g.fillStyle(0x86efac, 0.6).fillCircle(x - 12 * s, y - 114 * s, 12 * s);
    } else if (o.kind === 2) { // Papan Informasi / Rambu
      const x = o.s === 1 ? CX + 1.95 * lw : CX - 1.95 * lw;
      g.fillStyle(0x64748b).fillRect(x - 3 * s, y - 110 * s, 6 * s, 110 * s);
      g.fillStyle(COLOR.royal).fillRoundedRect(x - 48 * s, y - 150 * s, 96 * s, 62 * s, 6 * s);
      g.lineStyle(2.5 * s, COLOR.yellow).strokeRoundedRect(x - 48 * s, y - 150 * s, 96 * s, 62 * s, 6 * s);
      g.fillStyle(COLOR.yellow).fillRect(x - 38 * s, y - 140 * s, 76 * s, 10 * s);
      g.fillStyle(COLOR.white).fillRect(x - 38 * s, y - 122 * s, 68 * s, 6 * s).fillRect(x - 38 * s, y - 108 * s, 48 * s, 6 * s);
    } else { // Lampu Jalan dengan sorot cahaya
      const x = o.s === 1 ? CX + 1.68 * lw : CX - 1.68 * lw;
      // Tiang lampu
      g.fillStyle(0x334155).fillRect(x - 3.5 * s, y - 150 * s, 7 * s, 150 * s);
      g.fillStyle(0x1e293b).fillRect(x - 14 * s, y - 162 * s, 28 * s, 12 * s);
      // Bohlam menyala
      g.fillStyle(COLOR.yellow, 0.95).fillCircle(x, y - 155 * s, 7 * s);
      // Sorotan cahaya kuning transparan ke aspal
      g.fillStyle(COLOR.yellow, 0.12).fillTriangle(x, y - 155 * s, x - 35 * s, y, x + 35 * s, y);
    }
  }

  drawItem(g, o) {
    const q = o.p * o.p, y = lineY(q), s = scaleAt(q), x = laneX(o.lane, q);

    if (o.type === 'obs') {
      // Barikade Bahaya Bergaris Strip & Lampu Sirine Kedip
      const w = 92 * s, h = 64 * s;
      // Bayangan tebal
      g.fillStyle(0x000000, 0.35).fillEllipse(x, y + 2, w * 1.1, 16 * s);

      // Kaki logam penyangga
      g.fillStyle(0x475569)
        .fillRect(x - w * 0.44, y - 14 * s, 10 * s, 14 * s)
        .fillRect(x + w * 0.34, y - 14 * s, 10 * s, 14 * s);

      // Papan Barikade Utama
      g.fillStyle(COLOR.red).fillRoundedRect(x - w / 2, y - h, w, h - 8 * s, 6 * s);
      g.lineStyle(2.5 * s, 0xffffff, 0.9).strokeRoundedRect(x - w / 2, y - h, w, h - 8 * s, 6 * s);

      // Strip Putih Reflektif Miring
      for (let i = -2; i <= 2; i++) {
        const sx = x + i * 18 * s;
        poly(g, COLOR.white, [
          [sx - 7 * s, y - h],
          [sx + 4 * s, y - h],
          [sx - 1 * s, y - 8 * s],
          [sx - 12 * s, y - 8 * s],
        ], 0.95);
      }

      // Lampu Rotary Kuning Kedip di puncak barikade
      const blink = Math.floor(this.time * 6 + o.lane) % 2 === 0;
      g.fillStyle(0x1e293b).fillRect(x - 8 * s, y - h - 10 * s, 16 * s, 10 * s);
      g.fillStyle(blink ? COLOR.yellow : 0xb45309, 0.95).fillCircle(x, y - h - 14 * s, 7 * s);
      if (blink) {
        g.fillStyle(COLOR.yellow, 0.3).fillCircle(x, y - h - 14 * s, 18 * s);
      }
    } else {
      // Buku Pintar SDG 4: Mengambang, Berputar, & Memancarkan Aura Emas
      const floatY = y - (34 + 9 * Math.sin(this.time * 6 + o.lane * 2)) * s;
      const w = 68 * s, h = 48 * s;

      // Bayangan mengambang mengecil saat naik
      g.fillStyle(0x000000, 0.25).fillEllipse(x, y, 65 * s, 12 * s);

      // Aura berpendar
      g.fillStyle(COLOR.yellow, 0.35 + 0.15 * Math.sin(this.time * 8)).fillCircle(x, floatY - h * 0.5, 38 * s);

      // Buku Sampul Royal Blue & Halaman Emas
      g.fillStyle(COLOR.royal).fillRoundedRect(x - w / 2, floatY - h, w, h, 6 * s);
      g.lineStyle(2.5 * s, COLOR.yellow, 0.95).strokeRoundedRect(x - w / 2, floatY - h, w, h, 6 * s);

      // Lembaran halaman putih
      g.fillStyle(COLOR.white).fillRect(x - w / 2 + 6 * s, floatY - h + 6 * s, w - 12 * s, h - 14 * s);
      // Pita bookmark emas
      g.fillStyle(COLOR.yellow).fillRect(x + w * 0.15, floatY - h, 7 * s, h * 0.7);

      // Bintang kecil berkilau di sekitar buku
      const sp = Math.sin(this.time * 10);
      g.fillStyle(COLOR.yellow, 0.9).fillCircle(x - w * 0.45, floatY - h - 4 * s + sp * 4, 3 * s);
      g.fillStyle(0xffffff, 0.9).fillCircle(x + w * 0.45, floatY - 4 * s - sp * 4, 2.5 * s);
    }
  }
}
