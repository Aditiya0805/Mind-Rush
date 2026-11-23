import Phaser from 'phaser';
import { COLOR, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';

const BODY = [
  'MIND RUSH adalah game edukasi bertema SDG 4: Pendidikan Berkualitas.',
  'Kamu pelajar yang dikejar guru. Jawab kuis dengan cepat dan benar agar guru menjauh.',
  'Jawaban salah atau waktu habis mengurangi nyawa dan membuat guru mendekat.',
  'Hindari barikade merah, ambil buku untuk bonus 10 poin.',
];
const KEYS = ['A / Panah Kiri: pindah jalur kiri', 'D / Panah Kanan: pindah jalur kanan', 'Mouse: pilih jawaban', 'Esc: jeda permainan'];

export default class AboutScene extends Phaser.Scene {
  constructor() { super('AboutScene'); }
  create() {
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.85);
    text(this, 640, 70, 'About', 46);
    text(this, 640, 220, BODY.join('\n\n'), 24, '#ffffff', { align: 'center', wordWrap: { width: 900 }, lineSpacing: 4 });
    text(this, 640, 470, 'Kontrol', 26, hex(COLOR.yellow));
    text(this, 640, 550, KEYS.join('\n'), 22, hex(COLOR.sky), { align: 'center', lineSpacing: 8 });
    button(this, 150, 650, 220, 56, 'Kembali', () => this.scene.start('MenuScene'), { fill: COLOR.navy, size: 22 });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
