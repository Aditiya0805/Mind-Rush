import Phaser from 'phaser';
import { COLOR, hex } from '../config.js';
import { text, button } from '../ui/UI.js';
import { drawCityBackdrop } from '../ui/Backdrop.js';

const BODY = [
  'MIND RUSH adalah game edukasi aksi bertema SDG 4: Pendidikan Berkualitas.',
  'Kamu adalah seorang pelajar yang dikejar oleh gurumu yang tegas dan bersemangat, Pak Tono!',
  'Jawab pertanyaan seputar wawasan umum & pendidikan secepat mungkin agar Pak Tono tertinggal jauh.',
  'Hindari barikade bahaya di jalan, dan kumpulkan buku-buku pintar untuk meraih bonus skor serta combo streak!',
];

const CONTROLS = [
  '⬅  ➡  Panah Kiri & Kanan   : Berpindah jalur lari',
  '⬆ / Spasi / W              : Lompat (Tekan 2x di udara untuk SALTO!)',
  '🔄  F                      : Putar hadap karakter (Depan / Belakang)',
  '⌨  A / B / C / D atau 1 - 4 : Memilih jawaban kuis instan',
  '🖱  Klik Mouse               : Alternatif memilih opsi jawaban',
  '⏸  ESC                      : Jeda permainan',
];

export default class AboutScene extends Phaser.Scene {
  constructor() { super('AboutScene'); }
  create() {
    drawCityBackdrop(this);
    this.add.rectangle(640, 360, 1280, 720, COLOR.navy, 0.82);

    // Card frame
    const card = this.add.graphics();
    card.fillStyle(COLOR.navy, 0.95).fillRoundedRect(140, 34, 1000, 582, 20);
    card.lineStyle(2.5, COLOR.sky, 0.9).strokeRoundedRect(140, 34, 1000, 582, 20);

    text(this, 640, 72, 'TENTANG MIND RUSH', 40, hex(COLOR.yellow), { stroke: '#07142f', strokeThickness: 5 });
    text(this, 640, 114, 'SDG 4: Quality Education — Belajar Cepat & Tepat', 18, hex(COLOR.sky));

    text(this, 640, 224, BODY.join('\n\n'), 20, '#ffffff', { align: 'center', wordWrap: { width: 920 }, lineSpacing: 4 });

    // Panel Kontrol
    const kG = this.add.graphics();
    kG.fillStyle(COLOR.ink, 0.75).fillRoundedRect(200, 354, 880, 232, 14);
    kG.lineStyle(2, COLOR.yellow, 0.8).strokeRoundedRect(200, 354, 880, 232, 14);

    text(this, 640, 380, '🎮 PANDUAN KONTROL KEYBOARD', 21, hex(COLOR.yellow));
    text(this, 640, 482, CONTROLS.join('\n'), 19, hex(COLOR.sky), { align: 'left', lineSpacing: 10 });

    button(this, 640, 655, 260, 56, '⬅  Kembali', () => this.scene.start('MenuScene'), { fill: COLOR.navy, size: 22 });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
