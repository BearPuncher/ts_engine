import {IPoint} from '../utils/math';
import {Actor, IActorOptions} from './abstract_actor';

/**
 * A rectangle shaped actor.
 */
export default class RectActor extends Actor {

    public width: number;
    public height: number;

    /**
     * Constructor.
     * @param origin Point of origin
     * @param width the width
     * @param height the height
     * @param options the actor options.
     */
    constructor(origin: IPoint, width: number, height: number, options: IActorOptions = {}) {
        super(origin, options);
        this.width = width;
        this.height = height;
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
        ctx.strokeStyle = this.debugColour;
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    public static rectOverlap(a: RectActor, b: RectActor): boolean {
        const xOverlap: boolean = this.valueInRange(a.pos.x, b.pos.x, b.pos.x + b.width) ||
            this.valueInRange(b.pos.x, a.pos.x, a.pos.x + a.width);

        const yOverlap: boolean = this.valueInRange(a.pos.y, b.pos.y, b.pos.y + b.height) ||
            this.valueInRange(b.pos.y, a.pos.y, a.pos.y + a.height);

        return xOverlap && yOverlap;
    }

    private static valueInRange(value: number, min: number, max: number): boolean {
        return (value >= min) && (value <= max);
    }
}
