import './style.css'
import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
  }

  preload() {
    this.load.image('bg', 'bg.png')
  }

  create() {
    // background
    this.add.image(0, 0, 'bg').setOrigin(0, 0)

    // Create a graphics object to draw the grid lines.
    var graphics = this.add.graphics();





    // Define the grid parameters (rows, columns, cell width, cell height).
    var rows = 10;
    var columns = 14;
    var cellWidth = 48;
    var cellHeight = 48;


    // Set the line style for grid lines (color, thickness).
    graphics.lineStyle(1, 0x000000, 0.5);


    // Draw horizontal grid lines.
    for (var i = 0; i <= rows; i++) {
      graphics.moveTo(0, i * cellHeight);
      graphics.lineTo(columns * cellWidth, i * cellHeight);
    }


    // Draw vertical grid lines.
    for (var j = 0; j <= columns; j++) {
      graphics.moveTo(j * cellWidth, 0);
      graphics.lineTo(j * cellWidth, rows * cellHeight);
    }

    graphics.closePath();
    graphics.strokePath();

  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,

  width: 670,
  height: 480,
  canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  scene: [GameScene]
}


const game = new Phaser.Game(config)