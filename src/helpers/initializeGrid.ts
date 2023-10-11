
type Params = {
    cellWidth: number;
    cellHeight: number;
    rows: number;
    columns: number;
    graphics: Phaser.GameObjects.Graphics;
}

export const initializeGrid = ({ cellHeight, cellWidth, columns, rows, graphics, }: Params) => {
    // Set the line style for grid lines (color, thickness).
    graphics.lineStyle(1, 0x000000, 0.5);

    // Draw horizontal grid lines.
    for (var i = 0; i <= rows; i++) {
        graphics.moveTo(0, i * cellHeight);
        graphics.lineTo(columns * cellWidth, i * cellHeight);
    }

    // Draw vertical grid lines.
    for (var j = 0; j <= columns; j++) {
        graphics.moveTo(j * cellWidth, 0);
        graphics.lineTo(j * cellWidth, rows * cellHeight);
    }

    graphics.closePath();
    graphics.strokePath();
}