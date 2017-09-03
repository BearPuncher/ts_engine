import * as TSE from '../../lib';
import Player from './player';

/**
 * Controllable actor.
 */
export default class Lantern extends TSE.CircleActor {

    public player: Player;

    public constructor(player: Player, radius: number) {
        super({x: player.pos.x + player.width / 2,
            y: player.pos.y + player.height / 2},
            radius, {layer: player.layer - 1});
        this.player = player;
        this.player.lantern = this;
    }

    public init(): void {
        super.init();
    }

    public updatePosition() {
        this.pos = {x: this.player.pos.x + this.player.width / 2,
            y: this.player.pos.y + this.player.height / 2};
        this.layer = this.player.layer - 1;
    }

    public render(): void {
        const ctx: CanvasRenderingContext2D = this.stage.ctx;
        // draw a simple rectangle shape
        ctx.save();
        /*
        ctx.fillStyle = 'rgb(0,0,0, 0.8)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        */
        ctx.fillStyle = 'rgba(255, 255, 213, 0.3)';
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius + 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 213, 0.8)';
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }
}
