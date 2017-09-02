import * as TSE from '../../lib';

export enum TileType {
    WALL = 0,
    PATH = 1,
    RAMP = 2,
    OVER = 3,
    EXIT = 9,
}

export interface MazeTile {
    type: TileType;
    seen: boolean;
}

const TileLayouts = {
    CORNER: [TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.PATH,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.PATH,
        TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL],
    CROSS: [TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.PATH, TileType.PATH, TileType.PATH, TileType.PATH,
        TileType.PATH, TileType.PATH, TileType.PATH, TileType.PATH,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL],
    DEAD_END: [TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL],
    EXIT: [TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.EXIT, TileType.EXIT, TileType.WALL,
        TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL],
    DOUBLE_CORNER: [ TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.PATH, TileType.OVER, TileType.OVER, TileType.RAMP,
        TileType.PATH, TileType.OVER, TileType.OVER, TileType.RAMP,
        TileType.WALL, TileType.RAMP, TileType.RAMP, TileType.WALL],
    OVERPASS: [TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.RAMP, TileType.OVER, TileType.OVER, TileType.RAMP,
        TileType.RAMP, TileType.OVER, TileType.OVER, TileType.RAMP,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL],
    STRAIGHT: [TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL],
    T_BONE: [TileType.WALL, TileType.PATH, TileType.PATH, TileType.WALL,
        TileType.PATH, TileType.PATH, TileType.PATH, TileType.PATH,
        TileType.PATH, TileType.PATH, TileType.PATH, TileType.PATH,
        TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL],
};

export class MazePart {

    public tilesLayout: TSE.TileMapUtils.TileMap;
    public length: number;
    public diameter: number;
    public direction: number;
    public hovered: boolean;
    public rotates: boolean;

    constructor(tilesLayout: number[]) {
        this.length = 128;
        this.diameter = 4;
        this.direction = 0;
        this.tilesLayout = new TSE.TileMapUtils.TileMap(
            this.diameter, this.diameter, this.length / this.diameter, this.populateFromTileLayouts(tilesLayout));
        this.hovered = false;
        this.rotates = true;
    }

    // TODO: move this to the tile_map class, add rotations there
    public rotateRight(): void {
        if (!this.rotates) {
            return;
        }
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
        if (!this.rotates) {
            return;
        }
        this.direction = (this.direction - 90) % 360;
        const newTiles: number[] = [];

        for (let row = 0; row < this.diameter; row++) {
            for (let col = 0; col < this.diameter; col++) {
                newTiles[row * this.diameter + col] = this.tilesLayout.getTile(col, this.diameter - row - 1);
            }
        }

        this.tilesLayout.tiles = newTiles;
    }

    public render(xOffset: number, yOffset: number, ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(xOffset, yOffset);
        for (let row = 0; row < this.diameter; row++) {
            for (let col = 0; col < this.diameter; col++) {
                const tile: MazeTile = this.tilesLayout.getTile(row, col);
                switch (tile.type) {
                    case TileType.WALL:
                        ctx.fillStyle = 'black';
                        break;
                    case TileType.EXIT:
                        ctx.fillStyle = 'green';
                        break;
                    default:
                        ctx.fillStyle = 'LightGrey';
                }
                if (tile.seen) {
                    const tileSize: number = this.tilesLayout.tileSize;
                    const x: number = tileSize * col;
                    const y: number = tileSize * row;
                    ctx.lineWidth = 1;
                    ctx.fillRect(x, y, this.tilesLayout.tileSize, this.tilesLayout.tileSize);
                }
            }
        }
        if (this.hovered && this.rotates) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(0, 0, this.length, this.length);
        }

        ctx.restore();
    }

    private populateFromTileLayouts(tilesLayout: number[]): MazeTile[] {
        const returnArray: MazeTile[] = [];
        for (const tile of tilesLayout) {
            returnArray.push({type: tile, seen: false});
        }
        return returnArray;
    }
}

export enum MazePartType {
    CORNER,
    CROSS,
    DEAD_END,
    DOUBLE_CORNER,
    EXIT,
    STRAIGHT,
    T_BONE,
    OVERPASS,
}

export const MazePartFactory = {
    createMazePart: (type: MazePartType, rotate: number, canRotate: boolean): MazePart => {
        let mazepart: MazePart;
        switch (type) {
            case MazePartType.STRAIGHT:
                mazepart = new MazePart(TileLayouts.STRAIGHT);
                break;
            case MazePartType.CORNER:
                mazepart = new MazePart(TileLayouts.CORNER);
                break;
            case MazePartType.DEAD_END:
                mazepart = new MazePart(TileLayouts.DEAD_END);
                break;
            case MazePartType.EXIT:
                mazepart = new MazePart(TileLayouts.EXIT);
                break;
            case MazePartType.T_BONE:
                mazepart = new MazePart(TileLayouts.T_BONE);
                break;
            case MazePartType.CROSS:
                mazepart = new MazePart(TileLayouts.CROSS);
                break;
            case MazePartType.OVERPASS:
                mazepart = new MazePart(TileLayouts.OVERPASS);
                break;
            case MazePartType.DOUBLE_CORNER:
                mazepart = new MazePart(TileLayouts.DOUBLE_CORNER);
                break;
            default:
                throw Error('No matching type for: ' + type);
        }
        for (let i = 0; i < rotate; i++) {
            mazepart.rotateRight();
        }
        mazepart.rotates = canRotate;
        return mazepart;
    },
};
