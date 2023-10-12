
import Phaser from 'phaser'
import { initializeGrid } from '../helpers/initializeGrid';

const characterSkills = [
    {
        name: 'Fireball',
        description: 'Launches a fireball at the enemy.',
        damage: 20,
        // Other properties or effects here...
    },
    {
        name: 'Heal',
        description: 'Heals the character.',
        damage: -20,
    },
    // Add more skills as needed...
];

const character = {
    name: 'Hero',
    class: 'Warrior',
    health: 100,
    skills: characterSkills,
    // Other properties or effects here...
};

export class MainScene extends Phaser.Scene {
    character: Phaser.GameObjects.Sprite;
    diceRollButton!: Phaser.GameObjects.Text;
    cellWidth = 32;
    cellHeight = 32;
    rows = 15;
    columns = 21;
    isMoving = false;

    constructor() {
        super({ key: 'MainScene' })
        this.character = null!;
    }

    preload() {
        this.load.image('bg', 'assets/bg.png')

        this.load.spritesheet('character-right', 'assets/character-right.png', {
            frameWidth: 48,   // Width of a single frame in pixels
            frameHeight: 64, // Height of a single frame in pixels

        });
        this.load.spritesheet('character-left', 'assets/character-left.png', {
            frameWidth: 48,   // Width of a single frame in pixels
            frameHeight: 64, // Height of a single frame in pixels

        });
        this.load.spritesheet('character-up', 'assets/character-up.png', {
            frameWidth: 48,   // Width of a single frame in pixels
            frameHeight: 64, // Height of a single frame in pixels

        });
        this.load.spritesheet('character-down', 'assets/character-down.png', {
            frameWidth: 48,   // Width of a single frame in pixels
            frameHeight: 64, // Height of a single frame in pixels

        });


    }

    create() {
        // Retrieve the character's name from localStorage
        const characterName = localStorage.getItem('characterName');

        // background
        this.add.image(0, 0, 'bg').setOrigin(0, 0)

        // Draw the grid.
        initializeGrid({
            graphics: this.add.graphics(),
            cellHeight: this.cellHeight,
            cellWidth: this.cellWidth,
            columns: this.columns,
            rows: this.rows,
        })

        // Create a character sprite and set its initial position (e.g., grid cell 0,0).
        this.character = this.add.sprite(16, 15, 'character-right')

        // Set the character's scale.
        this.character.setScale(0.5, 0.5);

        // Display the character's skills.
        const skillText = this.add.text(500, 100, '', { color: 'black', fontSize: '16px', fontStyle: 'bold', backgroundColor: '#fff' });
        skillText.setText('Skills:\n' + character.skills.map(skill => skill.name).join('\n'));

        // Display the character's name, class and health.
        const nameText = this.add.text(500, 20, '', { color: 'black', fontSize: '16px', fontStyle: 'bold', backgroundColor: '#fff' });
        nameText.setText(`Name: ${characterName || character.name}\nClass: ${character.class}\nHealth: ${character.health}`);

        // Example: Allow the player to select a skill by clicking on it.
        skillText.setInteractive();
        skillText.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Get the selected skill based on the pointer's position.
            const calculateSkillIndex = (pointer: Phaser.Input.Pointer) => {
                const skillIndex = Math.floor((pointer.y - skillText.y) / 20);
                return skillIndex;
            }

            const skillIndex = calculateSkillIndex(pointer);
            const selectedSkill = character.skills[skillIndex];

            // Perform actions based on the selected skill, e.g., target an enemy and apply the skill's effects.
            console.log(`Selected skill: ${selectedSkill.name}`);
        });

        // Define animations for different directions.
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('character-right', { start: 0, end: 4 }), // Frames for walking up
            frameRate: 10, // Frames per second
            repeat: -1, // Infinite loop
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('character-left', { start: 0, end: 4 }), // Frames for walking up
            frameRate: 10, // Frames per second
            repeat: -1, // Infinite loop
        });

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('character-down', { start: 0, end: 4 }), // Frames for walking up
            frameRate: 10, // Frames per second
            repeat: -1, // Infinite loop
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('character-up', { start: 0, end: 4 }), // Frames for walking up
            frameRate: 10, // Frames per second
            repeat: -1, // Infinite loop
        });

        // Enable keyboard input.
        this?.input?.keyboard?.createCursorKeys();

        // Handle keyboard input to move the character.
        this?.input?.keyboard?.on('keydown', (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                    if (this.isMoving) return;
                    this.isMoving = true;
                    this.moveAndAnimateCharacter(this.character.x, this.character.y - this.cellHeight, 'walk-up');
                    break;
                case 'ArrowDown':
                    if (this.isMoving) return;
                    this.isMoving = true;
                    this.moveAndAnimateCharacter(this.character.x, this.character.y + this.cellHeight, 'walk-down');
                    break;
                case 'ArrowLeft':
                    if (this.isMoving) return;
                    this.isMoving = true;
                    this.moveAndAnimateCharacter(this.character.x - this.cellWidth, this.character.y, 'walk-left');
                    break;
                case 'ArrowRight':
                    if (this.isMoving) return;
                    this.isMoving = true;
                    this.moveAndAnimateCharacter(this.character.x + this.cellWidth, this.character.y, 'walk-right');
                    break;
            }
        });
    }

    moveAndAnimateCharacter(newX: number, newY: number, animationKey: string) {
        this.character.anims.play(animationKey, true); // Play the specified animation

        // Tween the character's position to create a smooth movement.
        this.tweens.add({
            targets: this.character,
            x: newX,
            y: newY,
            duration: 500, // Duration of the movement animation in milliseconds
            ease: 'Linear', // Linear easing for a constant speed
            onComplete: () => {
                this.isMoving = false;
                this.character.anims.stop();
            }
        });
    }
}