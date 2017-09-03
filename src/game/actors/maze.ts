import * as TSE from '../../lib';
import {MazePart, MazeTile, TileType} from './maze_part';

/**
 * The maze.
 */
export default class Maze extends TSE.RectActor {

    public mazePartSize: number;
    public needsUpdate: boolean;
    private mazePartMap: MazePart[][];
    private tileMap: TSE.TileMapUtils.TileMap;
    private rows: number;
    private cols: number;

    constructor(width: number, height: number, mazePartSize: number) {
        super(TSE.Math.ORIGIN, width, height, {layer: 0});
        this.mazePartSize = mazePartSize;
        this.rows = height / mazePartSize;
        this.cols = width / mazePartSize;
        this.mazePartMap = [];
        this.needsUpdate = true;
    }

    public setMazeParts(mazePartMap: MazePart[][]): void {
        this.mazePartMap = mazePartMap;
    }

    /**
     * Override.
     */
    public init(): void {
        const tileSize: number = 32;
        const cols: number = this.width / tileSize;
        const rows: number = this.height / tileSize;

        const tiles = new Array<number>(rows * cols);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                tiles[i * cols + j] = 0;
            }
        }

        this.tileMap = new TSE.TileMapUtils.TileMap(rows, cols, tileSize, tiles);
    }

    /**
     * Override.
     */
    public update(step: number): void {
        super.update(step);
        if (this.needsUpdate) {
            this.updateTileMapWithMazeParts();
            this.needsUpdate = false;
        }
    }

    public iterateMazeParts(callback: Function): void {
        for (let row = 0; row < this.mazePartMap.length; row++) {
            for (let col = 0; col < this.mazePartMap[row].length; col++) {
                callback(this.mazePartMap[row][col], row, col);
            }
        }
    }

    public resetState(): void {
        this.iterateMazeParts((part: MazePart, row: number, col: number) => {
            part.actionable = false;
            part.hovered = false;
        });
    }

    /**
     * Override.
     */
    public render(): void {
        this.iterateMazeParts((part: MazePart, row: number, col: number) => {
            const length: number = part.length;
            part.drawMazeParts(col * length, row * length, this.stage.ctx);
        });
    }

    public drawMazePostEffects(): void {
        this.iterateMazeParts((part: MazePart, row: number, col: number) => {
            const length: number = part.length;
            part.drawPostEffects(col * length, row * length, this.stage.ctx);
        });
    }

    public getAdjacentMazeParts(pos: TSE.Math.IPoint): MazePart[] {
        if (pos.x < 0 || pos.x > this.width ||
            pos.y < 0 || pos.y > this.height) {
            return [];
        }
        const currentRow: number = Math.floor(pos.y / this.mazePartSize);
        const currentCol: number = Math.floor(pos.x / this.mazePartSize);
        if (!this.mazePartMap[currentRow]) {
            return [];
        }

        const returnArray: MazePart[] = [];
        if (currentRow - 1 >= 0) {
            returnArray.push(this.mazePartMap[currentRow - 1][currentCol]);
        }
        if (currentRow + 1 < this.rows) {
            returnArray.push(this.mazePartMap[currentRow + 1][currentCol]);
        }
        if (currentCol - 1 >= 0) {
            returnArray.push(this.mazePartMap[currentRow][currentCol - 1]);
        }
        if (currentCol + 1 < this.cols) {
            returnArray.push(this.mazePartMap[currentRow][currentCol + 1]);
        }

        return returnArray;
    }

    public getMazePartAtPosition(pos: TSE.Math.IPoint): MazePart {
        if (pos.x < 0 || pos.x > this.width ||
            pos.y < 0 || pos.y > this.height) {
            return null;
        }
        const currentRow: number = Math.floor(pos.y / this.mazePartSize);
        const currentCol: number = Math.floor(pos.x / this.mazePartSize);
        if (!this.mazePartMap[currentRow]) {
            return null;
        }

        return this.mazePartMap[currentRow][currentCol];
    }

    public getTileAtPosition(pos: TSE.Math.IPoint): any {
        if (pos.x < 0 || pos.x > this.width ||
            pos.y < 0 || pos.y > this.height) {
            return null;
        }
        const currentRow: number = Math.floor(pos.y / this.tileMap.tileSize);
        const currentCol: number = Math.floor(pos.x / this.tileMap.tileSize);

        return this.tileMap.getTile(currentRow, currentCol);
    }

    // This some hacky bullshit
    // TODO: Fix this hacky bullcrap
    public setAdjacentTilesSeen(actor: TSE.CircleActor): void {
        let mostTop: number = Math.floor((actor.pos.y - actor.radius) / this.mazePartSize);
        let mostBottom: number = Math.floor((actor.pos.y + actor.radius) / this.mazePartSize);
        let mostLeft: number = Math.floor((actor.pos.x - actor.radius) / this.mazePartSize);
        let mostRight: number = Math.floor((actor.pos.x + actor.radius) / this.mazePartSize);

        if (mostTop < 0) {
            mostTop = 0;
        }

        if (mostBottom > this.rows - 1) {
            mostBottom = this.rows - 1;
        }

        if (mostLeft < 0) {
            mostLeft = 0;
        }

        if (mostRight > this.cols - 1) {
            mostRight = this.cols - 1;
        }

        for (let i = mostLeft; i <= mostRight; i++) {
            for (let j = mostTop; j <= mostBottom; j++) {
                // Reposition actor because tilemap is skewed
                // Start of hacky bullcrap
                // TODO: Fix this hacky bullcrap
                const circleActor = new TSE.CircleActor({
                    x: actor.pos.x - i * this.mazePartSize,
                    y: actor.pos.y - j * this.mazePartSize
                }, actor.radius);

                const tiles: TSE.TileMapUtils.Tile[] =
                    this.mazePartMap[j][i].layout.getTilesAdjacentToCircleActor(circleActor);
                for (let tile of tiles) {
                    tile.value.seen = true;
                }
                // End of hacky bullcrap
            }
        }

    }

    // http://jonathanwhiting.com/tutorial/collision/
    public isRectActorColliding(actor: TSE.RectActor): boolean {
        if (actor.pos.x < 0 || actor.pos.x + actor.width > this.width ||
            actor.pos.y < 0 || actor.pos.y + actor.height > this.height ) {
            return true;
        }

        const tiles: TSE.TileMapUtils.Tile[] = this.tileMap.getTilesAdjacentToRectActor(actor);

        if (tiles.length === 0) {
            return false;
        }

        for (const tile of tiles) {
            if (tile.value === TileType.WALL) {
                return true;
            }
        }

        return false;
    }

    private updateTileMapWithMazeParts(): void {
        this.iterateMazeParts((part: MazePart, row: number, col: number) => {
            for (let innerRow = 0; innerRow < part.diameter; innerRow++) {
                for (let innerCol = 0; innerCol < part.diameter; innerCol++) {
                    const tile: MazeTile = part.layout.getTile(innerRow, innerCol);
                    this.tileMap.setTile(row * part.diameter + innerRow,
                        col * part.diameter + innerCol, tile.type);
                }
            }
        });
    }
}
