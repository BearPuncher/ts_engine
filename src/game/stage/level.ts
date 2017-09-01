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
        let cursor: string = 'default';
        const pos: TSE.Math.IPoint = this.getMousePosition();
        if (pos) {
            // TODO: This is hacky
            const selectedMazePart: MazePart = this.maze.getMazePartAtPosition(pos);
            const standingOnPart: MazePart = this.maze.getMazePartAtPosition(this.player.position);
            if (selectedMazePart) {
                // If standing on maze part
                if (selectedMazePart !== standingOnPart) {
                    cursor = 'pointer';
                    if (this.player.mouse) {
                        if (this.player.mouse.left) {
                            this.maze.needsUpdate = true;
                            selectedMazePart.rotateLeft();
                        }
                        if (this.player.mouse.right) {
                            this.maze.needsUpdate = true;
                            selectedMazePart.rotateRight();
                        }
                    }
                }
                if (selectedMazePart === standingOnPart) {
                    cursor = 'not-allowed';
                }
                if (!selectedMazePart.rotates) {
                    cursor = 'no-drop';
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
        const pos: TSE.Math.IPoint = this.getMousePosition();
        if (pos) {
            const selectedMazePart: MazePart = this.maze.getMazePartAtPosition(pos);
            if (selectedMazePart) {
                selectedMazePart.hovered = true;
            }
        }

        const ctx: CanvasRenderingContext2D = this.ctx;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);

        let cameraX: number = - this.player.position.x + this.width / 2;
        let cameraY: number = - this.player.position.y + this.height / 2;

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
