import * as TSE from '../../lib';
import Lantern from '../actors/lantern';
import {Level} from './level';
import Maze from '../actors/maze';
import Player from '../actors/player';

const WIDTH: number = 640;
const HEIGHT: number = 512;
const TILE_SIZE: number = 128;

export default class Level2 extends Level {

    public init(): void {
        this.m = new Maze(WIDTH, HEIGHT, TILE_SIZE);
        this.setMapPartsFromLevel(1);
        super.addActor(this.m);

        const ACTOR_LENGTH: number = 16;
        this.p1 = new Player({x: 184, y: 312}, ACTOR_LENGTH, ACTOR_LENGTH, {layer: 1});
        super.addActor(this.p1);
        this.p1.maze = this.m;

        this.createTreasure({x: 560, y: 176});
        this.createTreasure({x: 304, y: 432});

        const lantern = new Lantern(this.p1, 36);
        super.addActor(lantern);
    }
}
