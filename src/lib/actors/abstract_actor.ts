import Sprite from '../sprite';
import Stage from '../stage';
import {IPoint} from '../utils/math';

/**
 * Options for actor.
 */
export interface IActorOptions {
    readonly layer?: number;
    readonly stage?: Stage;
    readonly debugColour?: string;
}

/**
 * Interface for additional actor properties.
 */
export interface ISpriteOptions {
    /**
     * Sprite.
     */
    readonly sp: Sprite;
    /**
     * Sprite Offset.
     */
    readonly spriteOffset?: {x: number, y: number};
    readonly opacity?: number;
}

/**
 * Basic Actor implementation.
 *
 */
export abstract class Actor {

    /**
     * Position.
     */
    public p: IPoint;
    /**
     * Layer.
     */
    public l: number;
    /**
     * Stage.
     */
    public st: Stage;
    /**
     * Sprite.
     */
    public sp: Sprite;
    public spriteOffset: {x: number, y: number};
    public opacity: number;
    public remove: boolean;
    protected debugColour: string;

    /**
     * Constructor.
     * @param origin the start p
     * @param options additional options
     */
    constructor(origin: IPoint, options: IActorOptions) {
        this.p = origin;
        this.l = (options.layer) ? options.layer : 0;
        this.st = (options.stage) ? options.stage : null;
        this.debugColour = (options.debugColour) ? options.debugColour : 'black';
        this.sp = null;
        this.spriteOffset = {x: 0, y: 0};
        this.opacity = 1;
        this.remove = false;
    }

    /**
     * Set s properties for actor.
     */
    public setSprite(options: ISpriteOptions) {
        this.sp = options.sp;
        this.spriteOffset = (options.spriteOffset) ? options.spriteOffset : {x: 0, y: 0};
        this.opacity = (options.opacity) ? options.opacity : 1;
    }

    /**
     * Initialization function.
     */
    public abstract init(): void;

    /**
     * Update the actor.
     * @param step the number of steps
     */
    public update(step: number): void {
        if (this.sp) {
            this.sp.updateFrame(step);
        }
    }

    /**
     * Render the s of the actor, if set.
     */
    public render(): void {
        if (this.sp) {
            const point: IPoint = {
                x: this.p.x + this.spriteOffset.x,
                y: this.p.y + this.spriteOffset.y,
            };
            this.sp.draw(point, this.st.ctx, this.opacity);
        }

        this.drawDebug();
    }

    /**
     * Render the debugging version of the actor.
     */
     protected abstract drawDebug(): void;
}
