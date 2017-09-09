import {IPoint} from '../utils/math';
import {Actor, IActorOptions} from './abstract_actor';

/**
 * A rectangle shaped actor.
 */
export default class RectActor extends Actor {

    /**
     * Width.
     */
    public w: number;
    public h: number;

    /**
     * Constructor.
     * @param origin Point of origin
     * @param width the w
     * @param height the h
     * @param options the actor options.
     */
    constructor(origin: IPoint, width: number, height: number, options: IActorOptions = {}) {
        super(origin, options);
        this.w = width;
        this.h = height;
    }

    /**
     * @inheritDoc
     */
    public init(): void {
        // Do nothing.
    }

    public static rectOverlap(a: RectActor, b: RectActor): boolean {
        const xOverlap: boolean = this.valueInRange(a.p.x, b.p.x, b.p.x + b.w) ||
            this.valueInRange(b.p.x, a.p.x, a.p.x + a.w);

        const yOverlap: boolean = this.valueInRange(a.p.y, b.p.y, b.p.y + b.h) ||
            this.valueInRange(b.p.y, a.p.y, a.p.y + a.h);

        return xOverlap && yOverlap;
    }

    /**
     * @inheritDoc
     */
    protected drawDebug() {
        const ctx = this.st.ctx;
        ctx.strokeStyle = this.debugColour;
        ctx.strokeRect(this.p.x, this.p.y, this.w, this.h);
    }

    private static valueInRange(value: number, min: number, max: number): boolean {
        return (value >= min) && (value <= max);
    }
}
