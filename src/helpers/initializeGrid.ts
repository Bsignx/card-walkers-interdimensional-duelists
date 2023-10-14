interface Params {
  cellWidth: number
  cellHeight: number
  rows: number
  columns: number
  scene: Phaser.Scene
}

export const initializeGrid = ({ cellHeight, cellWidth, columns, rows, scene }: Params) => {
  // Create a grid
  const grid = scene.add.grid(200, 200, cellWidth * columns, cellHeight * rows, cellWidth, cellHeight, 0x0ffff)

  grid.setOrigin(0.5)

  return grid
}
