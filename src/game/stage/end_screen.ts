import * as TSE from '../../lib';

export class EndScreen extends TSE.Stage {

    private gameOver: string = 'GAME OVER';

    public render(): void {
        super.render();
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.font = '60px Blippo, fantasy';
        this.ctx.fillStyle = 'white';
        const halfTextWidth: number = this.ctx.measureText(this.gameOver).width / 2;
        this.ctx.fillText(
            this.gameOver, this.w / 2 - halfTextWidth,
            this.h / 2);
        this.ctx.restore();
    }
}