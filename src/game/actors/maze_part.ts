import TileMap from '../../lib/tile_map';

export const TileLayouts = {
    CORNER: [0, 1, 1, 0,
        0, 1, 1, 1,
        0, 1, 1, 1,
        0, 0, 0, 0],
    CROSS: [0, 1, 1, 0,
        1, 1, 1, 1,
        1, 1, 1, 1,
        0, 1, 1, 0],
    DEAD_END: [0, 1, 1, 0,
        0, 1, 1, 0,
        0, 1, 1, 0,
        0, 0, 0, 0],
    DOUBLE_CORNER: [ 0, 1, 1, 0,
        1, 3, 3, 2,
        1, 3, 3, 2,
        0, 2, 2, 0],
    OVERPASS: [0, 1, 1, 0,
        2, 3, 3, 2,
        2, 3, 3, 2,
        0, 1, 1, 0],
    STRAIGHT: [0, 1, 1, 0,
        0, 1, 1, 0,
        0, 1, 1, 0,
        0, 1, 1, 0],
    T_BONE: [0, 1, 1, 0,
        1, 1, 1, 1,
        1, 1, 1, 1,
        0, 0, 0, 0],
};

export class MazePart {

    public tilesLayout: TileMap;
    public length: number;
    public diameter: number;
    public direction: number;

    constructor(tilesLayout: number[]) {
        this.length = 128;
        this.diameter = 4;
        this.direction = 0;
        this.tilesLayout = new TileMap(this.diameter, this.diameter, this.length / this.diameter, tilesLayout);
    }

    public rotateRight(): void {
        this.direction = (this.direction + 90) % 360;
        const newTiles: number[] = [];

        for (let row = 0; row < this.diameter; row++) {
            for (let col = 0; col < this.diameter; col++) {
                newTiles[row * this.diameter + col] = this.tilesLayout.getTile(this.diameter - col - 1, row);
            }
        }

        this.tilesLayout.tiles = newTiles;
    }

    public rotateLeft(): void {
        this.direction = (this.direction - 90) % 360;
        const newTiles: number[] = [];

        for (let row = 0; row < this.diameter; row++) {
            for (let col = 0; col < this.diameter; col++) {
                newTiles[row * this.diameter + col] = this.tilesLayout.getTile(col, this.diameter - row - 1);
            }
        }

        this.tilesLayout.tiles = newTiles;
    }

    public drawDebug(xOffset: number, yOffset: number, ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(xOffset, yOffset);
        for (let row = 0; row < this.diameter; row++) {
            for (let col = 0; col < this.diameter; col++) {
                const tile: number = this.tilesLayout.getTile(row, col);
                if (tile === 0) {
                    ctx.fillStyle = 'black';
                } else if (tile === 1) {
                    ctx.fillStyle = 'green';
                } else if (tile === 2) {
                    ctx.fillStyle = 'yellow';
                } else if (tile === 3) {
                    ctx.fillStyle = 'red';
                }
                const tileSize: number = this.tilesLayout.tileSize;
                const x: number = tileSize * col;
                const y: number = tileSize * row;
                ctx.fillRect(x, y, this.tilesLayout.tileSize, this.tilesLayout.tileSize);
            }
        }
        ctx.restore();
    }
}

export enum MazePartType {
    CORNER,
    CROSS,
    DEAD_END,
    DOUBLE_CORNER,
    STRAIGHT,
    T_BONE,
    OVERPASS,
}

export const MazePartFactory = {
    createMazePart: (type: MazePartType): MazePart => {
        switch (type) {
            case MazePartType.STRAIGHT:
                return new MazePart(TileLayouts.STRAIGHT);
            case MazePartType.CORNER:
                return new MazePart(TileLayouts.CORNER);
            case MazePartType.DEAD_END:
                return new MazePart(TileLayouts.DEAD_END);
            case MazePartType.T_BONE:
                return new MazePart(TileLayouts.T_BONE);
            case MazePartType.CROSS:
                return new MazePart(TileLayouts.CROSS);
            case MazePartType.OVERPASS:
                return new MazePart(TileLayouts.OVERPASS);
            case MazePartType.DOUBLE_CORNER:
                return new MazePart(TileLayouts.DOUBLE_CORNER);
            default:
                throw Error('No matching type for: ' + type);
        }
    },
};
