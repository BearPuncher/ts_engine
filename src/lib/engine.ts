import Stage from './stage';

/**
 * Engine that runs the game.
 */
export default class Engine {
    /**
     * Expected FPS of game.
     * @type {number}
     */
    private static TARGET_FPS: number = 60;
    /**
     * Expected frame duration.
     * @type {number}
     */
    private static FRAME_DUR: number = 1000 / Engine.TARGET_FPS;

    // Dimensions
    public width: number;
    public height: number;
    public currentStage: Stage;
    // Timers
    public running: boolean;
    private currentTime: number;
    private accumulator: number;
    // Objects
    private canvas: any;
    private ctx: CanvasRenderingContext2D;
    private transitionFunction: () => void;

    /**
     * Basic constructor taking width, height and a canvas element.
     * @param {number} width - The width of the canvas.
     * @param {number} height - The height of the canvas.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     */
    constructor(width: number, height: number, canvas: any) {
        this.width = width;
        this.height = height;

        // Timing
        this.running = false;
        this.currentTime = 0;
        this.accumulator = 0;

        // Canvas
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext('2d');
    }

    /**
     * Set a currentStage.
     * @param {Stage} stage - The currentStage to update and drawMazeParts.
     */
    public setStage(stage: Stage) {
        this.currentStage = stage;
        this.currentStage.ctx = this.ctx;
        this.currentStage.init();
    }

    /**
     * Set a currentStage transition function
     * @param transition the transition function
     */
    public setStageTransition(transition: () => void) {
        this.transitionFunction = transition;
    }

    /**
     * Update function
     * @param {number} dt - The number of steps.
     */
    public update(dt: number) {
        // Run transition function if currentStage is marked as 'finished'
        if (this.currentStage.finished && this.transitionFunction !== undefined) {
            this.transitionFunction();
        }

        // Update currentStage
        if (this.currentStage !== undefined) {
            this.currentStage.update(dt);
        }
    }

    /**
     * Render function.
     */
    public render() {
        // Clear reset canvas
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        // Render Stage
        if (this.currentStage !== undefined) {
            this.currentStage.render();
        }
    }

    /**
     * Start the game engine.
     */
    public start() {
        this.running = true;
        this.currentTime = Date.now();

        // Set game loop
        this.loop();

        // Create drawMazeParts loop
        const engine = this;
        function renderLoop() {
            engine.render();
            window.requestAnimationFrame(renderLoop);
        }
        window.requestAnimationFrame(renderLoop);
    }

    /**
     * Stop the game engine.
     */
    public stop() {
        this.running = false;
    }

    /**
     * Game loop.
     */
    private loop() {
        // If not running - exit
        if (!this.running) {
            return;
        }

        // Create update loop
        const engine = this;
        setTimeout(() => {
            engine.loop();
        }, Engine.FRAME_DUR);

        // Update timers
        const timeNow: number = Date.now();
        this.accumulator += timeNow - this.currentTime;
        this.currentTime = timeNow;

        // Run loop
        while (this.accumulator >= Engine.FRAME_DUR) {
            this.update(Engine.FRAME_DUR);
            this.accumulator -= Engine.FRAME_DUR;
        }
    }
}
