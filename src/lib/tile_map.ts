import * as TSE from '../lib';

/**
 * Basic tile map class.
 */
export default class TileMap {

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
     * Get the tile's x & y position.
     */
    public getTilePosition(row: number, col: number): TSE.Math.IPoint {
        return {x: row * this.tileSize, y: col * this.tileSize};
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
