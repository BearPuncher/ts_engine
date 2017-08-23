import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {Direction, MazePart, MazePartFactory, MazePartType} from '../actors/maze_part';
import Player from '../actors/player';

const MAZE_PARTS: MazePart[][] = [];
MAZE_PARTS[0] = [];
MAZE_PARTS[0][0] = MazePartFactory.createMazePart(MazePartType.STRAIGHT, {x: 0, y: 0});
MAZE_PARTS[0][1] = MazePartFactory.createMazePart(MazePartType.STRAIGHT, {x: 0, y: 1});

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

        for (const array of MAZE_PARTS) {
            for (const mazePart of array) {
                super.addActor(mazePart);

            }
        }

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
