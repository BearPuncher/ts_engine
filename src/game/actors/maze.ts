import * as TSE from '../../lib';
import {IMazeTile, MazePart, TileType} from './maze_part';
import {IPoint} from "../../lib/utils/math";

/**
 * The m.
 */
export default class Maze extends TSE.RectActor {

    /**
     * MazePart Size.
     */
    public mpS: number;
    public needsUpdate: boolean;
    /**
     * Part Map.
     */
    private ptMp: MazePart[][];
    private tileMap: TSE.TileMapUtils.TileMap;
    private rows: number;
    private cols: number;

    constructor(width: number, height: number, mazePartSize: number) {
        super(TSE.Math.ORIGIN, width, height, {layer: 0});
        this.mpS = mazePartSize;
        this.rows = height / mazePartSize;
        this.cols = width / mazePartSize;
        this.ptMp = [];
        this.needsUpdate = true;
    }

    public setMazeParts(mazePartMap: MazePart[][]): void {
        this.ptMp = mazePartMap;
    }

    /**
     * Override.
     */
    public init(): void {
        const tileSize: number = 32;
        const cols: number = this.w / tileSize;
        const rows: number = this.h / tileSize;

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

    public iterateMazeParts(callback: (part: MazePart, row: number, col: number) => void): void {
        for (let row = 0; row < this.ptMp.length; row++) {
            for (let col = 0; col < this.ptMp[row].length; col++) {
                callback(this.ptMp[row][col], row, col);
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
            const length: number = part.lg;
            part.drawMazeParts(col * length, row * length, this.st.ctx);
        });
    }

    public drawShadows(lightSource: TSE.Math.IPoint, radius: number): void {
        const tileLocation = this.translatePointToTile(lightSource);
        const dist: number = Math.ceil(radius / this.tileMap.tSz) + 1;
        const shadowDepth: number = dist * this.tileMap.tSz;
        const startX: number = (tileLocation.col - dist < 0) ? 0 : tileLocation.col - dist;
        const startY: number = (tileLocation.row - dist < 0) ? 0 : tileLocation.row - dist;

        const stopX: number  = (tileLocation.col + dist > this.tileMap.cl) ? this.tileMap.cl : tileLocation.col + dist;
        const stopY: number  = (tileLocation.row + dist > this.tileMap.rw) ? this.tileMap.rw : tileLocation.row + dist;

        for(let i = startX; i < stopX; i++) {
            for (let j = startY; j < stopY; j++) {
                const tile: IMazeTile = this.tileMap.getTile(j, i);
                if (tile.type === TileType.W) {
                    const tileSize: number = this.tileMap.tSz;
                    const x: number = tileSize * i;
                    const y: number = tileSize * j;

                    this.drawWallShadow(lightSource, x, y, shadowDepth);
                }
            }
        }
    }

    public drawAsMap() {
        const ctx: CanvasRenderingContext2D = this.st.ctx;
        for (let r = 0; r < this.tileMap.rw; r++) {
            for (let c = 0; c < this.tileMap.cl; c++) {
                const tile: IMazeTile = this.tileMap.getTile(r, c);
                if (tile.type !== TileType.W && tile.seen) {
                    ctx.fillStyle = 'grey';
                    ctx.strokeStyle = 'grey';

                    const tileSize: number = this.tileMap.tSz;
                    const x: number = tileSize * c;
                    const y: number = tileSize * r;
                    ctx.lineWidth = 1;
                    ctx.fillRect(x, y, tileSize, tileSize);
                    ctx.strokeRect(x, y, tileSize, tileSize);
                }
            }
        }
    }

    public drawMazePostEffects(): void {
        this.iterateMazeParts((part: MazePart, row: number, col: number) => {
            const length: number = part.lg;
            part.drawPostEffects(col * length, row * length, this.st.ctx);
        });
    }

    public getAdjacentMazeParts(pos: TSE.Math.IPoint): MazePart[] {
        if (pos.x < 0 || pos.x > this.w ||
            pos.y < 0 || pos.y > this.h) {
            return [];
        }
        const currentRow: number = Math.floor(pos.y / this.mpS);
        const currentCol: number = Math.floor(pos.x / this.mpS);
        if (!this.ptMp[currentRow]) {
            return [];
        }

        const returnArray: MazePart[] = [];
        if (currentRow - 1 >= 0) {
            returnArray.push(this.ptMp[currentRow - 1][currentCol]);
        }
        if (currentRow + 1 < this.rows) {
            returnArray.push(this.ptMp[currentRow + 1][currentCol]);
        }
        if (currentCol - 1 >= 0) {
            returnArray.push(this.ptMp[currentRow][currentCol - 1]);
        }
        if (currentCol + 1 < this.cols) {
            returnArray.push(this.ptMp[currentRow][currentCol + 1]);
        }

        return returnArray;
    }

    public getMazePartAtPosition(pos: TSE.Math.IPoint): MazePart {
        if (pos.x < 0 || pos.x > this.w ||
            pos.y < 0 || pos.y > this.h) {
            return null;
        }
        const currentRow: number = Math.floor(pos.y / this.mpS);
        const currentCol: number = Math.floor(pos.x / this.mpS);
        if (!this.ptMp[currentRow]) {
            return null;
        }

        return this.ptMp[currentRow][currentCol];
    }

    public getTileAtPosition(pos: TSE.Math.IPoint): IMazeTile {
        const loc = this.translatePointToTile(pos);
        return this.tileMap.getTile(loc.row, loc.col);
    }

    // This some hacky bullshit
    // TODO: Fix this hacky bullcrap
    public setAdjacentTilesSeen(actor: TSE.CircleActor): void {
        let mostTop: number = Math.floor((actor.p.y - actor.r) / this.mpS);
        let mostBottom: number = Math.floor((actor.p.y + actor.r) / this.mpS);
        let mostLeft: number = Math.floor((actor.p.x - actor.r) / this.mpS);
        let mostRight: number = Math.floor((actor.p.x + actor.r) / this.mpS);

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
                    x: actor.p.x - i * this.mpS,
                    y: actor.p.y - j * this.mpS,
                }, actor.r);

