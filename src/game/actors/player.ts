import * as TSE from '../../lib';
import Maze from './maze';
import Lantern from './lantern';
import {MazeTile, TileType} from "./maze_part";

enum MoveDirection {
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
    public mouse: {left: boolean, right: boolean, position: TSE.Math.IPoint};
    private oldPosition: TSE.Math.IPoint;

    public init(): void {
        this.mouse = {left: false, right: false, position: null};
        this.debugColour = 'orange';
        const canvas: HTMLCanvasElement = this.stage.ctx.canvas;
        // Update mouse position
        canvas.addEventListener('mousemove', (event: MouseEvent) => {
            const rect = this.stage.ctx.canvas.getBoundingClientRect();
            this.mouse.position = {x: event.clientX - rect.left, y: event.clientY - rect.top};
        }, true);
        // Capture click
        canvas.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
            const rect = this.stage.ctx.canvas.getBoundingClientRect();
            this.mouse.position = {x: event.clientX - rect.left, y: event.clientY - rect.top};
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
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }

    private doMove(step: number): void {
        const controls: TSE.Controller = new TSE.Controller();

        const fraction: number = (step / 100);
        const speed: number = fraction * 24;
        let direction: MoveDirection;

        if (controls.isPressed(TSE.Controller.keys.W) || controls.isPressed(TSE.Controller.keys.UP)) {
            direction = MoveDirection.N;
        }

        if (controls.isPressed(TSE.Controller.keys.S) || controls.isPressed(TSE.Controller.keys.DOWN)) {
            direction = MoveDirection.S;
        }

        if (controls.isPressed(TSE.Controller.keys.A) || controls.isPressed(TSE.Controller.keys.LEFT)) {
            if (direction === MoveDirection.N) {
                direction = MoveDirection.NW;
            } else if (direction === MoveDirection.S) {
                direction = MoveDirection.SW;
            } else {
                direction = MoveDirection.W;
            }
        }

        if (controls.isPressed(TSE.Controller.keys.D) || controls.isPressed(TSE.Controller.keys.RIGHT)) {
            if (direction === MoveDirection.N) {
                direction = MoveDirection.NE;
            } else if (direction === MoveDirection.S) {
                direction = MoveDirection.SE;
            } else {
                direction = MoveDirection.E;
            }
        }

        // No direction, no move
        if (typeof direction === 'undefined') {
            return;
        }

        // Set to new location, with slide
        this.oldPosition = this.position;
        const newX = this.position.x + speed * Math.cos(direction * (Math.PI / 180));
        this.position = {x: newX, y: this.position.y};
        if (this.maze.isRectActorColliding(this)) {
            this.position = this.oldPosition;
        }
        this.oldPosition = this.position;
        const newY = this.position.y + speed * Math.sin(direction * (Math.PI / 180));
        this.position = {x: this.position.x, y: newY};
        if (this.maze.isRectActorColliding(this)) {
            this.position = this.oldPosition;
        }

        const tile: TileType = this.maze.getTileAtPosition({
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        });

        if (tile === TileType.EXIT) {
            console.log('finished');
            this.stage.finished = true;
        }
    }

}
