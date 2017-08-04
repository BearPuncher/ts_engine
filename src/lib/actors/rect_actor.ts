import {Point} from '../utils/math';
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
     * @param w the width
     * @param h the height
     * @param options the actor options.
     */
    constructor(origin: Point, w: number, h: number, options: IActorOptions = {}) {
        super(origin, options);
        this.width = w;
        this.height = h;
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
        this.stage.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
