
import { MainScene } from './scenes/main-scene'
import { StartScene } from './scenes/start-scene'
import './style.css'
import Phaser from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 670,
  height: 480,
  canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  scene: [StartScene, MainScene],

}

new Phaser.Game(config)
