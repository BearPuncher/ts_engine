import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {MazePart} from '../actors/maze_part';
import Player from '../actors/player';
import Treasure from "../actors/treasure";
import * as TinyMusic from '../../../node_modules/tinymusic';
import {pushd} from "shelljs";
import {IPoint} from "../../lib/utils/math";

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
            // TODO: rotate player position round mazeTIle center if selected === standing

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
        this.m.drawMazePostEffects();
        ctx.restore();

        // Show treasure count
        ctx.font = '30px Arial';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.fillText("Treasure Found " + this.numTreasures + "/" + this.treasures.length, 30, this.h - 30);
    }

    private getMousePosition(): TSE.Math.IPoint {
        if (!this.p1.ms.p) {
            return null;
        }
        return {x: this.p1.ms.p.x - this.camera.x,
            y: this.p1.ms.p.y - this.camera.y};
    }
}
