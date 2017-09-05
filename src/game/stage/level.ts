import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {MazePart} from '../actors/maze_part';
import Player from '../actors/player';
import Treasure from "../actors/treasure";
import * as TinyMusic from '../../../node_modules/tinymusic';

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

            const dX: number = Math.abs(
                Math.floor(pos.x / this.m.mazePartSize) - Math.floor(this.p1.p.x / this.m.mazePartSize));
            const dY: number = Math.abs(
                Math.floor(pos.y / this.m.mazePartSize) - Math.floor(this.p1.p.y / this.m.mazePartSize));

            const adjacent: boolean = (dX === 0 && dY === 1) || (dX === 1 && dY === 0);

            if (selected && adjacent) {
                // If standing on m part
                if (selected !== standing) {
                    if (selected.rotates) {
                        cursor = 'pointer';
                        if (this.p1.mouse) {
                            if (this.p1.mouse.left) {
                                this.m.needsUpdate = true;
                                selected.rotateLeft();
                            }
                            if (this.p1.mouse.right) {
                                this.m.needsUpdate = true;
                                selected.rotateRight();
                            }
                        }
                    }
                    selected.hovered = true;
                }
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
        if (!this.p1.mouse.pos) {
            return null;
        }
        return {x: this.p1.mouse.pos.x - this.camera.x,
            y: this.p1.mouse.pos.y - this.camera.y};
    }
}
