import Phaser from 'phaser'

import { MainScene } from './scenes/main-scene'
import { StartScene } from './scenes/start-scene'
import { RegistrationScene } from './scenes/registration-scene';

import './style.css'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 670,
  height: 480,
  parent: document.getElementById('game') as HTMLElement,
  canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  dom: {
    createContainer: true,
  },
  scene: [StartScene, RegistrationScene, MainScene],
}

new Phaser.Game(config)
