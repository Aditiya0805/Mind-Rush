import { W, H, COLOR } from '../config.js';

// Latar siluet kota untuk menu dan layar akhir (statis, deterministik).
export function drawCityBackdrop(scene) {
  const g = scene.add.graphics().setDepth(-10);
  g.fillStyle(COLOR.navy).fillRect(0, 0, W, H);
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const tones = [0x10306f, 0x143a86, 0x0f2a63];
  for (let x = -20; x < W; ) {
    const w = 80 + rnd() * 90, h = 170 + rnd() * 250;
    g.fillStyle(tones[Math.floor(rnd() * 3)]).fillRect(x, 640 - h, w, h);
    for (let wy = 640 - h + 18; wy < 620; wy += 34)
      for (let wx = x + 12; wx < x + w - 18; wx += 28) {
        if (rnd() > 0.72) g.fillStyle(COLOR.yellow, 0.85).fillRect(wx, wy, 12, 16);
      }
    x += w + 6;
  }
  g.fillStyle(0xc7d7ee).fillRect(0, 640, W, 24);
  g.fillStyle(0x1a2b57).fillRect(0, 664, W, 56);
  g.fillStyle(COLOR.white, 0.8);
  for (let x = 20; x < W; x += 120) g.fillRect(x, 692, 60, 6);
  return g;
}
