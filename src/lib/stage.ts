import {Actor} from './actors/abstract_actor';

/**
 * A currentStage, which can be rendered.
 */
export default class Stage {
    public width: number;
    public height: number;
    public ctx: CanvasRenderingContext2D;
    public finished: boolean;
    private actors: Actor[];

    /**
     * Basic constructor taking currentStage width and height.
     * @param width {number} - The currentStage width.
     * @param height {number} - The currentStage height.
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.actors = [];
        this.finished = false;
        this.ctx = null;
    }

    /**
     * Add an actor to the currentStage, and initialises it.
     * @param actor {Actor} - The actor to add.
     */
    public addActor(actor: Actor): void {
        actor.stage = this;
        actor.init();

        this.actors.push(actor);
    }

    /**
     * Initialize the currentStage. Can be overridden.
     */
    public init(): void {
        // Override
        this.finished = false;
    }

    /**
     * Update the currentStage. Can be overridden.
     * @param step {number} - The number of steps to update for.
     */
    public update(step: number): void {
        this.sortActorsByLayer();
        // Iterate over all actors and update
        const newActors: Actor[] = [];
        for (const actor of this.actors) {
            actor.update(step);
            if (!actor.remove) {
                newActors.push(actor);
            }
        }
        this.actors = newActors;
    }

    /**
     * Render the currentStage. Can be overridden.
     */
    public render(): void {
        // Iterate over all actors and drawMazeParts
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