                const tiles: TSE.TileMapUtils.ITile[] =
                    this.ptMp[j][i].ly.getTilesAdjacentToCircleActor(circleActor);
                for (const tile of tiles) {
                    tile.value.seen = true;
                }
                // End of hacky bullcrap
            }
        }

    }

    // http://jonathanwhiting.com/tutorial/collision/
    public isRectActorColliding(actor: TSE.RectActor): boolean {
        if (actor.p.x < 0 || actor.p.x + actor.w > this.w ||
            actor.p.y < 0 || actor.p.y + actor.h > this.h ) {
            return true;
        }

        const tiles: TSE.TileMapUtils.ITile[] = this.tileMap.getTilesAdjacentToRectActor(actor);

        if (tiles.length === 0) {
            return false;
        }

        for (const tile of tiles) {
            if (tile.value.type === TileType.W) {
                return true;
            }
        }

        return false;
    }

    private  drawWallShadow(pos: IPoint, fromX: number, fromY: number, shadowDepth: number) {
        //Get points
        const w: number = this.tileMap.tSz;
        const points: TSE.Math.IPoint[] = [
            {x: fromX, y: fromY},
            {x: fromX + w, y: fromY},
            {x: fromX + w, y: fromY + w},
            {x: fromX, y: fromY + w}];

        const actualPoints: TSE.Math.IPoint[] = [];
        const dotProducts: number[] = [];

        for (let i: number = 0; i < points.length; i++) {
            const j: number = (i < points.length - 1) ? i + 1 : 0;

            const lightVectX = points[i].x - pos.x;
            const lightVectY = points[i].y - pos.y;

            const nx = -(points[j].y - points[i].y);
            const ny = points[j].x - points[i].x;

            const outcome = TSE.Math.dotproduct([lightVectX, lightVectY], [nx, ny]);
            dotProducts.push(outcome);
        }

        for(let i: number = 0; i < dotProducts.length; i++) {
            const j = (i < dotProducts.length - 1) ? i + 1 : 0;

            if (TSE.Math.sign(dotProducts[i]) == 1 && TSE.Math.sign(dotProducts[j]) == 1) {
                actualPoints.push(points[j]);
            } else if (TSE.Math.sign(dotProducts[i]) == 1 && TSE.Math.sign(dotProducts[j]) != 1) {
                actualPoints.push(points[j]);

                const newPointX = points[j].x + (points[j].x - pos.x) * shadowDepth;
                const newPointY = points[j].y + (points[j].y - pos.y) * shadowDepth;
                actualPoints.push({x: newPointX, y: newPointY});

            } else if (TSE.Math.sign(dotProducts[i]) != 1 && TSE.Math.sign(dotProducts[j]) == 1) {

                const newPointX = points[j].x + (points[j].x - pos.x) * shadowDepth;
                const newPointY = points[j].y + (points[j].y - pos.y) * shadowDepth;
                actualPoints.push({x: newPointX, y: newPointY});

                actualPoints.push(points[j]);
            }
        }

        const ctx: CanvasRenderingContext2D = this.st.ctx;
        if (actualPoints.length != 0) {
            ctx.beginPath();
            ctx.moveTo(actualPoints[0].x, actualPoints[0].y);
            for(let i = 1; i < actualPoints.length; i++) {
                ctx.lineTo(actualPoints[i].x, actualPoints[i].y);

            }
            ctx.closePath( );
            ctx.fillStyle = 'black';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
        }
    }

    private translatePointToTile(pos: TSE.Math.IPoint) {
        if (pos.x < 0 || pos.x > this.w ||
            pos.y < 0 || pos.y > this.h) {
            return null;
        }
        const currentRow: number = Math.floor(pos.y / this.tileMap.tSz);
        const currentCol: number = Math.floor(pos.x / this.tileMap.tSz);

        return {row: currentRow, col: currentCol};
    }

    private updateTileMapWithMazeParts(): void {
        this.iterateMazeParts((part: MazePart, row: number, col: number) => {
            for (let innerRow = 0; innerRow < part.di; innerRow++) {
                for (let innerCol = 0; innerCol < part.di; innerCol++) {
                    const tile: IMazeTile = part.ly.getTile(innerRow, innerCol);
                    this.tileMap.setTile(row * part.di + innerRow,
                        col * part.di + innerCol, tile);
                }
            }
        });
    }
}
