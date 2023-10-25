import Phaser from 'phaser'
// import { DIMENSIONS } from '../data/dimensions'
import { createCharacterAnimations } from '../character/createAnimations'

export class DimensionScene extends Phaser.Scene {
  character!: Phaser.Physics.Arcade.Sprite
  characterOffsetX = 400
  characterOffsetY = 400
  cellWidth = 32
  cellHeight = 32

  constructor () {
    super({ key: 'DimensionScene' })
  }

  preload () {
    this.load.image('tile-test', 'assets/tile-test.png')
    this.load.tilemapTiledJSON('dimension', 'assets/tile-test.json')

    this.load.spritesheet('character-right', 'assets/character-right.png', {
      frameWidth: 48, // * Width of a single frame in pixels
      frameHeight: 64 // * Height of a single frame in pixels

    })
    this.load.spritesheet('character-left', 'assets/character-left.png', {
      frameWidth: 48, // * Width of a single frame in pixels
      frameHeight: 64 // * Height of a single frame in pixels

    })
    this.load.spritesheet('character-up', 'assets/character-up.png', {
      frameWidth: 48, // * Width of a single frame in pixels
      frameHeight: 64 // * Height of a single frame in pixels

    })
    this.load.spritesheet('character-down', 'assets/character-down.png', {
      frameWidth: 48, // * Width of a single frame in pixels
      frameHeight: 64 // * Height of a single frame in pixels

    })

    // add npc
    this.load.spritesheet('npc', 'assets/npc-1.png', {
      frameWidth: 48, // * Width of a single frame in pixels
      frameHeight: 64 // * Height of a single frame in pixels
    })
  }

