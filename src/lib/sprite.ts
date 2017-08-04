import {Point} from './utils/math';
import Timer from './utils/timer';

/**
 * Class for animating a sprite.
 */
export default class Sprite {
    // Display settings
    public image: HTMLImageElement;
    public width: number;
    public height: number;
    public scale: {x: number, y: number};
    private cycle: [[number, number]];
    private interval: number;
    private frame: number;
    private timer: Timer;

    /**
     * Constructor.
     * @param image the image to use
     * @param width sprite width
     * @param height sprite height, defaults to width
     */
    constructor(image: HTMLImageElement, width: number, height?: number) {
        this.image = image;
        this.width = width;
        this.height = (height) ? height : width;
        this.scale = {x: 1, y: 1};
        this.frame = 0;
    }

    /**
     * Set sprite to display a given cycle.
     * @param cycle the cycle to display, as an array of pairs
     * @param interval the interval between frames (ms)
     */
    public setCycle(cycle: [[number, number]], interval: number): void {
        this.cycle = cycle;
        this.interval = interval;
        this.frame = 0;
        this.timer = new Timer(interval);
    }

    /**
     * Set the scale of the sprite image
     * @param scaleX the scale value for the X axis
     * @param scaleY the scale value for the Y axis
     */
    public setScale(scaleX: number, scaleY?: number): void {
        this.scale = {x: scaleX, y: (scaleY) ? scaleY : scaleX};
    }

    /**
     * Update the current frame of the sprite
     * @param step the amount to advance the timer
     */
    public updateFrame(step: number): void {
        this.timer.tick(step);
        if (this.timer.hasEnded()) {
            this.frame = (this.frame + 1) % this.cycle.length;
            this.timer.reset();
        }
    }

    /**
     * Draw the current frame of the sprite.
     * @param point the coordinates
     * @param ctx canvas context
     * @param opacity the opacity (between 0 - 1)
     */
    public draw(point: Point, ctx: CanvasRenderingContext2D, opacity?: number): void {
        const framePositions = this.cycle[this.frame];
        const dx = framePositions[0] * this.width;
        const dy = framePositions[1] * this.height;

        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.globalAlpha = opacity ? opacity : 1;
        ctx.scale(this.scale.x, this.scale.y);
        ctx.drawImage(this.image, dx, dy, this.width, this.height,
            0, 0, this.width, this.height);
        ctx.restore();
    }
}
