import {Point} from './utils/math';

/**
 * Actor interface.
 */
export interface IActor {
    /**
     * Update the actor.
     * @param step the number of steps
     */
    update(step: number): void;

    /**
     * Render the image of the actor.
     */
    render(): void;
}

/**
 * Basic Actor implementation.
 */
export class BaseActor implements IActor {

    /**
     * Actors position.
     */
    public position: Point;
    public layer: number;

    /**
     * Constructor.
     * @param origin the start position
     * @param options additional options
     */
    constructor(origin: Point, options?: {layer: number}) {
        this.position = origin;
        this.layer = (options.layer) ? options.layer : 0;
    }

    /**
     * @inheritDoc
     */
    public update(step: number): void {
        throw new Error('Method not implemented.');
    }

    /**
     * @inheritDoc
     */
    public render(): void {
        this.drawDebug();
    }

    /**
     * Draw the debug mode version of this actor.
     */
    protected drawDebug(): void {
        // Override
    }
}
