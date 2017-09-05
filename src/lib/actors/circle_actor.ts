import {IPoint} from '../utils/math';
import {Actor, IActorOptions} from './abstract_actor';

/**
 * A circle shaped actor.
 */
export default class CircleActor extends Actor {

    /**
     * Radius.
     */
    public r: number;

    /**
     * Constructor.
     * @param origin the Point of origin
     * @param radius the r of the circle
     * @param options the actor options
     */
    constructor(origin: IPoint, radius: number, options: IActorOptions = {}) {
        super(origin, options);
        this.r = radius;
    }

    /**
     * @inheritDoc
     */
    public init(): void {
        // Do nothing.
    }

    /**
     * @inheritDoc
     */
    protected drawDebug() {
        const ctx = this.st.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.debugColour;
        ctx.arc(this.p.x, this.p.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }
}
