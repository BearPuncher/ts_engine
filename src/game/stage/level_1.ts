import * as TSE from '../../lib';
import {Level} from './level';
import Lantern from '../actors/lantern';
import Maze from '../actors/maze';
import Player from '../actors/player';

const WIDTH: number = 512;
const HEIGHT: number = 512;
const TILE_SIZE: number = 128;

export default class Level1 extends Level {

    public init(): void {
        this.m = new Maze(WIDTH, HEIGHT, TILE_SIZE);
        this.setMapPartsFromLevel(0);
        super.addActor(this.m);

        const ACTOR_LENGTH: number = 16;
        this.p1 = new Player({x: 184, y: 312}, ACTOR_LENGTH, ACTOR_LENGTH, {layer: 1});
        super.addActor(this.p1);
        this.p1.maze = this.m;

        this.createTreasure({x: 308, y: 48});
        this.createTreasure({x: 432, y: 432});

        const lantern = new Lantern(this.p1, 36);
        super.addActor(lantern);

        this.playTime = 0;
    }
}
