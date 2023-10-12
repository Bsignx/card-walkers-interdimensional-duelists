import Phaser from 'phaser'

export class RegistrationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RegistrationScene' });
    }

    preload() {
        // Load background image
        this.load.image('start-bg', 'assets/start-bg.jpg');

        // Load background music
        this.load.audio('backgroundMusic', 'assets/les-plaines-de-cania.mp3');

    }

    create() {
        // Get the dimensions of the game's canvas
        const gameWidth = this.game.config.width as number;
        const gameHeight = this.game.config.height as number;

        // Add a background image or graphic
        const background = this.add.image(0, 0, 'start-bg').setOrigin(0, 0)

        // Scale the background to fit the entire screen
        background.setScale(gameWidth / background.width, gameHeight / background.height);


        // Play background music
        const music = this.sound.add('backgroundMusic', { loop: true }); // Set loop to true for continuous playback
        music.setVolume(0.3);
        music.play();

        // Create input label
        this.add.text(150, 50, 'Enter your character name', {
            fontSize: '24px',
            color: '#ffffff',
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
                bottom: 10,
            }
        }).setOrigin(0);

        // Create a text input field for the character's name
        const nameInput = this.add.dom(430, 200, 'input', 'background-color: #ffffff; padding: 10px; width: 200px; height: 20px; font: 14px Arial');
        console.log({ nameInput })
        // Set input field properties
        nameInput.setScale(2); // Adjust the size as needed
        nameInput.addListener('keydown');

        // Create a submit button
        const submitButton = this.add.text(350, 300, 'Submit', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#0073e6',
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        });
        submitButton.setOrigin(0.5);

        submitButton.setInteractive();
        submitButton.on('pointerdown', () => {
            // Retrieve the entered character name
            const characterName = (nameInput.node as HTMLInputElement)?.value;
            console.log({ characterName })

            // Handle the character registration and transition to the main game scene
            // Save the character's name to localStorage
            localStorage.setItem('characterName', characterName);

            this.scene.start('MainScene'); // Replace 'MainGame' with your actual game scene key
        });

    }
}