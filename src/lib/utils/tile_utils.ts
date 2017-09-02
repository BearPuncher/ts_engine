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

    public rows: number;
    public cols: number;
    public tileSize: number;
    public tiles: any[];

    /**
     * Constructor.
     * @param {number} rows the number of rows
     * @param {number} cols the number of columns
     * @param {number} tileSize the tile size
     * @param {[number]} tiles the tiles
     */
    constructor(rows: number, cols: number, tileSize: number, tiles: any[]) {
        if (tiles.length !== rows * cols) {
            throw Error('tiles supplied not expected size.');
        }
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.tiles = tiles;
    }

    /**
     * Get the number of a tile.
     */
    public getTile(row: number, col: number): any {
        return this.tiles[row * this.cols + col];
    }

    /**
     * Get the number of a tile.
     */
    public setTile(row: number, col: number, tile: any) {
        this.tiles[row * this.cols + col] = tile;
    }

    /**
     * Get the tile's x & y pos.
     */
    public getTilePosition(row: number, col: number): TSE.Math.IPoint {
        return {x: row * this.tileSize, y: col * this.tileSize};
    }

    public getTilesAdjacentToCircleActor(actor: TSE.CircleActor): Tile[] {
        const returnArray: Tile[] = [];
        const tileSize = this.tileSize;
        let leftTile: number = Math.floor((actor.pos.x - actor.radius) / tileSize);
        let rightTile: number = Math.floor((actor.pos.x + actor.radius) / tileSize);
        let topTile: number = Math.floor((actor.pos.y - actor.radius) / tileSize);
        let bottomTile: number = Math.floor((actor.pos.y + actor.radius) / tileSize);

        if (leftTile < 0) {
            leftTile = 0;
        }

        if (rightTile > this.cols - 1) {
            rightTile = this.cols - 1;
        }

        if (topTile < 0) {
            topTile = 0;
        }

        if (bottomTile > this.rows - 1) {
            bottomTile = this.rows - 1;
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
        const tileSize = this.tileSize;
        let leftTile: number = Math.floor(actor.pos.x / tileSize);
        let rightTile: number = Math.floor((actor.pos.x + actor.width) / tileSize);
        let topTile: number = Math.floor(actor.pos.y / tileSize);
        let bottomTile: number = Math.floor((actor.pos.y + actor.height) / tileSize);

        if (leftTile < 0) {
            leftTile = 0;
        }

        if (rightTile > this.cols - 1) {
            rightTile = this.cols - 1;
        }

        if (topTile < 0) {
            topTile = 0;
        }

        if (bottomTile > this.rows - 1) {
            bottomTile = this.rows - 1;
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

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const x = j * this.tileSize;
                const y = i * this.tileSize;
                const tile: number = this.getTile(i, j);
                if (tile === 0) {
                    ctx.strokeStyle = 'white';
                } else if (tile === 1) {
                    ctx.strokeStyle = 'blue';
                } else if (tile >= 2) {
                    ctx.strokeStyle = 'black';
                }
                ctx.strokeRect(x, y, this.tileSize, this.tileSize);

            }
        }

        ctx.restore();
    }

}