  create () {
    // * create the tilemap
    const map = this.make.tilemap({ key: 'dimension' })
    const tileset = map.addTilesetImage('tile-test') as Phaser.Tilemaps.Tileset

    const seaLayer = map.createLayer('sea', tileset) as Phaser.Tilemaps.TilemapLayer
    map.createLayer('ground', tileset)
    const spritesLayer = map.createLayer('sprites', tileset) as Phaser.Tilemaps.TilemapLayer

    seaLayer.setCollisionByProperty({ collide: true })
    spritesLayer.setCollisionByProperty({ collide: true })

    // * Create a coliddable character sprite and set its initial position (e.g., grid cell 0,0).
    this.character = this.physics.add.sprite(this.characterOffsetX, this.characterOffsetY, 'character-right')

    // * Set the character's scale.
    this.character.setScale(0.5, 0.5)

    // * Enable physics for the character.
    this.physics.world.enable(this.character)

    this.physics.add.collider(this.character, seaLayer)
    this.physics.add.collider(this.character, spritesLayer)

    this.cameras.main.startFollow(this.character, true, 0.05, 0.05)

    // * Set the character's initial animation.
    createCharacterAnimations(this)

    // * Move while animating the character using the keyboard, and stop the animation when the key is released.
    // * Enable keyboard input.
    const cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys

    // * Define a character movement speed.
    const moveSpeed = 150

    // * Function to update character velocity based on pressed keys.
    const updateCharacterVelocity = () => {
      if (cursors.right.isDown) {
        console.log('right')
        this.character.anims.play('walk-right', true)
        this.character.setVelocity(moveSpeed, 0)
      } else if (cursors.left.isDown) {
        console.log('left')
        this.character.anims.play('walk-left', true)
        this.character.setVelocity(-moveSpeed, 0)
      } else if (cursors.up.isDown) {
        console.log('up')
        this.character.anims.play('walk-up', true)
        this.character.setVelocity(0, -moveSpeed)
      } else if (cursors.down.isDown) {
        console.log('down')
        this.character.anims.play('walk-down', true)
        this.character.setVelocity(0, moveSpeed)
      } else {
        this.character.anims.stop()
        this.character.setVelocity(0, 0)
      }
    }

    // * Call updateCharacterVelocity inside the update function
    this.update = () => {
      updateCharacterVelocity()
    }

    // * add npc
    const npc = this.physics.add.sprite(300, 350, 'npc')

    this.physics.world.enable(npc)

    npc.setScale(0.8, 0.8)
    npc.setInteractive()

    // * Create a dialog system
    const dialogues = [
      {
        text: 'Hello there! What can I do for you?',
        choices: [
          { label: 'Ask for directions', action: 'directions' },
          { label: 'Battle', action: 'battle' }
        ]
      },
      {
        text: 'Great! I can help with that. Which way do you want to go?',
        choices: [
          { label: 'Left', action: 'goLeft' },
          { label: 'Right', action: 'goRight' }
        ]
      },
      {
        text: 'Cool!'
      },
      {
        text: 'You can go left.'
      },
      {
        text: 'You can go right.'
      },
      {
        text: 'Let\'s battle! I\'ll go easy on you.'
      }
      // * Add more dialogues with choices as needed.
    ]

    let currentDialogueIndex = 0

    // * create a white rectangle behind the text and only show it when the npc is clicked
    const dialogueBox = this.add.rectangle(300, 350 - 75, 200, 100, 0xFFFFFF)
    dialogueBox.setOrigin(0.5)
    dialogueBox.setAlpha(0)

    const dialogueText = this.add.text(300, 350 - 100, '', {
      font: '12px Arial',
      color: '#000',
      wordWrap: { width: 200 }
    })
    dialogueText.setOrigin(0.5)

    const choiceText1 = this.add.text(210, 350 - 75, '', {
      font: '10px Arial',
      color: '#000',
      wordWrap: { width: 200 }
    })

    const choiceText2 = this.add.text(210, 350 - 50, '', {
      font: '10px Arial',
      color: '#000',
      wordWrap: { width: 200 }
    })

    const choices = [choiceText1, choiceText2]

    const updateDialogue = (
      isFirstInteraction: boolean = false
    ) => {
      if (isFirstInteraction) {
        currentDialogueIndex = 0
      }

      dialogueBox.setAlpha(1)
      const dialogue = dialogues[currentDialogueIndex]

      dialogueText.setText(dialogue.text)

      // * Check if there are choices
      if (dialogue.choices != null) {
        dialogue.choices.forEach((choice, index) => {
          // * Handle user choice selection
          choices[index].setText(choice.label)
          choices[index].setInteractive()

          choices[index].on('pointerdown', () => {
            handleChoiceSelection(choice.action)
          })
        })
      } else {
        // * Hide the choices
        choices.forEach(choice => choice.setText(''))
      }
    }

    const handleChoiceSelection = (action: string) => {
      switch (action) {
        case 'directions':
          // * Handle user's choice to ask for directions
          // * Update the dialogues and NPC's response
          currentDialogueIndex = 1
          break

        case 'quest':
          currentDialogueIndex = 2
          break

        case 'goLeft':
          currentDialogueIndex = 3
          break

        case 'goRight':
          currentDialogueIndex = 4
          break
        case 'battle':
          // * open battle scene after 3 seconds
          setTimeout(() => { this.scene.start('BattleScene') }, 3000)

          currentDialogueIndex = 5
          break

        // * Add more cases to handle other choices and actions.
      }

      updateDialogue()
    }

    npc.addListener('pointerdown', () => {
      updateDialogue(true)
      currentDialogueIndex++

      // * close the dialogue box when the last dialogue is shown
      if (currentDialogueIndex > dialogues.length) {
        dialogueBox.setAlpha(0)
        dialogueText.setText('')
        currentDialogueIndex = 0
      }
    })

    // // * show the current dimension name
    // const currentDimensionNumber = localStorage.getItem('currentDimension') as unknown as number

    // const currentDimension = DIMENSIONS[currentDimensionNumber - 1]

    // // * show the current dimension name
    // this.add.text(200, 200, currentDimension.name, { fontSize: '32px', color: currentDimension.color, fontFamily: 'Arial', fontStyle: 'bold' })

    // // * create a button to go back to the main scene
    // const backButton = this.add.text(200, 300, 'Back', { fontSize: '32px', color: '#FFFFFF', fontFamily: 'Arial', fontStyle: 'bold' })
    // backButton.setInteractive()
    // backButton.on('pointerdown', () => {
    //   this.scene.start('MainScene')
    // })
  }
}
