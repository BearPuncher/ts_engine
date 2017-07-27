"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Asset Loader singleton.
 * Singleton pattern;  http://www.adam-bien.com/roller/abien/entry/singleton_pattern_in_es6_and
 * TODO: Add sound loader logic
 */
var AssetLoader = (function () {
    /**
     * Constructor.
     * @returns {AssetLoader} instance if already initialized
     */
    function AssetLoader() {
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
    AssetLoader.prototype.loadImage = function (key, src) {
        this.numOfImages++;
        var downloadingImage = new Image();
        downloadingImage.onload = function () {
            AssetLoader.instance.images[key] = downloadingImage;
            AssetLoader.instance.numComplete++;
        };
        downloadingImage.src = src;
    };
    /**
     * Get the image associated with the given key.
     * @param {string} key - the key for the image
     * @returns {Image}
     */
    AssetLoader.prototype.getImage = function (key) {
        var image = this.images[key];
        if (image instanceof Image) {
            return image;
        }
        throw new Error(key + ' is not a valid key');
    };
    /**
     * Get percentage of assets loaded.
     * @returns {number} percentage of load loading completed
     */
    AssetLoader.prototype.getProgress = function () {
        return this.numComplete / this.numOfImages;
    };
    /**
     * Check whether loading is complete.
     * @returns {boolean} true if loading is done.
     */
    AssetLoader.prototype.loadingIsCompleted = function () {
        return this.getProgress() === 1;
    };
    return AssetLoader;
}());
exports.default = AssetLoader;
