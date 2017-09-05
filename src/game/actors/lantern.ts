import * as TSE from '../../lib';
import Player from './player';

/**
 * Controllable actor.
 */
export default class Lantern extends TSE.CircleActor {

    /**
     * Player
     */
    public pl: Player;

    public constructor(player: Player, radius: number) {
        super({x: player.p.x + player.w / 2,
            y: player.p.y + player.h / 2},
            radius, {layer: player.l - 1});
        this.pl = player;
        this.pl.lantern = this;
    }

    public init(): void {
        super.init();
    }

    public updatePosition() {
        this.p = {x: this.pl.p.x + this.pl.w / 2,
            y: this.pl.p.y + this.pl.h / 2};
        this.l = this.pl.l - 1;
    }

    public render(): void {
        const ctx: CanvasRenderingContext2D = this.st.ctx;
        // draw a simple rectangle shape
        ctx.save();
        /*
        ctx.fillStyle = 'rgb(0,0,0, 0.8)';
        ctx.fillRect(0, 0, ctx.canvas.w, ctx.canvas.h);
        ctx.globalCompositeOperation = 'overlay';
        */
        ctx.fillStyle = 'rgba(255, 255, 213, 0.3)';
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r + 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 213, 0.8)';
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }
}
