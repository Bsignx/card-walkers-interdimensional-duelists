import Phaser from 'phaser'

import { MainScene } from './scenes/main-scene'
import { StartScene } from './scenes/start-scene'
import { RegistrationScene } from './scenes/registration-scene'

import './style.css'
import { DimensionScene } from './scenes/dimension-scene'
import { BattleScene } from './scenes/battle-scene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: document.getElementById('game') as HTMLElement,
  canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [DimensionScene, MainScene, StartScene, RegistrationScene, BattleScene],
  scale: {
    zoom: 2
  }
}

new Phaser.Game(config)
