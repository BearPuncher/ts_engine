/**
 * Created by daniel on 9/10/17.
 */
import Lantern from '../actors/lantern';
import {Level} from './level';
import Maze from '../actors/maze';
import Player from '../actors/player';

const WIDTH: number = 640;
const HEIGHT: number = 640;
const TILE_SIZE: number = 128;

export default class Level3 extends Level {

    public init(): void {
        this.m = new Maze(WIDTH, HEIGHT, TILE_SIZE);
        this.setMapPartsFromLevel(2);
        super.addActor(this.m);

        const ACTOR_LENGTH: number = 16;
        this.p1 = new Player({x: 184, y: 440}, ACTOR_LENGTH, ACTOR_LENGTH, {layer: 1});
        super.addActor(this.p1);
        this.p1.maze = this.m;

        this.createTreasure({x: 48, y: 48});
        this.createTreasure({x: 432, y: 176});
        this.createTreasure({x: 48, y: 440});
        this.createTreasure({x: 560, y: 560});

        const lantern = new Lantern(this.p1, 36);
        super.addActor(lantern);

        this.playTime = 0;
    }
}
