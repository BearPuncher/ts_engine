import * as TSE from '../../lib';
import {Level} from './level';
import Player from '../actors/player';
import Maze from '../actors/maze';
import {MazePart, MazePartType, MazePartFactory} from '../actors/maze_part';
import Lantern from '../actors/lantern';
import Treasure from '../actors/treasure';

const WIDTH: number = 512;
const HEIGHT: number = 512;
const TILE_SIZE: number = 128;

export default class Level1 extends Level {

    public init(): void {
        this.m = new Maze(WIDTH, HEIGHT, TILE_SIZE);
        this.setupMaze();
        super.addActor(this.m);

        const ACTOR_LENGTH: number = 16;
        this.p1 = new Player({x: 184, y: 312}, ACTOR_LENGTH, ACTOR_LENGTH, {layer: 1});
        super.addActor(this.p1);
        this.p1.maze = this.m;

        const treasure = new Treasure({x: 308, y: 48});
        this.treasures.push(treasure);
        super.addActor(treasure);

        const treasure2 = new Treasure({x: 432, y: 432});
        this.treasures.push(treasure2);
        super.addActor(treasure2);

        const lantern = new Lantern(this.p1, 36);
        super.addActor(lantern);
    }

    private setupMaze(): void {

        const MAZE_PARTS: MazePart[][] = [];
        MAZE_PARTS[0] = [];
        MAZE_PARTS[0][0] = MazePartFactory.create(MazePartType.CORNER, 1, false);
        MAZE_PARTS[0][1] = MazePartFactory.create(MazePartType.DEAD_END, 3, false);
        MAZE_PARTS[0][2] = MazePartFactory.create(MazePartType.DEAD_END, 2, false);
        MAZE_PARTS[0][3] = MazePartFactory.create(MazePartType.EXIT, 2, false);
        MAZE_PARTS[1] = [];
        MAZE_PARTS[1][0] = MazePartFactory.create(MazePartType.T_BONE, 0, true);
        MAZE_PARTS[1][1] = MazePartFactory.create(MazePartType.STRAIGHT, 1, false);
        MAZE_PARTS[1][2] = MazePartFactory.create(MazePartType.CORNER, 3, false);
        MAZE_PARTS[1][3] = MazePartFactory.create(MazePartType.STRAIGHT, 1, true);
        MAZE_PARTS[2] = [];
        MAZE_PARTS[2][0] = MazePartFactory.create(MazePartType.STRAIGHT, 0, false);
        MAZE_PARTS[2][1] = MazePartFactory.create(MazePartType.DEAD_END, 2, false);
        MAZE_PARTS[2][2] = MazePartFactory.create(MazePartType.CORNER, 1, false);
        MAZE_PARTS[2][3] = MazePartFactory.create(MazePartType.T_BONE, 3, false);
        MAZE_PARTS[3] = [];
        MAZE_PARTS[3][0] = MazePartFactory.create(MazePartType.CORNER, 0, false);
        MAZE_PARTS[3][1] = MazePartFactory.create(MazePartType.T_BONE, 3, true);
        MAZE_PARTS[3][2] = MazePartFactory.create(MazePartType.CORNER, 3, false);
        MAZE_PARTS[3][3] = MazePartFactory.create(MazePartType.DEAD_END, 0, false);

        this.m.setMazeParts(MAZE_PARTS);
    }
}