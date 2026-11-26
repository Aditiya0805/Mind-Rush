import { COLOR, hex } from '../config.js';
import { text, button } from './UI.js';
import { Storage } from '../systems/Storage.js';
import { Sfx } from '../audio/Sfx.js';

export function showNameModal(scene, onSave) {
  let name = Storage.getPlayerName();
  let gender = Storage.getGender();
  scene.isModalOpen = true;

  const c = scene.add.container(640, 360).setDepth(200);

  // Overlay latar belakang yang memblokir klik di belakang
  const bg = scene.add.rectangle(0, 0, 1280, 720, 0x07142f, 0.82).setInteractive();

  // Card dialog
  const boxW = 560, boxH = 380;
  const card = scene.add.graphics();
  card.fillStyle(COLOR.navy, 0.98).fillRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 20);
  card.lineStyle(3, COLOR.sky, 0.95).strokeRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 20);

  const title = text(scene, 0, -142, 'KUSTOMISASI KARAKTER', 28, hex(COLOR.yellow));

  // Pemilih Karakter Pria / Wanita
  const maleBtn = button(scene, -95, -82, 175, 44, '👦 Pria', () => {
    gender = 'male';
    refreshGenderBtns();
  }, { size: 18 });

  const femaleBtn = button(scene, 95, -82, 175, 44, '👧 Wanita', () => {
    gender = 'female';
    refreshGenderBtns();
  }, { size: 18 });

  const refreshGenderBtns = () => {
    maleBtn.paint(gender === 'male' ? COLOR.royal : COLOR.ink);
    femaleBtn.paint(gender === 'female' ? 0xec4899 : COLOR.ink);
  };
  refreshGenderBtns();

  const desc = text(scene, 0, -32, 'Ketik nama karaktermu di keyboard (maks 12 huruf):', 16, '#ffffff');

  // Input display
  const inG = scene.add.graphics();
  const inW = 400, inH = 56;
  inG.fillStyle(COLOR.ink, 0.95).fillRoundedRect(-inW / 2, -10, inW, inH, 12);
  inG.lineStyle(2.5, COLOR.sky, 0.9).strokeRoundedRect(-inW / 2, -10, inW, inH, 12);

  const displayT = text(scene, 0, 18, '', 26, '#ffffff');
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
    scene.isModalOpen = false;
    cursorTimer.remove();
    scene.input.keyboard.off('keydown', keyHandler);
    c.destroy();
    if (saved && onSave) onSave(Storage.getPlayerName(), Storage.getGender());
  };

  const commitAndClose = () => {
    if (!name.trim()) return;
    Storage.setPlayerName(name);
    Storage.setGender(gender);
    close(true);
  };

  const keyHandler = (event) => {
    if (event.key === 'Backspace') {
      name = name.slice(0, -1);
      displayT.setText(name + (cursorVisible ? '|' : ' '));
    } else if (event.key === 'Enter') {
      if (name.trim()) {
        Sfx.play('click');
        commitAndClose();
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

  const saveBtn = button(scene, 100, 118, 180, 52, 'Simpan', commitAndClose, { size: 20, fill: COLOR.royal });
  const cancelBtn = button(scene, -100, 118, 180, 52, 'Batal', () => close(false), { size: 20, fill: COLOR.navy });

  c.add([bg, card, title, maleBtn, femaleBtn, desc, inG, displayT, saveBtn, cancelBtn]);
  return c;
}
