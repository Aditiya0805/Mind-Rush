import Phaser from 'phaser';
import { COLOR, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';
import { Storage } from '../systems/Storage.js';
import { showNameModal } from '../ui/NameModal.js';
import Student from '../characters/Student.js';
import Teacher from '../characters/Teacher.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    drawCityBackdrop(this);
    const sh = { shadow: { offsetX: 6, offsetY: 6, color: hex(COLOR.royal), fill: true } };
    text(this, 80, 30, 'MIND', 140, '#ffffff', sh, [0, 0]);
    text(this, 80, 160, 'RUSH', 140, hex(COLOR.yellow), sh, [0, 0]);
    text(this, 86, 342, 'THINK FAST. ANSWER SMART.', 26, hex(COLOR.sky), {}, [0, 0]);
    button(this, 260, 440, 340, 64, 'Start Game', () => this.scene.start('LevelScene'));
    button(this, 260, 520, 340, 64, 'Settings', () => this.scene.start('SettingsScene'), { fill: COLOR.navy });
    button(this, 260, 600, 340, 64, 'About', () => this.scene.start('AboutScene'), { fill: COLOR.navy });
    this.student = new Student(this, 930, 580).setScale(1.7);
    this.teacher = new Teacher(this, 1090, 710).setScale(1.9);

    this.nameBtn = button(this, 930, 665, 240, 48, `👤 ${Storage.getPlayerName()} (Ganti)`, () => this.openNameDialog(), { size: 17, fill: COLOR.navy });
    this.student.setInteractive(new Phaser.Geom.Rectangle(-40, -180, 80, 180), Phaser.Geom.Rectangle.Contains).on('pointerup', () => this.openNameDialog());
  }

  openNameDialog() {
    showNameModal(this, (newName) => {
      this.student.setName(newName);
      this.nameBtn.setLabel(`👤 ${newName} (Ganti)`);
    });
  }

  update(_, delta) {
    const dt = delta / 1000;
    this.student.tick(dt, 1.2);
    this.teacher.tick(dt, 1.2);
  }
}
