import { W, COLOR } from '../config.js';

// Proyeksi jalan 3 jalur dengan titik hilang. p = progres 0 (jauh) -> 1 (dekat), q = p*p memberi efek perspektif.
export const CX = 430, HY = 215, BY = 720;
const lerp = (a, b, t) => a + (b - a) * t;
export const laneW = (q) => lerp(34, 235, q);
export const lineY = (q) => lerp(HY, BY, q);
export const scaleAt = (q) => lerp(0.06, 1, q);
export const laneX = (lane, q) => CX + (lane - 1) * laneW(q);

const BUILD = [COLOR.royal, 0x3b6fd8, 0xe8f1ff, 0x5aa9ee];
const SKYLINE = [[0, 60, 70], [70, 50, 100], [130, 80, 60], [220, 45, 90], [270, 70, 55], [340, 60, 95], [410, 50, 70], [470, 90, 50], [570, 60, 85], [640, 70, 60], [720, 55, 100], [790, 90, 70], [890, 60, 55], [960, 70, 90]];
const poly = (g, c, pts, a = 1) => { g.fillStyle(c, a); g.fillPoints(pts.map(([x, y]) => ({ x, y })), true); };

export default class RoadWorld {
  constructor(scene, diff) {
    this.d = diff;
    this.g = scene.add.graphics().setDepth(0);
    this.off = 0; this.time = 0; this.sideDist = 0; this.itemTimer = 1.6;
    this.side = []; this.items = [];
    this.sideStep = 0.16;
    this.sideCount = 0;
    for (let p = 0.04; p < 1.15; p += this.sideStep) this.spawnSide(p);
  }

  spawnSide(p) {
    const isBuilding = (this.sideCount++ % 2 === 0);
    for (const s of [-1, 1]) {
      const r = Math.random();
      let kind;
      if (isBuilding) {
        kind = r < 0.15 ? 4 : 0;
      } else {
        kind = r < 0.55 ? 1 : r < 0.8 ? 2 : 3;
      }
      this.side.push({
        s, p,
        kind,
        h: kind === 0 ? 170 + Math.random() * 80 : 180,
        ci: Math.floor(Math.random() * 4),
        seed: Math.floor(Math.random() * 9),
      });
    }
  }

  spawnItem() {
    const lanes = [0, 1, 2].sort(() => Math.random() - 0.5);
    const mk = (lane, type) => ({ lane, type, p: 0, alive: true });
    if (Math.random() < this.d.double) this.items.push(mk(lanes[0], 'obs'), mk(lanes[1], 'obs'));
    else this.items.push(mk(lanes[0], Math.random() < 0.6 ? 'obs' : 'book'));
  }

