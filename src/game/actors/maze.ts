import * as TSE from '../../lib';
import {MazePart, TileLayouts} from './maze_part';

/**
 * The maze.
 */
export default class Maze extends TSE.RectActor {

    private mazePartMap: MazePart[][];
    private tileMap: TSE.TileMap;
    private tileSize: number;

    constructor(origin: TSE.Math.IPoint, width: number, height: number, tileSize: number) {
        super(origin, width, height, {layer: 0});
        this.tileSize = tileSize;
        this.mazePartMap = [];
    }

    public setMazeParts(mazePartMap: MazePart[][]) {
        this.mazePartMap = mazePartMap;
    }

    /**
     * Override.
     */
    public update(step: number): void {
        super.update(step);
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
    public render(): void {
        super.render();
        this.tileMap.drawDebug(this.stage.ctx);
    }

    private updateTileMapWithMazeParts(): void {
        for (let i = 0; i < this.mazePartMap.length; i++) {
            for (let j = 0; j < this.mazePartMap[i].length; j++) {
                // copy tilelayout to tilemap
                const x: number = this.mazePartMap[i][j].width * this.tileSize;
                const y: number = this.mazePartMap[i][j].height * this.tileSize;


            }
        }
    }
}
