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
    readonly sprite: Sprite;
    readonly spriteOffset?: {x: number, y: number};
    readonly opacity?: number;
}

/**
 * Basic Actor implementation.
 */
export abstract class Actor {

    public pos: IPoint;
    public layer: number;
    public stage: Stage;
    public sprite: Sprite;
    public spriteOffset: {x: number, y: number};
    public opacity: number;
    protected debugColour: string;

    /**
     * Constructor.
     * @param origin the start pos
     * @param options additional options
     */
    constructor(origin: IPoint, options: IActorOptions) {
        this.pos = origin;
        this.layer = (options.layer) ? options.layer : 0;
        this.stage = (options.stage) ? options.stage : null;
        this.debugColour = (options.debugColour) ? options.debugColour : 'black';
        this.sprite = null;
        this.spriteOffset = {x: 0, y: 0};
        this.opacity = 1;
    }

    /**
     * Set sprite properties for actor.
     */
    public setSprite(options: ISpriteOptions) {
        this.sprite = options.sprite;
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
        if (this.sprite) {
            this.sprite.updateFrame(step);
        }
    }

    /**
     * Render the sprite of the actor, if set.
     */
    public render(): void {
        if (this.sprite) {
            const point: IPoint = {
                x: this.pos.x + this.spriteOffset.x,
                y: this.pos.y + this.spriteOffset.y,
            };
            this.sprite.draw(point, this.stage.ctx, this.opacity);
        }

        this.drawDebug();
    }

    /**
     * Render the debugging version of the actor.
     */
     protected abstract drawDebug(): void;
}
