export const createCharacterAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'walk-right',
    frames: scene.anims.generateFrameNumbers('character-right', { start: 0, end: 3 }), // * Frames for walking up
    frameRate: 15, // * Frames per second
    repeat: -1 // * Infinite loop
  })

  scene.anims.create({
    key: 'walk-left',
    frames: scene.anims.generateFrameNumbers('character-left', { start: 0, end: 3 }), // * Frames for walking up
    frameRate: 15, // * Frames per second
    repeat: -1 // * Infinite loop
  })

  scene.anims.create({
    key: 'walk-down',
    frames: scene.anims.generateFrameNumbers('character-down', { start: 0, end: 3 }), // * Frames for walking up
    frameRate: 15, // * Frames per second
    repeat: -1 // * Infinite loop
  })

  scene.anims.create({
    key: 'walk-up',
    frames: scene.anims.generateFrameNumbers('character-up', { start: 0, end: 3 }), // * Frames for walking up
    frameRate: 15, // * Frames per second
    repeat: -1
  })
}
