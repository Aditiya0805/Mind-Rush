import { COLOR, FONT } from '../config.js';
import { Sfx } from '../audio/Sfx.js';

export function text(scene, x, y, str, size = 24, color = '#ffffff', style = {}, origin = [0.5, 0.5]) {
  return scene.add.text(x, y, str, { fontFamily: FONT, fontSize: size + 'px', fontStyle: 'bold', color, resolution: 2, ...style })
    .setOrigin(origin[0], origin[1]);
}

// Tombol: container interaktif dengan hover, klik, dan kontrol lock/unlock/paint/setLabel.
export function button(scene, x, y, w, h, label, onClick, o = {}) {
  const fill = o.fill ?? COLOR.royal;
  const c = scene.add.container(x, y).setSize(w, h);
  const g = scene.add.graphics();
  const t = text(scene, 0, 0, label, o.size ?? 26, '#ffffff', { wordWrap: { width: w - 28 }, align: 'center' });
  let cur = fill, locked = false;
  const draw = (f, off = 0) => {
    g.clear();
    g.fillStyle(COLOR.ink, 0.55).fillRoundedRect(-w / 2, -h / 2 + 6, w, h, 14);
    g.fillStyle(f).fillRoundedRect(-w / 2, -h / 2 + off, w, h, 14);
    g.lineStyle(3, COLOR.white, 0.9).strokeRoundedRect(-w / 2, -h / 2 + off, w, h, 14);
    t.y = off;
  };
  draw(fill);
  c.add([g, t]);
  c.setInteractive({ useHandCursor: true });
  c.on('pointerover', () => { if (!locked) { draw(o.hover ?? COLOR.sky); t.setColor('#0b1f4d'); } });
  c.on('pointerout', () => { if (!locked) { draw(cur); t.setColor('#ffffff'); } });
  c.on('pointerdown', () => { if (!locked) draw(o.hover ?? COLOR.sky, 4); });
  c.on('pointerup', () => { if (!locked) { Sfx.play('click'); onClick(); } });
  c.paint = (f, tc = '#ffffff') => { cur = f; draw(f); t.setColor(tc); };
  c.setLabel = (s) => t.setText(s);
  c.lock = () => { locked = true; c.disableInteractive(); };
  c.unlock = () => { locked = false; c.setInteractive({ useHandCursor: true }); c.paint(fill); };
  return c;
}
