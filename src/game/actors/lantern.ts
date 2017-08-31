import * as TSE from '../../lib';
import Player from './player';

/**
 * Controllable actor.
 */
export default class Lantern extends TSE.CircleActor {

    public player: Player;

    public constructor(player: Player, radius: number) {
        super({x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2},
            radius, {layer: player.layer - 1});
        this.player = player;
        this.player.lantern = this;
        this.debugColour = 'yellow';
    }

    public init(): void {

    }

    public updatePosition() {
        this.position = {x: this.player.position.x + this.player.width / 2,
            y: this.player.position.y + this.player.height / 2};
        this.layer = this.player.layer - 1;
    }

    public render():void {
        const ctx: CanvasRenderingContext2D = this.stage.ctx;
        // draw a simple rectangle shape
        ctx.save();
        //ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'rgba(255,255,213, 0.3)';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,213, 0.8)';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}
