import Phaser from 'phaser'

export class BattleScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BattleScene' })
  }

  create () {
    // * add battle text
    this.add.text(140, 100, 'Battle Scene', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#000'

    }).setOrigin(0)
  }
}
