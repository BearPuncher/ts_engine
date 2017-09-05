import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {MazePart} from '../actors/maze_part';
import Player from '../actors/player';
import Treasure from "../actors/treasure";

// TODO: drawMazeParts shadows around circle
// TODO: change tilemap to keep tyle info
export abstract class Level extends TSE.Stage {

    protected maze: Maze;
    protected player: Player;
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
        this.maze.resetState();
        let cursor: string = 'no-drop';
        const pos: TSE.Math.IPoint = this.getMousePosition();

        if (this.player.pos) {
            // Set adjacent maze parts to be actionable
            const adjacentMazeParts: MazePart[] = this.maze.getAdjacentMazeParts(this.player.pos);
            for (let i = 0; i < adjacentMazeParts.length; i++) {
                if (adjacentMazeParts[i]) {
                    adjacentMazeParts[i].actionable = true;
                }
            }
        }

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
                selectedPart.actionable = true;
            }
        }
        this.ctx.canvas.style.cursor = cursor;

        // Check if player picked up treasure
        // yuck
        for (let treasure of this.treasures) {
            if (!treasure.remove && treasure.isColliding(this.player)) {
                treasure.remove = true;
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
        this.maze.drawMazePostEffects();
        ctx.restore();

        // Show treasure count
        ctx.font = '30px Arial';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.fillText("Treasure Found " + this.numTreasures + "/" + this.treasures.length, 30, this.height - 30);
    }

    private getMousePosition(): TSE.Math.IPoint {
        if (!this.player.mouse.pos) {
            return null;
        }
        return {x: this.player.mouse.pos.x - this.camera.x,
            y: this.player.mouse.pos.y - this.camera.y};
    }
}
