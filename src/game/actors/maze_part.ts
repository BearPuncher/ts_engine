import * as TSE from '../../lib';

/**
 * Wall, PATH, RAMP, O, EX.
 */
export enum TileType {
    W = 0,
    P = 1,
    R = 2,
    O = 3,
    E = 9,
}

export interface IMazeTile {
    type: TileType;
    seen: boolean;
}

const TileLayouts = {
    CORNER: [TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.P, TileType.P, TileType.P,
        TileType.W, TileType.P, TileType.P, TileType.P,
        TileType.W, TileType.W, TileType.W, TileType.W],
    CROSS: [TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.P, TileType.P, TileType.P, TileType.P,
        TileType.P, TileType.P, TileType.P, TileType.P,
        TileType.W, TileType.P, TileType.P, TileType.W],
    DEAD_END: [TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.W, TileType.W, TileType.W],
    DOUBLE_CORNER: [ TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.P, TileType.O, TileType.O, TileType.R,
        TileType.P, TileType.O, TileType.O, TileType.R,
        TileType.W, TileType.R, TileType.R, TileType.W],
    EXIT: [TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.E, TileType.E, TileType.W,
        TileType.W, TileType.W, TileType.W, TileType.W],
    OVERPASS: [TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.R, TileType.O, TileType.O, TileType.R,
        TileType.R, TileType.O, TileType.O, TileType.R,
        TileType.W, TileType.P, TileType.P, TileType.W],
    STRAIGHT: [TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.W, TileType.P, TileType.P, TileType.W],
    T_BONE: [TileType.W, TileType.P, TileType.P, TileType.W,
        TileType.P, TileType.P, TileType.P, TileType.P,
        TileType.P, TileType.P, TileType.P, TileType.P,
        TileType.W, TileType.W, TileType.W, TileType.W],
};

export class MazePart {

    /**
     * Layout.
     */
    public ly: TSE.TileMapUtils.TileMap;
    /**
     * Length.
     */
    public lg: number;
    /**
     * Diameter.
     */
    public di: number;
    /**
     * Direction.
     */
    public dr: number;
    public actionable: boolean;
    public hovered: boolean;
    public rotates: boolean;
    /**
     * Sprite.
     */
    public s: TSE.Sprite;

    constructor(tilesLayout: number[]) {
        this.lg = 128;
        this.di = 4;
        this.dr = 0;
        this.ly = new TSE.TileMapUtils.TileMap(
            this.di, this.di, this.lg / this.di, this.populateFromTileLayouts(tilesLayout));
        this.actionable = false;
        this.hovered = false;
        this.rotates = true;

        // Set s
        const LOADER: TSE.AssetLoader = new TSE.AssetLoader();
        this.s = new TSE.Sprite(LOADER.getImage('mazetilemap'), 32, 32);
        this.s.setScale(4);
    }

    // TODO: move this to the tile_map class, add rotations there
    public rotateRight(): void {
        if (!this.rotates) {
            return;
        }
        this.dr = (this.dr + 90) % 360;
        const newTiles: number[] = [];

        for (let row = 0; row < this.di; row++) {
            for (let col = 0; col < this.di; col++) {
                newTiles[row * this.di + col] = this.ly.getTile(this.di - col - 1, row);
            }
        }

        this.s.angle = this.dr;
        this.ly.tiles = newTiles;
    }

    public rotateLeft(): void {
        if (!this.rotates) {
            return;
        }
        this.dr = (this.dr - 90) % 360;
        const newTiles: number[] = [];

        for (let row = 0; row < this.di; row++) {
            for (let col = 0; col < this.di; col++) {
                newTiles[row * this.di + col] = this.ly.getTile(col, this.di - row - 1);
            }
        }

        this.s.angle = this.dr;
        this.ly.tiles = newTiles;
    }

    public drawMazeParts(xOffset: number, yOffset: number, ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(xOffset, yOffset);
        this.s.draw({x: 0, y: 0}, ctx);
        /*
        for (let row = 0; row < this.di; row++) {
            for (let col = 0; col < this.di; col++) {
                const tile: IMazeTile = this.ly.getTile(row, col);
                if (!tile.seen) {
                    const tileSize: number = this.ly.tSz;
                    const x: number = tileSize * col;
                    const y: number = tileSize * row;
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 3;
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x - 1, y - 1, this.ly.tSz + 2, this.ly.tSz + 2);
                }
            }
        }*/

        ctx.restore();
    }

    public drawPostEffects(xOffset: number, yOffset: number, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(xOffset, yOffset);
        ctx.lineWidth = 3;

        if (this.rotates && this.actionable) {
            ctx.strokeStyle = 'red';
            if (this.hovered) {
                ctx.strokeStyle = 'blue';
            }
            ctx.strokeRect(0, 0, this.lg, this.lg);
        }
        ctx.restore();
    }

    private populateFromTileLayouts(tilesLayout: number[]): IMazeTile[] {
        const returnArray: IMazeTile[] = [];
        for (const tile of tilesLayout) {
            returnArray.push({type: tile, seen: false});
        }
        return returnArray;
    }
}

/**
 * Corner, Cross, Dead end, Double Corner, Exit, Straight, T-bone, Overpass.
 */
export enum MazePartType {
    CO = 0,
    CR,
    DE,
    DC,
    EX,
    ST,
    TB,
    O,
}

export const MazePartFactory = {
    create: (type: MazePartType, rotate: number, canRotate: boolean): MazePart => {
        let mazepart: MazePart;
        switch (type) {
            case MazePartType.CO:
                mazepart = new MazePart(TileLayouts.CORNER);
                mazepart.s.setCycle([[0, 0]], 0);
                break;
            case MazePartType.CR:
                mazepart = new MazePart(TileLayouts.CROSS);
                mazepart.s.setCycle([[1, 0]], 0);
                break;
            case MazePartType.DE:
                mazepart = new MazePart(TileLayouts.DEAD_END);
                mazepart.s.setCycle([[2, 0]], 0);
                break;
            case MazePartType.EX:
                mazepart = new MazePart(TileLayouts.EXIT);
                mazepart.s.setCycle([[3, 0]], 0);
                break;
            case MazePartType.ST:
                mazepart = new MazePart(TileLayouts.STRAIGHT);
                mazepart.s.setCycle([[4, 0]], 0);
                break;
            case MazePartType.TB:
                mazepart = new MazePart(TileLayouts.T_BONE);
                mazepart.s.setCycle([[5, 0]], 0);
                break;
            case MazePartType.O:
                mazepart = new MazePart(TileLayouts.OVERPASS);
                break;
            case MazePartType.DC:
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
