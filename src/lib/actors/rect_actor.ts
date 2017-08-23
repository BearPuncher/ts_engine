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
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
}