  // Kembalikan daftar item ('obs' | 'book') yang bertabrakan dengan MC di jalur tertentu.
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
    this.sideDist += speed * dt;
    if (this.sideDist >= this.sideStep) { this.sideDist -= this.sideStep; this.spawnSide(0); }
    this.side.forEach((o) => { o.p += speed * dt; });
    this.side = this.side.filter((o) => o.p < 1.25);
    this.itemTimer -= dt;
    if (this.itemTimer <= 0) { this.itemTimer = this.d.spawn * (0.8 + Math.random() * 0.5); this.spawnItem(); }
    this.items.forEach((o) => { o.p += speed * dt; });
    this.items = this.items.filter((o) => o.alive && o.p < 1.15);
    this.draw();
  }

  draw() {
    const g = this.g;
    g.clear();
    g.fillStyle(0x8fd3f8).fillRect(0, 0, W, HY);
    g.fillStyle(0x3b6fd8, 0.55);
    SKYLINE.forEach(([x, w, h]) => g.fillRect(x, HY - h, w, h));
    g.fillStyle(0x2f5aa6).fillRect(0, HY, W, 720 - HY);
    const e = (m, q) => laneW(q) * m;
    for (const s of [-1, 1]) {
      poly(g, 0xc7d7ee, [[CX + s * e(2.45, 0), HY], [CX + s * e(1.5, 0), HY], [CX + s * e(1.5, 1), BY], [CX + s * e(2.45, 1), BY]]);
    }
    poly(g, 0x1a2b57, [[CX - e(1.5, 0), HY], [CX + e(1.5, 0), HY], [CX + e(1.5, 1), BY], [CX - e(1.5, 1), BY]]);
    g.lineStyle(5, COLOR.yellow, 0.9);
    for (const s of [-1, 1]) g.lineBetween(CX + s * e(1.5, 0), HY, CX + s * e(1.5, 1), BY);

    g.fillStyle(COLOR.white, 0.9);
    for (let k = -1; k < 11; k++) {
      const p0 = k * 0.1 + this.off, p1 = p0 + 0.045;
      if (p1 <= 0.02) continue;
      const q0 = Math.max(0, p0) ** 2, q1 = p1 ** 2;
      for (const b of [-0.5, 0.5]) {
        const w0 = laneW(q0) * 0.05, w1 = laneW(q1) * 0.05, x0 = CX + b * laneW(q0), x1 = CX + b * laneW(q1);
        poly(g, COLOR.white, [[x0 - w0, lineY(q0)], [x0 + w0, lineY(q0)], [x1 + w1, lineY(q1)], [x1 - w1, lineY(q1)]], 0.9);
      }
    }
    [...this.side].sort((a, b) => a.p - b.p).forEach((o) => this.drawSide(g, o));
    [...this.items].sort((a, b) => a.p - b.p).forEach((o) => this.drawItem(g, o));
  }

  drawSide(g, o) {
    const q = o.p * o.p, y = lineY(q), s = scaleAt(q), lw = laneW(q);
    if (o.kind === 0) {
      const w = 190 * s, h = o.h * s, x0 = CX + o.s * (2.5 * lw + w / 2) - w / 2;
      g.fillStyle(BUILD[o.ci]).fillRect(x0, y - h, w, h);
      g.fillStyle(COLOR.navy).fillRect(x0 - 4 * s, y - h - 8 * s, w + 8 * s, 10 * s);
      const rows = Math.max(2, Math.floor(o.h / 52)), rh = h / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) {
        const lit = (r * 7 + c * 3 + o.seed) % 4 !== 0;
        g.fillStyle(lit ? COLOR.yellow : COLOR.navy, lit ? 0.95 : 0.55).fillRect(x0 + w * (0.13 + c * 0.29), y - h + (r + 0.35) * rh, w * 0.17, rh * 0.42);
      }
    } else if (o.kind === 4) { // gedung sekolah
      const w = 300 * s, h = 150 * s, x0 = CX + o.s * (2.5 * lw + w / 2) - w / 2;
      g.fillStyle(0xf4f8ff).fillRect(x0, y - h, w, h);
      g.fillStyle(COLOR.navy).fillTriangle(x0 - 6 * s, y - h, x0 + w + 6 * s, y - h, x0 + w / 2, y - h - 60 * s);
      g.fillStyle(COLOR.sky);
      for (let c = 0; c < 4; c++) g.fillRect(x0 + w * (0.07 + c * 0.235) + (c > 1 ? w * 0.1 : 0) - (c < 2 ? 0 : 0), y - h + 52 * s, w * 0.12, 36 * s);
      g.fillStyle(COLOR.yellow).fillRect(x0 + w * 0.43, y - 60 * s, w * 0.14, 60 * s);
      g.fillStyle(COLOR.royal).fillRect(x0 + w * 0.25, y - h + 14 * s, w * 0.5, 26 * s);
      g.fillStyle(COLOR.yellow).fillRect(x0 + w * 0.29, y - h + 24 * s, w * 0.42, 6 * s);
      g.lineStyle(3 * s, 0x94a3b8).lineBetween(x0 + w / 2, y - h - 60 * s, x0 + w / 2, y - h - 100 * s);
      g.fillStyle(COLOR.red).fillRect(x0 + w / 2, y - h - 100 * s, 28 * s, 10 * s);
      g.fillStyle(COLOR.white).fillRect(x0 + w / 2, y - h - 90 * s, 28 * s, 10 * s);
    } else if (o.kind === 1) { // pohon
      const x = CX + o.s * 2.05 * lw;
      g.fillStyle(0x6b4423).fillRect(x - 7 * s, y - 70 * s, 14 * s, 70 * s);
      g.fillStyle(0x2f9e5b).fillCircle(x, y - 100 * s, 40 * s).fillCircle(x - 26 * s, y - 82 * s, 30 * s).fillCircle(x + 26 * s, y - 82 * s, 30 * s);
      g.fillStyle(0x3fb76d).fillCircle(x - 8 * s, y - 112 * s, 22 * s);
    } else if (o.kind === 2) { // papan informasi
      const x = CX + o.s * 1.95 * lw;
      g.fillStyle(0x94a3b8).fillRect(x - 3 * s, y - 110 * s, 6 * s, 110 * s);
      g.fillStyle(COLOR.royal).fillRoundedRect(x - 50 * s, y - 150 * s, 100 * s, 64 * s, 6 * s);
      g.lineStyle(3 * s, COLOR.white).strokeRoundedRect(x - 50 * s, y - 150 * s, 100 * s, 64 * s, 6 * s);
      g.fillStyle(COLOR.yellow).fillRect(x - 40 * s, y - 140 * s, 80 * s, 10 * s);
      g.fillStyle(COLOR.white).fillRect(x - 40 * s, y - 122 * s, 70 * s, 6 * s).fillRect(x - 40 * s, y - 108 * s, 50 * s, 6 * s);
    } else { // lampu jalan
      const x = CX + o.s * 1.62 * lw;
      g.fillStyle(0x1e293b).fillRect(x - 4 * s, y - 150 * s, 8 * s, 150 * s);
      g.fillStyle(COLOR.yellow).fillRect(x - 15 * s, y - 160 * s, 30 * s, 11 * s);
    }
  }

  drawItem(g, o) {
    const q = o.p * o.p, y = lineY(q), s = scaleAt(q), x = laneX(o.lane, q);
    g.fillStyle(0x000000, 0.25).fillEllipse(x, y, 80 * s, 14 * s);
    if (o.type === 'obs') {
      const w = 86 * s, h = 62 * s;
      g.fillStyle(COLOR.red).fillRoundedRect(x - w / 2, y - h, w, h, 6 * s);
      g.fillStyle(COLOR.white).fillRect(x - w * 0.28, y - h * 0.85, w * 0.16, h * 0.7).fillRect(x + w * 0.12, y - h * 0.85, w * 0.16, h * 0.7);
      g.fillStyle(COLOR.yellow).fillRect(x - w / 2, y - h, w, 8 * s);
    } else {
      const w = 64 * s, h = 46 * s, yy = y - (28 + 7 * Math.sin(this.time * 6 + o.lane)) * s;
      g.fillStyle(COLOR.royal).fillRoundedRect(x - w / 2, yy - h, w, h, 5 * s);
      g.fillStyle(COLOR.white).fillRect(x - w / 2 + 6 * s, yy - h + 6 * s, w - 12 * s, h - 14 * s);
      g.fillStyle(COLOR.yellow).fillRect(x + w * 0.2, yy - h, 8 * s, h * 0.7);
    }
  }
}
