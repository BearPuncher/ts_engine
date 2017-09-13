/**
 * Created by daniel on 9/10/17.
 */
import Lantern from '../actors/lantern';
import {Level} from './level';
import Maze from '../actors/maze';
import Player from '../actors/player';
import {MazePartType} from "../actors/maze_part";

const WIDTH: number = 768;
const HEIGHT: number = 640;
const TILE_SIZE: number = 128;

const LAYOUT = [
    [[MazePartType.CO, 1, false], [MazePartType.ST, 1, false], [MazePartType.ST, 0, true], [MazePartType.CO, 2, false], [MazePartType.CO, 1, false], [MazePartType.DE, 3, false]],
    [[MazePartType.TB, 1, false], [MazePartType.CO, 1, true], [MazePartType.DE, 2, false], [MazePartType.CO, 0, false], [MazePartType.TB, 2, true], [MazePartType.DE, 2, false]],
    [[MazePartType.DE, 0, false], [MazePartType.CO, 0, false], [MazePartType.CR, 0, false], [MazePartType.ST, 1, false], [MazePartType.CR, 0, false], [MazePartType.CO, 3, false]],
    [[MazePartType.CO, 1, false], [MazePartType.ST, 1, false], [MazePartType.TB, 3, false], [MazePartType.CO, 1, false], [MazePartType.ST, 1, true], [MazePartType.CO, 2, false]],
    [[MazePartType.DE, 2, true], [MazePartType.EX, 1, false], [MazePartType.CO, 3, false], [MazePartType.CO, 0, false], [MazePartType.CO, 3, false], [MazePartType.DE, 0, false]],
];

export default class Level4 extends Level {

    public init(): void {
        this.m = new Maze(WIDTH, HEIGHT, TILE_SIZE);
        this.setMapParts(LAYOUT);
        super.addActor(this.m);

        const ACTOR_LENGTH: number = 16;
        this.p1 = new Player({x: 312, y: 312}, ACTOR_LENGTH, ACTOR_LENGTH, {layer: 1});
        super.addActor(this.p1);
        this.p1.maze = this.m;

        this.createTreasure({x: 688, y: 48});
        this.createTreasure({x: 688, y: 176});
        this.createTreasure({x: 48, y: 304});
        this.createTreasure({x: 688, y: 560});
        this.createTreasure({x: 48, y: 560});

        const lantern = new Lantern(this.p1, 36);
        super.addActor(lantern);

        this.playTime = 0;
    }
}
