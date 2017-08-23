import {IPoint} from '../utils/math';
import {Actor, IActorOptions} from './abstract_actor';

/**
 * A circle shaped actor.
 */
export default class CircleActor extends Actor {

    public radius: number;

    /**
     * Constructor.
     * @param origin the Point of origin
     * @param radius the radius of the circle
     * @param options the actor options
     */
    constructor(origin: IPoint, radius: number, options: IActorOptions = {}) {
        super(origin, options);
        this.radius = radius;
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
        const ctx = this.stage.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.debugColour;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
