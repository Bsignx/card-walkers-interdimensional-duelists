import { createCharacterAnimations } from '../character/createAnimations'
import Phaser from 'phaser'
import { initializeGrid } from '../grid/initializeGrid'
import { DIMENSIONS, GRID_DIMENSIONS } from '../data/dimensions'

const characterSkills = [
  {
    name: 'Fireball',
    description: 'Launches a fireball at the enemy.',
    damage: 20
    // * Other properties or effects here...
  },
  {
    name: 'Heal',
    description: 'Heals the character.',
    damage: -20
  }
  // * Add more skills as needed...
]

const character = {
  name: 'Hero',
  class: 'Warrior',
  health: 100,
  skills: characterSkills
  // * Other properties or effects here...
}

export class MainScene extends Phaser.Scene {
  character!: Phaser.GameObjects.Sprite
  characterOffsetX = 104
  characterOffsetY = 104
  diceRollButton!: Phaser.GameObjects.Text
  cellWidth = 32
  cellHeight = 32
  rows = 7
  columns = 7
  isMoving = false
  mana = 100
  manaCost = 1

  constructor () {
    super({ key: 'MainScene' })
  }

  preload () {
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
  }

  create () {
    // * Retrieve the character's name from localStorage
    const characterName = localStorage.getItem('characterName')

    // * Draw the grid.
    const grid = initializeGrid({
      scene: this,
      cellHeight: this.cellHeight,
      cellWidth: this.cellWidth,
      columns: this.columns,
      rows: this.rows
    })

    // * Enable physics for the grid
    this.physics.world.enable(grid)

    // * Create a coliddable character sprite and set its initial position (e.g., grid cell 0,0).
    this.character = this.physics.add.sprite(this.characterOffsetX, this.characterOffsetY, 'character-right')

    // * Set the character's scale.
    this.character.setScale(0.4, 0.4)

    // * Create colliders for the grid edges to prevent the character from moving outside the grid.
    this.physics.world.setBounds(75, 75, this.columns * this.cellWidth, this.rows * this.cellHeight)

    // * Display the character's skills.
    const skillText = this.add.text(500, 100, '', { color: 'black', fontSize: '16px', fontStyle: 'bold', backgroundColor: '#fff' })
    skillText.setText('Skills:\n' + character.skills.map(skill => skill.name).join('\n'))

    // * Display the character's name, class and health.
    const nameText = this.add.text(500, 20, '', { color: 'black', fontSize: '16px', fontStyle: 'bold', backgroundColor: '#fff' })
    nameText.setText(`Name: ${characterName ?? character.name}\nClass: ${character.class}\nHealth: ${character.health}`)

    // * Example: Allow the player to select a skill by clicking on it.
    skillText.setInteractive()
    skillText.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // * Get the selected skill based on the pointer's position.
      const calculateSkillIndex = (pointer: Phaser.Input.Pointer) => {
        const skillIndex = Math.floor((pointer.y - skillText.y) / 20)
        return skillIndex
      }

      const skillIndex = calculateSkillIndex(pointer)
      const selectedSkill = character.skills[skillIndex]

      // * Perform actions based on the selected skill, e.g., target an enemy and apply the skill's effects.
      console.log(`Selected skill: ${selectedSkill.name}`)
    })

    // * Define animations for different directions.
    createCharacterAnimations(this)

    // * Enable keyboard input.
    this?.input?.keyboard?.createCursorKeys()

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const { x, y } = this.character

      switch (event.code) {
        case 'ArrowUp':
          if (this.isMoving) return
          this.isMoving = true
          this.moveCharacterAndAnimate(x, y - this.cellHeight, 'walk-up')
          break
        case 'ArrowDown':
          if (this.isMoving) return
          this.isMoving = true
          this.moveCharacterAndAnimate(x, y + this.cellHeight, 'walk-down')
          break
        case 'ArrowLeft':
          if (this.isMoving) return
          this.isMoving = true
          this.moveCharacterAndAnimate(x - this.cellWidth, y, 'walk-left')
          break
        case 'ArrowRight':
          if (this.isMoving) return
          this.isMoving = true
          this.moveCharacterAndAnimate(x + this.cellWidth, y, 'walk-right')
          break
      }
    })

    // * Show the character mana
    const manaText = this.add.text(350, 150, '', { color: 'black', fontSize: '16px', fontStyle: 'bold', backgroundColor: '#fff' })
    manaText.setText(`Mana: ${this.mana}`)

    // * Show the current dimension name
    const dimensionName = this.add.text(200, 50, '', { fontSize: '32px', fontFamily: 'Arial', fontStyle: 'bold' })

    // * Create a "Move" button
    const moveButton = this.add.text(350, 250, 'Move', {
      fontSize: '24px',
      backgroundColor: '#00FF00',
      color: '#000000',
      padding: { x: 20, y: 10 }
    })

    // * Make the button clickable
    moveButton.setInteractive()

    // * Define a function to handle the button click
    moveButton.on('pointerdown', () => {
      // * Check if the character has enough MANA to move
      if (this.mana >= this.manaCost) {
        // * Deduct the MANA cost from the character's MANA attribute
        this.mana -= this.manaCost

        // * Update the MANA text
        manaText.setText(`Mana: ${this.mana}`)

        // * Randomly move the character to a new grid position
        const newX = (Phaser.Math.Between(0, this.rows - 1) * this.cellWidth) + this.characterOffsetX
        const newY = (Phaser.Math.Between(0, this.columns - 1) * this.cellHeight) + this.characterOffsetY

        // * teleport with fade effect the character to the new position
        this.tweens.add({
          targets: this.character,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            // * Teleport the character to the new position
            this.character.setPosition(newX, newY)
            // * Use another tween to fade the character back in
            this.tweens.add({
              targets: this.character,
              alpha: 1, // * Set alpha back to 1 for a fade-in effect
              duration: 500 // * Duration of the fade effect in milliseconds
            })
          }
        })

        // * Calculate the current row and column of the character
        const currentRow = Math.floor((newY - this.characterOffsetY) / this.cellHeight)
        const currentColumn = Math.floor((newX - this.characterOffsetX) / this.cellWidth)
        const currentDimensionNumber = GRID_DIMENSIONS[currentRow][currentColumn]

        // * Persist the current dimension in localStorage
        localStorage.setItem('currentDimension', currentDimensionNumber.toString())

        // * add a button to navigate to the dimension scene
        const dimensionButton = this.add.text(350, 200, 'Go to Dimension', {
          fontSize: '24px',
          backgroundColor: 'blue',
          color: 'white',
          padding: { x: 20, y: 10 }
        })

        // * Make the button clickable
        dimensionButton.setInteractive()

        // * Define a function to handle the button click
        dimensionButton.on('pointerdown', () => {
          // * Navigate to the Dimension scene
          this.scene.start('DimensionScene')
        })

        // * show the current dimension name
        const currentDimension = DIMENSIONS[currentDimensionNumber - 1]
        dimensionName.setText(`${currentDimension.id}: ${currentDimension.name}`)
        dimensionName.setColor(currentDimension.color)
      } else {
        // * Display a message indicating the character doesn't have enough MANA
        console.log('Not enough MANA to move.')
      }
    })
  }

  moveCharacterAndAnimate (
    newX: number,
    newY: number,
    animationKey: string
  ) {
    if (!this.physics.world.bounds.contains(newX, newY)) {
      // * Character is trying to move outside the grid, prevent movement.
      this.isMoving = false
      return
    }

    this.character.anims.play(animationKey, true)

    this.tweens.add({
      targets: this.character,
      x: newX,
      y: newY,
      duration: 500,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false
        this.character.anims.stop()
      }
    })
  }
}
