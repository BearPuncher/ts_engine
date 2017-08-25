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
MAZE_PARTS[2][3].rotateRight();
MAZE_PARTS[2][3].rotateRight();
MAZE_PARTS[2][4] = MazePartFactory.createMazePart(MazePartType.CROSS);
MAZE_PARTS[2][4].rotateLeft();
MAZE_PARTS[2][4].rotateLeft();
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


export default class LevelOneStage extends TSE.Stage {

    private maze: Maze;
    private player: Player;
    private tileSize: number;

    /**
     * Override.
     */
    public init() {
        this.tileSize = 32;
        this.maze = new Maze(TSE.Math.ORIGIN, this.width, this.height, this.tileSize);
        this.maze.setMazeParts(MAZE_PARTS);
        super.addActor(this.maze);

        const ACTOR_RADIUS: number = 16;
        this.player = new Player(TSE.Math.ORIGIN, ACTOR_RADIUS, {layer: 2});
        super.addActor(this.player);
    }

    /**
     * Override.
     */
    public render(): void {
        super.render();
    }
}
