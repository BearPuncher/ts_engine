import Stage from './stage';
import AssetLoader from './utils/asset_loader';

/**
 * Stage for rendering AssetLoader progress.
 */
export default class PreloaderStage extends Stage {

    private assetLoader: AssetLoader;
    private progress: number;

    /**
     * Basic constructor taking currentStage width and height.
     * @param {number} width - The currentStage width.
     * @param {number} height - The currentStage height.
     */
    constructor(width: number, height: number) {
        super(width, height);
        this.assetLoader = new AssetLoader();
        this.progress = this.assetLoader.getProgress();
    }

    /**
     * Overriding update function.
     * @param {number} step - The number of steps to update for.
     */
    public update(step: number) {
        super.update(step);
        this.progress = this.assetLoader.getProgress();
        if (this.assetLoader.loadingIsCompleted()) {
            this.finished = true;
        }
    }

    /**
     * Overriding drawMazeParts function.
     */
    public render() {
        super.render();
        this.ctx.save();
        this.drawProgress();
        this.ctx.restore();
    }

    /**
     * Draw progress as a bar.
     */
    private drawProgress() {
        const minX = 20;
        const maxX = this.width - (minX * 2);
        const barHeight = 50;
        const fill = maxX * this.progress;

        this.ctx.strokeRect(minX, this.height / 2 - barHeight / 2, maxX, barHeight);
        this.ctx.fillRect(minX, this.height / 2 - barHeight / 2, fill, barHeight);
    }
}
