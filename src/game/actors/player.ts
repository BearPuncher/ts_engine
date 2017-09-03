import * as TSE from '../../lib';
import Maze from './maze';
import Lantern from './lantern';
import {TileType} from "./maze_part";

// Move direction
enum MoveDir {
    E = 0,
    SE = 45,
    S = 90,
    SW = 135,
    W = 180,
    NW = 225,
    N = 270,
    NE = 315,
}

/**
 * Controllable actor.
 */
export default class Player extends TSE.RectActor {

    public lantern: Lantern;
    public maze: Maze;
    // TODO: combine all mouse things under mouse interface.
    public mouse: {left: boolean, right: boolean, pos: TSE.Math.IPoint};
    private oldPos: TSE.Math.IPoint;

    public init(): void {
        this.mouse = {left: false, right: false, pos: null};
        this.debugColour = 'orange';
        const canvas: HTMLCanvasElement = this.stage.ctx.canvas;
        // Update mouse pos
        canvas.addEventListener('mousemove', (event: MouseEvent) => {
            const rect = this.stage.ctx.canvas.getBoundingClientRect();
            this.mouse.pos = {x: event.clientX - rect.left, y: event.clientY - rect.top};
        }, true);
        // Capture click
        canvas.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
            const rect = this.stage.ctx.canvas.getBoundingClientRect();
            this.mouse.pos = {x: event.clientX - rect.left, y: event.clientY - rect.top};
            this.mouse.left = event.button === 0;
            this.mouse.right = event.button === 2;
        }, true);

        // Prevent right click menu
        canvas.oncontextmenu = (event) => {
            event.preventDefault();
        };
    }

    public update(step: number): void {
        super.update(step);
        this.doMove(step);
        this.maze.setAdjacentTilesSeen(this.lantern);
        this.lantern.updatePosition();
        this.mouse.left = false;
        this.mouse.right = false;
    }

    protected drawDebug(): void {
        const ctx = this.stage.ctx;
        ctx.save();
        ctx.fillStyle = this.debugColour;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.restore();
    }

    private doMove(step: number): void {
        const controls: TSE.Controller = new TSE.Controller();

        const fraction: number = (step / 100);
        const speed: number = fraction * 24;
        // Get current direction
        let dir: MoveDir;

        if (controls.isPressed(TSE.Controller.keys.W) || controls.isPressed(TSE.Controller.keys.UP)) {
            dir = MoveDir.N;
        }

        if (controls.isPressed(TSE.Controller.keys.S) || controls.isPressed(TSE.Controller.keys.DOWN)) {
            dir = MoveDir.S;
        }

        if (controls.isPressed(TSE.Controller.keys.A) || controls.isPressed(TSE.Controller.keys.LEFT)) {
            if (dir === MoveDir.N) {
                dir = MoveDir.NW;
            } else if (dir === MoveDir.S) {
                dir = MoveDir.SW;
            } else {
                dir = MoveDir.W;
            }
        }

        if (controls.isPressed(TSE.Controller.keys.D) || controls.isPressed(TSE.Controller.keys.RIGHT)) {
            if (dir === MoveDir.N) {
                dir = MoveDir.NE;
            } else if (dir === MoveDir.S) {
                dir = MoveDir.SE;
            } else {
                dir = MoveDir.E;
            }
        }

        // No direction, no move
        if (typeof dir === 'undefined') {
            return;
        }

        // Set to new location, with slide
        this.oldPos = this.pos;
        const newX = this.pos.x + speed * Math.cos(dir * (Math.PI / 180));
        this.pos = {x: newX, y: this.pos.y};
        if (this.maze.isRectActorColliding(this)) {
            this.pos = this.oldPos;
        }
        this.oldPos = this.pos;
        const newY = this.pos.y + speed * Math.sin(dir * (Math.PI / 180));
        this.pos = {x: this.pos.x, y: newY};
        if (this.maze.isRectActorColliding(this)) {
            this.pos = this.oldPos;
        }

        const tile: TileType = this.maze.getTileAtPosition({
            x: this.pos.x + this.width / 2,
            y: this.pos.y + this.height / 2
        });

        if (tile === TileType.EXIT) {
            console.log('finished');
            this.stage.finished = true;
        }
    }

}
