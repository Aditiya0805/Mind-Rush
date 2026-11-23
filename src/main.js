import Phaser from 'phaser';
import './styles/main.css';
import { W, H } from './config.js';
import MenuScene from './scenes/MenuScene.js';
import LevelScene from './scenes/LevelScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import AboutScene from './scenes/AboutScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#0b1f4d',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [MenuScene, LevelScene, SettingsScene, AboutScene, GameScene, PauseScene, GameOverScene, VictoryScene],
});
