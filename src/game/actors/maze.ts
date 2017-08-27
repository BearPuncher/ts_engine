import * as TSE from '../../lib';
import {MazePart} from './maze_part';
import RectActor from "../../lib/actors/rect_actor";

/**
 * The maze.
 */
export default class Maze extends TSE.RectActor {

    private mazePartMap: MazePart[][];
    private tileMap: TSE.TileMap;
    private tileSize: number;
    private needsUpdate: boolean;

    constructor(origin: TSE.Math.IPoint, width: number, height: number, tileSize: number) {
        super(origin, width, height, {layer: 0});
        this.tileSize = tileSize;
        this.mazePartMap = [];
        this.needsUpdate = true;
    }

    public setMazeParts(mazePartMap: MazePart[][]) {
        this.mazePartMap = mazePartMap;
    }

    // http://jonathanwhiting.com/tutorial/collision/
    public isRectActorColliding(actor: RectActor): boolean {
        const tilemapTileSize = this.tileMap.tileSize;
        let leftTile: number = Math.floor(actor.position.x / tilemapTileSize);
        let rightTile: number = Math.floor((actor.position.x + actor.width) / tilemapTileSize);
        let topTile: number = Math.floor(actor.position.y / tilemapTileSize);
        let bottomTile: number = Math.floor((actor.position.y + actor.height) / tilemapTileSize);

        if(leftTile < 0) {
            leftTile = 0;
        }

        if (rightTile > this.tileMap.cols) {
            rightTile = this.tileMap.cols;
        }

        if(topTile < 0) {
            topTile = 0;
        }

        if(bottomTile > this.tileMap.rows) {
            bottomTile = this.tileMap.rows;
        }

        //let anyCollision: boolean = false
        for(let i = leftTile; i <= rightTile; i++) {
            for(let j = topTile; j <= bottomTile; j++) {
                let tile = this.tileMap.getTile(j, i);
                if(tile === 0) {
                    return true
                }
            }
        }

        return false;
    }

    /**
     * Override.
     */
    public init() {
        const cols: number = this.width / this.tileSize;
        const rows: number = this.height / this.tileSize;

        const tiles = new Array<number>(rows * cols);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                tiles[i * cols + j] = 0;
            }
        }

        this.tileMap = new TSE.TileMap(rows, cols, this.tileSize, tiles);
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

    /**
     * Override.
     */
    public render(): void {
        super.render();

        for (let row = 0; row < this.mazePartMap.length; row++) {
            for (let col = 0; col < this.mazePartMap[row].length; col++) {
                // copy tilelayout to tilemap
                const length: number = this.mazePartMap[row][col].length;
                this.mazePartMap[row][col].drawDebug(col * length, row * length, this.stage.ctx);
            }
        }

        this.tileMap.drawDebug(this.stage.ctx);
    }

    private updateTileMapWithMazeParts(): void {
        for (let row = 0; row < this.mazePartMap.length; row++) {
            for (let col = 0; col < this.mazePartMap[row].length; col++) {
                // copy tilelayout to tilemap
                const mazePart: MazePart = this.mazePartMap[row][col];
                for (let innerRow = 0; innerRow < mazePart.diameter; innerRow++) {
                    for (let innerCol = 0; innerCol < mazePart.diameter; innerCol++) {
                        const tile: number = mazePart.tilesLayout.getTile(innerRow, innerCol);
                        this.tileMap.setTile(row * mazePart.diameter + innerRow,
                            col * mazePart.diameter + innerCol, tile);
                    }
                }
                const x: number = mazePart.length * this.tileSize;
                const y: number = mazePart.length * this.tileSize;
            }
        }
    }


}
