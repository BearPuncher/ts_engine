import {Actor} from './actors/abstract_actor';

/**
 * A stage, which can be rendered.
 */
export default class Stage {
    public width: number;
    public height: number;
    public ctx: CanvasRenderingContext2D;
    public finished: boolean;
    private actors: Actor[];

    /**
     * Basic constructor taking stage width and height.
     * @param width {number} - The stage width.
     * @param height {number} - The stage height.
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.actors = [];
        this.finished = false;
        this.ctx = null;
    }

    /**
     * Add an actor to the stage.
     * @param actor {Actor} - The actor to add.
     */
    public addActor(actor: Actor) {
        actor.stage = this;
        actor.init();

        this.actors.push(actor);
    }

    /**
     * Initialize the stage. Can be overridden.
     */
    public init() {
        // Override
        this.finished = false;
    }

    /**
     * Update the stage. Can be overridden.
     * @param step {number} - The number of steps to update for.
     */
    public update(step: number) {
        this.sortActorsByLayer();
        // Iterate over all actors and update
        for (const actor of this.actors) {
            actor.update(step);
        }
    }

    /**
     * Render the stage. Can be overridden.
     */
    public render() {
        // Iterate over all actors and render
        for (const actor of this.actors) {
            actor.render();
        }
    }

    /**
     * Sort actor list by layer.
     */
    private sortActorsByLayer() {
        this.actors.sort((a, b) => {
            return a.layer - b.layer;
        });
    }

}
