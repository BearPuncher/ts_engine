import {IPoint} from './utils/math';
import Timer from './utils/timer';

/**
 * Class for animating a sprite.
 */
export default class Sprite {
    // Display settings
    /**
     * Image.
     */
    public img: HTMLImageElement;
    /**
     * Width.
     */
    public w: number;
    /**
     * Height.
     */
    public h: number;
    public angle: number;
    public scale: {x: number, y: number};
    private cycle: [[number, number]];
    private interval: number;
    private frame: number;
    private timer: Timer;

    /**
     * Constructor.
     * @param image the img to use
     * @param width s w
     * @param height s h, defaults to w
     */
    constructor(image: HTMLImageElement, width: number, height?: number) {
        this.img = image;
        this.w = width;
        this.h = (height) ? height : width;
        this.angle = 0;
        this.scale = {x: 1, y: 1};
        this.frame = 0;
    }

    /**
     * Set s to display a given cycle.
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
     * Set the scale of the s img
     * @param scaleX the scale value for the X axis
     * @param scaleY the scale value for the Y axis
     */
    public setScale(scaleX: number, scaleY?: number): void {
        this.scale = {x: scaleX, y: (scaleY) ? scaleY : scaleX};
    }

    /**
     * Update the current frame of the s
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
     * Draw the current frame of the s.
     * @param point the coordinates
     * @param ctx canvas context
     * @param opacity the opacity (between 0 - 1)
     */
    public draw(point: IPoint, ctx: CanvasRenderingContext2D, opacity?: number): void {
        const framePositions = this.cycle[this.frame];
        const sX = framePositions[0] * this.w;
        const sY = framePositions[1] * this.h;
        const dX = this.w / 2;
        const dY = this.h / 2;

        ctx.save();
        ctx.translate(point.x, point.y);
        // Draw s scaled and rotated
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = opacity ? opacity : 1;
        ctx.scale(this.scale.x, this.scale.y);
        ctx.translate(dX, dY);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.img, sX, sY, this.w, this.h,
             - dX, - dY, this.w, this.h);
        // restroe
        ctx.restore();
    }
}
