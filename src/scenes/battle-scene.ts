import Phaser from 'phaser'
import { initializeGrid } from '../grid/initializeGrid'

const monsterCard = {
  name: 'Monster',
  class: 'Monster',
  rarity: 'Common',
  imageId: 'monster-1',
  helth: 10,
  attack: 10,
  defense: 10,
  speed: 10,
  action: 10,
  movement: 10,
  cost: 10,
  description: 'A monster that is very strong and very fast.',
  skills: [
    {
      name: 'Attack',
      description: 'Attack the enemy',
      type: 'Attack',
      damage: 5,
      cost: 5
    },
    {
      name: 'Fireball',
      description: 'Attack the enemy with fire',
      type: 'Attack',
      damage: 10,
      cost: 10
    }
  ]
}

const npcInfo = {
  name: 'Villager',
  role: 'NPC',
  deck: [
    monsterCard
  ]
}

const playerInfo = {
  name: 'Bruno',
  role: 'Player',
  deck: [
    monsterCard,
    { ...monsterCard, name: 'Monster 2', imageId: 'monster-2', description: 'A monster that is scary and mean.' }
  ]
}

export class BattleScene extends Phaser.Scene {
  cellWidth = 32
  cellHeight = 32
  rows = 7
  columns = 7
  turnQueue: any[] = []
  mana: number = 0

  constructor () {
    super({ key: 'BattleScene' })
  }

  preload () {
    this.load.image('card-template', 'assets/card-template.jpg')

    // load monster image for card
    this.load.image('monster-1', 'assets/monster-1.png')
    this.load.image('monster-2', 'assets/monster-2.png')
  }

  create () {
    // * start the battle grid
    const grid = initializeGrid({
      scene: this,
      cellHeight: this.cellHeight,
      cellWidth: this.cellWidth,
      columns: this.columns,
      rows: this.rows
    }).setOrigin(0, 0)

    // * Enable physics for the grid
    this.physics.world.enable(grid)

    const playerDeck = this.add.text(450, 100, 'Player\'s Deck', { fontSize: '16px', color: '#fff' })

    // * card template
    const cardBackground = this.add.image(500, 300, '').setScale(0.4).setAlpha(0)
    // * monster image with fixed size
    const monsterImage = this.add.image(500, 294, '').setAlpha(0).setDepth(1).setDisplaySize(3, 3)
    const cardName = this.add.text(450, 212, '', { fontSize: '12px', color: '#000' })
    const cardDescription = this.add.text(448, 358, '', { fontSize: '8px', color: '#000', wordWrap: { width: 112 } })

    const invokeActionTexts: Phaser.GameObjects.Text[] = []

    function hidePlayerActions () {
      for (const text of invokeActionTexts) {
        text.setAlpha(0)
        text.disableInteractive()
      }
    }

    const showPlayerActions = () => {
      for (const text of invokeActionTexts) {
        // text.setAlpha(1)
        // text.setInteractive()
      }
    }

    const playerInvokedMonsters: any[] = []
    const playerDeckCards: any[] = [...playerInfo.deck]
    let currentPlayer: any = null
    const isPlayerTurn = () => currentPlayer?.role === 'Player'

    const showPlayerDeck = () => {
      playerDeckCards.forEach((card, index) => {
        const playerDeckCard = this.add.text(450, 120 + (index * 30), card.name, { fontSize: '16px', color: '#fff', backgroundColor: 'blue', padding: { x: 10, y: 5 } })
        playerDeckCard.setInteractive()
        const invokeAction = this.add.text(450, 400, '', { fontSize: '16px', color: '#fff', padding: { x: 10, y: 5 } }).setAlpha(0).disableInteractive()
        invokeActionTexts.push(invokeAction)

        // * card click handler
        playerDeckCard.on('pointerdown', () => {
          cardBackground.setTexture('card-template')
          cardBackground.setAlpha(1)
          cardName.setText(card.name)
          cardDescription.setText(card.description)
          monsterImage.setTexture(card.imageId)
          monsterImage.setAlpha(1)
          console.log('click')

          if (isPlayerTurn()) {
            console.log('click 2')
            // * Show card actions
            invokeAction.setText('Invoke Action')
            invokeAction.setAlpha(1)
            invokeAction.setBackgroundColor('green')
            invokeAction.setInteractive()

            // * invoke action click handler
            invokeAction.on('pointerdown', () => {
              console.log('invoke action')
              // * check if the player has enough mana
              if (this.mana >= card.cost) {
                // * invoke the card action
                console.log('invoke action')
                this.mana -= card.cost
                playerMana.setText('Mana: ' + this.mana)

                playerInvokedMonsters.push(card)
                playerDeckCards.splice(index, 1)
                showPlayerDeck()
                console.log({ playerInvokedMonsters, playerDeckCards })
                // * hide the player's deck
                hidePlayerActions()
              } else {
                // * show a message saying that the player doesn't have enough mana
                console.log('not enough mana')
              }
            })
          }
        })
      })
    }

    showPlayerDeck()

    // * show player's mana to use
    const playerMana = this.add.text(450, 500, 'Mana: ' + this.mana, { fontSize: '16px', color: '#fff' })

    // * Show turn order
    const turnOrder = this.add.text(250, 450, '', { fontSize: '16px', color: '#fff' })

    // * Handle with the turn queue
    this.turnQueue = [playerInfo, npcInfo]

    const updateTurn = () => {
      if (!currentPlayer) {
        currentPlayer = this.turnQueue.shift()
      } else {
        this.turnQueue.push(currentPlayer)
        currentPlayer = this.turnQueue.shift()
      }

      turnOrder.setText(currentPlayer.name + '\'s Turn')
    }

    updateTurn()

    // * Create button to end turn
    const endTurnButton = this.add.text(450, 450, 'End Turn', { fontSize: '16px', color: '#fff', backgroundColor: 'red', padding: { x: 10, y: 5 } })
    endTurnButton.setInteractive()
    endTurnButton.on('pointerdown', () => {
      updateTurn()
      handleTurn()
    })

    // * handle with turn actions
    const handleTurn = () => {
      // * check if the current player is the player
      if (currentPlayer.role === 'Player') {
        // * show the player's deck
        console.log('player turn')
        showPlayerActions()
        // * add mana to the player
        this.mana += 10
        playerMana.setText('Mana: ' + this.mana)
      } else {
        // * hide the player's deck
        console.log('npc turn')
        hidePlayerActions()
      }
    }

    handleTurn()
  }
}
