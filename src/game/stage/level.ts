import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {MazePart, MazePartFactory, MazePartType} from '../actors/maze_part';
import Player from '../actors/player';

const MAZE_PARTS: MazePart[][] = [];
MAZE_PARTS[0] = [];
MAZE_PARTS[0][0] = MazePartFactory.createMazePart(MazePartType.STRAIGHT);
MAZE_PARTS[0][0].rotateRight();
MAZE_PARTS[0][1] = MazePartFactory.createMazePart(MazePartType.CROSS);
MAZE_PARTS[0][2] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[0][3] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[0][4] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[1] = [];
MAZE_PARTS[1][0] = MazePartFactory.createMazePart(MazePartType.CROSS);
MAZE_PARTS[1][1] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[1][2] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[1][2].rotateRight();
MAZE_PARTS[1][3] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[1][3].rotateRight();
MAZE_PARTS[1][3].rotateRight();
MAZE_PARTS[1][4] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[1][4].rotateRight();
MAZE_PARTS[1][4].rotateRight();
MAZE_PARTS[1][4].rotateRight();
MAZE_PARTS[2] = [];
MAZE_PARTS[2][0] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[2][1] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[2][2] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[2][2].rotateLeft();
MAZE_PARTS[2][3] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[2][4] = MazePartFactory.createMazePart(MazePartType.CROSS);
MAZE_PARTS[3] = [];
MAZE_PARTS[3][0] = MazePartFactory.createMazePart(MazePartType.CROSS);
MAZE_PARTS[3][1] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[3][2] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[3][2].rotateRight();
MAZE_PARTS[3][3] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[3][3].rotateRight();
MAZE_PARTS[3][3].rotateRight();
MAZE_PARTS[3][4] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[3][4].rotateRight();
MAZE_PARTS[3][4].rotateRight();
MAZE_PARTS[3][4].rotateRight();
MAZE_PARTS[4] = [];
MAZE_PARTS[4][0] = MazePartFactory.createMazePart(MazePartType.CROSS);
MAZE_PARTS[4][1] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[4][2] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[4][2].rotateRight();
MAZE_PARTS[4][3] = MazePartFactory.createMazePart(MazePartType.CORNER);
MAZE_PARTS[4][3].rotateRight();
MAZE_PARTS[4][3].rotateRight();
MAZE_PARTS[4][4] = MazePartFactory.createMazePart(MazePartType.T_BONE);
MAZE_PARTS[4][4].rotateRight();
MAZE_PARTS[4][4].rotateRight();
MAZE_PARTS[4][4].rotateRight();

export default class Level extends TSE.Stage {

    private maze: Maze;
    private player: Player;
    private camera: TSE.Math.IPoint;

    /**
     * Override.
     */
    public init() {
        const tileSize: number = 32;
        this.maze = new Maze(TSE.Math.ORIGIN, 640, 640, tileSize);
        this.maze.setMazeParts(MAZE_PARTS);
        super.addActor(this.maze);

        const ACTOR_LENGTH: number = 16;
        this.player = new Player({x: 0, y: 38}, ACTOR_LENGTH, ACTOR_LENGTH, {layer: 1});
        super.addActor(this.player);

        this.player.maze = this.maze;
    }

    public update(step: number): void {
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

        let cameraX: number = - this.player.position.x + this.width / 2;
        let cameraY: number = - this.player.position.y + this.height / 2;

        // Clamp camera to puzzle area
        cameraX = Math.min(0, cameraX);
        cameraY = Math.min(0, cameraY);
        cameraX = Math.max(cameraX, - this.maze.width + this.width);
        cameraY = Math.max(cameraY, - this.maze.height + this.height);

        ctx.translate(cameraX, cameraY);
        this.camera = {x: cameraX, y: cameraY};
        super.render();
        ctx.restore();
    }

    private getMousePosition(): TSE.Math.IPoint {
        return {x: this.player.mousePosition.x - this.camera.x,
            y: this.player.mousePosition.y - this.camera.y};
    }
}
