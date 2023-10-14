import Phaser from 'phaser'
import { DIMENSIONS } from '../data/dimensions'

export class DimensionScene extends Phaser.Scene {
  constructor () {
    super({ key: 'DimensionScene' })
  }

  preload () {

  }

  create () {
    // show the current dimension name
    const currentDimensionNumber = localStorage.getItem('currentDimension') as unknown as number

    const currentDimension = DIMENSIONS[currentDimensionNumber - 1]

    // show the current dimension name
    this.add.text(200, 200, currentDimension.name, { fontSize: '32px', color: currentDimension.color, fontFamily: 'Arial', fontStyle: 'bold' })

    // create a button to go back to the main scene
    const backButton = this.add.text(200, 300, 'Back', { fontSize: '32px', color: '#FFFFFF', fontFamily: 'Arial', fontStyle: 'bold' })
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      this.scene.start('MainScene')
    })
  }
}
