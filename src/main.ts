import Phaser from 'phaser'

import { MainScene } from './scenes/main-scene'
import { StartScene } from './scenes/start-scene'
import { RegistrationScene } from './scenes/registration-scene';

import './style.css'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 640,
  height: 360,
  parent: document.getElementById('game') as HTMLElement,
  canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [MainScene, StartScene, RegistrationScene],
}

new Phaser.Game(config)
