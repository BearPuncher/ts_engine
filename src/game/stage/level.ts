import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {MazePart, MazePartFactory, MazePartType} from '../actors/maze_part';
import Player from '../actors/player';
import Treasure from '../actors/treasure';
import * as TinyMusic from '../../../node_modules/tinymusic';

interface IMazePartData {
    t: MazePartType;
    r: number;
    cr: boolean;
}

export const MAP_LAYOUTS = [
    [
        [[MazePartType.CO, 1, false], [MazePartType.DE, 3, false], [MazePartType.DE, 2, false], [MazePartType.EX, 2, false]],
        [[MazePartType.TB, 0, true], [MazePartType.ST, 1, false], [MazePartType.CO, 3, false], [MazePartType.ST, 1, true]],
        [[MazePartType.ST, 0, false], [MazePartType.DE, 2, false], [MazePartType.CO, 1, false], [MazePartType.TB, 3, false]],
        [[MazePartType.CO, 0, false], [MazePartType.TB, 3, true], [MazePartType.CO, 3, false], [MazePartType.DE, 0, false]],
    ],
    [
        [[MazePartType.DE, 2, false], [MazePartType.DE, 2, false], [MazePartType.CO, 1, false], [MazePartType.ST, 1, false], [MazePartType.CO, 2, false]],
        [[MazePartType.CO, 0, false], [MazePartType.CR, 0, false], [MazePartType.TB, 0, false], [MazePartType.CO, 2, false], [MazePartType.DE, 0, false]],
        [[MazePartType.CO, 1, false], [MazePartType.CR, 0, false], [MazePartType.ST, 1, false], [MazePartType.TB, 3, false], [MazePartType.EX, 2, false]],
        [[MazePartType.CO, 0, false], [MazePartType.TB, 0, false], [MazePartType.DE, 3, false], [MazePartType.CO, 0, false], [MazePartType.CO, 3, false]],
    ],
];

// TODO: drawMazeParts shadows around circle
// TODO: change tilemap to keep tyle info
export abstract class Level extends TSE.Stage {

    /**
     * Maze.
     */
    protected m: Maze;
    /**
     * Player 1.
     */
    protected p1: Player;
    protected camera: TSE.Math.IPoint = {x: 0, y: 0};
    protected cameraClamp: boolean = false;
    protected treasures: Treasure[];
    protected numTreasures: number;

    public constructor(width: number, height: number) {
        super(width, height);
        this.treasures = [];
        this.numTreasures = 0;
    }

    /**
     * Override.
     */
    public abstract init(): void;

    /**
     * Override.
     */
    public update(step: number): void {
        this.m.resetState();
        let cursor: string = 'no-drop';
        const pos: TSE.Math.IPoint = this.getMousePosition();

        if (this.p1.p) {
            // Set adjacent m parts to be actionable
            const adjacent: MazePart[] = this.m.getAdjacentMazeParts(this.p1.p);
            for (let i = 0; i < adjacent.length; i++) {
                if (adjacent[i]) {
                    adjacent[i].actionable = true;
                }
            }
        }

        if (pos) {
            // TODO: This is hacky
            const selected: MazePart = this.m.getMazePartAtPosition(pos);
            const standing: MazePart = this.m.getMazePartAtPosition(this.p1.p);

            // TODO: Get standing mazeTile center

            const col: number = Math.floor(this.p1.p.x / this.m.mpS);
            const row: number = Math.floor(this.p1.p.y / this.m.mpS);

            const dX: number = Math.abs(
                Math.floor(pos.x / this.m.mpS) - col);
            const dY: number = Math.abs(
                Math.floor(pos.y / this.m.mpS) - row);

            const adjacent: boolean = (dX === 0 && dY === 1) || (dX === 1 && dY === 0);
            //const adjacent: boolean = (dX >= 0 && dY <= 1) || (dX >= 1 && dY <= 0);

            if (selected && standing && adjacent) {
                standing.actionable = true;

                if (selected.rotates) {
                    cursor = 'pointer';
                    if (this.p1.ms) {

                        /*const tileCenter: IPoint = {
                            x: col * this.m.mpS + this.m.mpS / 2,
                            y: row + this.m.mpS + this.m.mpS / 2
                        };*/

                        if (this.p1.ms.l) {
                            this.m.needsUpdate = true;
                            selected.rotateLeft();
                            // Rotate if standing on
                            /*if (selected === standing) {
                                this.p1.p = TSE.Math.rotatePoint(tileCenter, 90, this.p1.p);
                            }*/
                        }
                        if (this.p1.ms.r) {
                            this.m.needsUpdate = true;
                            selected.rotateRight();
                            // Rotate if standing on
                            /*if (selected === standing) {
                                this.p1.p = TSE.Math.rotatePoint(tileCenter, -90, this.p1.p);
                            }*/
                        }
                    }
                }
                selected.hovered = true;
            } else if (selected === standing) {
                if (selected.rotates) {
                    cursor = 'not-allowed';
                }
                selected.actionable = true;
            }
        }
        this.ctx.canvas.style.cursor = cursor;

        // Check if p1 picked up treasure
        // yuck
        for (let t of this.treasures) {
            if (!t.remove && t.isColliding(this.p1)) {
                t.remove = true;
                this.numTreasures++;
            }
        }

        super.update(step);
    }

    /**
     * Override.
     */
    public render(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.w, this.h);

        let cX: number = - this.p1.p.x + this.w / 2;
        let cY: number = - this.p1.p.y + this.h / 2;

        if (this.cameraClamp) {
            // Clamp camera to puzzle area
            cX = Math.min(0, cX);
            cY = Math.min(0, cY);
            cX = Math.max(cX, - this.m.w + this.w);
            cY = Math.max(cY, - this.m.h + this.h);
        }

        ctx.translate(cX, cY);
        this.camera = {x: cX, y: cY};
        super.render();
        this.m.drawShadows(this.p1.lantern.p, this.p1.lantern.r);
        this.m.drawMazePostEffects();
        ctx.restore();

        // Show treasure count
        ctx.font = '30px Arial';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.fillText("Treasure Found " + this.numTreasures + "/" + this.treasures.length, 30, this.h - 30);
    }

    protected createTreasure(point: TSE.Math.IPoint) {
        const treasure = new Treasure(point);
        this.treasures.push(treasure);
        super.addActor(treasure);
    }

    protected setMapPartsFromLevel(level: number): void {
        const mazeParts: MazePart[][] = [];

        let row: number = 0;
        for (let array of MAP_LAYOUTS[level]) {
            mazeParts[row] = [];
            for (let col = 0; col < array.length; col++) {
                const data = array[col];
                mazeParts[row][col] = MazePartFactory.create(Number(data[0]), Number(data[1]), Boolean(data[2]));
            }
            row++;
        }
        this.m.setMazeParts(mazeParts);
    }

    private getMousePosition(): TSE.Math.IPoint {
        if (!this.p1.ms.p) {
            return null;
        }
        return {x: this.p1.ms.p.x - this.camera.x,
            y: this.p1.ms.p.y - this.camera.y};
    }
}
