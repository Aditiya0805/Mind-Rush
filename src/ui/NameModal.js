import { COLOR, FONT, hex } from '../config.js';
import { text, button } from './UI.js';
import { Storage } from '../systems/Storage.js';
import { Sfx } from '../audio/Sfx.js';

export function showNameModal(scene, onSave) {
  let name = Storage.getPlayerName();
  const c = scene.add.container(640, 360).setDepth(200);

  // Overlay latar belakang yang memblokir klik di belakang
  const bg = scene.add.rectangle(0, 0, 1280, 720, 0x07142f, 0.8).setInteractive();

  // Card dialog
  const boxW = 560, boxH = 330;
  const card = scene.add.graphics();
  card.fillStyle(COLOR.navy, 0.98).fillRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 20);
  card.lineStyle(3, COLOR.sky, 0.95).strokeRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 20);

  const title = text(scene, 0, -112, 'NAMA KARAKTER', 30, hex(COLOR.yellow));
  const desc = text(scene, 0, -66, 'Ketik nama karaktermu di keyboard (maks 12 huruf):', 17, '#ffffff');

  // Input display
  const inG = scene.add.graphics();
  const inW = 400, inH = 58;
  inG.fillStyle(COLOR.ink, 0.95).fillRoundedRect(-inW / 2, -29, inW, inH, 12);
  inG.lineStyle(2.5, COLOR.sky, 0.9).strokeRoundedRect(-inW / 2, -29, inW, inH, 12);

  const displayT = text(scene, 0, 0, '', 26, '#ffffff');
  let cursorVisible = true;
  const cursorTimer = scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: () => {
      cursorVisible = !cursorVisible;
      displayT.setText(name + (cursorVisible ? '|' : ' '));
    },
  });
  displayT.setText(name + '|');

  const close = (saved) => {
    cursorTimer.remove();
    scene.input.keyboard.off('keydown', keyHandler);
    c.destroy();
    if (saved && onSave) onSave(name);
  };

  const keyHandler = (event) => {
    if (event.key === 'Backspace') {
      name = name.slice(0, -1);
      displayT.setText(name + (cursorVisible ? '|' : ' '));
    } else if (event.key === 'Enter') {
      if (name.trim()) {
        Storage.setPlayerName(name);
        Sfx.play('click');
        close(true);
      }
    } else if (event.key === 'Escape') {
      close(false);
    } else if (event.key.length === 1 && name.length < 12) {
      if (/[a-zA-Z0-9 _-]/.test(event.key)) {
        name += event.key;
        displayT.setText(name + (cursorVisible ? '|' : ' '));
      }
    }
  };

  scene.input.keyboard.on('keydown', keyHandler);

  const saveBtn = button(scene, 100, 95, 180, 52, 'Simpan', () => {
    if (name.trim()) {
      Storage.setPlayerName(name);
      close(true);
    }
  }, { size: 20, fill: COLOR.royal });

  const cancelBtn = button(scene, -100, 95, 180, 52, 'Batal', () => {
    close(false);
  }, { size: 20, fill: COLOR.navy });

  c.add([bg, card, title, desc, inG, displayT, saveBtn, cancelBtn]);
  return c;
}
