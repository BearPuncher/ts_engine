import * as TSE from '../../lib';

export default class Treasure extends TSE.RectActor {

    public constructor(pos: TSE.Math.IPoint) {
        super(pos, 32, 32);
        this.debugColour = 'yellow';
    }

    public isColliding(actor: TSE.RectActor): boolean {
        return TSE.RectActor.rectOverlap(this, actor);
    }

    public render(): void {
        const ctx: CanvasRenderingContext2D = this.st.ctx;
        ctx.save();
        ctx.fillStyle = this.debugColour;
        ctx.fillRect(this.p.x, this.p.y, this.w, this.h);
        ctx.restore();
    }
}