import * as TSE from '../../lib';

export interface Tile {
    value: any;
    row: number;
    col: number;
}

/**
 * Basic tile map class.
 */
export class TileMap {

    public rw: number;
    public cl: number;
    /**
     * Tile Size.
     */
    public tSz: number;
    public tiles: any[];

    /**
     * Constructor.
     * @param {number} rows the number of rw
     * @param {number} cols the number of columns
     * @param {number} tileSize the tile size
     * @param {[number]} tiles the tiles
     */
    constructor(rows: number, cols: number, tileSize: number, tiles: any[]) {
        if (tiles.length !== rows * cols) {
            throw Error('tiles supplied not expected size.');
        }
        this.rw = rows;
        this.cl = cols;
        this.tSz = tileSize;
        this.tiles = tiles;
    }

    /**
     * Get the number of a tile.
     */
    public getTile(row: number, col: number): any {
        return this.tiles[row * this.cl + col];
    }

    /**
     * Get the number of a tile.
     */
    public setTile(row: number, col: number, tile: any) {
        this.tiles[row * this.cl + col] = tile;
    }

    /**
     * Get the tile's x & y p.
     */
    public getTilePosition(row: number, col: number): TSE.Math.IPoint {
        return {x: row * this.tSz, y: col * this.tSz};
    }

    public getTilesAdjacentToCircleActor(actor: TSE.CircleActor): Tile[] {
        const returnArray: Tile[] = [];
        const tileSize = this.tSz;
        let leftTile: number = Math.floor((actor.p.x - actor.r) / tileSize);
        let rightTile: number = Math.floor((actor.p.x + actor.r) / tileSize);
        let topTile: number = Math.floor((actor.p.y - actor.r) / tileSize);
        let bottomTile: number = Math.floor((actor.p.y + actor.r) / tileSize);

        if (leftTile < 0) {
            leftTile = 0;
        }

        if (rightTile > this.cl - 1) {
            rightTile = this.cl - 1;
        }

        if (topTile < 0) {
            topTile = 0;
        }

        if (bottomTile > this.rw - 1) {
            bottomTile = this.rw - 1;
        }

        for (let i = leftTile; i <= rightTile; i++) {
            for (let j = topTile; j <= bottomTile; j++) {
                const value = this.getTile(j, i);
                returnArray.push({value: value, row: j, col: i});

            }
        }

        return returnArray;
    }

    public getTilesAdjacentToRectActor(actor: TSE.RectActor): Tile[] {
        const returnArray: Tile[] = [];
        const tileSize = this.tSz;
        let leftTile: number = Math.floor(actor.p.x / tileSize);
        let rightTile: number = Math.floor((actor.p.x + actor.w) / tileSize);
        let topTile: number = Math.floor(actor.p.y / tileSize);
        let bottomTile: number = Math.floor((actor.p.y + actor.h) / tileSize);

        if (leftTile < 0) {
            leftTile = 0;
        }

        if (rightTile > this.cl - 1) {
            rightTile = this.cl - 1;
        }

        if (topTile < 0) {
            topTile = 0;
        }

        if (bottomTile > this.rw - 1) {
            bottomTile = this.rw - 1;
        }

        for (let i = leftTile; i <= rightTile; i++) {
            for (let j = topTile; j <= bottomTile; j++) {
                const value = this.getTile(j, i);
                returnArray.push({value: value, row: j, col: i});
            }
        }

        return returnArray;
    }

    /**
     * Render the tile map.
     */
    public drawDebug(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        for (let i = 0; i < this.rw; i++) {
            for (let j = 0; j < this.cl; j++) {
                const x = j * this.tSz;
                const y = i * this.tSz;
                const tile: number = this.getTile(i, j);
                if (tile === 0) {
                    ctx.strokeStyle = 'white';
                } else if (tile === 1) {
                    ctx.strokeStyle = 'blue';
                } else if (tile >= 2) {
                    ctx.strokeStyle = 'black';
                }
                ctx.strokeRect(x, y, this.tSz, this.tSz);

            }
        }

        ctx.restore();
    }

}
