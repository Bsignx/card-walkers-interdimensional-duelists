import Phaser from 'phaser'

export class StartScene extends Phaser.Scene {
  constructor () {
    super({ key: 'StartScene' })
  }

  preload () {
    // Load background image
    this.load.image('start-bg', 'assets/start-bg.jpg')

    // Load background music
    this.load.audio('backgroundMusic', 'assets/les-plaines-de-cania.mp3')
  }

  create () {
    // Get the dimensions of the game's canvas
    const gameWidth = this.game.config.width as number
    const gameHeight = this.game.config.height as number

    // Add a background image or graphic
    const background = this.add.image(0, 0, 'start-bg').setOrigin(0, 0)

    // Scale the background to fit the entire screen
    background.setScale(gameWidth / background.width, gameHeight / background.height)

    // Play background music
    const music = this.sound.add('backgroundMusic', { loop: true }) // Set loop to true for continuous playback
    music.setVolume(0.5)
    music.play()

    // Add a title or logo
    this.add.text(140, 100, 'Card Walkers Interdimensional Duelists', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#000',
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 2,
        stroke: true,
        fill: true
      },
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }).setOrigin(0)

    // Add a play button
    const playButton = this.add.text(300, 300, 'Play', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#0073e6',
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    })

    playButton.setOrigin(0)
    playButton.setInteractive()
    playButton.on('pointerdown', () => {
      // Start the game or transition to the next scene
      this.scene.start('RegistrationScene')
    })

    // Add a continue button
    const continueButton = this.add.text(280, 400, 'Continue', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#0073e6',
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    })

    continueButton.setOrigin(0)
    continueButton.setInteractive()

    continueButton.on('pointerdown', () => {
      // Start the game or transition to the next scene
      this.scene.start('MainScene')
    })
  }
}
