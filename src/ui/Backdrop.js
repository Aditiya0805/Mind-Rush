import { W, H, COLOR } from '../config.js';

// Latar siluet kota megah untuk menu dan layar transisi
export function drawCityBackdrop(scene) {
  const g = scene.add.graphics().setDepth(-10);

  // 1. Langit malam berbintang & gradasi cakrawala
  const skyTones = [0x07142f, 0x0b1f4d, 0x143a86, 0x1d4ed8, 0x2563eb];
  const sh = 480 / skyTones.length;
  skyTones.forEach((col, idx) => {
    g.fillStyle(col, 1).fillRect(0, idx * sh, W, sh + 2);
  });

  // Bintang-bintang di langit malam
  let seed = 42;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 65; i++) {
    const sx = rnd() * W, sy = rnd() * 260;
    const r = rnd() > 0.8 ? 2 : 1.2;
    g.fillStyle(0xffffff, 0.4 + rnd() * 0.55).fillCircle(sx, sy, r);
  }

  // Bulan sabit lembut
  g.fillStyle(0xfef08a, 0.85).fillCircle(1120, 110, 38);
  g.fillStyle(0x0b1f4d, 1).fillCircle(1134, 102, 34);

  // 2. Siluet Gedung Jauh (Dark Navy)
  g.fillStyle(0x0a193d, 0.75);
  for (let x = -20; x < W; ) {
    const w = 70 + rnd() * 80, h = 180 + rnd() * 260;
    g.fillRect(x, 620 - h, w, h);
    x += w + 6;
  }

  // 3. Siluet Gedung Tengah dengan Jendela Menyala
  const tones = [0x10306f, 0x143a86, 0x1b449c];
  for (let x = -10; x < W; ) {
    const w = 85 + rnd() * 95, h = 140 + rnd() * 240;
    g.fillStyle(tones[Math.floor(rnd() * tones.length)], 0.95).fillRect(x, 620 - h, w, h);

    // Lampu jendela
    for (let wy = 620 - h + 18; wy < 605; wy += 28) {
      for (let wx = x + 12; wx < x + w - 16; wx += 24) {
        if (rnd() > 0.65) {
          const isWarm = rnd() > 0.3;
          g.fillStyle(isWarm ? COLOR.yellow : COLOR.sky, 0.85).fillRect(wx, wy, 11, 14);
        }
      }
    }

    // Antena atap dengan lampu merah
    if (rnd() > 0.4) {
      g.lineStyle(2, 0x64748b).lineBetween(x + w / 2, 620 - h, x + w / 2, 620 - h - 24);
      g.fillStyle(COLOR.red, 0.95).fillCircle(x + w / 2, 620 - h - 24, 3);
    }

    x += w + 8;
  }

  // 4. Trotoar & Jalan Raya di Bawah
  g.fillStyle(0x475569).fillRect(0, 616, W, 14);
  g.fillStyle(0x0f172a).fillRect(0, 630, W, 90);

  // Marka jalan putus-putus kuning menyala
  g.fillStyle(COLOR.yellow, 0.9);
  for (let x = 30; x < W; x += 110) {
    g.fillRect(x, 672, 60, 6);
  }

  return g;
}
