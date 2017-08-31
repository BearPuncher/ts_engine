import * as TSE from '../../lib';
import {MazePart, MazeTile, TileType} from './maze_part';

/**
 * The maze.
 */
export default class Maze extends TSE.RectActor {

    public needsUpdate: boolean;
    private mazePartMap: MazePart[][];
    private mazePartSize: number;
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
        for (let row = 0; row < this.mazePartMap.length; row++) {
            for (let col = 0; col < this.mazePartMap[row].length; col++) {
                this.mazePartMap[row][col].hovered = false;
            }
        }

    }

    /**
     * Override.
     */
    public render(): void {
        super.render();
        for (let row = 0; row < this.mazePartMap.length; row++) {
            for (let col = 0; col < this.mazePartMap[row].length; col++) {
                // copy tilelayout to tilemap
                const length: number = this.mazePartMap[row][col].length;
                this.mazePartMap[row][col].render(col * length, row * length, this.stage.ctx);
            }
        }
    }

    public getMazePart(position: TSE.Math.IPoint): MazePart {
        if (position.x < 0 || position.x > this.width ||
            position.y < 0 || position.y > this.height) {
            return null;
        }
        const currentRow: number = Math.floor(position.y / this.mazePartSize);
        const currentCol: number = Math.floor(position.x / this.mazePartSize);
        if (!this.mazePartMap[currentRow]) {
            return null;
        }

        return this.mazePartMap[currentRow][currentCol];
    }

    // This some hacky bullshit
    // TODO: Fix this hacky bullcrap
    public setAdjacentTilesSeen(actor: TSE.CircleActor): void {
        let mostTop: number = Math.floor((actor.position.y - actor.radius) / this.mazePartSize);
        let mostBottom: number = Math.floor((actor.position.y + actor.radius) / this.mazePartSize);
        let mostLeft: number = Math.floor((actor.position.x - actor.radius) / this.mazePartSize);
        let mostRight: number = Math.floor((actor.position.x + actor.radius) / this.mazePartSize);

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
                    x: actor.position.x - i * this.mazePartSize,
                    y: actor.position.y - j * this.mazePartSize,
                }, actor.radius);

                const tiles: TSE.TileMapUtils.Tile[] =
                    this.mazePartMap[j][i].tilesLayout.getTilesAdjacentToCircleActor(circleActor);
                for (let tile of tiles) {
                    tile.value.seen = true;
                }
                // End of hacky bullcrap
            }
        }

    }

    // http://jonathanwhiting.com/tutorial/collision/
    public isRectActorColliding(actor: TSE.RectActor): boolean {
        if (actor.position.x < 0 || actor.position.x + actor.width > this.width ||
            actor.position.y < 0 || actor.position.y + actor.height > this.height ) {
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
        for (let row = 0; row < this.mazePartMap.length; row++) {
            for (let col = 0; col < this.mazePartMap[row].length; col++) {
                // copy tilelayout to tilemap
                const mazePart: MazePart = this.mazePartMap[row][col];
                for (let innerRow = 0; innerRow < mazePart.diameter; innerRow++) {
                    for (let innerCol = 0; innerCol < mazePart.diameter; innerCol++) {
                        const tile: MazeTile = mazePart.tilesLayout.getTile(innerRow, innerCol);
                        this.tileMap.setTile(row * mazePart.diameter + innerRow,
                            col * mazePart.diameter + innerCol, tile.type);
                    }
                }
            }
        }
    }

}
