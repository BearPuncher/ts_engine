import * as TSE from '../../lib';
import {IPoint} from "../../lib/utils/math";
import TileMap from "../../lib/tile_map";

export const TileLayouts = {
    CORNER: [0, 1, 1, 0,
        0, 1, 1, 1,
        0, 1, 1, 1,
        0, 0, 0, 0],
    CROSS: [0, 1, 1, 0,
        1, 1, 1, 1,
        1, 1, 1, 1,
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

export class MazePart extends TSE.RectActor {

    public currentDirection: number;
    public tilesLayout: TileMap;
    private length: number;
    private diameter: number;

    constructor(index: IPoint, tilesLayout: number[]) {
        const length = 128;
        super({x: index.y * length, y: index.x * length}, length, length, {layer: 1});
        this.currentDirection = 0;
        this.length = length;
        this.diameter = 4;
        this.tilesLayout = new TileMap(this.diameter, this.diameter, this.length / this.diameter, tilesLayout);
    }

    public rotateRight(): void {
        this.currentDirection =  this.currentDirection + 90 % 360;
    }

    public rotateLeft(): void {
        this.currentDirection =  this.currentDirection - 90 % 360;
    }

    protected drawDebug(): void {
        const ctx = this.stage.ctx;
        ctx.fillStyle = 'green';
        for (let row = 0; row < this.diameter; row++) {
            for (let col = 0; col < this.diameter; col++) {
                const tile: number = this.tilesLayout.getTile(row, col);
                if (tile) {
                    const tileSize: number = this.tilesLayout.tileSize;
                    const x: number = this.position.x + tileSize * col;
                    const y: number = this.position.y + tileSize * row;
                    ctx.fillRect(x, y, this.tilesLayout.tileSize, this.tilesLayout.tileSize);
                }
            }
        }
    }
}

export enum MazePartType {
    CORNER,
    CROSS,
    STRAIGHT,
    T_BONE,
}

export const MazePartFactory = {
    createMazePart: (type: MazePartType, index: IPoint): MazePart => {
        switch (type) {
            case MazePartType.STRAIGHT:
                return new MazePart(index, TileLayouts.STRAIGHT);
            case MazePartType.CORNER:
                return new MazePart(index, TileLayouts.CORNER);
            case MazePartType.T_BONE:
                return new MazePart(index, TileLayouts.T_BONE);
            case MazePartType.CROSS:
                return new MazePart(index, TileLayouts.CROSS);
            default:
                throw Error('No matching type for: ' + type);
        }
    },
};
