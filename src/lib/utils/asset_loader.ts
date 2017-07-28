/**
 * Asset Loader singleton.
 * Singleton pattern;  http://www.adam-bien.com/roller/abien/entry/singleton_pattern_in_es6_and
 * TODO: Add sound loader logic
 */
export default class AssetLoader {

    /**
     * The singleton instance.
     */
    private static instance: AssetLoader;

    private numOfImages: number;
    private numComplete: number;
    private images: { [key: string]: HTMLImageElement };

    /**
     * Constructor.
     * @returns {AssetLoader} instance if already initialized
     */
    constructor() {
        if (AssetLoader.instance) {
            return AssetLoader.instance;
        }

        this.numOfImages = 0;
        this.numComplete = 0;
        this.images = {};
        AssetLoader.instance = this;
    }

    /**
     * Load an image and assign it to a given key.
     * @param key the key for the image
     * @param src the src for the image
     */
    public loadImage(key: string, src: string) {
        this.numOfImages++;
        const downloadingImage = new Image();
        downloadingImage.onload = () => {
            AssetLoader.instance.images[key] = downloadingImage;
            AssetLoader.instance.numComplete++;
        };
        downloadingImage.src = src;
    }

    /**
     * Get the image associated with the given key.
     * @param {string} key - the key for the image
     * @returns {Image}
     */
    public getImage(key: string): HTMLImageElement {
        const image = this.images[key];
        if (image instanceof Image) {
            return image;
        }
        throw new Error(key + ' is not a valid key');
    }

    /**
     * Get percentage of assets loaded.
     * @returns {number} percentage of load loading completed
     */
    public getProgress(): number {
        return this.numComplete / this.numOfImages;
    }

    /**
     * Check whether loading is complete.
     * @returns {boolean} true if loading is done.
     */
    public loadingIsCompleted(): boolean {
        return this.getProgress() === 1;
    }
}
