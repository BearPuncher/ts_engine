import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {MazePart} from '../actors/maze_part';
import Player from '../actors/player';

// TODO: render shadows around circle
// TODO: change tilemap to keep tyle info
export abstract class Level extends TSE.Stage {

    protected maze: Maze;
    protected player: Player;
    protected camera: TSE.Math.IPoint = {x: 0, y: 0};
    protected cameraClamp: boolean = false;

    /**
     * Override.
     */
    public abstract init(): void;

    /**
     * Override.
     */
    public update(step: number): void {
        this.maze.resetHover();
        let cursor: string = 'no-drop';
        const pos: TSE.Math.IPoint = this.getMousePosition();
        if (pos) {
            // TODO: This is hacky
            const selectedPart: MazePart = this.maze.getMazePartAtPosition(pos);
            const standingPart: MazePart = this.maze.getMazePartAtPosition(this.player.pos);

            const distX: number = Math.abs(
                Math.floor(pos.x / this.maze.mazePartSize) - Math.floor(this.player.pos.x / this.maze.mazePartSize));
            const distY: number = Math.abs(
                Math.floor(pos.y / this.maze.mazePartSize) - Math.floor(this.player.pos.y / this.maze.mazePartSize));

            const adjacent: boolean = (distX === 0 && distY === 1) || (distX === 1 && distY === 0);
            if (selectedPart && adjacent) {
                // If standing on maze part
                if (selectedPart !== standingPart) {
                    if (selectedPart.rotates) {
                        cursor = 'pointer';
                        if (this.player.mouse) {
                            if (this.player.mouse.left) {
                                this.maze.needsUpdate = true;
                                selectedPart.rotateLeft();
                            }
                            if (this.player.mouse.right) {
                                this.maze.needsUpdate = true;
                                selectedPart.rotateRight();
                            }
                        }
                    }
                    selectedPart.hovered = true;
                }
            } else if (selectedPart === standingPart) {
                if (selectedPart.rotates) {
                    cursor = 'not-allowed';
                }
            }
        }
        this.ctx.canvas.style.cursor = cursor;
        super.update(step);

    }

    /**
     * Override.
     */
    public render(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);

        let cameraX: number = - this.player.pos.x + this.width / 2;
        let cameraY: number = - this.player.pos.y + this.height / 2;

        if (this.cameraClamp) {
            // Clamp camera to puzzle area
            cameraX = Math.min(0, cameraX);
            cameraY = Math.min(0, cameraY);
            cameraX = Math.max(cameraX, - this.maze.width + this.width);
            cameraY = Math.max(cameraY, - this.maze.height + this.height);
        }

        ctx.translate(cameraX, cameraY);
        this.camera = {x: cameraX, y: cameraY};
        super.render();
        ctx.restore();
    }

    private getMousePosition(): TSE.Math.IPoint {
        if (!this.player.mouse.position) {
            return null;
        }
        return {x: this.player.mouse.position.x - this.camera.x,
            y: this.player.mouse.position.y - this.camera.y};
    }
}
